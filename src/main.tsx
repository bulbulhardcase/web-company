import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { I18nProvider } from "./i18n/I18nProvider";

// One listener covers every WhatsApp link; data-location says which one was clicked.
document.addEventListener("click", (event) => {
  const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="https://wa.me/"]');
  if (link) window.gtag?.("event", "whatsapp_click", { link_location: link.dataset.location ?? "other" });
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>
);
