import { useEffect, useRef, useState, type ReactNode } from "react";
import { assets } from "./figma-assets";
import { SupportChat, WHATSAPP_URL } from "./SupportChat";
import { Reveal } from "./Reveal";
import { useScrollPast } from "./hooks/useScrollPast";
import { useI18n } from "./i18n/I18nProvider";
import { LanguageToggle } from "./i18n/LanguageToggle";
import type { Dictionary } from "./i18n/dictionary";

const primaryButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy";

export default function App() {
  const scrolled = useScrollPast(8);
  const { t } = useI18n();

  return (
    <div className="relative min-h-screen bg-white text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:bg-white focus:px-4 focus:py-2 focus:text-ink focus:outline-2 focus:outline-navy"
      >
        {t("skipToContent")}
      </a>
      <NavBar scrolled={scrolled} />
      <main id="main">
        <Hero />
        <FeaturePanel />
        <ProblemSection />
        <ProductsSection />
        <HowItWorksSection />
        <GallerySection />
        <CtaSection />
      </main>
      <Footer />
      <SupportChat />
    </div>
  );
}

function Shell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`mx-auto w-full max-w-[1280px] [padding-left:max(1rem,env(safe-area-inset-left))] [padding-right:max(1rem,env(safe-area-inset-right))] md:px-8 ${className}`}
    >
      {children}
    </div>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" className="size-4 shrink-0 transition-transform group-hover:translate-x-1" fill="none" aria-hidden="true">
      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p className={`mb-3 text-xs font-semibold uppercase tracking-[0.14em] ${light ? "text-white/70" : "text-accent"}`}>
      {children}
    </p>
  );
}

const navLinkKeys: { href: string; key: keyof Dictionary }[] = [
  { href: "#problem", key: "navWhyCustom" },
  { href: "#engineered", key: "navEngineered" },
  { href: "#products", key: "navProducts" },
  { href: "#how-it-works", key: "navProcess" },
  { href: "#contact", key: "navContact" },
];

function NavBar({ scrolled }: { scrolled: boolean }) {
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={`sticky top-0 z-[210] border-b bg-white pt-[env(safe-area-inset-top,0px)] transition-shadow ${
        scrolled ? "border-line shadow-[0_2px_12px_rgba(11,26,79,0.08)]" : "border-transparent"
      }`}
    >
      <Shell className="flex h-16 items-center justify-between gap-4 md:h-[72px]">
        <a href="#main" aria-label="BulBul Hardcase home" className="flex h-full shrink-0 items-center">
          <img alt="Bulbul Hardcase" width={112} height={56} className="h-12 w-auto md:h-14" src={assets.logoNav} />
        </a>

        <nav className="hidden flex-1 items-center gap-1 lg:flex" aria-label={t("navPrimary")}>
          {navLinkKeys.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm font-semibold text-ink transition-colors hover:text-navy hover:underline hover:underline-offset-8"
            >
              {t(item.key)}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <LanguageToggle />
          <a href="#quote" className={`max-sm:hidden ${primaryButton} min-h-9 px-4 py-2 text-xs`}>
            {t("requestQuote")}
          </a>
          <button
            type="button"
            className="flex size-11 items-center justify-center text-ink lg:hidden"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <svg aria-hidden="true" className="h-5 w-7" viewBox="0 0 28 20" fill="none">
              <path d="M1 2h26M1 10h26M1 18h26" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </Shell>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[110] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label={t("closeMenu")}
            onClick={() => setMobileOpen(false)}
          />
          <nav
            className="absolute right-0 top-0 flex h-full w-[min(100%,340px)] flex-col bg-white px-6 pb-6 pt-[calc(1rem+env(safe-area-inset-top))] shadow-[-8px_0_32px_rgba(11,26,79,0.15)]"
            aria-label={t("navMobile")}
          >
            <div className="mb-4 flex items-center justify-between">
              <LanguageToggle />
              <button
                type="button"
                className="flex size-11 items-center justify-center text-ink"
                aria-label={t("closeMenu")}
                onClick={() => setMobileOpen(false)}
              >
                <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="m5 5 14 14M19 5 5 19" />
                </svg>
              </button>
            </div>
            <ul className="flex flex-col">
              {navLinkKeys.map((item) => (
                <li key={item.href} className="border-b border-line">
                  <a
                    href={item.href}
                    className="group flex items-center justify-between py-4 text-base font-semibold text-ink hover:text-navy"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t(item.key)}
                    <Arrow />
                  </a>
                </li>
              ))}
            </ul>
            <a href="#quote" className={`mt-6 w-full ${primaryButton}`} onClick={() => setMobileOpen(false)}>
              {t("requestQuote")}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function Hero() {
  const { t } = useI18n();
  return (
    <section className="relative flex min-h-[min(78vh,720px)] items-center overflow-hidden bg-navy">
      {/* Background: `assets.hero` — locked; do not replace without explicit approval */}
      <img alt="" fetchPriority="high" className="absolute inset-0 size-full object-cover" src={assets.hero} />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" aria-hidden />
      <Shell className="relative py-20 pb-32 md:pb-40">
        <div className="max-w-[640px] text-white">
          <h1 className="text-balance text-[clamp(2.25rem,6vw,4rem)] font-bold leading-[1.08] tracking-tight">
            {t("heroH1a")} {t("heroH1b")}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/90 md:text-lg">{t("heroSub")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#quote" className={`group ${primaryButton}`}>
              {t("heroCtaPrimary")}
              <Arrow />
            </a>
            <a
              href={WHATSAPP_URL}
              data-location="hero"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-navy"
            >
              {t("heroCtaSecondary")}
            </a>
          </div>
        </div>
      </Shell>
    </section>
  );
}

const featureIcons = [
  <path key="a" d="M28 5 48 16v24L28 51 8 40V16L28 5ZM8 16l20 12 20-12M28 28v23" />,
  <path key="b" d="M10 18h36v27H10zM6 12h44M17 7v10M28 7v10M39 7v10M17 29h22M17 36h22" />,
  <path key="c" d="M8 12h40v32H8zM14 18h28v20H14zm6 14 6-7 5 5 5-6" />,
];

function FeaturePanel() {
  const { t } = useI18n();
  const features = [
    { title: t("engineeredF1Title"), body: t("engineeredF1Body") },
    { title: t("engineeredF2Title"), body: t("engineeredF2Body") },
    { title: t("engineeredF3Title"), body: t("engineeredF3Body") },
  ];
  return (
    <section id="engineered" className="relative z-10 scroll-mt-24">
      <Shell className="-mt-20 md:-mt-24">
        <div className="bg-white shadow-[0_8px_40px_rgba(11,26,79,0.14)]">
          <div className="border-b border-line px-6 py-5 md:px-8">
            <h2 className="text-lg font-bold text-ink md:text-xl">{t("engineeredTitle")}</h2>
            <p className="mt-1 text-sm text-muted">
              {t("engineeredSub")} {t("engineeredSub2")}
            </p>
          </div>
          <div className="grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
            {features.map((f, i) => (
              <div key={f.title} className="flex gap-4 p-6 md:p-8">
                <svg viewBox="0 0 56 56" className="size-10 shrink-0 text-navy" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  {featureIcons[i]}
                </svg>
                <div>
                  <h3 className="font-semibold text-ink">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Shell>
    </section>
  );
}

function ProblemSection() {
  const { t } = useI18n();
  return (
    <section id="problem" className="scroll-mt-24 py-16 md:py-24">
      <Shell className="grid gap-10 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <Eyebrow>{t("navWhyCustom")}</Eyebrow>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-ink md:text-[44px]">
            {t("problemL1")} <span className="text-navy">{t("problemL2a")} {t("problemL2b")}</span>
          </h2>
        </Reveal>
        <Reveal className="space-y-5 text-base leading-relaxed text-muted md:text-lg" delayMs={80}>
          <p>{t("problemP1")}</p>
          <p>{t("problemP2")}</p>
        </Reveal>
      </Shell>
    </section>
  );
}

function ProductsSection() {
  const { t } = useI18n();
  const products = [
    { title: t("productElectricalTitle"), sub: t("productElectricalSub"), img: assets.productElectrical },
    { title: t("productCamerasTitle"), sub: t("productCamerasSub"), img: assets.productCameras },
    { title: t("productMusicalTitle"), sub: t("productMusicalSub"), img: assets.productMusical },
    { title: t("productIndustrialTitle"), sub: t("productIndustrialSub"), img: assets.productIndustrial },
  ];
  return (
    <section id="products" className="scroll-mt-24 border-t border-line py-16 md:py-24">
      <Shell>
        <Reveal className="mb-10 grid gap-4 md:grid-cols-2 md:items-end md:gap-16">
          <div>
            <Eyebrow>{t("productsBadge")}</Eyebrow>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t("productsTitle")}</h2>
          </div>
          <p className="text-base leading-relaxed text-muted md:text-lg">{t("productsBlurb")}</p>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.title} delayMs={i * 60}>
              <a href="#quote" className="group flex h-full flex-col border border-line bg-white transition-shadow hover:shadow-[0_8px_28px_rgba(11,26,79,0.12)]">
                <div className="aspect-square overflow-hidden bg-black">
                  <img alt="" loading="lazy" className="size-full object-contain transition-transform duration-500 group-hover:scale-105" src={p.img} />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-bold leading-snug text-ink">{p.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted">{p.sub}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy">
                    {t("requestQuote")}
                    <Arrow />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </Shell>
    </section>
  );
}

function HowItWorksSection() {
  const { t } = useI18n();
  const steps = [
    { img: assets.gradientHow1, title: t("how1Title"), body: t("how1Body") },
    { img: assets.gradientHow2, title: t("how2Title"), body: t("how2Body") },
    { img: assets.gradientHow3, title: t("how3Title"), body: t("how3Body") },
    { img: assets.gradientHow4, title: t("how4Title"), body: t("how4Body") },
  ];
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-mist py-16 md:py-24">
      <Shell>
        <Reveal>
          <Eyebrow>{t("navProcess")}</Eyebrow>
          <h2 className="mb-10 text-3xl font-bold tracking-tight md:text-4xl">{t("howTitle")}</h2>
        </Reveal>
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} delayMs={i * 60} className="flex h-full flex-col bg-white">
                <div className="aspect-square overflow-hidden bg-black">
                  <img alt="" loading="lazy" className="size-full object-contain" src={s.img} />
                </div>
                <div className="p-5">
                  <p className="text-sm font-semibold text-accent">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-1 text-lg font-bold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
                </div>
            </Reveal>
          ))}
        </ol>
      </Shell>
    </section>
  );
}

function GallerySection() {
  const { t } = useI18n();
  const photos = [
    { src: "/gallery/flightcase-laser-medis.jpeg", caption: t("gallery1") },
    { src: "/gallery/case-instrumen-bedah.jpeg", caption: t("gallery2") },
    { src: "/gallery/flightcase-perangkat-medis.jpeg", caption: t("gallery5") },
    { src: "/gallery/flightcase-troli-ramp.jpeg", caption: t("gallery6") },
    { src: "/gallery/case-lengan-monitor.jpeg", caption: t("gallery7") },
    { src: "/gallery/flightcase-tower-medis.jpeg", caption: t("gallery8") },
    { src: "/gallery/flightcase-lemari-beroda.jpeg", caption: t("gallery3") },
  ];
  const track = useRef<HTMLUListElement>(null);
  // One step = one card plus the gap, so each press lands on the next snap point.
  const slide = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (el && card) el.scrollBy({ left: dir * (card.offsetWidth + 24), behavior: "smooth" });
  };
  const navButton = "flex size-11 items-center justify-center rounded-full border border-line bg-white text-navy transition-colors hover:bg-mist";
  return (
    <section id="gallery" className="scroll-mt-24 border-t border-line py-16 md:py-24">
      <Shell>
        <Reveal className="mb-10 flex items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t("galleryTitle")}</h2>
            <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">{t("galleryBlurb")}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button type="button" className={navButton} aria-label={t("galleryPrev")} onClick={() => slide(-1)}>
              <span className="rotate-180">
                <Arrow />
              </span>
            </button>
            <button type="button" className={navButton} aria-label={t("galleryNext")} onClick={() => slide(1)}>
              <Arrow />
            </button>
          </div>
        </Reveal>
        <ul
          ref={track}
          aria-label={t("galleryTitle")}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {photos.map((p) => (
            <li key={p.src} className="w-[80%] shrink-0 snap-start sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]">
              <figure className="h-full border border-line bg-white">
                <img alt={p.caption} loading="lazy" className="aspect-square w-full object-cover" src={p.src} />
                <figcaption className="p-4 text-sm text-muted">{p.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Shell>
    </section>
  );
}

function CtaSection() {
  const { t } = useI18n();
  const waUrl = `${WHATSAPP_URL}?text=${encodeURIComponent(t("ctaWhatsappText"))}`;
  return (
    <section id="quote" className="scroll-mt-24 py-16 md:py-24">
      <Shell>
        <div className="grid overflow-hidden border border-navy bg-navy text-white md:grid-cols-2">
          <div className="flex flex-col justify-center gap-6 p-8 md:p-14">
            <h2 className="text-3xl font-bold leading-tight md:text-4xl">{t("ctaTitle")}</h2>
            <p className="max-w-md text-base leading-relaxed text-white/85">{t("ctaBody")}</p>
            <a
              href={waUrl}
              data-location="cta"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-mist"
            >
              {t("ctaButton")}
              <Arrow />
            </a>
          </div>
          <img alt="" loading="lazy" className="aspect-[3/2] w-full bg-white object-contain p-4 md:aspect-auto md:h-full md:min-h-[360px]" src={assets.ctaBottom} />
        </div>
      </Shell>
    </section>
  );
}

function Footer() {
  const { t } = useI18n();
  const company = [
    { label: t("footerAbout"), href: "#problem" },
    { label: t("footerProcess"), href: "#how-it-works" },
    { label: t("footerContact"), href: "#quote" },
  ];
  const industry = [t("footerMed"), t("footerCam"), t("footerMusic"), t("footerInd"), t("footerOffice")];

  return (
    <footer id="contact" className="scroll-mt-24 bg-navy py-14 text-white md:py-20">
      <Shell className="flex flex-col gap-12 lg:flex-row lg:justify-between">
        <div className="max-w-sm space-y-5">
          <div className="inline-block bg-white p-2">
            <img alt="Bulbul Hardcase" width={96} height={48} className="h-12 w-auto" src={assets.logoNav} />
          </div>
          <p className="text-sm uppercase tracking-[0.18em] text-white/80">{t("footerTagline")}</p>
          <a href={WHATSAPP_URL} data-location="footer" target="_blank" rel="noopener noreferrer" className="inline-block py-2 text-sm font-semibold text-white hover:underline">
            WhatsApp +62 857-8224-2101
          </a>
          <address className="text-sm not-italic leading-relaxed text-white/80">
            Jl. Kebagusan II No.30, RT.2/RW.7, Kebagusan, Pasar Minggu, Jakarta Selatan 12520
          </address>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 sm:gap-20">
          <nav aria-label={t("footerCompany")}>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/60">{t("footerCompany")}</p>
            <ul className="space-y-1">
              {company.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="inline-block py-2 text-sm text-white/90 hover:text-white hover:underline">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label={t("footerIndustry")}>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/60">{t("footerIndustry")}</p>
            <ul className="space-y-1">
              {industry.map((label) => (
                <li key={label}>
                  <a href="#products" className="inline-block py-2 text-sm text-white/90 hover:text-white hover:underline">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Shell>
      <Shell className="mt-12 border-t border-white/15 pt-6">
        <p className="text-xs text-white/60">{t("footerCopyright")}</p>
      </Shell>
    </footer>
  );
}
