import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { MagneticButton } from "@/components/magnetic-button";
import { useReveal } from "@/hooks/use-reveal";
import workAether from "@/assets/work-aether.jpg";
import workObsidian from "@/assets/work-obsidian.jpg";
import workMonolith from "@/assets/work-monolith.jpg";
import workFilm from "@/assets/work-film.jpg";

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
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleHeroMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-brand/40 selection:text-primary-foreground">
      {/* NAV */}
      <nav
        className={`fixed top-0 left-0 z-50 flex w-full items-center justify-between border-b px-6 py-4 transition-all duration-500 md:px-10 ${
          scrolled ? "border-border bg-background/70 backdrop-blur-xl" : "border-transparent bg-transparent"
        }`}
      >
        <a href="#top" className="font-display text-lg font-black uppercase tracking-tighter">
          SAM Studios<span className="ml-0.5 align-top text-[10px]">®</span>
        </a>
        <div className="hidden items-center gap-10 text-xs font-medium uppercase tracking-[0.2em] md:flex">
          <a href="#work" className="transition-colors hover:text-brand">Work</a>
          <a href="#services" className="transition-colors hover:text-brand">Services</a>
          <a href="#manifesto" className="transition-colors hover:text-brand">About</a>
          <a href="#contact" className="transition-colors hover:text-brand">Contact</a>
        </div>
        <ThemeToggle />
      </nav>

      <main id="top" className="mx-auto max-w-7xl space-y-24 px-6 pt-32 pb-12 md:px-10 md:pt-40 md:pb-24">
        {/* HERO BENTO */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div
            ref={heroRef}
            onMouseMove={handleHeroMove}
            className="grain relative col-span-1 flex min-h-[560px] flex-col justify-end overflow-hidden rounded-3xl border border-border bg-card p-8 md:p-14 lg:col-span-8"
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
            <div className="absolute top-8 right-8 flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
              </span>
              <span className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-brand">System: Active</span>
            </div>

            <div className="relative z-10 space-y-6">
              <h1 className="text-balance font-display text-5xl leading-[0.88] font-black tracking-tighter md:text-7xl lg:text-8xl">
                WE MAKE{" "}
                <span className="bg-gradient-to-r from-brand to-brand-glow bg-clip-text text-transparent">
                  ANYTHING
                </span>
                <span className="lg:text-7xl">
                . BEAUTIFULLY.
                </span>
              </h1>
              
              
              <p className="max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
                SAM Studios® is a multidisciplinary creative studio. Brand systems, films, products, installations, packaging, sites, sound, set design — if you can dream it, we can make it.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a href="https://form.typeform.com/to/HB8qtmvl" target="_blank" rel="noopener noreferrer">
                <MagneticButton>
                  <Sparkles className="h-4 w-4" /> Start a Project
                </MagneticButton>
                </a>
                <a href="#work" className="font-mono-tight text-xs uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground">
                  → See the work
                </a>
              </div>
            </div>
          </div>

          <div className="col-span-1 grid grid-rows-2 gap-4 lg:col-span-4">
            <div
              className="flex flex-col justify-between rounded-3xl border border-border bg-card p-8"
              style={{ animation: "fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both" }}
            >
              <div className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground">/CAPABILITIES</div>
              <div className="space-y-2">
                <div className="h-1 w-full overflow-hidden rounded-full bg-border">
                  <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-brand to-brand-glow" />
                </div>
                <div className="flex justify-between font-mono-tight text-[10px] uppercase text-muted-foreground">
                  <span>Range</span>
                  <span>∞ / mediums</span>
                </div>
              </div>
              <div className="font-display text-2xl font-black leading-none">
                NO MEDIUM<br />OFF LIMITS.
              </div>
            </div>
            <a
              href="#work"
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-brand-glow p-8 text-primary-foreground"
              style={{ animation: "fade-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}
            >
              <div className="font-mono-tight text-[10px] uppercase tracking-[0.25em] opacity-80">EST. 2024 — CANADA / EVERYWHERE</div>
              <div className="flex items-end justify-between">
                <div className="font-display text-4xl font-black leading-none transition-transform group-hover:-translate-y-1">
                  VIEW<br />WORK
                </div>
                <ArrowUpRight className="h-10 w-10 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
              <div className="pointer-events-none absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
            </a>
          </div>
        </section>

        {/* MARQUEE */}
        <section className="-mx-6 overflow-hidden border-y border-border bg-card/40 py-6 md:-mx-10">
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

        {/* SERVICES */}
        <section id="services" className="reveal space-y-8">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl font-black tracking-tight uppercase md:text-4xl">
              Disciplines
            </h2>
            <div className="font-mono-tight text-xs text-brand">[001 — 004]</div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                n: "01",
                title: "Brand & Identity",
                copy: "Wordmarks, systems, voice, art direction. The full visual DNA of who you are.",
              },
              {
                n: "02",
                title: "Film & Motion",
                copy: "Short films, campaigns, title sequences, music videos, kinetic identity.",
              },
              {
                n: "03",
                title: "Digital Products",
                copy: "Sites, apps, interfaces. Crafted front to back with obsessive precision.",
              },
              {
                n: "04",
                title: "Print & Spatial",
                copy: "Books, posters, packaging, installations, environments. Things you can touch.",
              },
            ].map((s) => (
              <div
                key={s.n}
                className="group relative space-y-4 overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all duration-500 hover:-translate-y-1 hover:border-brand/60 hover:shadow-[0_20px_60px_-20px_var(--brand)]"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-brand/10 font-mono-tight text-sm text-brand">
                  {s.n}
                </div>
                <h3 className="font-display text-xl font-bold uppercase">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.copy}</p>
                <div className="absolute right-6 bottom-6 opacity-0 transition-opacity group-hover:opacity-100">
                  <ArrowUpRight className="h-5 w-5 text-brand" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WORK */}
        <section id="work" className="reveal space-y-8">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl font-black tracking-tight uppercase md:text-4xl">
              Selected Work
            </h2>
            <div className="font-mono-tight text-xs text-brand">2023 — 2024</div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              { src: workAether, title: "[REDACTED]", tag: "[REDACTED] / 20XX" },
              { src: workObsidian, title: "[REDACTED]", tag: "[REDACTED] / 20XX" },
              { src: workFilm, title: "[REDACTED]", tag: "[REDACTED] / 20XX" },
              { src: workMonolith, title: "[REDACTED]", tag: "[REDACTED] / 20XX" },
            ].map((w) => (
              <a
                key={w.title}
                href="#"
                className="group relative block aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-card md:aspect-square"
              >
                <img
                  src={w.src}
                  alt={w.title}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 w-full space-y-1 p-8">
                  <div className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-brand">{w.tag}</div>
                  <h4 className="font-display text-2xl font-black tracking-tight md:text-3xl">{w.title}</h4>
                </div>
                <div className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-background/60 backdrop-blur-md transition-all group-hover:bg-brand group-hover:text-primary-foreground">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* MANIFESTO */}
        <section id="manifesto" className="reveal border-y border-border py-16">
          <div className="max-w-4xl space-y-8">
            <div className="font-mono-tight text-xs uppercase tracking-[0.3em] text-brand">/ Manifesto</div>
            <p className="text-balance font-display text-3xl leading-[1.05] font-black tracking-tighter md:text-5xl lg:text-6xl">
              NO MEDIUM <span className="italic text-muted-foreground">OFF LIMITS</span>. NO BRIEF <span className="italic text-muted-foreground">TOO STRANGE</span>. WE BUILD WHATEVER THE IDEA <span className="text-brand">DEMANDS</span>.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section
          id="contact"
          className="reveal grain relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-brand to-brand-glow p-10 text-center text-primary-foreground md:p-20"
        >
          <div className="pointer-events-none absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 30% 30%, white, transparent 60%)" }} />
          <div className="relative z-10 mx-auto max-w-3xl space-y-8">
            <h2 className="text-balance font-display text-4xl leading-[0.9] font-black tracking-tighter md:text-7xl">
              GOT AN IDEA?<br />LET'S MAKE IT.
            </h2>
            <p className="mx-auto max-w-xl text-base opacity-90 md:text-lg">
              We're taking on select projects for Q3 / Q4 2026. Tell us what you're dreaming up.
            </p>
            <div className="pt-2">
              <a
                href="https://form.typeform.com/to/HB8qtmvl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full bg-background px-10 py-5 font-display text-sm font-bold uppercase tracking-widest text-foreground transition-transform hover:scale-105"
              >
                Open Form <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border px-6 py-12 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="font-display text-base font-black uppercase tracking-tighter">
            SAM Studios<span className="ml-0.5 align-top text-[8px]">®</span>
          </div>
          <div className="flex gap-8 font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <a href="https://www.instagram.com/sachian05.hk" className="transition-colors hover:text-brand" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://x.com/Sachian_hk" className="transition-colors hover:text-brand" target="_blank" rel="noopener noreferrer">X</a>
            <a href="https://www.linkedin.com/in/sachianderan" className="transition-colors hover:text-brand" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
          <div className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            © 2026 — All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
}
