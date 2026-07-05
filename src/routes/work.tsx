import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Fragment } from "react";
import { ArrowUpRight, Check, Copy, Hash, Search, X } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { StatusPill } from "@/components/status-pill";

import neonStudio from "@/assets/work-neon-studio.jpg";
import fashionLab from "@/assets/work-fashion-lab.jpg";
import filmSet from "@/assets/work-film-set.jpg";
import packaging from "@/assets/work-packaging.jpg";
import appInterface from "@/assets/work-app-interface.jpg";
import spatialEvent from "@/assets/work-spatial-event.jpg";

// OTP-style slot display for the project-code search (AA-00).
// - When totally empty, all slots show the ghosted placeholder chars A A 0 0.
// - When partially filled, filled slots show the entered char, empty ones show "_".
function CodeSlots({ letters, digits, active }: { letters: string; digits: string; active: boolean }) {
  const isEmpty = letters.length === 0 && digits.length === 0;
  const combinedLen = letters.length + digits.length;
  const slots: Array<{ char: string | undefined; ph: string; idx: number }> = [
    { char: letters[0], ph: "A", idx: 0 },
    { char: letters[1], ph: "A", idx: 1 },
    { char: digits[0], ph: "0", idx: 2 },
    { char: digits[1], ph: "0", idx: 3 },
  ];
  return (
    <div className="mt-1 flex items-center gap-1.5 font-mono-tight text-lg font-black uppercase md:text-xl">
      {slots.map((s, i) => {
        const isCaret = active && combinedLen === s.idx;
        const filled = Boolean(s.char);
        return (
          <Fragment key={s.idx}>
            <span
              aria-hidden
              className={`relative inline-flex h-9 w-7 items-center justify-center rounded-md border transition-all duration-200 md:h-10 md:w-8 ${
                filled
                  ? "border-brand/60 bg-brand/10 text-foreground"
                  : isCaret
                    ? "border-brand bg-background/60 text-muted-foreground/60 shadow-[0_0_18px_-4px_var(--brand)]"
                    : "border-border bg-background/40 text-muted-foreground/50"
              }`}
            >
              {filled ? (
                <span className="tabular-nums">{s.char}</span>
              ) : isEmpty ? (
                <span className="opacity-50">{s.ph}</span>
              ) : (
                <span className="opacity-60">_</span>
              )}
              {isCaret && !filled && (
                <span className="pointer-events-none absolute bottom-1.5 h-[2px] w-3 animate-pulse rounded-full bg-brand" />
              )}
            </span>
            {i === 1 && (
              <span aria-hidden className="mx-0.5 text-muted-foreground/60">-</span>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work — SAM Studios®" },
      { name: "description", content: "Search SAM Studios® work across brand, film, product, apparel, packaging, and spatial experiences." },
      { property: "og:title", content: "Work — SAM Studios®" },
      { property: "og:description", content: "A searchable studio showcase of SAM Studios® projects." },
    ],
  }),
  component: WorkPage,
});

type Project = {
  id: string;
  title: string;
  client: string;
  year: string;
  discipline: "Brand" | "Film" | "Product" | "Apparel" | "Packaging" | "Spatial";
  image: string;
  summary: string;
  impact: string;
  services: string[];
  palette: string;
};

const PROJECTS: Project[] = [
  {
    id: "Project AA-00",
    title: "Aether Studio System",
    client: "Aether Labs",
    year: "2026",
    discipline: "Brand",
    image: neonStudio,
    summary: "A total brand launch spanning naming, identity, motion rules, web presence, and launch content.",
    impact: "Launch system built for every channel in 8 weeks.",
    services: ["Identity", "Campaign", "Motion", "Web"],
    palette: "from-brand/80 via-brand-glow/35 to-transparent",
  },
  {
    id: "Project AA-01",
    title: "Signal Film Unit",
    client: "Signal Audio",
    year: "2026",
    discipline: "Film",
    image: filmSet,
    summary: "A cinematic campaign film package with cutdowns, title language, sound identity, and social motion kit.",
    impact: "Hero film + 18 launch assets delivered as one system.",
    services: ["Film", "Direction", "Sound", "Edit"],
    palette: "from-brand-glow/75 via-brand/25 to-transparent",
  },
  {
    id: "Project AA-02",
    title: "Interface Wall",
    client: "Northstar AI",
    year: "2025",
    discipline: "Product",
    image: appInterface,
    summary: "Product UX, visual design, dashboard systems, and interactive prototypes for a data-heavy platform.",
    impact: "Reduced onboarding friction with a clearer command center.",
    services: ["UX", "UI", "Prototype", "Design System"],
    palette: "from-chart-2/55 via-brand/30 to-transparent",
  },
  {
    id: "Project AA-03",
    title: "Atelier Capsule",
    client: "Mile Atelier",
    year: "2025",
    discipline: "Apparel",
    image: fashionLab,
    summary: "A full capsule concept including art direction, lookbook planning, packaging, tags, and drop page.",
    impact: "A luxury drop language designed from garment to checkout.",
    services: ["Apparel", "Art Direction", "Lookbook", "Commerce"],
    palette: "from-chart-4/55 via-brand/30 to-transparent",
  },
  {
    id: "Project AA-04",
    title: "White Label Objects",
    client: "Halcyon Goods",
    year: "2024",
    discipline: "Packaging",
    image: packaging,
    summary: "Premium packaging architecture, unboxing moments, surface finishes, and retail-ready system rules.",
    impact: "A physical product family that feels unified before it is opened.",
    services: ["Packaging", "Print", "Retail", "Materials"],
    palette: "from-brand/70 via-chart-5/20 to-transparent",
  },
  {
    id: "Project AA-05",
    title: "Room of Light",
    client: "Monolith Gallery",
    year: "2024",
    discipline: "Spatial",
    image: spatialEvent,
    summary: "An immersive installation concept with wayfinding, environmental graphics, lighting, and visitor flow.",
    impact: "A gallery experience built to be photographed, remembered, and shared.",
    services: ["Spatial", "Install", "Wayfinding", "Lighting"],
    palette: "from-brand-glow/65 via-brand/35 to-transparent",
  },
];

function WorkPage() {
  const [query, setQuery] = useState("");
  // codeQuery format: 2 letters + "-" + 2 digits, entered strictly per-field
  const [codeLetters, setCodeLetters] = useState("");
  const [codeDigits, setCodeDigits] = useState("");
  const codeInputRef = useRef<HTMLInputElement>(null);
  const [codeFocused, setCodeFocused] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const codeQuery = codeLetters + (codeDigits ? "-" + codeDigits : codeLetters ? "" : "");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const cq = (codeLetters + codeDigits).toLowerCase();
    return PROJECTS.filter((p) => {
      const matchesQuery =
        !q ||
        [p.title, p.client, p.discipline, p.year, ...p.services].some((item) => item.toLowerCase().includes(q));
      const flatId = p.id.toLowerCase().replace(/[^a-z0-9]/g, "");
      const matchesCode = !cq || flatId.includes(cq);
      return matchesQuery && matchesCode;
    });
  }, [query, codeLetters, codeDigits]);

  const opened = openId ? PROJECTS.find((p) => p.id === openId) ?? null : null;

  // esc closes overlay
  useEffect(() => {
    if (!opened) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenId(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [opened]);

  const copyCode = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
    } catch {
      // no-op
    }
    setCopied(id);
    window.setTimeout(() => setCopied((c) => (c === id ? null : c)), 1600);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="relative overflow-hidden pt-32 pb-24 md:pt-40">
        <section className="relative border-b border-border bg-card/30">
          <div className="absolute inset-0 opacity-[0.05]" aria-hidden style={{ backgroundImage: "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
          <div className="relative mx-auto max-w-7xl space-y-8 px-6 py-12 md:px-10 lg:py-16">
            <div className="flex flex-wrap items-center gap-3">
              <StatusPill status="active" />
              <span className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                / archive · {PROJECTS.length} projects
              </span>
            </div>
            <div>
              <h1 className="font-display text-5xl font-black uppercase leading-[0.86] tracking-tight md:text-7xl lg:text-8xl">
                The Archive.
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-base text-muted-foreground md:text-lg">
                Search the full showcase by name, discipline, or client — or jump straight to a project code.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.5fr_1fr]">
              {/* GENERAL SEARCH */}
              <div className="group flex items-center gap-3 rounded-3xl border border-border bg-background/65 p-4 shadow-[0_25px_80px_-45px_var(--brand)] backdrop-blur-xl transition-all duration-500 focus-within:border-brand focus-within:shadow-[0_40px_120px_-45px_var(--brand)]">
                <Search className="h-5 w-5 text-brand" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="font-mono-tight text-[9px] uppercase tracking-[0.28em] text-muted-foreground">Search projects</span>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="keyword"
                    className="min-w-0 bg-transparent font-display text-base font-bold tracking-tight outline-none placeholder:text-muted-foreground/60 md:text-lg"
                    autoFocus
                  />
                </div>
                {query && (
                  <button type="button" onClick={() => setQuery("")} className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-brand hover:text-foreground" aria-label="Clear search">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {/* CODE SEARCH — OTP-style slots: 2 letters + 2 digits */}
              <div
                onClick={() => codeInputRef.current?.focus()}
                className={`group relative flex items-center gap-3 rounded-3xl border p-4 backdrop-blur-xl transition-all duration-500 ${
                  codeFocused
                    ? "border-brand bg-background/70 shadow-[0_25px_60px_-35px_var(--brand)]"
                    : "border-border bg-background/65"
                }`}
              >
                <Hash className="h-5 w-5 text-brand" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="font-mono-tight text-[9px] uppercase tracking-[0.28em] text-muted-foreground">Project code</span>
                  <CodeSlots
                    letters={codeLetters}
                    digits={codeDigits}
                    active={codeFocused}
                  />
                </div>
                {(codeLetters || codeDigits) && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setCodeLetters(""); setCodeDigits(""); codeInputRef.current?.focus(); }}
                    className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-brand hover:text-foreground"
                    aria-label="Clear code"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                {/* Single hidden capture input — routes chars into letters/digits state */}
                <input
                  ref={codeInputRef}
                  value=""
                  onChange={() => { /* handled in keydown */ }}
                  onFocus={() => setCodeFocused(true)}
                  onBlur={() => setCodeFocused(false)}
                  onKeyDown={(e) => {
                    // combined length: 0..4 (0-1 letters slot, 2-3 digits slot)
                    const combinedLen = codeLetters.length + codeDigits.length;
                    if (e.key === "Backspace") {
                      e.preventDefault();
                      if (codeDigits.length > 0) setCodeDigits((s) => s.slice(0, -1));
                      else if (codeLetters.length > 0) setCodeLetters((s) => s.slice(0, -1));
                      return;
                    }
                    if (e.metaKey || e.ctrlKey || e.altKey) return;
                    if (e.key.length !== 1) return;
                    // Letter slots
                    if (combinedLen < 2) {
                      if (/[a-zA-Z]/.test(e.key)) {
                        e.preventDefault();
                        setCodeLetters((s) => (s + e.key.toUpperCase()).slice(0, 2));
                      } else {
                        e.preventDefault();
                      }
                      return;
                    }
                    // Digit slots
                    if (combinedLen < 4) {
                      if (/[0-9]/.test(e.key)) {
                        e.preventDefault();
                        setCodeDigits((s) => (s + e.key).slice(0, 2));
                      } else {
                        e.preventDefault();
                      }
                      return;
                    }
                    e.preventDefault();
                  }}
                  inputMode="text"
                  autoCapitalize="characters"
                  aria-label="Project code (AA-00)"
                  className="absolute inset-0 z-0 h-full w-full cursor-text opacity-0"
                />
              </div>
            </div>

          </div>
        </section>

        <section className="mx-auto mt-10 max-w-7xl px-6 md:px-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="font-mono-tight text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              {filtered.length} visible · {PROJECTS.length} total
            </div>
            {codeQuery && (
              <div className="font-mono-tight text-[10px] uppercase tracking-[0.28em] text-brand">
                filtering · {codeLetters}{codeDigits ? "-" + codeDigits : ""}
              </div>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card/35 p-16 text-center font-mono-tight text-xs uppercase tracking-[0.25em] text-muted-foreground">
              No projects match. Clear the search to see everything.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  copied={copied === project.id}
                  onOpen={() => setOpenId(project.id)}
                  onCopy={() => copyCode(project.id)}
                  index={index}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
      <ProjectDetailOverlay project={opened} copied={opened ? copied === opened.id : false} onClose={() => setOpenId(null)} onCopy={() => opened && copyCode(opened.id)} />
    </div>
  );
}

function ProjectCard({ project, copied, onOpen, onCopy, index }: { project: Project; copied: boolean; onOpen: () => void; onCopy: () => void; index: number }) {
  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-5 transition-all duration-500 hover:-translate-y-1 hover:border-brand/60 hover:shadow-[0_35px_90px_-40px_var(--brand)]"
      style={{ animation: `fade-up 0.5s cubic-bezier(0.16,1,0.3,1) ${index * 0.06}s both` }}
    >
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-32 bg-[radial-gradient(circle_at_top,color-mix(in_oklab,var(--brand)_20%,transparent),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative flex items-center justify-between gap-3">
        <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-brand/40 bg-brand/10 px-3 py-1.5 font-mono-tight text-[11px] font-bold uppercase tracking-[0.25em] text-brand shadow-[0_0_20px_-10px_var(--brand)]">
          <Hash className="h-3 w-3" />
          {project.id.replace("Project ", "")}
        </span>
        <span className="rounded-full border border-border bg-background/50 px-2.5 py-1 font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          {project.year}
        </span>
      </div>

      <button type="button" onClick={onOpen} className="relative mt-5 text-left">
        <div className="font-mono-tight text-[10px] uppercase tracking-[0.28em] text-brand">{project.discipline}</div>
        <h3 className="mt-2 font-display text-2xl font-black uppercase leading-[0.95] tracking-tight text-foreground transition-colors group-hover:text-brand">
          {project.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{project.summary}</p>
      </button>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.services.slice(0, 3).map((s) => (
          <span key={s} className="rounded-full border border-border bg-background/45 px-2 py-1 font-mono-tight text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            {s}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
        <div className="min-w-0">
          <div className="font-mono-tight text-[9px] uppercase tracking-[0.25em] text-muted-foreground">Client</div>
          <div className="truncate font-display text-sm font-bold uppercase tracking-tight">{project.client}</div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onCopy}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono-tight text-[10px] uppercase tracking-[0.22em] transition-all ${
              copied
                ? "border-brand bg-brand text-primary-foreground"
                : "border-border text-muted-foreground hover:border-brand hover:text-brand"
            }`}
            aria-label="Copy project code"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy code"}
          </button>
          <button type="button" onClick={onOpen} className="flex items-center gap-1.5 rounded-full border border-brand/40 bg-brand/10 px-3 py-1.5 font-mono-tight text-[10px] uppercase tracking-[0.22em] text-brand transition-all hover:bg-brand hover:text-primary-foreground">
            Open <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </article>
  );
}

function ProjectDetailOverlay({ project, copied, onClose, onCopy }: { project: Project | null; copied: boolean; onClose: () => void; onCopy: () => void }) {
  return (
    <div
      aria-hidden={!project}
      className={`fixed inset-0 z-[70] flex items-end justify-center px-3 pb-3 pt-16 transition-opacity duration-300 md:items-center md:px-6 md:py-10 ${project ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <button type="button" onClick={onClose} aria-label="Close" className="absolute inset-0 bg-background/70 backdrop-blur-lg" />
      {project && (
        <article
          key={project.id}
          className="relative z-10 grid max-h-full w-full max-w-6xl grid-cols-1 overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_60px_160px_-40px_var(--brand)] lg:grid-cols-[1.1fr_0.9fr]"
          style={{ animation: "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          <div className="relative min-h-[260px] overflow-hidden lg:min-h-full">
            <img src={project.image} alt={project.title} width={1600} height={1200} className="absolute inset-0 h-full w-full object-cover" />
            <div className={`absolute inset-0 bg-gradient-to-tr ${project.palette}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-card" />
            <div className="absolute inset-x-6 top-6 flex items-center justify-between">
              <span className="rounded-full border border-border bg-background/70 px-3 py-1 font-mono-tight text-[10px] uppercase tracking-[0.25em] text-brand backdrop-blur">
                {project.id}
              </span>
              <span className="rounded-full border border-border bg-background/70 px-3 py-1 font-mono-tight text-[10px] uppercase tracking-[0.25em] text-foreground backdrop-blur">
                {project.year}
              </span>
            </div>
          </div>

          <div className="relative flex max-h-[85vh] flex-col overflow-y-auto p-6 md:p-8">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur transition-all hover:rotate-90 hover:border-brand hover:text-brand"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-brand">
              {project.discipline} · {project.client}
            </div>
            <h2 className="mt-3 font-display text-3xl font-black uppercase leading-[0.9] tracking-tight md:text-5xl">
              {project.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">{project.summary}</p>

            <div className="mt-6 rounded-2xl border border-brand/30 bg-brand/8 p-4">
              <div className="font-mono-tight text-[9px] uppercase tracking-[0.28em] text-brand">Impact</div>
              <div className="mt-2 font-display text-lg font-black uppercase leading-tight tracking-tight text-foreground">
                {project.impact}
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <div className="rounded-2xl border border-brand/30 bg-background/40 p-3">
                <div className="font-mono-tight text-[9px] uppercase tracking-[0.25em] text-muted-foreground">Project code</div>
                <div className="mt-1 font-mono-tight text-xl font-black uppercase tracking-[0.15em] text-brand">{project.id}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-2xl border border-border bg-background/40 p-3">
                  <div className="font-mono-tight text-[9px] uppercase tracking-[0.25em] text-muted-foreground">Year</div>
                  <div className="mt-1 font-display text-sm font-black uppercase tracking-tight">{project.year}</div>
                </div>
                <div className="rounded-2xl border border-border bg-background/40 p-3">
                  <div className="font-mono-tight text-[9px] uppercase tracking-[0.25em] text-muted-foreground">Field</div>
                  <div className="mt-1 font-display text-sm font-black uppercase tracking-tight">{project.discipline}</div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="font-mono-tight text-[9px] uppercase tracking-[0.28em] text-muted-foreground">Scope of work</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.services.map((service) => (
                  <span key={service} className="rounded-full border border-border bg-background/45 px-3 py-1.5 font-mono-tight text-[10px] uppercase tracking-[0.22em] text-foreground">
                    {service}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-5">
              <button
                type="button"
                onClick={onCopy}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono-tight text-[10px] uppercase tracking-[0.22em] transition-all ${copied ? "border-brand bg-brand text-primary-foreground" : "border-border bg-background/40 text-muted-foreground hover:border-brand hover:text-brand"}`}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Code copied" : "Copy project code"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-brand to-brand-glow px-4 py-2 font-mono-tight text-[10px] uppercase tracking-[0.22em] text-primary-foreground transition-all hover:shadow-[0_0_30px_var(--brand)]"
              >
                Enquire <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </article>
      )}
    </div>
  );
}