import { useCallback, useEffect, useId, useRef, useState } from "react";
import { assets } from "./figma-assets";

const brand = "#f84300";

type ChatLine = { role: "user" | "assistant"; content: string };

function getSessionId(): string {
  try {
    const k = "bb_support_session";
    let id = sessionStorage.getItem(k);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(k, id);
    }
    return id;
  } catch {
    return "fallback-session";
  }
}

export function SupportChat() {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<ChatLine[]>([
    {
      role: "assistant",
      content:
        "Hi — I’m BulBul’s support agent. Ask about custom hardcases, materials, lead times, or how to get a quote.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const sessionIdRef = useRef<string>(getSessionId());
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [lines, open, loading]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setLines((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId: sessionIdRef.current }),
      });
      const data = (await res.json()) as { reply?: string; error?: string; sessionId?: string };
      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      if (data.sessionId) sessionIdRef.current = data.sessionId;
      if (data.reply) {
        setLines((prev) => [...prev, { role: "assistant", content: data.reply! }]);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      setLines((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry — ${msg}. For local dev: run the API (\`npm run dev:api\` or use combined \`npm run dev\`) and set OPENROUTER_API_KEY.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Figma 109:1565 — AI Chat / customer support agent trigger */}
      <button
        type="button"
        className="fixed bottom-6 right-6 z-[200] block size-[100px] cursor-pointer rounded-full shadow-[0_16px_48px_-12px_rgba(248,67,0,0.55)] transition-[transform,box-shadow] duration-300 hover:scale-[1.03] hover:shadow-[0_20px_56px_-12px_rgba(248,67,0,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 md:bottom-10 md:right-10"
        style={{ backgroundColor: brand }}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Open customer support chat"
        data-node-id="109:1565"
        data-support-fab
        onClick={() => setOpen((v) => !v)}
      >
        <img alt="" className="pointer-events-none absolute inset-0 block size-full max-w-none rounded-full object-cover" src={assets.supportFabBg} />
        <span className="pointer-events-none absolute left-[22%] right-[22%] top-[22px] aspect-square overflow-hidden">
          <span className="absolute inset-[12.5%_8.33%] block">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={assets.supportFabIcon} />
          </span>
        </span>
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label="Customer support"
          className="fixed bottom-[calc(1.5rem+100px+12px)] right-6 z-[199] flex w-[min(100vw-2rem,400px)] flex-col overflow-hidden rounded-lg border border-white/10 bg-[#0e0e0e]/95 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl md:bottom-[calc(2.5rem+100px+12px)] md:right-10"
        >
          <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3" style={{ backgroundColor: "rgba(248,67,0,0.12)" }}>
            <div>
              <p className="font-display text-sm font-bold tracking-wide text-white">Support</p>
              <p className="text-xs text-white/65">BulBul Hardcase · AI agent</p>
            </div>
            <button
              type="button"
              className="rounded px-2 py-1 text-xs text-white/80 hover:bg-white/10 hover:text-white"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>

          <div ref={listRef} className="max-h-[min(52vh,420px)] space-y-3 overflow-y-auto px-4 py-3">
            {lines.map((m, i) => (
              <div
                key={`${i}-${m.role}`}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[90%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                    m.role === "user" ? "text-white" : "bg-white/5 text-white/90"
                  }`}
                  style={m.role === "user" ? { backgroundColor: brand } : undefined}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading ? (
              <p className="text-xs text-white/45" aria-live="polite">
                Thinking…
              </p>
            ) : null}
          </div>

          <form
            className="border-t border-white/10 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <div className="flex gap-2">
              <input
                className="min-w-0 flex-1 rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-white/30 focus:outline-none"
                placeholder="Type a message…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                autoComplete="off"
              />
              <button
                type="submit"
                className="shrink-0 rounded-md px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                style={{ backgroundColor: brand }}
                disabled={loading || !input.trim()}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
