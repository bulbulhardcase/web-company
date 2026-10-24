/// <reference types="vite/client" />

// Set by the Google tag in index.html; absent when blocked.
interface Window {
  gtag?: (command: "event", name: string, params?: Record<string, string>) => void;
}
