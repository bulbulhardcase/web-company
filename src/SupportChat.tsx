import { useCallback, useEffect, useId, useRef, useState } from "react";
import { assets } from "./figma-assets";
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
      {/* Figma 109:1565 — AI Chat / customer support agent trigger */}
      <button
        type="button"
        className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))] z-[200] block size-16 cursor-pointer rounded-full shadow-[0_10px_32px_-10px_rgba(248,67,0,0.5)] transition-[transform,box-shadow] duration-300 hover:scale-[1.04] hover:shadow-[0_14px_40px_-10px_rgba(248,67,0,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 md:bottom-[max(2.5rem,env(safe-area-inset-bottom))] md:right-[max(2.5rem,env(safe-area-inset-right))]"
        style={{ backgroundColor: brand }}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={t("supportFabAria")}
        data-node-id="109:1565"
        data-support-fab
        onClick={() => setOpen((v) => !v)}
      >
        <img alt="" className="pointer-events-none absolute inset-0 block size-full max-w-none rounded-full object-cover" src={assets.supportFabBg} />
        <span className="pointer-events-none absolute left-[22%] right-[22%] top-3.5 aspect-square overflow-hidden">
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
