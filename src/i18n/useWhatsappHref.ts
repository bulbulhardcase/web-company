import { useMemo } from "react";
import { useI18n } from "./I18nProvider";

const WHATSAPP_E164 = "6285778112271";

export function useWhatsappQuoteHref(): string {
  const { t } = useI18n();
  return useMemo(
    () => `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(t("whatsappPrefill"))}`,
    [t],
  );
}
