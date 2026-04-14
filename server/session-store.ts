import { createSupportAgent, type SupportAgent } from "./support-agent.js";

const MAX_SESSIONS = Math.max(1, Number(process.env.CHAT_MAX_SESSIONS ?? 500));
const SESSION_TTL_MS = Math.max(60_000, Number(process.env.CHAT_SESSION_TTL_MS ?? 86_400_000));

type Entry = { agent: SupportAgent; lastUsed: number };

const sessions = new Map<string, Entry>();

function pruneChatSessions(): void {
  const now = Date.now();
  for (const [id, e] of sessions) {
    if (now - e.lastUsed > SESSION_TTL_MS) sessions.delete(id);
  }
  while (sessions.size > MAX_SESSIONS) {
    const oldestKey = sessions.keys().next().value;
    if (oldestKey === undefined) break;
    sessions.delete(oldestKey);
  }
}

export function getOrCreateChatAgent(
  sessionId: string,
  apiKey: string,
  model: string,
): SupportAgent {
  pruneChatSessions();
  const hit = sessions.get(sessionId);
  if (hit) {
    hit.lastUsed = Date.now();
    sessions.delete(sessionId);
    sessions.set(sessionId, hit);
    return hit.agent;
  }
  const agent = createSupportAgent({ apiKey, model });
  sessions.set(sessionId, { agent, lastUsed: Date.now() });
  return agent;
}
