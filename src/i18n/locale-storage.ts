import type { Locale } from "./dictionary";

const STORAGE_KEY = "bb_locale";

export function readStoredLocale(): Locale | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "id" || v === "en") return v;
  } catch {
    /* ignore */
  }
  return null;
}

export function detectLocale(): Locale {
  if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("id")) {
    return "id";
  }
  return "en";
}

export function getInitialLocale(): Locale {
  return readStoredLocale() ?? detectLocale();
}

export function persistLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    /* ignore */
  }
}
