import "./env.js";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import chat from "../api/chat.js";

// Local dev server: runs the same handlers Vercel serves from `api/`.
// Not the generic PORT: dev tooling sets that to the Vite port. Must match the proxy target in vite.config.ts.
const PORT = Number(process.env.API_PORT ?? 3333);
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "*";

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
app.use(express.json({ limit: "256kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/chat", chatLimiter, chat);

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
