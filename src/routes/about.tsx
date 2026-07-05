import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Database, Globe2, Hash, MapPin, Quote, X } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { StatusPill } from "@/components/status-pill";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — SAM Studios®" },
      {
        name: "description",
        content:
          "About SAM Studios® — meet the founder and team building brand, film, product, and spatial work.",
      },
      { property: "og:title", content: "About Us — SAM Studios®" },
      { property: "og:description", content: "Meet the team behind SAM Studios®." },
    ],
  }),
  component: FounderPage,
});

const DOSSIER: { k: string; v: string }[] = [
  { k: "Full Name", v: "Samuel A. M." },
  { k: "Role", v: "Founder · CEO · Creative Director" },
  { k: "Based", v: "New York City" },
  { k: "Years in industry", v: "10+" },
  { k: "Studio founded", v: "2024" },
  { k: "Focus", v: "Brand · Film · Product · Spatial" },
  { k: "Languages", v: "English · Spanish" },
  { k: "Contact", v: "sam@samstudios.com" },
];

const TIMELINE = [
  { year: "TK", title: "Origin", body: "Born. Started drawing on every available surface shortly after." },
  { year: "TK", title: "First Build", body: "Shipped a website at TK years old. Got hooked." },
  { year: "TK", title: "Studied Design", body: "Formal training in visual systems, type, and motion." },
  { year: "2024", title: "Founded SAM Studios®", body: "Opened the doors with one rule: no medium off limits." },
  { year: "2026", title: "The Empire Era", body: "Scaled the studio across film, brand, product, and spatial work." },
];

const PRINCIPLES = [
  "Make it weird. Make it work.",
  "If it can be drawn, it can be built.",
  "Taste compounds.",
  "The brief is the beginning, not the boundary.",
  "Ship more than you explain.",
  "No medium is off limits.",
];

const LOCATIONS = [
  { city: "New York", country: "United States", tz: "GMT-5", zone: "America/New_York", role: "HQ · Founder office", hue: 295, code: "NYC", team: 12 },
  { city: "Toronto", country: "Canada", tz: "GMT-5", zone: "America/Toronto", role: "Studio · Production", hue: 285, code: "YYZ", team: 8 },
  { city: "London", country: "United Kingdom", tz: "GMT+0", zone: "Europe/London", role: "Strategy · Brand", hue: 310, code: "LDN", team: 5 },
  { city: "Berlin", country: "Germany", tz: "GMT+1", zone: "Europe/Berlin", role: "Engineering", hue: 270, code: "BER", team: 6 },
  { city: "Tokyo", country: "Japan", tz: "GMT+9", zone: "Asia/Tokyo", role: "Motion · Design", hue: 300, code: "TYO", team: 4 },
  { city: "Mexico City", country: "Mexico", tz: "GMT-6", zone: "America/Mexico_City", role: "Industrial · Spatial", hue: 315, code: "CDMX", team: 4 },
];

function useCityTime(zone: string) {
  const [t, setT] = useState("--:--");
  useEffect(() => {
    const tick = () => {
      try {
        setT(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: zone }).format(new Date()));
      } catch { setT("--:--"); }
    };
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, [zone]);
  return t;
}

function LocationSignalTile({ l, i }: { l: typeof LOCATIONS[number]; i: number }) {
  const time = useCityTime(l.zone);
  return (
    <div className="bg-background/70 p-4 text-center backdrop-blur">
      <div className="font-display text-xl font-black uppercase tracking-tight text-foreground">{l.code}</div>
      <div className="mt-1 font-mono-tight text-[8px] uppercase tracking-[0.22em] text-brand">{time}</div>
      <div className="mt-2 font-mono-tight text-[8px] uppercase tracking-[0.2em] text-muted-foreground">signal {String(i + 1).padStart(2, '0')}</div>
    </div>
  );
}

const TEAM = [
  {
    initials: "SA",
    name: "Samuel A. M.",
    role: "Founder · CEO",
    loc: "NYC",
    age: "Founder file pending",
    birthplace: "New York City",
    joined: "Founded SAM Studios®",
    focus: "Vision, creative direction, empire building",
    bio: "The person behind the studio's no-medium-off-limits philosophy. Samuel leads the taste, ambition, and final creative calls across the house.",
    quote: "If the idea is strong enough, we will find the medium for it.",
    hue: 295,
  },
  {
    initials: "MR",
    name: "Maya R.",
    role: "Head of Design",
    loc: "LA",
    age: "26",
    birthplace: "Los Angeles, CA",
    joined: "2024",
    focus: "Identity systems, layouts, art direction",
    bio: "Turns rough ideas into visual worlds with rules, rhythm, and enough edge to make every brand feel alive.",
    quote: "A system should feel simple after you survive the chaos.",
    hue: 280,
  },
  {
    initials: "JK",
    name: "Jordan K.",
    role: "Director of Film",
    loc: "Brooklyn",
    age: "29",
    birthplace: "Queens, NY",
    joined: "2024",
    focus: "Campaign films, edits, color, story",
    bio: "Builds cinematic language for brands, artists, and products — from the first frame to the final render.",
    quote: "The cut is where the idea tells the truth.",
    hue: 310,
  },
  {
    initials: "LV",
    name: "Lena V.",
    role: "Lead Engineer",
    loc: "Berlin",
    age: "27",
    birthplace: "Berlin, Germany",
    joined: "2025",
    focus: "Web apps, portals, interactive systems",
    bio: "Makes the beautiful stuff usable, fast, and real — especially when the prototype looks impossible.",
    quote: "Motion is a feature when it teaches the interface.",
    hue: 270,
  },
  {
    initials: "TO",
    name: "Theo O.",
    role: "Brand Strategist",
    loc: "London",
    age: "31",
    birthplace: "London, UK",
    joined: "2025",
    focus: "Positioning, naming, launch strategy",
    bio: "Finds the language, tension, and reason-to-exist that give every project a spine before visuals begin.",
    quote: "Good strategy makes decisions faster.",
    hue: 300,
  },
  {
    initials: "AN",
    name: "Aiko N.",
    role: "Motion Designer",
    loc: "Tokyo",
    age: "25",
    birthplace: "Tokyo, Japan",
    joined: "2025",
    focus: "Kinetic type, title systems, micro-motion",
    bio: "Gives static worlds a pulse through motion that feels intentional, premium, and impossible to ignore.",
    quote: "Every frame should have a job.",
    hue: 285,
  },
  {
    initials: "DC",
    name: "Diego C.",
    role: "Industrial Design",
    loc: "CDMX",
    age: "30",
    birthplace: "Mexico City, MX",
    joined: "2025",
    focus: "Objects, packaging, spatial concepts",
    bio: "Bridges digital taste with physical form, shaping the things people can hold, wear, unbox, and remember.",
    quote: "A product has to look good in the hand, not just the render.",
    hue: 315,
  },
  {
    initials: "RP",
    name: "Rae P.",
    role: "Producer",
    loc: "NYC",
    age: "28",
    birthplace: "Newark, NJ",
    joined: "2024",
    focus: "Timelines, budgets, client experience",
    bio: "Keeps the studio moving cleanly from kickoff to delivery, making ambitious work feel organized for clients.",
    quote: "The magic hits harder when the schedule is real.",
    hue: 290,
  },
];

type TeamMember = (typeof TEAM)[number];

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(1100px) rotateX(${y * -5}deg) rotateY(${x * 7}deg)`;
    };
    const leave = () =>
      (el.style.transform = "perspective(1100px) rotateX(0) rotateY(0)");
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);
  return (
    <div ref={ref} className="transition-transform duration-300 ease-out">
      {children}
    </div>
  );
}

function FounderPage() {
  useReveal();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      {/* Ambient field */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-20 h-[40rem] w-[40rem] rounded-full bg-brand/15 blur-[160px]" />
        <div className="absolute top-1/2 right-0 h-[32rem] w-[32rem] rounded-full bg-brand-glow/15 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <main className="relative mx-auto flex max-w-7xl flex-col px-6 pt-24 pb-20 md:px-10 md:pt-28">
        {/* ============ WORLD DESK HERO ============ */}
        <section className="relative order-1 overflow-hidden border-y border-brand/35 py-9 md:py-11" data-rail-label="World Desk">
          <div aria-hidden className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-brand/25" style={{ animation: "spin-slow 48s linear infinite" }} />
          <div aria-hidden className="absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/60" />
          <div className="relative grid gap-6 lg:grid-cols-[0.72fr_1.38fr_0.72fr] lg:items-center">
            <div className="order-2 space-y-3 font-mono-tight text-[10px] uppercase tracking-[0.26em] text-muted-foreground lg:order-1">
              <div className="flex items-center gap-2 text-brand"><MapPin className="h-3.5 w-3.5" /> Studio network</div>
              <div className="h-px w-full bg-gradient-to-r from-brand to-transparent" />
              <div>6 connected bases</div>
              <div>5 live time zones</div>
              <div>39 builders online</div>
              <div className="pt-3"><StatusPill status="active" /> Currently taking work</div>
            </div>

            <div className="order-1 text-center lg:order-2">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-brand/50 bg-brand/10 text-brand shadow-[0_0_65px_-12px_var(--brand)] md:h-24 md:w-24">
                <Globe2 className="h-9 w-9 md:h-10 md:w-10" />
              </div>
              <div className="font-mono-tight text-[10px] uppercase tracking-[0.35em] text-brand">About · World desk</div>
              <h1 className="mx-auto mt-4 max-w-4xl font-display font-black uppercase leading-[0.84] tracking-tight" style={{ fontSize: "clamp(3rem, 8.2vw, 7.25rem)" }}>
                Global signal.<br />One studio.
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                The people, projects, and city desks behind SAM Studios® — connected across time zones without losing the craft.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link to="/locations" className="group inline-flex items-center gap-3 rounded-full bg-brand px-7 py-3.5 font-display text-xs font-bold uppercase tracking-widest text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-[0_0_50px_var(--brand)]">
                  Open Locations <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-6 py-3.5 font-mono-tight text-[11px] uppercase tracking-[0.25em] text-muted-foreground backdrop-blur-md transition-colors hover:border-brand/60 hover:text-foreground">
                  Start a brief
                </Link>
              </div>
            </div>

            <div className="order-3 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
              {LOCATIONS.map((l, i) => (
                <LocationSignalTile key={l.code} l={l} i={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ============ THE ARCHIVE — projects database CTA ============ */}
        <section id="archive" className="reveal order-3 mt-28 scroll-mt-32">
          <SectionHeader index="02" title="The Archive" caption="every project on record" />
          <Link
            to="/work"
            className="group relative grid grid-cols-1 gap-6 overflow-hidden rounded-3xl border border-brand/40 bg-gradient-to-br from-brand/15 via-card/60 to-card/60 p-8 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-brand/70 hover:shadow-[0_35px_100px_-40px_var(--brand)] md:grid-cols-[1.4fr_1fr] md:p-12"
          >
            <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand/25 blur-3xl transition-transform duration-700 group-hover:scale-125" />
            <div className="relative">
              <div className="flex items-center gap-2 font-mono-tight text-[10px] uppercase tracking-[0.3em] text-brand">
                <Database className="h-3.5 w-3.5" /> Live · searchable
              </div>
              <h3 className="mt-3 font-display text-3xl font-black uppercase leading-none tracking-tighter md:text-5xl">
                Browse the projects database
              </h3>
              <p className="mt-4 max-w-md text-sm text-muted-foreground md:text-base">
                Every shipped project, indexed by code (AA-00 → AA-05). Search by keyword or jump straight to a code.
              </p>
              <span className="mt-6 inline-flex items-center gap-3 rounded-full bg-brand px-6 py-3 font-display text-xs font-bold uppercase tracking-widest text-primary-foreground transition-all group-hover:shadow-[0_0_40px_var(--brand)]">
                Open the archive <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </div>
            <div className="relative grid grid-cols-3 gap-2">
              {["AA-00","AA-01","AA-02","AA-03","AA-04","AA-05"].map((code, i) => (
                <div
                  key={code}
                  className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-border bg-background/50 p-3 font-mono-tight text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-all group-hover:border-brand/50"
                  style={{ animation: `fade-up 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.05}s both` }}
                >
                  <Hash className="h-3 w-3 text-brand" />
                  <span className="font-black tracking-[0.2em] text-foreground">{code}</span>
                </div>
              ))}
            </div>
          </Link>
        </section>

        {/* ============ MANIFESTO PULL QUOTE ============ */}
        <section className="reveal order-4 mt-28">
          <div className="grain relative overflow-hidden rounded-3xl border border-border bg-card p-8 md:p-14">
            <Quote className="absolute right-8 top-8 h-24 w-24 text-brand/15" />
            <div className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-brand">
              03 · In his own words
            </div>
            <p
              className="mt-6 max-w-4xl font-display font-black uppercase leading-[0.95] tracking-tight"
              style={{ fontSize: "clamp(1.5rem, 4.5vw, 3.25rem)" }}
            >
              "I wanted a studio where the answer to{" "}
              <span className="text-brand">'can you make that?'</span> is always{" "}
              <span className="bg-gradient-to-r from-brand to-brand-glow bg-clip-text text-transparent">
                yes — and better than you imagined.
              </span>
              "
            </p>
            <div className="mt-8 font-mono-tight text-xs uppercase tracking-[0.25em] text-muted-foreground">
              — Samuel A. M., Founder
            </div>
          </div>
        </section>

        {/* ============ THE CREW ============ */}
        <section className="reveal order-2 mt-28">
          <SectionHeader index="01" title="The Team" caption="people behind the work" />
          <div className="mb-6 flex items-center justify-between font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span>{TEAM.length} team members</span>
            <span className="hidden md:inline">click a card for details</span>
          </div>

          {/* Featured CEO card */}
          {(() => {
            const ceo = TEAM[0];
            return (
              <button
                type="button"
                onClick={() => setSelectedMember(ceo)}
                className="group relative mb-3 grid w-full grid-cols-1 overflow-hidden rounded-3xl border border-brand/40 bg-card/50 text-left backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-brand/80 hover:shadow-[0_30px_80px_-30px_var(--brand)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/70 md:grid-cols-[1fr_1.6fr]"
                style={{ animation: "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both" }}
              >
                <div
                  className="relative aspect-square min-h-[18rem] overflow-hidden md:aspect-auto"
                  style={{ background: `radial-gradient(circle at 35% 30%, oklch(0.7 0.24 ${ceo.hue}), oklch(0.18 0.06 ${ceo.hue}))` }}
                >
                  <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent 0 6px, color-mix(in oklab, var(--primary-foreground) 12%, transparent) 6px 7px)" }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-[10rem] font-black tracking-normal text-primary-foreground/90 mix-blend-overlay md:text-[14rem]">
                      {ceo.initials}
                    </span>
                  </div>
                  <div className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-18deg] bg-gradient-to-r from-transparent via-primary-foreground/55 to-transparent opacity-0 transition-opacity duration-300 group-hover:animate-[shine-sweep_1.2s_cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100" />
                  <div className="absolute left-4 top-4 rounded-full border border-primary-foreground/40 bg-background/30 px-3 py-1 font-mono-tight text-[9px] uppercase tracking-[0.3em] text-primary-foreground backdrop-blur-md">
                    CEO · Founder · Owner
                  </div>
                </div>
                <div className="flex flex-col justify-between gap-6 p-6 md:p-10">
                  <div>
                    <div className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-brand">{ceo.role}</div>
                    <h3 className="mt-3 font-display text-3xl font-black uppercase leading-none tracking-tight md:text-5xl">
                      {ceo.name}
                    </h3>
                    <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
                      {ceo.bio}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-xl border border-border bg-background/40 p-3">
                      <div className="font-mono-tight text-[9px] uppercase tracking-[0.25em] text-brand">Base</div>
                      <div className="mt-1 font-display text-xs font-bold uppercase">{ceo.loc}</div>
                    </div>
                    <div className="rounded-xl border border-border bg-background/40 p-3">
                      <div className="font-mono-tight text-[9px] uppercase tracking-[0.25em] text-brand">Focus</div>
                      <div className="mt-1 font-display text-xs font-bold uppercase line-clamp-1">{ceo.focus}</div>
                    </div>
                    <div className="rounded-xl border border-border bg-background/40 p-3">
                      <div className="font-mono-tight text-[9px] uppercase tracking-[0.25em] text-brand">Status</div>
                      <div className="mt-1 font-display text-xs font-bold uppercase">Active</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-2 self-start rounded-full border border-brand/40 bg-brand/10 px-4 py-2 font-mono-tight text-[10px] uppercase tracking-[0.25em] text-brand transition-all group-hover:bg-brand/20">
                    Open full profile <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </button>
            );
          })()}

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {TEAM.slice(1).map((m, i) => (
              <button
                type="button"
                key={m.name}
                onClick={() => setSelectedMember(m)}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 text-left backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-brand/60 hover:shadow-[0_20px_50px_-20px_color-mix(in_oklab,var(--brand)_40%,transparent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/70"
                style={{ animation: `fade-up 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.05}s both` }}
              >
                {/* avatar */}
                <div
                  className="relative aspect-square overflow-hidden"
                  style={{
                    background: `radial-gradient(circle at 35% 30%, oklch(0.65 0.22 ${m.hue}), oklch(0.18 0.06 ${m.hue}))`,
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-30 mix-blend-overlay"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(45deg, transparent 0 6px, color-mix(in oklab, var(--primary-foreground) 12%, transparent) 6px 7px)",
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-6xl font-black tracking-normal text-primary-foreground/90 mix-blend-overlay">
                      {m.initials}
                    </span>
                  </div>
                  <div className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-18deg] bg-gradient-to-r from-transparent via-primary-foreground/55 to-transparent opacity-0 transition-opacity duration-300 group-hover:animate-[shine-sweep_1.05s_cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100" />
                  <div className="absolute left-3 top-3 rounded-md border border-primary-foreground/30 bg-background/35 px-1.5 py-0.5 font-mono-tight text-[9px] uppercase tracking-[0.25em] text-primary-foreground/90 backdrop-blur-sm">
                    /{String(i + 2).padStart(2, "0")}
                  </div>
                  <div className="absolute bottom-3 right-3 rounded-full border border-primary-foreground/30 bg-background/35 px-2 py-1 font-mono-tight text-[8px] uppercase tracking-[0.22em] text-primary-foreground/90 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                    Open file
                  </div>
                </div>
                {/* info */}
                <div className="space-y-1 p-4">
                  <div className="font-display text-base font-black uppercase leading-tight tracking-tight">
                    {m.name}
                  </div>
                  <div className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-brand">
                    {m.role}
                  </div>
                  <div className="pt-2 font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    · {m.loc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ============ PRINCIPLES ============ */}
        <section className="reveal order-5 mt-28">
          <SectionHeader index="04" title="How We Operate" caption="principles" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {PRINCIPLES.map((p, i) => (
              <div
                key={p}
                className="group flex items-start gap-4 rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-brand/60 hover:bg-brand/5"
              >
                <span className="mt-1.5 font-mono-tight text-[10px] text-brand">
                  /{String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-lg font-bold leading-tight tracking-tight md:text-xl">
                  {p}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ============ CTA ============ */}
        <section className="reveal order-6 mt-28">
          <div className="grain relative overflow-hidden rounded-3xl border border-border bg-card p-10 text-center md:p-16">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklab,var(--brand)_40%,transparent),transparent_60%)]" />
            <div className="relative space-y-6">
              <div className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-brand">
                Ready when you are
              </div>
              <h2
                className="font-display font-black uppercase leading-[0.9] tracking-tighter"
                style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)" }}
              >
                LET'S BUILD <br className="hidden md:block" />
                SOMETHING.
              </h2>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 rounded-full bg-brand px-8 py-4 font-display text-xs font-bold uppercase tracking-widest text-primary-foreground transition-all hover:shadow-[0_0_50px_var(--brand)]"
              >
                Start The Brief <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <TeamModal member={selectedMember} onClose={() => setSelectedMember(null)} />

      <Footer />
    </div>
  );
}

function TeamModal({ member, onClose }: { member: TeamMember | null; onClose: () => void }) {
  useEffect(() => {
    if (!member) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [member, onClose]);

  if (!member) return null;

  const facts = [
    ["Name", member.name],
    ["Age", member.age],
    ["Birthplace", member.birthplace],
    ["Base", member.loc],
    ["Joined", member.joined],
    ["Focus", member.focus],
  ];

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-background/72 px-4 py-8 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-label={`${member.name} team profile`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ animation: "fade-in 180ms ease-out both" }}
    >
      <div
        className="grain relative grid w-full max-w-4xl overflow-hidden rounded-[2rem] border border-brand/35 bg-card shadow-[0_40px_120px_-50px_var(--brand)] md:grid-cols-[0.85fr_1.15fr]"
        style={{ animation: "modal-rise 420ms cubic-bezier(0.16,1,0.3,1) both" }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/60 text-muted-foreground backdrop-blur-md transition-all hover:border-brand/60 hover:text-foreground"
          aria-label="Close profile"
        >
          <X className="h-4 w-4" />
        </button>

        <div
          className="relative min-h-[21rem] overflow-hidden p-6 md:min-h-full"
          style={{
            background: `radial-gradient(circle at 35% 25%, oklch(0.68 0.24 ${member.hue}), oklch(0.17 0.06 ${member.hue}))`,
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_85%,rgba(255,255,255,0.22),transparent_40%)]" />
          <div className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-18deg] bg-gradient-to-r from-transparent via-primary-foreground/50 to-transparent [animation:shine-sweep_1.25s_cubic-bezier(0.16,1,0.3,1)_220ms_both]" />
          <div className="relative flex h-full min-h-[18rem] flex-col justify-between">
            <div className="w-fit rounded-full border border-primary-foreground/35 bg-background/30 px-3 py-1 font-mono-tight text-[9px] uppercase tracking-[0.3em] text-primary-foreground backdrop-blur-md">
              Team profile
            </div>
            <div className="flex items-center justify-center py-10">
              <div className="flex h-36 w-36 items-center justify-center rounded-[2rem] border border-primary-foreground/25 bg-primary-foreground/10 shadow-[inset_0_0_40px_rgba(255,255,255,0.12)] backdrop-blur-sm">
                <span className="font-display text-6xl font-black text-primary-foreground/90 mix-blend-overlay">
                  {member.initials}
                </span>
              </div>
            </div>
            <div className="font-mono-tight text-[10px] uppercase tracking-[0.26em] text-primary-foreground/80">
              Active team member
            </div>
          </div>
        </div>

        <div className="relative space-y-6 p-6 md:p-8">
          <div>
            <div className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-brand">
              {member.role}
            </div>
            <h3 className="mt-2 font-display text-3xl font-black uppercase leading-none tracking-tight md:text-5xl">
              {member.name}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {facts.map(([label, value], index) => (
              <div
                key={label}
                className="rounded-2xl border border-border bg-background/45 p-3 backdrop-blur-sm"
                style={{ animation: `fade-up 0.45s cubic-bezier(0.16,1,0.3,1) ${index * 0.045 + 0.12}s both` }}
              >
                <div className="font-mono-tight text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
                  {label}
                </div>
                <div className="mt-1 text-sm font-semibold text-foreground">{value}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-brand/25 bg-brand/8 p-5">
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">{member.bio}</p>
            <div className="mt-4 border-l-2 border-brand pl-4 font-display text-lg font-bold leading-tight tracking-tight">
              “{member.quote}”
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/contact"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 font-display text-[11px] font-bold uppercase tracking-widest text-primary-foreground transition-all hover:shadow-[0_0_35px_var(--brand)]"
            >
              Work with {member.initials} <ArrowUpRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-border bg-background/45 px-5 py-3 font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground transition-all hover:border-brand/60 hover:text-foreground"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  index,
  title,
  caption,
}: {
  index: string;
  title: string;
  caption: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4 border-b border-border pb-4">
      <div>
        <div className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-brand">
          /{index} · {caption}
        </div>
        <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight md:text-4xl">
          {title}
        </h2>
      </div>
      <div className="hidden font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground md:block">
        SAM/{index}
      </div>
    </div>
  );
}