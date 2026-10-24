import { supportReply, type SimpleMessage } from "../server/support-agent.js";

const API_KEY = process.env.OLLAMA_API_KEY ?? "";
const MODEL = process.env.OLLAMA_MODEL ?? "gpt-oss:20b";
const MAX_MESSAGE_CHARS = 8000;
const MAX_HISTORY = 20;

// History comes from the browser, so keep only well-formed turns and cap their size.
function cleanHistory(value: unknown): SimpleMessage[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (m): m is SimpleMessage =>
        (m?.role === "user" || m?.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.length <= MAX_MESSAGE_CHARS,
    )
    .slice(-MAX_HISTORY)
    .map(({ role, content }) => ({ role, content }));
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body ?? {};
  const message = body.message;

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Message required" });
  }
  if (message.length > MAX_MESSAGE_CHARS) {
    return res.status(400).json({ error: "Message too long" });
  }

  if (!API_KEY) {
    return res.status(503).json({ error: "Chat unavailable" });
  }

  try {
    const reply = await supportReply(API_KEY, MODEL, [
      ...cleanHistory(body.history),
      { role: "user", content: message },
    ]);
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("[chat]", error);
    return res.status(500).json({ error: "Chat service error" });
  }
}
