/**
 * Normalizes assistant text for in-app chat: no raw Markdown visible to users.
 * Safe to run twice (idempotent enough for typical replies).
 */
export function stripMarkdownForChat(input: string): string {
  let s = input.replace(/\r\n/g, "\n");
  s = s.replace(/\*\*([\s\S]*?)\*\*/g, "$1");
  s = s.replace(/\*([^*\n]+)\*/g, "$1");
  s = s.replace(/__([^_]+)__/g, "$1");
  s = s.replace(/_([^_\n]+)_/g, "$1");
  s = s.replace(/^#{1,6}\s+/gm, "");
  s = s.replace(/`([^`]+)`/g, "$1");
  s = s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  s = s.replace(/^[-*]\s+/gm, "• ");
  return s.trim();
}
