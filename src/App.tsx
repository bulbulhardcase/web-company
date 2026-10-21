import { useEffect, useState, type ReactNode } from "react";
import { assets } from "./figma-assets";
import { SupportChat } from "./SupportChat";
import { QuoteForm } from "./QuoteForm";
import { Reveal } from "./Reveal";
import { useScrollPast } from "./hooks/useScrollPast";
import { useI18n } from "./i18n/I18nProvider";
import { LanguageToggle } from "./i18n/LanguageToggle";
import type { Dictionary } from "./i18n/dictionary";

const brand = "#f84300";
const card = "#131313";

export default function App() {
  const scrolled = useScrollPast(40);
  const { t } = useI18n();

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black focus:outline-none focus:ring-2 focus:ring-[#f84300]"
      >
        {t("skipToContent")}
      </a>
      <NavBar scrolled={scrolled} />
      <main id="main">
        <Hero />
        <ProblemSection />
        <EngineeredSection />
        <ProductsSection />
        <HowItWorksSection />
        <CtaSection />
        <QuoteForm />
        <Footer />
      </main>
      <SupportChat />
    </div>
  );
}

function Shell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`mx-auto w-full max-w-[1440px] [padding-left:max(1rem,env(safe-area-inset-left))] [padding-right:max(1rem,env(safe-area-inset-right))] sm:[padding-left:max(1.5rem,env(safe-area-inset-left))] sm:[padding-right:max(1.5rem,env(safe-area-inset-right))] md:[padding-left:max(7.5rem,env(safe-area-inset-left))] md:[padding-right:max(7.5rem,env(safe-area-inset-right))] ${className}`}
    >
      {children}
    </div>
  );
}

const navLinkKeys: { href: string; key: keyof Dictionary }[] = [
  { href: "#problem", key: "navWhyCustom" },
  { href: "#engineered", key: "navEngineered" },
  { href: "#products", key: "navProducts" },
  { href: "#how-it-works", key: "navProcess" },
  { href: "#custom", key: "navCustomBuild" },
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
      className={`fixed left-0 right-0 top-0 z-[100] transition-[padding,background-color,border-color,box-shadow] duration-500 ease-out ${
        scrolled
          ? "border-b border-white/10 bg-[#0a0a0a]/88 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.65)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent pb-5 pt-[calc(1.25rem+env(safe-area-inset-top,0px))] md:pb-6 md:pt-[calc(1.5rem+env(safe-area-inset-top,0px))]"
      }`}
    >
      <Shell>
        <div
          className={`nav-glass flex items-center justify-between gap-3 rounded-[6px] px-4 py-3 shadow-[0px_2px_10px_0px_rgba(0,0,0,0.12)] md:py-4 ${scrolled ? "ring-1 ring-white/10" : "ring-1 ring-white/5"}`}
          style={{ backgroundColor: scrolled ? "rgba(24,24,24,0.65)" : "rgba(171,171,171,0.1)" }}
        >
          <a href="#main" aria-label="BulBul Hardcase home" className="flex min-w-0 flex-1 items-center gap-2.5 md:flex-none">
            <div className="relative h-14 w-44 shrink-0 flex items-center">
  <img
    alt="Bulbul Hardcase"
    className="pointer-events-none h-auto w-full object-contain"
    src={assets.logoNav}
  />
</div>
            
          </a>

          <nav className="hidden items-center gap-1 lg:flex" aria-label={t("navPrimary")}>
            {navLinkKeys.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="link-sweep rounded px-3 py-2.5 text-sm font-medium text-white/90 transition-colors hover:text-white"
              >
                {t(item.key)}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 md:gap-3">
            <LanguageToggle />
            <a
              href="#quote"
              className="hidden px-4 py-2.5 text-center text-sm font-semibold text-white transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-10px_rgba(248,67,0,0.55)] sm:inline-block"
              style={{ backgroundColor: brand }}
            >
              {t("requestQuote")}
            </a>
            <button
              type="button"
              className="flex size-11 min-h-[44px] min-w-[44px] shrink-0 items-center justify-center overflow-hidden transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-8px_rgba(248,67,0,0.5)] lg:hidden"
              style={{ backgroundColor: brand }}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
              onClick={() => setMobileOpen((o) => !o)}
            >
              <img alt="" className="block h-5 w-[30px]" src={assets.menuIcon} />
            </button>
          </div>
        </div>
      </Shell>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[110] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 z-0 bg-black/70 backdrop-blur-sm"
            aria-label={t("closeMenu")}
            onClick={() => setMobileOpen(false)}
          />
          <nav
            className="absolute right-0 top-0 z-10 flex h-full w-[min(100%,340px)] flex-col border-l border-white/10 bg-[#0a0a0e] py-6 pl-6 pr-6 pt-[calc(1rem+env(safe-area-inset-top))] shadow-[-12px_0_48px_rgba(0,0,0,0.55)]"
            aria-label={t("navMobile")}
          >
            <div className="mb-4">
              <LanguageToggle />
            </div>
            <ul className="flex flex-col gap-1">
              {navLinkKeys.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="block rounded-md py-3 text-base font-medium text-white/95 transition-colors hover:bg-white/5 hover:text-white"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t(item.key)}
                  </a>
                </li>
              ))}
              <li className="mt-4 border-t border-white/10 pt-4">
                <a
                  href="#quote"
                  className="inline-flex w-full items-center justify-center rounded-[5px] px-4 py-3 text-sm font-semibold text-white transition-[transform,box-shadow] hover:shadow-[0_12px_32px_-10px_rgba(248,67,0,0.55)]"
                  style={{ backgroundColor: brand }}
                  onClick={() => setMobileOpen(false)}
                >
                  {t("requestQuote")}
                </a>
              </li>
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function Hero() {
  const { t } = useI18n();
  return (
    <section
      className="relative flex min-h-[min(100vh,1024px)] flex-col overflow-hidden pt-[calc(104px+env(safe-area-inset-top,0px))] md:pt-[calc(112px+env(safe-area-inset-top,0px))]"
      data-node-id="14:209"
    >
      {/* Background: `assets.hero` — locked; do not replace without explicit approval */}
      <img
        alt=""

className="pointer-events-none absolute inset-0 z-0 size-full max-w-none object-contain object-center md:object-cover"
        src={assets.hero}
      />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/50 via-black/40 to-[#0a0a0a]/88" aria-hidden />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_90%_60%_at_50%_20%,rgba(248,67,0,0.12),transparent_60%)]" aria-hidden />
      {/* Soft bridge into next section: gradient + progressive backdrop blur */}
      <div
        className="hero-problem-bridge pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[min(28vh,220px)] md:h-[min(32vh,280px)]"
        aria-hidden
      />
      <div className="relative z-[3] flex flex-1 flex-col items-center justify-center px-6 py-16 text-center md:px-[120px] md:py-[50px]">
        <div className="flex max-w-[686px] flex-col items-center gap-6 py-6 md:gap-8 md:py-10">
          <h1
            className="hero-rise font-sans text-balance break-words text-[clamp(2rem,6.5vw,58px)] font-bold leading-[clamp(2.75rem,8.5vw,80px)] tracking-[0.2px] text-white md:text-[58px] md:leading-[80px]"
            style={{ animationDelay: "40ms" }}
          >
            {t("heroH1a")}
            <br />
            {t("heroH1b")}
          </h1>
          <p
            className="hero-rise max-w-xl text-lg leading-[30px] tracking-[0.2px] text-white/90 md:text-xl"
            style={{ animationDelay: "140ms" }}
          >
            {t("heroSub")}
          </p>
          <div
            className="hero-rise flex w-full max-w-md flex-col items-stretch gap-4 sm:max-w-none sm:flex-row sm:items-center sm:justify-center"
            style={{ animationDelay: "260ms" }}
          >
            <a
              href="#custom"
              className="group inline-flex items-center justify-center gap-3 rounded-[5px] px-6 py-[15px] text-sm font-bold tracking-[0.2px] text-white transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_-12px_rgba(248,67,0,0.55)]"
              style={{ backgroundColor: brand }}
            >
              {t("heroCtaPrimary")}
              <span className="inline-block h-4 w-[9px] transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                <svg viewBox="0 0 9 16" className="size-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L8 8L1 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-[5px] border border-solid px-10 py-[15px] text-sm font-bold tracking-[0.2px] text-white transition-[transform,background-color] duration-300 hover:-translate-y-1 hover:bg-white/5"
              style={{ borderColor: brand }}
            >
              {t("heroCtaSecondary")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const { t } = useI18n();
  return (
    <section
      id="problem"
      className="relative border-t border-white/[0.04] bg-[#0a0a0a] py-16 md:py-[100px] scroll-mt-28"
      data-node-id="14:225"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage: "repeating-linear-gradient(-18deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 3px)",
        }}
      />
      <Shell className="relative flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-[72px]">
        <Reveal className="flex max-w-[568px] flex-col gap-8" delayMs={0}>
          <div className="space-y-0 font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-[60px] md:leading-[1]">
            <p>{t("problemL1")}</p>
            <p style={{ color: brand }}>{t("problemL2a")}</p>
            <p style={{ color: brand }}>{t("problemL2b")}</p>
          </div>
          <div className="h-1 w-20 rounded-full shadow-[0_0_24px_rgba(248,67,0,0.45)]" style={{ backgroundColor: brand }} />
        </Reveal>
        <Reveal className="flex min-w-0 flex-1 flex-col gap-6 text-lg leading-[29.25px] text-white/88" delayMs={90}>
          <p>{t("problemP1")}</p>
          <p>{t("problemP2")}</p>
        </Reveal>
      </Shell>
    </section>
  );
}

function EngineeredSection() {
  const { t } = useI18n();
  const features = [
    {
      title: t("engineeredF1Title"),
      body: t("engineeredF1Body"),
    },
    {
      title: t("engineeredF2Title"),
      body: t("engineeredF2Body"),
    },
    {
      title: t("engineeredF3Title"),
      body: t("engineeredF3Body"),
    },
  ];

  return (
    <section
      id="engineered"
      className="relative scroll-mt-28 py-16 md:py-[100px]"
      data-node-id="15:535"
      style={{
        background: "linear-gradient(180deg, #0a0a0a 0%, #0c0c0c 40%, #0a0a0a 100%)",
      }}
    >
      <Shell className="flex flex-col items-center text-center">
        <Reveal delayMs={0}>
          <div className="space-y-3 tracking-[0.2px]">
            <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight md:text-[40px] md:leading-[50px]">
              {t("engineeredTitle")}
            </h2>
            <p className="text-lg font-normal text-white/85 md:text-xl">
              {t("engineeredSub")}
              <br />
              {t("engineeredSub2")}
            </p>
          </div>
        </Reveal>
        <div className="mt-14 grid w-full gap-10 md:grid-cols-3 md:gap-10 lg:px-0 lg:py-[50px]">
          {features.map((f, i) => (
            <Reveal key={f.title} className="flex flex-col items-start gap-4 text-left" delayMs={80 + i * 70}>
              <div className="flex size-14 shrink-0 items-center justify-center text-[#f84300] transition-transform duration-500 hover:rotate-[-4deg] hover:scale-105" aria-hidden="true">
                {i === 0 ? (
                  <svg viewBox="0 0 56 56" className="size-full" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M28 5 48 16v24L28 51 8 40V16L28 5Z" />
                    <path d="m8 16 20 12 20-12M28 28v23M18 10l20 12" />
                  </svg>
                ) : i === 1 ? (
                  <svg viewBox="0 0 56 56" className="size-full" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 18h36v27H10zM6 12h44M17 7v10M28 7v10M39 7v10" />
                    <path d="M17 29h22M17 36h22" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 56 56" className="size-full" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 12h40v32H8zM14 18h28v20H14z" />
                    <path d="m20 32 6-7 5 5 5-6" />
                    <circle cx="38" cy="22" r="2" />
                  </svg>
                )}
              </div>
              <h3 className="text-lg font-semibold uppercase tracking-[1.8px] text-white/95">{f.title}</h3>
              <p className="text-base font-light leading-[26px] text-white/80">{f.body}</p>
            </Reveal>
          ))}
        </div>
      </Shell>
    </section>
  );
}

function ProductCard({
  title,
  subtitle,
  image,
  imageClassName = "",
  className,
}: {
  title: string;
  subtitle: string;
  image: string;
  imageClassName?: string;
  className?: string;
}) {
  return (
    <div
      className={`group relative cursor-default overflow-hidden rounded-sm ring-1 ring-white/[0.06] transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_24px_80px_-40px_rgba(0,0,0,0.85)] hover:ring-white/15 ${className ?? ""}`}
      style={{ backgroundColor: card }}
    >
      <div className={`absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-75 ${imageClassName}`}>
        <img alt="" className="size-full max-w-none object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-[1.06]" src={image} />
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#131313] via-[rgba(19,19,19,0.35)] to-transparent"
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute bottom-0 left-0 flex flex-col gap-2 p-8 md:p-10">
        <h3 className="font-display text-xl font-bold leading-8 transition-transform duration-500 group-hover:translate-y-[-2px] md:text-2xl md:leading-8">
          {title}
        </h3>
        <p className="text-xs uppercase tracking-[1.2px]" style={{ color: "#adc6ff" }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function ProductsSection() {
  const { t } = useI18n();
  return (
    <section id="products" className="relative scroll-mt-28 py-20 md:py-[100px]" data-node-id="29:630">
      <Shell className="flex flex-col gap-12 py-6 md:flex-row md:items-end md:gap-24 md:py-8">
        <Reveal className="flex max-w-[380px] flex-col gap-6" delayMs={0}>
          <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight md:text-4xl md:leading-[1.1]">
            {t("productsTitle")}
          </h2>
          <div
            className="inline-flex w-fit items-center px-2.5 py-1.5 text-lg tracking-tight shadow-[0_0_40px_-12px_rgba(248,67,0,0.4)] md:text-xl"
            style={{ backgroundColor: brand }}
          >
            <span className="leading-8">{t("productsBadge")}</span>
          </div>
        </Reveal>
        <Reveal className="min-w-0 flex-1 text-xl leading-snug tracking-normal text-white/85 md:text-2xl" delayMs={80}>
          {t("productsBlurb")}
        </Reveal>
      </Shell>

      <Shell className="grid grid-cols-1 gap-6 py-6 md:auto-rows-[minmax(388px,auto)] md:grid-cols-12 md:gap-6 md:py-10">
        <ProductCard
          className="min-h-[320px] md:col-span-8 md:row-start-1 md:min-h-[388px]"
          title={t("productElectricalTitle")}
          subtitle={t("productElectricalSub")}
          image={assets.productElectrical}
        />
        <ProductCard
          className="min-h-[500px] md:col-span-4 md:row-span-2 md:col-start-9 md:row-start-1 md:min-h-[800px]"
          title={t("productCamerasTitle")}
          subtitle={t("productCamerasSub")}
          image={assets.productCameras}
          imageClassName="[&_img]:scale-[1.15] [&_img]:object-[center_20%]"
        />
        <ProductCard
          className="min-h-[320px] md:col-span-4 md:col-start-1 md:row-start-2 md:min-h-[388px]"
          title={t("productMusicalTitle")}
          subtitle={t("productMusicalSub")}
          image={assets.productMusical}
          imageClassName="[&_img]:object-[30%_center] [&_img]:scale-110"
        />
        <ProductCard
          className="min-h-[320px] md:col-span-4 md:col-start-5 md:row-start-2 md:min-h-[388px]"
          title={t("productIndustrialTitle")}
          subtitle={t("productIndustrialSub")}
          image={assets.productIndustrial}
          imageClassName="[&_img]:object-[35%_center] [&_img]:scale-110"
        />
      </Shell>
    </section>
  );
}

function HowItWorksSection() {
  const { t } = useI18n();
  const steps = [
    {
      img: assets.gradientHow1,
      title: t("how1Title"),
      body: t("how1Body"),
    },
    {
      img: assets.gradientHow2,
      title: t("how2Title"),
      body: t("how2Body"),
    },
    {
      img: assets.gradientHow3,
      title: t("how3Title"),
      body: t("how3Body"),
    },
    {
      img: assets.gradientHow4,
      title: t("how4Title"),
      body: t("how4Body"),
    },
  ];

  return (
    <section id="how-it-works" className="relative scroll-mt-28 py-24 md:py-[120px]" data-node-id="63:75">
      <Shell className="flex flex-col items-center">
        <Reveal delayMs={0}>
          <h2 className="text-center font-display text-3xl font-extrabold tracking-tight md:text-4xl md:leading-10">{t("howTitle")}</h2>
        </Reveal>
        <div className="mt-12 grid w-full gap-10 md:grid-cols-2 xl:grid-cols-4 xl:gap-[37px]">
          {steps.map((s, i) => (
            <Reveal key={s.title} className="mx-auto max-w-[260px] md:mx-0 md:max-w-none" delayMs={60 + i * 55}>
              <article className="flex flex-col gap-5">
                <div className="relative aspect-[260/278] w-full overflow-hidden rounded-sm ring-1 ring-white/10">
                  <img alt="" className="size-full object-cover transition-transform duration-[1.2s] hover:scale-[1.03]" src={s.img} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-xl font-bold uppercase tracking-wide">{s.title}</h3>
                  <p className="text-sm leading-[22.75px] text-white/82">{s.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Shell>
    </section>
  );
}

function CtaSection() {
  const { t } = useI18n();
  return (
    <section id="custom" className="relative scroll-mt-28 overflow-hidden py-28 md:py-[128px]" data-node-id="74:173">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <img
          alt=""
className="absolute inset-0 h-full w-full max-w-none object-contain object-center md:object-cover"
          src={assets.ctaBottom}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/55 to-black/35" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(248,67,0,0.14),transparent_55%)]" />
      </div>
      <Shell className="relative z-[1] flex flex-col items-center gap-10 text-center">
        <Reveal className="flex w-full flex-col items-center gap-8" delayMs={0}>
          <div className="h-[5px] w-[min(360px,80vw)] rounded-full shadow-[0_0_32px_rgba(248,67,0,0.35)]" style={{ backgroundColor: brand }} />
          <h2 className="font-display text-4xl font-bold md:text-[50px] md:leading-[1.1]">{t("ctaTitle")}</h2>
          <p className="max-w-[388px] text-base leading-[22px] text-white/88">{t("ctaBody")}</p>
          <a
            href="#quote"
            className="inline-flex min-w-[240px] items-center justify-center rounded-[5px] border border-solid px-8 py-[17px] text-lg font-semibold tracking-[0.2px] text-white transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-14px_rgba(248,67,0,0.55)]"
            style={{ backgroundColor: brand, borderColor: brand }}
            aria-label={t("ctaButtonAria")}
          >
            {t("ctaButton")}
          </a>
        </Reveal>
      </Shell>
    </section>
  );
}

function Footer() {
  const { t } = useI18n();
  const company = [
    { label: t("footerAbout"), href: "#problem" },
    { label: t("footerProcess"), href: "#how-it-works" },
    { label: t("footerContact"), href: "#contact" },
  ];
  const industry = [
    t("footerMed"),
    t("footerCam"),
    t("footerMusic"),
    t("footerInd"),
    t("footerOffice"),
  ].map((label) => ({ label, href: "#products" }));

  return (
    <footer
      id="contact"
      className="scroll-mt-28 border-t border-white/10 bg-gradient-to-b from-transparent to-[rgba(18,20,24,0.55)] py-16 md:py-[80px]"
      data-node-id="80:67"
    >
      <Shell className="flex flex-col gap-16 lg:flex-row lg:gap-[100px]">
        <Reveal className="flex min-w-0 flex-1 flex-col gap-10" delayMs={0}>
          <div className="space-y-10">
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-44 shrink-0">
                <img
                  alt="Bulbul Hardcase"
                  className="size-full object-contain object-left"
                  src={assets.logoNav}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <span className="font-display text-3xl font-bold tracking-[0.02em] md:text-4xl">Bulbul Hardcase</span>
            </div>
            <p className="text-sm font-light uppercase tracking-[0.22em] text-white/85 md:text-base md:tracking-[0.28em]">
              {t("footerTagline")}
            </p>
          </div>
          <p className="text-sm text-white/55 md:text-base">{t("footerCopyright")}</p>
        </Reveal>
        <div className="flex flex-col gap-12 sm:flex-row">
          <nav className="min-w-[200px] space-y-3" aria-label={t("footerCompany")}>
            <p className="text-[10px] uppercase tracking-[0.5px] text-white/55">{t("footerCompany")}</p>
            <ul className="space-y-2.5">
              {company.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="link-sweep inline-block min-h-[44px] py-2.5 text-base text-white/90 transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <nav className="min-w-[200px] space-y-3" aria-label={t("footerIndustry")}>
            <p className="text-[10px] uppercase tracking-[0.5px] text-white/55">{t("footerIndustry")}</p>
            <ul className="space-y-2.5">
              {industry.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="link-sweep inline-block min-h-[44px] py-2.5 text-base text-white/90 transition-colors hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Shell>
    </footer>
  );
}
