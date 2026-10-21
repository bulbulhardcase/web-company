import { useCallback, useEffect, useId, useRef, useState } from "react";
import { stripMarkdownForChat } from "./chatPlainText";
import { getDictionary } from "./i18n/dictionary";
import { getInitialLocale } from "./i18n/locale-storage";
import { useI18n } from "./i18n/I18nProvider";

const brand = "#f84300";

type ChatLine = { role: "user" | "assistant"; content: string };

function ChatBubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  const plain = role === "assistant" ? stripMarkdownForChat(content) : content;
  if (role === "user") {
    return (
      <span className="text-sm leading-relaxed whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{plain}</span>
    );
  }
  const blocks = plain.split(/\n\n+/).filter(Boolean);
  return (
    <div className="space-y-2 text-[13px] leading-[1.55] text-white/92">
      {blocks.map((block, idx) => (
        <p key={idx} className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] last:mb-0">
          {block}
        </p>
      ))}
    </div>
  );
}

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
  const { t, locale } = useI18n();
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<ChatLine[]>(() => [
    { role: "assistant", content: getDictionary(getInitialLocale()).supportWelcome },
  ]);
  const [loading, setLoading] = useState(false);
  const sessionIdRef = useRef<string>(getSessionId());
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLines((prev) => {
      const hasUserMessage = prev.some((m) => m.role === "user");
      if (hasUserMessage) return prev;
      return [{ role: "assistant", content: t("supportWelcome") }];
    });
  }, [locale, t]);

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
        if (res.status === 429) {
          setLines((prev) => [
            ...prev,
            { role: "assistant", content: t("supportErrorRateLimit") },
          ]);
          return;
        }
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      if (data.sessionId) sessionIdRef.current = data.sessionId;
      if (data.reply) {
        setLines((prev) => [...prev, { role: "assistant", content: data.reply! }]);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      const devHint =
        import.meta.env.DEV && msg
          ? `\n\n(${msg})`
          : "";
      setLines((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `${t("supportError")}${devHint}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, t]);

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
      {/* Tombol WhatsApp bisnis */}
      <button
        type="button"
        className="fixed bottom-6 right-6 z-[200] flex size-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-105 md:bottom-10 md:right-10"
        aria-label="Hubungi BulBul Hardcase via WhatsApp"
        onClick={() =>
          window.open(
            "https://wa.me/6285782242101",
            "_blank",
            "noopener,noreferrer"
          )
        }
      >
        <svg
          viewBox="0 0 24 24"
          fill="white"
          className="size-7"
          aria-hidden="true"
        >
          <path d="M12.04 2a9.87 9.87 0 0 0-8.5 14.88L2.2 22l5.28-1.38A9.96 9.96 0 1 0 12.04 2Zm0 18.2a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.13.82.84-3.05-.2-.32A8.18 8.18 0 1 1 12.04 20.2Z" />
          <path d="M9.2 7.5c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.4-.3.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.9 4.4 3.9 2.2.9 2.6.7 3.1.7.5-.1 1.6-.7 1.8-1.3.2-.7.2-1.2.1-1.3-.1-.1-.3-.2-.6-.3l-1.8-.9c-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.6-1.5-1.9-.2-.3 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.8-1.9Z" />
        </svg>
      </button>

      {/* Tombol AI Support Chat */}
      <button
        type="button"
        className="fixed bottom-24 right-6 z-[200] flex size-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 md:bottom-32 md:right-10"
        style={{ backgroundColor: brand }}
        aria-label={t("supportTitle")}
        aria-expanded={open}
        aria-controls={panelId}
        data-support-fab
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="size-7" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" className="size-7" aria-hidden="true">
            <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H7l-3.5 2v-5A7.5 7.5 0 1 1 20 11.5Z" />
            <path d="M8 11.5h8M8 14.5h5" />
          </svg>
        )}
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label={t("supportDialog")}
          className="fixed bottom-[calc(1.5rem+4rem+12px+env(safe-area-inset-bottom,0px))] right-[max(1.5rem,env(safe-area-inset-right))] z-[199] flex w-[min(100vw-2rem,400px)] flex-col overflow-hidden rounded-lg border border-white/10 bg-[#0e0e0e]/95 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl md:bottom-[calc(2.5rem+4rem+12px+env(safe-area-inset-bottom,0px))] md:right-[max(2.5rem,env(safe-area-inset-right))]"
        >
          <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3" style={{ backgroundColor: "rgba(248,67,0,0.12)" }}>
            <div>
              <p className="font-display text-sm font-bold tracking-wide text-white">{t("supportTitle")}</p>
              <p className="text-xs text-white/70">{t("supportSubtitle")}</p>
            </div>
            <button
              type="button"
              className="min-h-[44px] min-w-[44px] rounded px-3 text-xs text-white/80 hover:bg-white/10 hover:text-white"
              onClick={() => setOpen(false)}
            >
              {t("supportClose")}
            </button>
          </div>

          <div
            ref={listRef}
            className="max-h-[min(52vh,420px)] space-y-3 overflow-y-auto px-4 py-3"
            aria-live="polite"
            aria-relevant="additions"
          >
            {lines.map((m, i) => (
              <div
                key={`${i}-${m.role}`}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[90%] rounded-lg px-3 py-2.5 shadow-sm ${
                    m.role === "user"
                      ? "text-white"
                      : "border border-white/[0.07] bg-white/[0.06] text-white/92"
                  }`}
                  style={m.role === "user" ? { backgroundColor: brand } : undefined}
                >
                  <ChatBubble role={m.role} content={m.content} />
                </div>
              </div>
            ))}
            {loading ? (
              <p className="text-xs text-white/50" role="status">
                {t("supportTyping")}
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
                placeholder={t("supportPlaceholder")}
                aria-label={t("supportInputAria")}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                autoComplete="off"
              />
              <button
                type="submit"
                className="min-h-[44px] shrink-0 rounded-md px-4 text-sm font-semibold text-white disabled:opacity-50"
                style={{ backgroundColor: brand }}
                disabled={loading || !input.trim()}
              >
                {t("supportSend")}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
