import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { type Dictionary, type Locale, en, id } from "./dictionary";
import { getInitialLocale, persistLocale } from "./locale-storage";

const dictionaries: Record<Locale, Dictionary> = { en, id };

type I18nContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: keyof Dictionary) => string;
  dictionary: Dictionary;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    persistLocale(l);
  }, []);

  const dictionary = dictionaries[locale];

  const t = useCallback(
    (key: keyof Dictionary) => {
      return dictionary[key];
    },
    [dictionary],
  );

  useEffect(() => {
    document.documentElement.lang = locale === "id" ? "id" : "en";
    document.title = dictionary.metaTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", dictionary.metaDescription);
  }, [locale, dictionary.metaTitle, dictionary.metaDescription]);

  const value = useMemo(
    () => ({ locale, setLocale, t, dictionary }),
    [locale, setLocale, t, dictionary],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
