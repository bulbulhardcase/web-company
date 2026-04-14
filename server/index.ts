import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { getOrCreateChatAgent } from "./session-store.js";

const PORT = Number(process.env.PORT ?? 3333);
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? "";
const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini";
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "*";
const NODE_ENV = process.env.NODE_ENV ?? "development";
const isProd = NODE_ENV === "production";

const MAX_MESSAGE_CHARS = Math.min(
  32_000,
  Math.max(512, Number(process.env.CHAT_MAX_MESSAGE_CHARS ?? 8000)),
);

const chatLimiter = rateLimit({
  windowMs: Math.max(1000, Number(process.env.CHAT_RATE_LIMIT_WINDOW_MS ?? 60_000)),
  max: Math.max(1, Number(process.env.CHAT_RATE_LIMIT_MAX ?? 30)),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests" },
});

const app = express();
if (process.env.TRUST_PROXY === "1") {
  app.set("trust proxy", 1);
}

app.use(
  cors({
    origin: CORS_ORIGIN === "*" ? true : CORS_ORIGIN.split(",").map((s) => s.trim()),
  }),
);
app.use(express.json({ limit: "64kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/chat", chatLimiter, async (req, res) => {
  try {
    const body = req.body as { sessionId?: string; message?: string };
    const sessionId =
      typeof body.sessionId === "string" && body.sessionId.trim()
        ? body.sessionId.trim()
        : "default";
    const message =
      typeof body.message === "string" ? body.message : "";

    if (!message.trim()) {
      res.status(400).json({ error: "Message required" });
      return;
    }
    if (message.length > MAX_MESSAGE_CHARS) {
      res.status(400).json({ error: "Message too long" });
      return;
    }

    if (!OPENROUTER_API_KEY) {
      res.status(503).json({ error: "Chat unavailable" });
      return;
    }

    const agent = getOrCreateChatAgent(
      sessionId,
      OPENROUTER_API_KEY,
      OPENROUTER_MODEL,
    );
    const reply = await agent.chat(message);
    res.json({ reply });
  } catch (err) {
    console.error("[chat]", err);
    res.status(500).json({
      error: isProd ? "Something went wrong" : String((err as Error).message),
    });
  }
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
