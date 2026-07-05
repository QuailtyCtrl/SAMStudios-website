import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { MagneticButton } from "@/components/magnetic-button";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { StatusPill } from "@/components/status-pill";
import { CITIES, type CityInfo } from "@/components/world-clocks";
import { InfoModal, type ModalContent } from "@/components/info-modal";
import { useReveal } from "@/hooks/use-reveal";
import { Clock, Zap, Layers, Sun, Moon, Sunrise, Sunset } from "lucide-react";
import disciplineBrand from "@/assets/work-neon-studio.jpg";
import disciplineFilm from "@/assets/work-film-set.jpg";
import disciplineProduct from "@/assets/work-app-interface.jpg";
import disciplineSpatial from "@/assets/work-packaging.jpg";

const DISCIPLINES = [
  {
    n: "01",
    emoji: "🎨",
    title: "Brand & Identity",
    copy: "Wordmarks, systems, voice, art direction. The full visual DNA of who you are.",
    long: "We build brands as complete operating systems — from strategy and naming to typography, motion principles, and voice. Every asset is designed to scale across every touchpoint you'll ever ship.",
    meta: [
      { label: "Deliverables", value: "Wordmark, System, Guidelines" },
      { label: "Typical Range", value: "6 – 12 weeks" },
    ],
    image: disciplineBrand,
  },
  {
    n: "02",
    emoji: "🎬",
    title: "Film & Motion",
    copy: "Short films, campaigns, title sequences, music videos, kinetic identity.",
    long: "Concept, direction, production, post — all under one roof. From 15-second social cuts to festival films, we treat motion as its own language, not a decoration.",
    meta: [
      { label: "Crew", value: "In-house directors + DP" },
      { label: "Typical Range", value: "4 – 10 weeks" },
    ],
    image: disciplineFilm,
  },
  {
    n: "03",
    emoji: "💻",
    title: "Digital Products",
    copy: "Sites, apps, interfaces. Crafted front to back with obsessive precision.",
    long: "React, TypeScript, motion-native. We ship marketing sites, product interfaces, and experimental micro-tools with the same craft — pixel-tuned, accessible, and fast.",
    meta: [
      { label: "Stack", value: "React · TS · Node" },
      { label: "Typical Range", value: "6 – 16 weeks" },
    ],
    image: disciplineProduct,
  },
  {
    n: "04",
    emoji: "📦",
    title: "Print & Spatial",
    copy: "Books, posters, packaging, installations, environments. Things you can touch.",
    long: "Substrates, finishes, dielines, spatial systems. When the work needs to exist in the physical world, we sweat the paper stock as hard as the pixels.",
    meta: [
      { label: "Craft", value: "Print · Packaging · Spatial" },
      { label: "Typical Range", value: "3 – 10 weeks" },
    ],
    image: disciplineSpatial,
  },
];

const PROCESS = [
  { n: "01", t: "Brief", emoji: "🎯", c: "We listen, ask the sharp questions, define the win.", long: "Kickoff sessions with your team, competitive audits, and a written creative brief that everyone signs off on before a single pixel moves." },
  { n: "02", t: "Concept", emoji: "💡", c: "Directions, references, the spine of the idea.", long: "Two or three distinct creative territories, each backed by references, sample compositions, and a strategic rationale — designed to disagree with each other." },
  { n: "03", t: "Design", emoji: "✏️", c: "Systems, frames, prototypes — refined until obvious.", long: "The chosen direction becomes a full system. Type scales, color, motion behavior, spacing, edge cases — every state prototyped before build." },
  { n: "04", t: "Build", emoji: "🛠️", c: "Production, engineering, motion, polish, QA.", long: "Engineering, production, animation, and copy come together. Weekly demos, staging environments, cross-device QA, and no surprises at handoff." },
  { n: "05", t: "Launch", emoji: "🚀", c: "Ship, support, measure, iterate — own the rollout.", long: "Launch playbook, monitoring, support windows, and a 30-day retrospective. We stay close through the rollout — the launch is a beginning, not a finale." },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SAM Studios® — We Make Anything" },
      { name: "description", content: "SAM Studios® is a multidisciplinary creative studio crafting brands, films, products, and experiences for the next era." },
      { property: "og:title", content: "SAM Studios® — We Make Anything" },
      { property: "og:description", content: "A multidisciplinary creative studio crafting brands, films, products, and experiences." },
    ],
  }),
  component: Index,
});

function Index() {
  useReveal();
  const heroRef = useRef<HTMLDivElement>(null);
  const [modal, setModal] = useState<ModalContent | null>(null);

  const handleHeroMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  const openDiscipline = (d: (typeof DISCIPLINES)[number]) =>
    setModal({
      eyebrow: `Discipline · ${d.n}`,
      title: d.title,
      image: d.image,
      emoji: d.emoji,
      body: (
        <>
          <p>{d.copy}</p>
          <p className="mt-3">{d.long}</p>
        </>
      ),
      meta: d.meta,
      accent: "SAM · Discipline",
    });

  const openStep = (s: (typeof PROCESS)[number], i: number, total: number) =>
    setModal({
      eyebrow: `Step · ${s.n} of ${String(total).padStart(2, "0")}`,
      title: s.t,
      emoji: s.emoji,
      body: (
        <>
          <p className="font-display text-lg text-foreground">{s.c}</p>
          <p className="mt-3">{s.long}</p>
        </>
      ),
      meta: [
        { label: "Stage", value: `${i + 1} / ${total}` },
        { label: "Owner", value: i < 2 ? "Strategy" : i < 4 ? "Design + Build" : "Delivery" },
      ],
      accent: "SAM · Process",
    });

  const openCity = (c: CityInfo) =>
    setModal({
      eyebrow: `City · ${c.code}`,
      title: `${c.city} — ${c.landmark}`,
      image: c.image,
      emoji: c.emoji,
      body: (
        <>
          <p>{c.blurb}</p>
          <p className="mt-3 text-sm text-muted-foreground/80">
            One studio, always on. Whichever timezone you're in, we're already up.
          </p>
        </>
      ),
      meta: [
        { label: "Timezone", value: c.tz },
        { label: "Airport Code", value: c.code },
      ],
      accent: "SAM · Global",
    });

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-brand/40 selection:text-primary-foreground">
      <Nav />

      <main id="top" className="space-y-24 pt-32 pb-12 md:pt-40 md:pb-24">
        {/* HERO */}
        <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* HERO BENTO */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div
            ref={heroRef}
            onMouseMove={handleHeroMove}
            className="grain relative col-span-1 flex min-h-[460px] flex-col justify-end overflow-hidden rounded-3xl border border-border bg-card p-7 md:p-10 lg:col-span-8"
            style={{ animation: "fade-up 0.9s cubic-bezier(0.16,1,0.3,1) both" }}
          >
            {/* cursor-tracking glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-70 transition-opacity"
              style={{
                background:
                  "radial-gradient(400px circle at var(--mx, 50%) var(--my, 30%), color-mix(in oklab, var(--brand) 35%, transparent), transparent 60%)",
              }}
            />
            <div className="pointer-events-none absolute -bottom-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-brand/30 blur-[140px]" />
            {/* animated grid backdrop */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
                maskImage: "radial-gradient(ellipse at 30% 70%, black 30%, transparent 75%)",
              }}
            />
            {/* floating particles */}
            <FloatingParticles />
            {/* Dimensional cosmic sigil */}
            <div aria-hidden className="pointer-events-none absolute right-4 top-4 hidden md:block lg:right-6 lg:top-6">
              <div className="relative flex h-[280px] w-[280px] items-center justify-center lg:h-[340px] lg:w-[340px]">
                {/* Outer diffused glow */}
                <div className="absolute inset-0 animate-pulse rounded-full bg-brand/15 blur-[80px]" />
                {/* Core */}
                <div className="relative z-20">
                  <div
                    className="h-14 w-14 rounded-full bg-gradient-to-br from-[#e9d5ff] via-brand to-[#7c3aed] shadow-[0_0_40px_color-mix(in_oklab,var(--brand)_80%,transparent)]"
                    style={{ animation: "sigil-core-pulse 4s ease-in-out infinite" }}
                  />
                  <div className="absolute left-1/4 top-1/4 h-3 w-3 rounded-full bg-white/60 blur-[1px]" />
                </div>
                {/* Ring 1: wide & tilted */}
                <div
                  className="absolute h-[220px] w-[220px] rounded-full border border-brand/40 lg:h-[280px] lg:w-[280px]"
                  style={{ transformStyle: "preserve-3d", animation: "sigil-orbit-slow 15s linear infinite" }}
                >
                  <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-200 shadow-[0_0_10px_#fff]" />
                </div>
                {/* Ring 2: narrow & dashed */}
                <div
                  className="absolute h-[170px] w-[170px] rounded-full border-2 border-dashed border-brand-glow/25 lg:h-[220px] lg:w-[220px]"
                  style={{ transformStyle: "preserve-3d", animation: "sigil-orbit-fast 10s linear infinite" }}
                />
                {/* Ring 3: inner tracer */}
                <div
                  className="absolute h-[140px] w-[140px] rounded-full border border-brand/50 opacity-50 lg:h-[180px] lg:w-[180px]"
                  style={{ animation: "sigil-spin 20s linear infinite" }}
                >
                  <div className="absolute -right-1 top-1/2 h-1.5 w-1.5 rounded-full bg-brand-glow" />
                </div>
                {/* Floating satellite star */}
                <div
                  className="absolute flex h-full w-full items-center justify-center"
                  style={{ animation: "sigil-satellite 8s ease-in-out infinite" }}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-brand-glow drop-shadow-[0_0_8px_color-mix(in_oklab,var(--brand-glow)_90%,transparent)]" fill="currentColor">
                    <path d="M12 2L15 9H22L16 14L18 21L12 17L6 21L8 14L2 9H9L12 2Z" />
                  </svg>
                </div>
                {/* Crosshairs */}
                <div className="absolute inset-0 scale-110 rounded-full border border-foreground/5" />
                <div className="absolute left-0 top-1/2 h-px w-full bg-gradient-to-r from-transparent via-brand/25 to-transparent" />
                <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-brand/25 to-transparent" />
                {/* Distant particles */}
                <span className="absolute left-8 top-10 h-1 w-1 animate-pulse rounded-full bg-white/40" />
                <span className="absolute bottom-14 right-8 h-1 w-1 animate-pulse rounded-full bg-brand-glow/50" style={{ animationDelay: "1s" }} />
                <span className="absolute right-3 top-1/2 h-1.5 w-1.5 animate-pulse rounded-full bg-white/20" style={{ animationDelay: "2.5s" }} />
              </div>
            </div>
            <div className="relative z-10 space-y-6">
              <StatusPill status="active" />
              <h1
                className="max-w-full font-display font-black leading-[0.92] tracking-normal"
                style={{ fontSize: "clamp(2.2rem, 5.45vw, 4.75rem)" }}
              >
                <span className="block">WE MAKE</span>
                <span className="block bg-gradient-to-r from-brand to-brand-glow bg-clip-text text-transparent">
                  ANYTHING.
                </span>
                <span className="block">BEAUTIFULLY.</span>
              </h1>
              <RotatingTag />
              <p className="max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
                SAM Studios® is a multidisciplinary creative studio. Brand systems, films, products, installations, packaging, sites, sound, set design — if you can dream it, we can make it.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <MagneticButton>
                  <Sparkles className="h-4 w-4" /> Start a Project
                </MagneticButton>
                <Link to="/contact" className="font-mono-tight text-xs uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground">
                  → Contact us
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT — Global Live Clocks integrated */}
          <aside
            className="col-span-1 flex flex-col gap-3 rounded-3xl border border-border bg-card/70 p-5 backdrop-blur-xl lg:col-span-4"
            style={{ animation: "fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s both" }}
          >
            <div className="flex items-center justify-between">
              <div className="font-mono-tight text-[10px] uppercase tracking-[0.28em] text-brand">/ Global · Live</div>
              <span className="flex items-center gap-1.5 font-mono-tight text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
                </span>
                7 cities
              </span>
            </div>
            <div className="font-display text-lg font-black uppercase leading-tight tracking-tight">
              Always on.<br /><span className="text-brand">Everywhere.</span>
            </div>
            <div className="mt-1 flex flex-col divide-y divide-border/50 overflow-hidden rounded-2xl border border-border/60 bg-background/40">
              {CITIES.map((c, i) => (
                <HeroClockRow key={c.code} city={c} index={i} onClick={openCity} />
              ))}
            </div>
            <a
              href="#services"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group mt-auto inline-flex items-center justify-between rounded-2xl bg-gradient-to-br from-brand to-brand-glow px-5 py-4 text-primary-foreground transition-all hover:shadow-[0_0_40px_var(--brand)]"
            >
              <span className="font-display text-sm font-black uppercase tracking-tight">Explore Studio</span>
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </aside>
        </section>

        {/* HERO UTILITY ROW — separated from time boxes */}
        <HeroInfoRow />
        </div>

        {/* MARQUEE — full bleed edge to edge */}
        <section className="w-screen overflow-hidden border-y border-border bg-card/40 py-6">
          <div className="flex w-max animate-marquee gap-12 font-display text-3xl font-black tracking-tighter whitespace-nowrap uppercase md:text-5xl">
            {[
              "Brand Systems",
              "Films",
              "Digital Products",
              "Packaging",
              "Installations",
              "Sound Design",
              "Print",
              "Set Design",
              "Apparel",
              "Apps",
            ]
              .concat([
                "Brand Systems",
                "Films",
                "Digital Products",
                "Packaging",
                "Installations",
                "Sound Design",
                "Print",
                "Set Design",
                "Apparel",
                "Apps",
              ])
              .map((word, i) => (
                <span key={i} className="flex items-center gap-12">
                  <span className={i % 2 === 0 ? "text-foreground" : "text-brand"}>{word}</span>
                  <span className="text-brand/50">✦</span>
                </span>
              ))}
          </div>
        </section>

        {/* SERVICES — asymmetric bento */}
        <div className="mx-auto max-w-7xl px-6 md:px-10">
        <section id="services" className="reveal space-y-8 scroll-mt-32">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 font-mono-tight text-[10px] uppercase tracking-[0.3em] text-brand">/ what we do</div>
              <h2 className="font-display text-3xl font-black tracking-tight uppercase md:text-5xl">
                Disciplines
              </h2>
            </div>
            <div className="font-mono-tight text-xs text-muted-foreground">
              Tap any tile ↗ <span className="text-brand">[001 — 004]</span>
            </div>
          </div>
          <DisciplinesShowcase onOpen={openDiscipline} />
        </section>
        </div>

        {/* PROCESS — connected timeline */}
        <div className="mx-auto max-w-7xl px-6 md:px-10">
        <section id="process" className="reveal space-y-8 scroll-mt-32">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 font-mono-tight text-[10px] uppercase tracking-[0.3em] text-brand">/ how it flows</div>
              <h2 className="font-display text-3xl font-black tracking-tight uppercase md:text-5xl">
                Process
              </h2>
            </div>
            <div className="font-mono-tight text-xs text-muted-foreground">
              Tap a step for detail <span className="text-brand">[01 — 05]</span>
            </div>
          </div>

          <div className="relative">
            {/* horizontal connector line */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[60px] hidden h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent md:block" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              {PROCESS.map((s, i) => (
                <button
                  key={s.n}
                  type="button"
                  onClick={() => openStep(s, i, PROCESS.length)}
                  className="group relative flex flex-col items-start gap-4 rounded-3xl border border-border bg-card p-5 text-left transition-all duration-500 hover:-translate-y-2 hover:border-brand/60 hover:bg-gradient-to-b hover:from-brand/10 hover:to-transparent hover:shadow-[0_25px_60px_-25px_var(--brand)]"
                  style={{ animation: `fade-up 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s both` }}
                >
                  {/* node */}
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-background text-3xl ring-1 ring-border transition-all group-hover:ring-brand/80">
                    <span className="transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-6">{s.emoji}</span>
                    <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-glow font-mono-tight text-[9px] font-bold text-primary-foreground shadow-[0_0_16px_var(--brand)]">
                      {s.n}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-black uppercase leading-tight tracking-tight">
                      {s.t}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground md:text-sm">
                      {s.c}
                    </p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1 font-mono-tight text-[10px] uppercase tracking-[0.25em] text-brand opacity-0 transition-opacity group-hover:opacity-100">
                    Details <ArrowUpRight className="h-3 w-3" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
        </div>

        {/* MANIFESTO — full bleed */}
        <section id="manifesto" className="reveal relative w-screen overflow-hidden py-16 md:py-24">
          <div className="relative mx-auto max-w-6xl px-6 md:px-10 space-y-8">
            <div className="font-mono-tight text-xs uppercase tracking-[0.3em] text-brand">/ Manifesto</div>
            <p className="text-balance font-display text-3xl leading-[1.05] font-black tracking-tighter md:text-5xl lg:text-6xl">
              NO MEDIUM <span className="italic text-muted-foreground">OFF LIMITS</span>. NO BRIEF <span className="italic text-muted-foreground">TOO STRANGE</span>. WE BUILD WHATEVER THE IDEA <span className="text-brand">DEMANDS</span>.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="mx-auto max-w-7xl px-6 md:px-10">
        <section
          id="contact"
          className="reveal grain group relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-brand to-brand-glow p-10 text-center text-primary-foreground transition-all duration-500 hover:shadow-[0_40px_120px_-30px_var(--brand)] md:p-20"
        >
          {/* animated blobs */}
          <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary-foreground/30 blur-3xl" style={{ animation: "float 7s ease-in-out infinite" }} />
          <div aria-hidden className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-brand-glow/40 blur-3xl" style={{ animation: "float 9s ease-in-out infinite reverse" }} />
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 30% 30%, white, transparent 60%)" }} />
          {/* rotating grid */}
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{
            backgroundImage: "linear-gradient(var(--primary-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--primary-foreground) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }} />
          {/* orbiting sparkles */}
          <div aria-hidden className="pointer-events-none absolute right-10 top-10 hidden h-24 w-24 md:block">
            <div className="absolute inset-0 rounded-full border border-primary-foreground/40" style={{ animation: "spin-slow 10s linear infinite" }}>
              <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-primary-foreground shadow-[0_0_18px_white]" />
            </div>
            <div className="absolute inset-3 rounded-full border border-primary-foreground/30" style={{ animation: "spin-reverse 7s linear infinite" }}>
              <span className="absolute -top-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary-foreground/80" />
            </div>
          </div>
          <div className="relative z-10 mx-auto max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-3 py-1 font-mono-tight text-[10px] uppercase tracking-[0.3em] backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary-foreground" />
              </span>
              Q3 / Q4 2026 · Now booking
            </div>
            <h2 className="text-balance font-display text-4xl leading-[0.9] font-black tracking-tighter md:text-7xl">
              <span className="inline-block transition-transform duration-500 group-hover:-translate-y-1">GOT AN IDEA?</span>
              <br />
              <span className="relative inline-block bg-gradient-to-r from-primary-foreground via-primary-foreground to-primary-foreground/70 bg-[length:200%_100%] bg-clip-text text-transparent [animation:shimmer_4s_linear_infinite] transition-transform duration-500 group-hover:translate-y-1">
                LET'S MAKE IT.
              </span>
            </h2>
            <p className="mx-auto max-w-xl text-base opacity-90 md:text-lg">
              We're taking on select projects for Q3 / Q4 2026. Tell us what you're dreaming up.
            </p>
            <div className="pt-2">
              <Link
                to="/contact"
                className="relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-background px-10 py-5 font-display text-sm font-bold uppercase tracking-widest text-foreground transition-all duration-500 hover:scale-110 hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.35)]"
              >
                <span className="relative z-10">Start the Brief</span>
                <ArrowUpRight className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-brand/25 to-transparent transition-transform duration-700 hover:translate-x-full" />
              </Link>
            </div>
          </div>
        </section>
        </div>
      </main>

      <Footer />

      <InfoModal open={!!modal} onClose={() => setModal(null)} content={modal} />
    </div>
  );
}

function FloatingParticles() {
  const particles = Array.from({ length: 14 });
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((_, i) => {
        const size = 2 + ((i * 7) % 5);
        const left = (i * 37) % 100;
        const top = (i * 53) % 100;
        const dur = 6 + (i % 5) * 1.5;
        const delay = (i % 7) * 0.4;
        return (
          <span
            key={i}
            className="absolute rounded-full bg-brand/60 shadow-[0_0_12px_var(--brand)]"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              top: `${top}%`,
              animation: `float ${dur}s ease-in-out ${delay}s infinite`,
              opacity: 0.35 + (i % 4) * 0.15,
            }}
          />
        );
      })}
    </div>
  );
}

function HeroClockRow({
  city,
  index,
  onClick,
}: {
  city: CityInfo;
  index: number;
  onClick: (c: CityInfo) => void;
}) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  const time = now
    ? new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: city.tz,
      }).format(now)
    : "--:--";
  const hour = now ? parseInt(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hour12: false, timeZone: city.tz }).format(now), 10) : 12;
  const minute = now ? parseInt(new Intl.DateTimeFormat("en-GB", { minute: "2-digit", timeZone: city.tz }).format(now), 10) : 0;
  const decimal = hour + minute / 60;
  // Sun cycle bounds
  const SUNRISE = 6;
  const SUNSET = 19;
  const isDay = decimal >= SUNRISE && decimal < SUNSET;
  const isSunrise = decimal >= SUNRISE - 1 && decimal < SUNRISE + 1;
  const isSunset = decimal >= SUNSET - 1 && decimal < SUNSET + 1;
  // 0 = sunrise (left horizon), 1 = sunset (right horizon)
  const dayProgress = Math.max(0, Math.min(1, (decimal - SUNRISE) / (SUNSET - SUNRISE)));
  const nightProgress = decimal < SUNRISE ? decimal / SUNRISE : Math.min(1, (decimal - SUNSET) / (24 - SUNSET));
  const celestialX = isDay ? 8 + dayProgress * 84 : decimal < SUNRISE ? 14 + nightProgress * 20 : 76 + nightProgress * 16;
  const celestialY = isDay ? 78 - Math.sin(Math.PI * dayProgress) * 58 : 74 - Math.sin(Math.PI * nightProgress) * 10;
  const label = isSunrise ? "Sunrise" : isSunset ? "Sunset" : isDay ? "Day" : "Night";
  const Icon = isSunrise ? Sunrise : isSunset ? Sunset : isDay ? Sun : Moon;
  const bgClass = isSunrise
    ? "from-amber-500/25 via-rose-500/15 to-transparent"
    : isSunset
      ? "from-orange-500/25 via-fuchsia-500/15 to-transparent"
      : isDay
        ? "from-sky-400/20 via-cyan-300/10 to-transparent"
        : "from-indigo-500/20 via-violet-500/10 to-transparent";
  const dotColor = isSunrise
    ? "bg-amber-400 text-amber-400"
    : isSunset
      ? "bg-orange-400 text-orange-400"
      : isDay
        ? "bg-amber-300 text-amber-300"
        : "bg-indigo-300 text-indigo-300";
  return (
    <button
      type="button"
      onClick={() => onClick(city)}
      className="group/row relative flex items-center gap-3 overflow-hidden px-3 py-2.5 text-left transition-colors hover:bg-brand/8"
      style={{ animation: `fade-up 0.4s cubic-bezier(0.16,1,0.3,1) ${index * 0.05 + 0.25}s both` }}
    >
      {/* ambient day/night wash */}
      <span aria-hidden className={`pointer-events-none absolute inset-0 bg-gradient-to-r opacity-70 ${bgClass}`} />

      <span className="relative text-lg">{city.emoji}</span>
      <div className="relative min-w-0 flex-1">
        <div className="font-display text-[11px] font-black uppercase leading-none tracking-tight">
          {city.city}
        </div>
        <div className="mt-0.5 font-mono-tight text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
          {city.code}
        </div>
      </div>

      {/* Animated sun arc indicator */}
      <div className="relative hidden h-10 w-16 shrink-0 overflow-visible sm:block" aria-hidden>
        {/* horizon line */}
        <span className="absolute inset-x-0 bottom-2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        {/* arc track */}
        <span className="absolute inset-x-1 bottom-2 top-2 rounded-t-full border border-dashed border-border/70" />
        {/* drifting clouds (day) */}
        {isDay && (
          <>
            <span
              className="absolute top-1 h-1 w-3 rounded-full bg-white/70 shadow-[0_0_6px_rgba(255,255,255,0.6)]"
              style={{ left: "-20%", animation: "cloud-drift 9s linear infinite" }}
            />
            <span
              className="absolute top-3 h-[3px] w-2 rounded-full bg-white/50"
              style={{ left: "-30%", animation: "cloud-drift 13s linear 2s infinite" }}
            />
            <span
              className="absolute top-0 h-[3px] w-2.5 rounded-full bg-white/55"
              style={{ left: "-40%", animation: "cloud-drift 17s linear 5s infinite" }}
            />
          </>
        )}
        {/* twinkling stars + drifting cloud wisp (night) */}
        {!isDay && (
          <>
            <span className="absolute right-2 top-0 h-[3px] w-[3px] rotate-45 bg-indigo-100 shadow-[0_0_6px_#c7d2fe]" style={{ animation: "pulse-slow 2.2s ease-in-out infinite" }} />
            <span className="absolute left-3 top-2 h-[2px] w-[2px] rotate-45 bg-white shadow-[0_0_5px_#fff]" style={{ animation: "pulse-slow 1.7s ease-in-out 0.6s infinite" }} />
            <span className="absolute left-7 top-0 h-[2px] w-[2px] rotate-45 bg-indigo-200 shadow-[0_0_4px_#a5b4fc]" style={{ animation: "pulse-slow 2.8s ease-in-out 0.3s infinite" }} />
            <span
              className="absolute top-2 h-[3px] w-3 rounded-full bg-indigo-300/40"
              style={{ left: "-30%", animation: "cloud-drift 16s linear infinite" }}
            />
          </>
        )}
        {/* traveling sun/moon */}
        <span
          className={`absolute z-10 flex h-3 w-3 items-center justify-center rounded-full ${dotColor} shadow-[0_0_14px_currentColor]`}
          style={{
            left: `${celestialX}%`,
            top: `${celestialY}%`,
            transform: "translate(-50%, -50%)",
            transition: "left 800ms cubic-bezier(0.16,1,0.3,1), top 800ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      </div>

      <div className="relative text-right">
        <div
          suppressHydrationWarning
          className="font-display text-sm font-black tabular-nums leading-none transition-colors group-hover/row:text-brand"
        >
          {time}
        </div>
        <div className="mt-0.5 flex items-center justify-end gap-1 font-mono-tight text-[8px] uppercase tracking-[0.2em] text-muted-foreground">
          <Icon className={`h-2.5 w-2.5 ${dotColor.split(" ")[1]}`} />
          {label}
        </div>
      </div>
    </button>
  );
}

function HeroUtilityBoxes() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const torontoTime = now
    ? new Intl.DateTimeFormat("en-CA", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "America/Toronto",
      }).format(now)
    : "--:--";
  const torontoDate = now
    ? new Intl.DateTimeFormat("en-CA", {
        weekday: "short",
        month: "short",
        day: "2-digit",
        timeZone: "America/Toronto",
      }).format(now)
    : "Loading";

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        className="group relative overflow-hidden rounded-2xl border border-border bg-background/45 p-4 text-left transition-all duration-500 hover:-translate-y-1 hover:border-brand/60 hover:bg-brand/10"
      >
        <span className="font-mono-tight text-[9px] uppercase tracking-[0.28em] text-muted-foreground">Toronto HQ</span>
        <span suppressHydrationWarning className="mt-3 block font-display text-2xl font-black tabular-nums tracking-tight text-foreground group-hover:text-brand">
          {torontoTime}
        </span>
        <span suppressHydrationWarning className="mt-1 block font-mono-tight text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
          {torontoDate}
        </span>
        <span aria-hidden className="absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-18deg] bg-gradient-to-r from-transparent via-brand/20 to-transparent opacity-0 transition-opacity group-hover:animate-[shine-sweep_1.1s_cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100" />
      </button>

      <button
        type="button"
        className="group relative overflow-hidden rounded-2xl border border-border bg-background/45 p-4 text-left transition-all duration-500 hover:-translate-y-1 hover:border-brand/60 hover:bg-brand/10"
      >
        <span className="font-mono-tight text-[9px] uppercase tracking-[0.28em] text-muted-foreground">Studio Mode</span>
        <span className="mt-3 flex items-center gap-2 font-display text-lg font-black uppercase tracking-tight text-foreground group-hover:text-brand">
          <span className="h-2 w-2 rounded-full bg-brand shadow-[0_0_12px_var(--brand)]" /> Open
        </span>
        <span className="mt-1 block font-mono-tight text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
          Strategy · Design · Build
        </span>
        <span aria-hidden className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-gradient-to-r from-brand to-brand-glow transition-transform duration-500 group-hover:scale-x-100" />
      </button>

      <a
        href="#process"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("process")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="group col-span-2 flex items-center justify-between overflow-hidden rounded-2xl border border-border bg-background/45 p-4 transition-all duration-500 hover:-translate-y-1 hover:border-brand/60 hover:bg-brand/10"
      >
        <span>
          <span className="block font-mono-tight text-[9px] uppercase tracking-[0.28em] text-muted-foreground">Next in line</span>
          <span className="mt-2 block font-display text-base font-black uppercase tracking-tight">See how a project moves</span>
        </span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brand/40 text-brand transition-all group-hover:rotate-45 group-hover:bg-brand group-hover:text-primary-foreground">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </a>
    </div>
  );
}

function HeroInfoRow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  const torontoTime = now
    ? new Intl.DateTimeFormat("en-CA", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Toronto" }).format(now)
    : "--:--";

  const items = [
    {
      eyebrow: "Response window",
      title: "< 24h",
      sub: "First reply, every weekday",
      icon: Clock,
      href: "/contact",
      accent: "Reply guarantee",
      meta: torontoTime + " · Toronto HQ",
    },
    {
      eyebrow: "Now booking",
      title: "Q3 / Q4 · 2026",
      sub: "Select engagements open",
      icon: Zap,
      href: "/contact",
      accent: "Start a brief",
      meta: "3 slots remaining",
    },
    {
      eyebrow: "The archive",
      title: "42 shipped",
      sub: "Across 6 disciplines",
      icon: Layers,
      href: "/work",
      accent: "Browse projects",
      meta: "Updated weekly",
    },
  ] as const;

  return (
    <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
      {items.map((it, i) => {
        const Icon = it.icon;
        return (
          <Link
            key={it.eyebrow}
            to={it.href}
            className="group relative flex items-stretch gap-4 overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-500 hover:-translate-y-1 hover:border-brand/60 hover:shadow-[0_25px_60px_-35px_var(--brand)]"
            style={{ animation: `fade-up 0.6s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.08}s both` }}
          >
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/20 transition-all group-hover:bg-brand group-hover:text-primary-foreground group-hover:ring-brand">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-mono-tight text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
                {it.eyebrow}
              </div>
              <div className="mt-1 font-display text-xl font-black uppercase tracking-tight text-foreground group-hover:text-brand">
                {it.title}
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">{it.sub}</div>
              <div className="mt-2 flex items-center gap-2 font-mono-tight text-[9px] uppercase tracking-[0.22em] text-brand/80">
                <span className="h-1 w-1 rounded-full bg-brand shadow-[0_0_6px_var(--brand)]" />
                {it.meta}
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 self-start text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand" />
            <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-18deg] bg-gradient-to-r from-transparent via-brand/25 to-transparent opacity-0 transition-opacity group-hover:animate-[shine-sweep_1.1s_cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100" />
          </Link>
        );
      })}
    </div>
  );
}

function DisciplinesShowcase({ onOpen }: { onOpen: (d: (typeof DISCIPLINES)[number]) => void }) {
  // (keep existing implementation below)
  return _DisciplinesShowcaseImpl({ onOpen });
}

function RotatingTag() {
  const WORDS = ["Brand systems", "Films", "Products", "Installations", "Packaging", "Sites", "Sound"];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % WORDS.length), 1800);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/8 px-3 py-1.5 font-mono-tight text-[10px] uppercase tracking-[0.3em] text-brand backdrop-blur">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-70" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
      </span>
      today · building
      <span key={i} className="min-w-[7ch] font-display text-xs font-black tracking-tight text-foreground" style={{ animation: "fade-up 0.35s cubic-bezier(0.16,1,0.3,1) both" }}>
        {WORDS[i]}
      </span>
    </div>
  );
}

function _DisciplinesShowcaseImpl({ onOpen }: { onOpen: (d: (typeof DISCIPLINES)[number]) => void }) {
  const [active, setActive] = useState(0);
  const d = DISCIPLINES[active];
  return (
    <div className="grid grid-cols-1 items-stretch gap-5 lg:min-h-[640px] lg:grid-cols-12">
      {/* FEATURE PANEL */}
      <div className="flex lg:col-span-7">
        <button
          type="button"
          onClick={() => onOpen(d)}
          className="group relative block h-[24rem] w-full overflow-hidden rounded-3xl border border-border bg-card text-left transition-all hover:border-brand/60 hover:shadow-[0_40px_100px_-40px_var(--brand)] md:h-[32rem] lg:h-full lg:min-h-[640px]"
        >
          {DISCIPLINES.map((it, i) => (
            <img
              key={it.n}
              src={it.image}
              alt=""
              loading={i === 0 ? undefined : "lazy"}
              width={1400}
              height={1000}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-[900ms] ${
                i === active ? "scale-100 opacity-80 group-hover:scale-105" : "scale-110 opacity-0"
              }`}
            />
          ))}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
          <div
            aria-hidden
            className="absolute inset-0 opacity-40 mix-blend-overlay"
            style={{ background: "linear-gradient(135deg, var(--brand) 0%, transparent 55%)" }}
          />

          {/* number rail */}
          <div className="absolute left-6 top-6 flex flex-col gap-2">
            {DISCIPLINES.map((it, i) => (
              <span
                key={it.n}
                className={`font-mono-tight text-[10px] tracking-[0.3em] transition-all ${
                  i === active ? "text-brand" : "text-muted-foreground/60"
                }`}
              >
                /{it.n}
              </span>
            ))}
          </div>

          <div className="absolute right-6 top-6 text-5xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-110 md:text-6xl">
            {d.emoji}
          </div>

          <div key={d.n} className="absolute inset-x-6 bottom-6 md:inset-x-10 md:bottom-10" style={{ animation: "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both" }}>
            <div className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-brand">Discipline · {d.n}</div>
            <h3 className="mt-2 font-display font-black uppercase leading-[0.9] tracking-tighter" style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
              {d.title}
            </h3>
            <p className="mt-3 max-w-md text-sm text-foreground/85 md:text-base">{d.copy}</p>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2 font-mono-tight text-[10px] uppercase tracking-[0.25em] text-brand backdrop-blur transition-all group-hover:border-brand group-hover:bg-brand group-hover:text-primary-foreground">
              Open case <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>

          <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-18deg] bg-gradient-to-r from-transparent via-primary-foreground/40 to-transparent opacity-0 transition-opacity group-hover:animate-[shine-sweep_1.1s_cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100" />
        </button>
      </div>

      {/* SELECTOR LIST */}
      <ul className="grid grid-cols-1 gap-3 lg:col-span-5 lg:grid-rows-4">
        {DISCIPLINES.map((it, i) => {
          const isActive = i === active;
          return (
            <li key={it.n}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => (isActive ? onOpen(it) : setActive(i))}
                  className={`group relative flex h-full w-full items-stretch gap-4 overflow-hidden rounded-2xl border p-4 text-left transition-all duration-500 md:p-5 ${
                  isActive
                    ? "border-brand bg-gradient-to-r from-brand/15 via-brand/5 to-transparent shadow-[0_20px_50px_-25px_var(--brand)]"
                    : "border-border bg-card/50 hover:-translate-y-0.5 hover:border-brand/50"
                }`}
              >
                {/* thumb */}
                <div className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl border transition-all md:w-24 ${isActive ? "border-brand/60" : "border-border"}`}>
                  <img src={it.image} alt="" loading="lazy" width={1400} height={1000} className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ${isActive ? "scale-110" : "scale-100 group-hover:scale-105"}`} />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-tr from-background/50 via-transparent to-transparent" />
                  <span className="absolute left-1.5 top-1.5 rounded-md bg-background/70 px-1.5 py-0.5 font-mono-tight text-[8px] uppercase tracking-[0.2em] text-brand backdrop-blur">
                    /{it.n}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{it.emoji}</span>
                    <h4 className={`font-display text-base font-black uppercase tracking-tight md:text-xl ${isActive ? "text-brand" : ""}`}>
                      {it.title}
                    </h4>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground md:text-sm">{it.copy}</p>
                </div>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center self-center rounded-full border transition-all duration-500 ${isActive ? "rotate-45 border-brand bg-brand text-primary-foreground" : "border-border text-muted-foreground group-hover:border-brand/60"}`}>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
                {/* active bar */}
                <span aria-hidden className={`absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b from-brand to-brand-glow transition-transform duration-500 ${isActive ? "scale-y-100" : "scale-y-0"}`} />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
