
import { getOrCreateChatAgent } from "../server/session-store.js";

const API_KEY = process.env.OPENROUTER_API_KEY ?? "";
const MODEL = process.env.OPENROUTER_MODEL ?? "openrouter/free";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body ?? {};
  const message = body.message;
  const sessionId =
    typeof body.sessionId === "string" && body.sessionId.trim()
      ? body.sessionId.trim()
      : "default";

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Message required" });
  }

  if (!API_KEY) {
    return res.status(503).json({ error: "Chat unavailable" });
  }

  try {
    const agent = getOrCreateChatAgent(sessionId, API_KEY, MODEL);
    const reply = await agent.chat(message);
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("[chat]", error);
    return res.status(500).json({ error: "Chat service error" });
  }
}
