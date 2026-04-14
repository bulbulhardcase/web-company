import "dotenv/config";
import cors from "cors";
import express from "express";
import { createSupportAgent, type SupportAgent } from "./support-agent.js";

const PORT = Number(process.env.PORT) || 3333;
/** Loaded after dotenv (import order); set OPENROUTER_API_KEY in project root `.env` */
const apiKey = process.env.OPENROUTER_API_KEY?.trim() || undefined;

const sessions = new Map<string, SupportAgent>();

function getOrCreateAgent(sessionId: string): SupportAgent {
  let agent = sessions.get(sessionId);
  if (!agent) {
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY is not set");
    }
    agent = createSupportAgent({
      apiKey,
      model: process.env.OPENROUTER_MODEL ?? "openrouter/free",
    });
    sessions.set(sessionId, agent);
  }
  return agent;
}

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") ?? ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);
app.use(express.json({ limit: "64kb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    hasKey: Boolean(apiKey),
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
    const sessionId = typeof req.body?.sessionId === "string" && req.body.sessionId.length > 0 ? req.body.sessionId : "default";

    if (!message) {
      res.status(400).json({ error: "message is required" });
      return;
    }

    if (!apiKey) {
      res.status(503).json({
        error: "Chat is not configured. Set OPENROUTER_API_KEY on the server.",
      });
      return;
    }

    const agent = getOrCreateAgent(sessionId);
    const reply = await agent.sendSync(message);

    res.json({ reply, sessionId });
  } catch (err) {
    const e = err instanceof Error ? err : new Error(String(err));
    console.error("[chat]", e);
    res.status(500).json({ error: e.message || "Chat failed" });
  }
});

app.listen(PORT, () => {
  console.log(`[support-api] http://localhost:${PORT}`);
  if (!apiKey) {
    console.warn("[support-api] OPENROUTER_API_KEY missing — /api/chat will return 503");
  }
});
