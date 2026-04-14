import type { ReactNode } from "react";
import { assets } from "./figma-assets";
import { SupportChat } from "./SupportChat";
import { Reveal } from "./Reveal";
import { useScrollPast } from "./hooks/useScrollPast";

const brand = "#f84300";
const card = "#131313";

export default function App() {
  const scrolled = useScrollPast(40);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black focus:outline-none focus:ring-2 focus:ring-[#f84300]"
      >
        Skip to content
      </a>
      <NavBar scrolled={scrolled} />
      <main id="main">
        <Hero />
        <ProblemSection />
        <EngineeredSection />
        <ProductsSection />
        <HowItWorksSection />
        <CtaSection />
        <Footer />
      </main>
      <SupportChat />
    </div>
  );
}

function Shell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1440px] px-6 md:px-[120px] ${className}`}>{children}</div>;
}

function NavBar({ scrolled }: { scrolled: boolean }) {
  return (
    <header
      className={`fixed left-0 right-0 top-0 z-[100] transition-[padding,background-color,border-color,box-shadow] duration-500 ease-out ${
        scrolled ? "border-b border-white/10 bg-[#0a0a0a]/88 py-3 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.65)] backdrop-blur-xl" : "border-b border-transparent bg-transparent py-5 md:py-6"
      }`}
    >
      <Shell>
        <div
          className={`nav-glass flex items-center justify-between gap-3 rounded-[6px] px-4 py-3 shadow-[0px_2px_10px_0px_rgba(0,0,0,0.12)] md:py-4 ${scrolled ? "ring-1 ring-white/10" : "ring-1 ring-white/5"}`}
          style={{ backgroundColor: scrolled ? "rgba(24,24,24,0.65)" : "rgba(171,171,171,0.1)" }}
        >
          <a href="#" className="flex min-w-0 flex-1 items-center gap-2.5">
            <div className="relative h-10 w-8 shrink-0">
              <img alt="" className="pointer-events-none size-full object-contain" src={assets.logoNav} />
            </div>
            <span className="font-display truncate text-base font-bold tracking-[0.02em]">Bulbul Hardcase</span>
          </a>
          <div className="flex shrink-0 items-center gap-2 md:gap-3">
            <a
              href="#quote"
              className="hidden px-4 py-2.5 text-center text-sm font-semibold text-white transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-10px_rgba(248,67,0,0.55)] sm:inline-block"
              style={{ backgroundColor: brand }}
            >
              Request Quote
            </a>
            <button
              type="button"
              className="flex size-[43px] shrink-0 items-center justify-center overflow-hidden transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-8px_rgba(248,67,0,0.5)]"
              style={{ backgroundColor: brand }}
              aria-label="Open menu"
            >
              <img alt="" className="block h-5 w-[30px]" src={assets.menuIcon} />
            </button>
          </div>
        </div>
      </Shell>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-[min(100vh,1024px)] flex-col pt-[104px] md:pt-[112px]" data-node-id="14:209">
      <img
        alt=""
        className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
        src={assets.hero}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-[#0a0a0a]/90" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_20%,rgba(248,67,0,0.12),transparent_60%)]" aria-hidden />
      <div className="relative z-[1] flex flex-1 flex-col items-center justify-center px-6 py-16 text-center md:px-[120px] md:py-[50px]">
        <div className="flex max-w-[686px] flex-col items-center gap-6 py-6 md:gap-8 md:py-10">
          <h1
            className="hero-rise font-sans text-balance break-words text-[clamp(2rem,6.5vw,58px)] font-bold leading-[clamp(2.75rem,8.5vw,80px)] tracking-[0.2px] text-white md:text-[58px] md:leading-[80px]"
            style={{ animationDelay: "40ms" }}
          >
            Built to hold.
            <br />
            Engineered to last.
          </h1>
          <p
            className="hero-rise max-w-xl text-lg leading-[30px] tracking-[0.2px] text-white/90 md:text-xl"
            style={{ animationDelay: "140ms" }}
          >
            Custom hardcase solutions for equipment that cannot be replaced. Precision-fitted, impact-tested,
            field-proven.
          </p>
          <div
            className="hero-rise flex w-full max-w-md flex-col items-stretch gap-4 sm:max-w-none sm:flex-row sm:items-center sm:justify-center"
            style={{ animationDelay: "260ms" }}
          >
            <a
              href="#custom"
              className="inline-flex items-center justify-center gap-3 rounded-[5px] px-6 py-[15px] text-sm font-bold tracking-[0.2px] text-white transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_-12px_rgba(248,67,0,0.55)]"
              style={{ backgroundColor: brand }}
            >
              Start Your Custom Case
              <span className="inline-block h-4 w-[9px] transition-transform duration-300 group-hover:translate-x-1">
                <img alt="" className="size-full" src={assets.arrowRight} />
              </span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-[5px] border border-solid px-10 py-[15px] text-sm font-bold tracking-[0.2px] text-white transition-[transform,background-color] duration-300 hover:-translate-y-1 hover:bg-white/5"
              style={{ borderColor: brand }}
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section className="relative border-t border-white/[0.06] py-16 md:py-[100px]" data-node-id="14:225">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage: "repeating-linear-gradient(-18deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 3px)",
        }}
      />
      <Shell className="relative flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-[72px]">
        <Reveal className="flex max-w-[568px] flex-col gap-8" delayMs={0}>
          <div className="space-y-0 font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] md:text-[60px] md:leading-[1]">
            <p>Standard cases fail.</p>
            <p style={{ color: brand }}>Custom protection</p>
            <p style={{ color: brand }}>endures.</p>
          </div>
          <div className="h-1 w-20 rounded-full shadow-[0_0_24px_rgba(248,67,0,0.45)]" style={{ backgroundColor: brand }} />
        </Reveal>
        <Reveal className="flex min-w-0 flex-1 flex-col gap-6 text-lg leading-[29.25px] text-white/88" delayMs={90}>
          <p>
            Off-the-shelf solutions ignore the micro-vibrations and specific impact points of specialized gear. We
            don&apos;t just provide a box; we provide a calibrated environment.
          </p>
          <p>
            Every millimeter is calculated. Every seal is tested. Because when the mission is critical, failure
            isn&apos;t an option.
          </p>
        </Reveal>
        <div className="hidden shrink-0 lg:block lg:w-[100px]">
          <div className="sticky top-28 w-[100px]">
            <button
              type="button"
              className="relative block size-[100px] cursor-pointer transition-[transform,filter] duration-300 hover:scale-105 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              aria-label="Open customer support chat"
              onClick={() => {
                document.querySelector<HTMLButtonElement>("[data-support-fab]")?.click();
              }}
            >
              <img
                alt=""
                className="size-full drop-shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
                src={assets.chatBubble}
              />
              <span className="pointer-events-none absolute left-[22%] right-[22%] top-[22px] aspect-square overflow-hidden">
                <span className="absolute inset-[12.5%_8.33%] block">
                  <img alt="" className="absolute inset-0 size-full max-w-none" src={assets.chatIcon} />
                </span>
              </span>
            </button>
          </div>
        </div>
      </Shell>
    </section>
  );
}

function EngineeredSection() {
  const features = [
    {
      icon: assets.feature1,
      title: "Impact-Resistant",
      body: (
        <>
          Ultra-high molecular weight polypropylene shell designed to deflect kinetic energy away from the core
          contents.
        </>
      ),
    },
    {
      icon: assets.feature2,
      title: "PRESSURE-RESISTANT",
      body: <>Automatic pressure equalization valve balances internal air pressure while keeping water and dust out.</>,
    },
    {
      icon: assets.feature3,
      title: "PRECISION-FIT",
      body: (
        <>
          Laser-cut cross-linked polyethylene (XLPE) foam, custom contoured to your equipment&apos;s exact CAD
          specifications.
        </>
      ),
    },
  ];

  return (
    <section
      className="relative py-16 md:py-[100px]"
      data-node-id="15:535"
      style={{
        background: "linear-gradient(180deg, #0a0a0a 0%, #0c0c0c 40%, #0a0a0a 100%)",
      }}
    >
      <Shell className="flex flex-col items-center text-center">
        <Reveal delayMs={0}>
          <div className="space-y-3 tracking-[0.2px]">
            <h2 className="font-display text-3xl font-extrabold leading-tight md:text-[40px] md:leading-[50px]">Engineered to Endure</h2>
            <p className="text-lg font-normal text-white/85 md:text-xl">
              Three layers of protection.
              <br />
              Zero compromise
            </p>
          </div>
        </Reveal>
        <div className="mt-14 grid w-full gap-10 md:grid-cols-3 md:gap-10 lg:px-0 lg:py-[50px]">
          {features.map((f, i) => (
            <Reveal key={f.title} className="flex flex-col items-start gap-4 text-left" delayMs={80 + i * 70}>
              <div className="size-14 shrink-0 transition-transform duration-500 hover:rotate-[-4deg] hover:scale-105">
                <img alt="" className="size-full" src={f.icon} />
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
  return (
    <section className="relative py-12 md:py-[50px]" data-node-id="29:630">
      <Shell className="flex flex-col gap-12 py-8 md:flex-row md:items-end md:gap-24 md:py-[50px]">
        <Reveal className="flex max-w-[380px] flex-col gap-6" delayMs={0}>
          <h2 className="font-display text-3xl font-extrabold leading-tight tracking-[-0.03em] md:text-4xl md:leading-[1.1]">
            Explore Bulbul Products
          </h2>
          <div
            className="inline-flex w-fit items-center px-2.5 py-1.5 text-lg tracking-[-0.02em] shadow-[0_0_40px_-12px_rgba(248,67,0,0.4)] md:text-xl"
            style={{ backgroundColor: brand }}
          >
            <span className="leading-8">Precision Built Since 2021</span>
          </div>
        </Reveal>
        <Reveal className="min-w-0 flex-1 text-xl leading-snug tracking-[-0.02em] text-white/85 md:text-2xl" delayMs={80}>
          Every case is custom-engineered for mission-critical equipment. Built in South Jakarta with industrial-grade
          materials and precision-cut foam — designed around your exact specifications
        </Reveal>
      </Shell>

      <Shell className="grid grid-cols-1 gap-6 py-8 md:auto-rows-[minmax(388px,auto)] md:grid-cols-12 md:gap-6 md:py-[50px]">
        <ProductCard
          className="min-h-[320px] md:col-span-8 md:row-start-1 md:min-h-[388px]"
          title="Electrical Equipment"
          subtitle="Precision-fit sanctuary"
          image={assets.productElectrical}
        />
        <ProductCard
          className="min-h-[500px] md:col-span-4 md:row-span-2 md:col-start-9 md:row-start-1 md:min-h-[800px]"
          title="Cameras & Drones"
          subtitle="The explorer's choice"
          image={assets.productCameras}
          imageClassName="[&_img]:scale-[1.15] [&_img]:object-[center_20%]"
        />
        <ProductCard
          className="min-h-[320px] md:col-span-4 md:col-start-1 md:row-start-2 md:min-h-[388px]"
          title="Musical Instruments"
          subtitle="The professional's standard"
          image={assets.productMusical}
          imageClassName="[&_img]:object-[30%_center] [&_img]:scale-110"
        />
        <ProductCard
          className="min-h-[320px] md:col-span-4 md:col-start-5 md:row-start-2 md:min-h-[388px]"
          title="Industrial Tools"
          subtitle="Built for the field"
          image={assets.productIndustrial}
          imageClassName="[&_img]:object-[35%_center] [&_img]:scale-110"
        />
      </Shell>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      img: assets.gradientHow1,
      title: "DEFINE EQUIPMENT",
      body: "High-resolution spatial scanning and volumetric analysis of the subject hardware to establish boundary constraints.",
    },
    {
      img: assets.gradientHow2,
      title: "PRECISION DESIGN",
      body: "Generative parametric modeling creates a structural chassis optimized for impact dissipation and weight ratio.",
    },
    {
      img: assets.gradientHow3,
      title: "INDUSTRIAL PRODUCTION",
      body: "Multi-axis CNC milling and polymer injection layering ensures sub-micron tolerance adherence to original CAD.",
    },
    {
      img: assets.gradientHow4,
      title: "DELIVERY",
      body: "Final ultrasonic cleaning, surface anodizing, and secure transit packaging to global deployment nodes.",
    },
  ];

  return (
    <section className="relative py-12 md:py-[50px]" data-node-id="63:75">
      <Shell className="flex flex-col items-center">
        <Reveal delayMs={0}>
          <h2 className="text-center font-display text-3xl font-extrabold tracking-[-0.03em] md:text-4xl md:leading-10">How it Works</h2>
        </Reveal>
        <div className="mt-12 grid w-full gap-10 md:grid-cols-2 xl:grid-cols-4 xl:gap-[37px]">
          {steps.map((s, i) => (
            <Reveal key={s.title} className="max-w-[260px] md:max-w-none" delayMs={60 + i * 55}>
              <article className="flex flex-col gap-5">
                <div className="relative aspect-[260/278] w-full overflow-hidden rounded-sm ring-1 ring-white/10">
                  <img alt="" className="size-full object-cover transition-transform duration-[1.2s] hover:scale-[1.03]" src={s.img} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-xl font-bold uppercase tracking-[-0.02em]">{s.title}</h3>
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
  return (
    <section id="custom" className="relative overflow-hidden py-20 md:py-[100px]" data-node-id="74:173">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <img
          alt=""
          className="absolute left-0 top-[-40%] h-[200%] w-full max-w-none object-cover"
          src={assets.ctaBottom}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/55 to-black/35" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(248,67,0,0.14),transparent_55%)]" />
      </div>
      <Shell className="relative z-[1] flex flex-col items-center gap-10 text-center">
        <Reveal className="flex w-full flex-col items-center gap-8" delayMs={0}>
          <div className="h-[5px] w-[min(360px,80vw)] rounded-full shadow-[0_0_32px_rgba(248,67,0,0.35)]" style={{ backgroundColor: brand }} />
          <h2 className="font-display text-4xl font-bold md:text-[50px] md:leading-[1.1]">Start Your Custom Case</h2>
          <p className="max-w-[388px] text-base leading-[22px] text-white/88">
            Tell us what you need to protect. We&apos;ll engineer a solution built around your exact equipment.
          </p>
          <a
            href="#quote"
            className="inline-flex min-w-[240px] items-center justify-center rounded-[5px] border border-solid px-8 py-[17px] text-lg font-semibold tracking-[0.2px] text-white transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-14px_rgba(248,67,0,0.55)]"
            style={{ backgroundColor: brand, borderColor: brand }}
          >
            Describe Your Equipment
          </a>
        </Reveal>
      </Shell>
    </section>
  );
}

function Footer() {
  const company = ["About Us", "Our Process", "Contact"];
  const industry = ["Medical Equipment", "Camera & Drone", "Musical Instruments", "Industrial Tools", "Office Equipment"];

  return (
    <footer
      id="contact"
      className="border-t border-white/10 bg-gradient-to-b from-transparent to-[rgba(18,20,24,0.55)] py-12 md:py-[50px]"
      data-node-id="80:67"
    >
      <Shell className="flex flex-col gap-16 lg:flex-row lg:gap-[100px]">
        <Reveal className="flex min-w-0 flex-1 flex-col gap-10" delayMs={0}>
          <div className="space-y-10">
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-11 shrink-0">
                <img alt="" className="size-full object-contain" src={assets.logoFooter} />
              </div>
              <span className="font-display text-3xl font-bold tracking-[0.02em] md:text-4xl">Bulbul Hardcase</span>
            </div>
            <p className="text-sm font-light uppercase tracking-[0.22em] text-white/85 md:text-base md:tracking-[0.28em]">
              Precision-engineered protection for mission-critical equipment.
            </p>
          </div>
          <p className="text-sm text-white/55 md:text-base">© 2026 BulBul Hardcase. All rights reserved.</p>
        </Reveal>
        <div className="flex flex-col gap-12 sm:flex-row">
          <nav className="min-w-[200px] space-y-3" aria-label="Company">
            <p className="text-[10px] uppercase tracking-[0.5px] text-white/55">Company</p>
            <ul className="space-y-2.5">
              {company.map((l) => (
                <li key={l}>
                  <a href="#" className="link-sweep text-base text-white/90 transition-colors hover:text-white">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <nav className="min-w-[200px] space-y-3" aria-label="Industry">
            <p className="text-[10px] uppercase tracking-[0.5px] text-white/55">Industry</p>
            <ul className="space-y-2.5">
              {industry.map((l) => (
                <li key={l}>
                  <a href="#" className="link-sweep text-base text-white/90 transition-colors hover:text-white">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Shell>
      <div id="quote" className="sr-only" aria-hidden>
        Quote anchor
      </div>
    </footer>
  );
}
