import { useCallback, useRef, type KeyboardEvent, type RefObject } from "react";
import { useI18n } from "./I18nProvider";
import type { Locale } from "./dictionary";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();
  const idRef = useRef<HTMLButtonElement>(null);
  const enRef = useRef<HTMLButtonElement>(null);

  const select = useCallback(
    (code: Locale) => {
      setLocale(code);
    },
    [setLocale],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, code: Locale) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        if (code === "id") {
          e.preventDefault();
          select("en");
          queueMicrotask(() => enRef.current?.focus());
        }
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        if (code === "en") {
          e.preventDefault();
          select("id");
          queueMicrotask(() => idRef.current?.focus());
        }
      }
    },
    [select],
  );

  const btn = (code: Locale, label: string, ref: RefObject<HTMLButtonElement | null>) => (
    <button
      ref={ref}
      key={code}
      type="button"
      role="radio"
      aria-checked={locale === code}
      tabIndex={locale === code ? 0 : -1}
      className={`relative z-10 min-h-[44px] min-w-[2.75rem] cursor-pointer rounded px-2.5 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 ${
        locale === code ? "bg-white/20 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
      }`}
      onClick={() => select(code)}
      onKeyDown={(e) => onKeyDown(e, code)}
    >
      {label}
    </button>
  );

  return (
    <div
      className={`pointer-events-auto relative z-10 inline-flex items-stretch rounded-md border border-white/15 p-0.5 text-xs font-semibold ${className}`}
      role="radiogroup"
      aria-label={t("langSwitcher")}
    >
      {btn("id", "ID", idRef)}
      {btn("en", "EN", enRef)}
    </div>
  );
}
