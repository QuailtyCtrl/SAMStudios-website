import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Clock,
  Compass,
  MapPin,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Users,
} from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { StatusPill } from "@/components/status-pill";

export const Route = createFileRoute("/locations")({
  head: () => ({
    meta: [
      { title: "Locations — SAM Studios®" },
      { name: "description", content: "Six cities, one studio. Explore the SAM Studios® global network." },
      { property: "og:title", content: "Locations — SAM Studios®" },
      { property: "og:description", content: "Six cities, one studio." },
    ],
  }),
  component: LocationsPage,
});

type Loc = {
  city: string;
  country: string;
  code: string;
  tz: string;
  tzShort: string;
  role: string;
  neighborhood: string;
  since: string;
  team: number;
  hue: number;
  landmark: string;
  image: string;
  quote: string;
  lat: number;
  lng: number;
};

const LOCATIONS: Loc[] = [
  { city: "Toronto",    country: "Canada",         code: "YYZ",  tz: "America/Toronto",      tzShort: "EST", role: "HQ · Origin studio · Founder office", neighborhood: "King West",     since: "2020", team: 16, hue: 200, landmark: "CN Tower",              image: "https://images.unsplash.com/photo-1517090504586-fde19ea6066f?auto=format&fit=crop&w=2400&q=80", quote: "Where SAM Studios® was born. Home base, always.", lat: 43.65, lng: -79.38 },
  { city: "New York",   country: "United States",  code: "NYC",  tz: "America/New_York",     tzShort: "EST", role: "Studio · Production",    neighborhood: "SoHo, Manhattan",    since: "2024", team: 12, hue: 295, landmark: "Manhattan skyline",     image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=2400&q=80", quote: "The city that punishes half-measures.", lat: 40.72, lng: -74.00 },
  { city: "London",     country: "United Kingdom", code: "LDN",  tz: "Europe/London",        tzShort: "GMT", role: "Strategy · Brand",       neighborhood: "Shoreditch",         since: "2025", team: 5,  hue: 310, landmark: "Tower Bridge",          image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=2400&q=80", quote: "Editorial with an edge.", lat: 51.50, lng: -0.12 },
  { city: "Berlin",     country: "Germany",        code: "BER",  tz: "Europe/Berlin",        tzShort: "CET", role: "Engineering",            neighborhood: "Kreuzberg",          since: "2025", team: 6,  hue: 200, landmark: "Reichstag",             image: "https://images.unsplash.com/photo-1587330979470-3016b6702d89?auto=format&fit=crop&w=2400&q=80", quote: "We build like the wall is coming down again.", lat: 52.52, lng: 13.40 },
  { city: "Tokyo",      country: "Japan",          code: "TYO",  tz: "Asia/Tokyo",           tzShort: "JST", role: "Motion · Design",        neighborhood: "Shibuya",            since: "2025", team: 4,  hue: 350, landmark: "Shibuya Crossing",      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=2400&q=80", quote: "Frames per second, obsessed.", lat: 35.68, lng: 139.69 },
  { city: "Mexico City",country: "Mexico",         code: "CDMX", tz: "America/Mexico_City",  tzShort: "CST", role: "Industrial · Spatial",   neighborhood: "Roma Norte",         since: "2025", team: 4,  hue: 40,  landmark: "Angel of Independence", image: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=2400&q=80", quote: "Color, texture, and things you can hold.", lat: 19.43, lng: -99.13 },
];

function useLiveTime(tz: string) {
  const [t, setT] = useState<{ hh: string; mm: string; ss: string; hour: number; date: string }>(() => ({ hh: "--", mm: "--", ss: "--", hour: 12, date: "" }));
  useEffect(() => {
    const tick = () => {
      try {
        const now = new Date();
        const parts = new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: tz,
        }).formatToParts(now);
        const map: Record<string, string> = {};
        for (const p of parts) map[p.type] = p.value;
        const dateStr = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "2-digit", timeZone: tz }).format(now);
        setT({ hh: map.hour ?? "--", mm: map.minute ?? "--", ss: map.second ?? "--", hour: parseInt(map.hour ?? "12", 10), date: dateStr });
      } catch {
        /* noop */
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tz]);
  return t;
}

function phaseFor(hour: number) {
  if (hour >= 5 && hour < 7) return { label: "Sunrise", Icon: Sunrise, tone: "from-amber-500/40 to-rose-500/20", chip: "text-amber-300 border-amber-400/40 bg-amber-400/10" };
  if (hour >= 7 && hour < 17) return { label: "Day",     Icon: Sun,     tone: "from-sky-400/30 to-cyan-300/10",   chip: "text-sky-200 border-sky-300/40 bg-sky-300/10" };
  if (hour >= 17 && hour < 20) return { label: "Sunset", Icon: Sunset,  tone: "from-orange-500/40 to-fuchsia-500/20", chip: "text-orange-200 border-orange-400/40 bg-orange-400/10" };
  return { label: "Night", Icon: Moon, tone: "from-indigo-600/40 to-violet-500/15", chip: "text-indigo-200 border-indigo-400/40 bg-indigo-400/10" };
}

function LocationsPage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [dialIdx, setDialIdx] = useState(0);
  const panelRefs = useRef<Array<HTMLElement | null>>([]);

  // observe the currently visible panel to sync side nav
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.55) {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            if (!Number.isNaN(idx)) {
              setActiveIdx(idx);
              setDialIdx(idx);
            }
          }
        });
      },
      { threshold: [0.55, 0.75] },
    );
    panelRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (i: number) => {
    panelRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden pt-28 md:pt-36">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -left-20 h-[36rem] w-[36rem] rounded-full bg-brand/20 blur-[160px]" />
          <div className="absolute top-1/3 right-0 h-[28rem] w-[28rem] rounded-full bg-brand-glow/15 blur-[140px]" />
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              maskImage: "radial-gradient(ellipse at 50% 40%, black 30%, transparent 75%)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-16 md:px-10">
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill status="active" />
            <span className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              /global · {LOCATIONS.length} studios
            </span>
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-end">
            <h1
              className="font-display font-black uppercase leading-[0.82] tracking-tighter"
              style={{ fontSize: "clamp(2.75rem, 10vw, 8.5rem)" }}
            >
              <span className="block">A STUDIO</span>
              <span className="block bg-gradient-to-r from-brand via-brand-glow to-brand bg-[length:200%_100%] bg-clip-text text-transparent [animation:shimmer_6s_linear_infinite]">
                WORLD DESK.
              </span>
            </h1>

            {/* Live global dial */}
            <GlobalDial locations={LOCATIONS} activeIdx={dialIdx} onSelect={setDialIdx} />
          </div>

          {/* horizontal city ticker */}
          <div className="mt-10 flex flex-wrap gap-2">
            {LOCATIONS.map((l, i) => (
              <button
                key={l.code}
                type="button"
                onClick={() => {
                  setDialIdx(i);
                  scrollTo(i);
                }}
                className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono-tight text-[10px] uppercase tracking-[0.24em] backdrop-blur transition-all hover:-translate-y-0.5 ${
                  activeIdx === i
                    ? "border-brand bg-brand/15 text-foreground shadow-[0_0_25px_-6px_var(--brand)]"
                    : "border-border bg-card/40 text-muted-foreground hover:border-brand/60 hover:text-foreground"
                }`}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full shadow-[0_0_8px_currentColor]"
                  style={{ color: `oklch(0.7 0.22 ${l.hue})` }}
                />
                {l.code} · {l.city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CITY PANELS ========== */}
      <section className="relative mt-6">
        <div>
          {LOCATIONS.map((l, i) => (
            <CityPanel
              key={l.code}
              loc={l}
              idx={i}
              total={LOCATIONS.length}
              refCb={(el) => (panelRefs.current[i] = el)}
            />
          ))}
        </div>
      </section>

      {/* ========== FOOTER CTA ========== */}
      <section className="relative mx-auto mt-16 max-w-7xl px-6 pb-24 md:px-10">
        <div className="grain relative overflow-hidden rounded-3xl border border-brand/40 bg-gradient-to-br from-brand/20 via-card/60 to-card/60 p-10 backdrop-blur-md md:p-16">
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/25 blur-3xl" style={{ animation: "float 8s ease-in-out infinite" }} />
          <div aria-hidden className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-brand-glow/25 blur-3xl" style={{ animation: "float 10s ease-in-out infinite reverse" }} />
          <div className="relative flex flex-wrap items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 font-mono-tight text-[10px] uppercase tracking-[0.3em] text-brand">
                <Compass className="h-3.5 w-3.5" /> Ready when you are
              </div>
              <h3 className="mt-3 font-display text-4xl font-black uppercase leading-none tracking-tighter md:text-6xl">
                Any city.<br /> Any brief.
              </h3>
            </div>
            <div className="flex flex-col items-start gap-3 md:items-end">
              <div className="flex items-center gap-2 font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                <Users className="h-3.5 w-3.5" /> {LOCATIONS.reduce((s, l) => s + l.team, 0)} people across {LOCATIONS.length} studios
              </div>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 rounded-full bg-brand px-7 py-3.5 font-display text-xs font-bold uppercase tracking-widest text-primary-foreground transition-all hover:shadow-[0_0_50px_var(--brand)]"
              >
                Start the Brief <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ============================================================ */
/* Global Dial — animated live "world clock" summary            */
/* ============================================================ */
function GlobalDial({ locations, activeIdx, onSelect }: { locations: Loc[]; activeIdx: number; onSelect: (i: number) => void }) {
  const active = locations[activeIdx];
  const t = useLiveTime(active.tz);
  const phase = phaseFor(t.hour);
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl md:p-7">
      <div aria-hidden className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60 ${phase.tone}`} />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-20"
        style={{ backgroundImage: "radial-gradient(circle at 20% 20%, currentColor 1px, transparent 1px)", backgroundSize: "20px 20px", color: "var(--brand)" }} />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono-tight text-[10px] uppercase tracking-[0.28em] text-brand">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
          </span>
          Now in {active.code}
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono-tight text-[9px] uppercase tracking-[0.22em] ${phase.chip}`}>
          <phase.Icon className="h-3 w-3" /> {phase.label}
        </span>
      </div>
      <div className="relative mt-4 flex items-baseline gap-1 font-display text-6xl font-black tabular-nums leading-none tracking-tight md:text-7xl">
        <span>{t.hh}</span>
        <span className="animate-pulse text-muted-foreground/70">:</span>
        <span>{t.mm}</span>
        <span className="ml-2 font-mono-tight text-sm font-bold tabular-nums text-muted-foreground">{t.ss}</span>
      </div>
      <div className="relative mt-2 font-mono-tight text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
        {t.date} · {active.tzShort} · {active.city}
      </div>
      {/* mini row of all cities */}
      <div className="relative mt-5 grid grid-cols-3 gap-1.5">
        {locations.map((l, i) => (
          <MiniClock key={l.code} loc={l} active={i === activeIdx} onClick={() => onSelect(i)} />
        ))}
      </div>
    </div>
  );
}

function MiniClock({ loc, active, onClick }: { loc: Loc; active: boolean; onClick: () => void }) {
  const t = useLiveTime(loc.tz);
  const phase = phaseFor(t.hour);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-center gap-2 rounded-lg border px-2 py-1.5 text-left transition-all ${
        active ? "border-brand bg-brand/10" : "border-border/60 bg-background/40 hover:border-brand/50"
      }`}
    >
      <phase.Icon className={`h-3 w-3 ${phase.chip.split(" ")[0]}`} />
      <span className="min-w-0 flex-1 truncate font-mono-tight text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{loc.code}</span>
      <span className="font-display text-[11px] font-black tabular-nums">{t.hh}:{t.mm}</span>
    </button>
  );
}

/* ============================================================ */
/* City Panel — cinematic full-viewport section per location    */
/* ============================================================ */
function CityPanel({ loc, idx, total, refCb }: { loc: Loc; idx: number; total: number; refCb: (el: HTMLElement | null) => void }) {
  const t = useLiveTime(loc.tz);
  const phase = phaseFor(t.hour);
  const [mx, setMx] = useState(50);
  const [my, setMy] = useState(50);

  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setMx(((e.clientX - r.left) / r.width) * 100);
    setMy(((e.clientY - r.top) / r.height) * 100);
  };

  const parallax = useMemo(() => ({
    transform: `scale(1.08) translate3d(${(mx - 50) * -0.25}px, ${(my - 50) * -0.25}px, 0)`,
  }), [mx, my]);

  return (
    <section
      ref={refCb as any}
      data-idx={idx}
      onMouseMove={move}
      className="relative w-full"
    >
      <div className="mx-auto max-w-[100rem] px-4 md:px-8">
        <div className={`relative overflow-hidden rounded-[2.5rem] border bg-card ${idx === 0 ? "border-brand/60 shadow-[0_80px_220px_-40px_var(--brand)] ring-1 ring-brand/40" : "border-border/70 shadow-[0_60px_160px_-60px_var(--brand)]"}`}>
          {idx === 0 && (
            <>
              <div aria-hidden className="pointer-events-none absolute -inset-1 rounded-[2.75rem] bg-gradient-to-br from-brand/40 via-transparent to-brand-glow/40 opacity-40 blur-2xl" />
              <div aria-hidden className="pointer-events-none absolute left-0 top-0 z-20 h-px w-full bg-gradient-to-r from-transparent via-brand-glow to-transparent [animation:portal-scan-x_3.5s_ease-in-out_infinite]" />
            </>
          )}
          {/* IMAGE */}
          <div className={`relative w-full overflow-hidden ${idx === 0 ? "aspect-[3/4] sm:aspect-[16/11] lg:aspect-[16/9] xl:aspect-[16/8]" : "aspect-[3/4] sm:aspect-[16/10] lg:aspect-[16/8] xl:aspect-[21/9]"}`}>
            <img
              src={loc.image}
              alt={`${loc.city} — ${loc.landmark}`}
              loading={idx === 0 ? "eager" : "lazy"}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out"
              style={parallax}
            />
            {/* scrims */}
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/40" />
            <div
              aria-hidden
              className="absolute inset-0 opacity-40 mix-blend-overlay"
              style={{ background: `radial-gradient(500px circle at ${mx}% ${my}%, oklch(0.7 0.24 ${loc.hue} / 0.6), transparent 60%)` }}
            />

            {/* TOP META */}
            <div className="absolute inset-x-6 top-6 flex flex-wrap items-center justify-between gap-3 md:inset-x-10 md:top-10">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full border border-white/25 bg-black/40 px-3 py-1 font-mono-tight text-[10px] uppercase tracking-[0.28em] text-white backdrop-blur-md">
                  <MapPin className="h-3.5 w-3.5 text-brand-glow" /> /{loc.code}
                </span>
                <span className="hidden items-center gap-1.5 rounded-full border border-white/25 bg-black/40 px-3 py-1 font-mono-tight text-[10px] uppercase tracking-[0.28em] text-white backdrop-blur-md md:inline-flex">
                  {loc.country}
                </span>
                {idx === 0 && (
                  <>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/80 bg-brand/30 px-3 py-1 font-mono-tight text-[10px] font-bold uppercase tracking-[0.28em] text-white shadow-[0_0_25px_var(--brand)] backdrop-blur-md">
                      ★ Home Base · HQ
                    </span>
                    <span className="hidden items-center gap-1.5 rounded-full border border-white/30 bg-black/45 px-3 py-1 font-mono-tight text-[10px] uppercase tracking-[0.28em] text-brand-glow backdrop-blur-md md:inline-flex">
                      🦉 The Nest · Est. 2020
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono-tight text-[9px] uppercase tracking-[0.24em] backdrop-blur-md ${phase.chip}`}>
                  <phase.Icon className="h-3 w-3" /> {phase.label}
                </span>
                <span className="rounded-full border border-white/25 bg-black/40 px-3 py-1 font-mono-tight text-[10px] uppercase tracking-[0.24em] text-white backdrop-blur-md tabular-nums">
                  {t.hh}:{t.mm} · {loc.tzShort}
                </span>
                <span className="rounded-full border border-white/25 bg-black/40 px-3 py-1 font-mono-tight text-[10px] uppercase tracking-[0.24em] text-white backdrop-blur-md tabular-nums">
                  {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* BIG TITLE + PULL QUOTE */}
            <div className="absolute inset-x-6 bottom-6 md:inset-x-12 md:bottom-12">
              {idx === 0 && (
                <div aria-hidden className="pointer-events-none absolute -top-40 right-0 hidden h-32 w-32 md:block">
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-brand-glow/70" style={{ animation: "spin-slow 22s linear infinite" }} />
                  <div className="absolute inset-2 rounded-full border border-brand/50 bg-black/50 backdrop-blur-md" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-display text-3xl font-black leading-none tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">HQ</span>
                    <span className="mt-1 font-mono-tight text-[8px] uppercase tracking-[0.32em] text-brand-glow">Origin · 2020</span>
                  </div>
                </div>
              )}
              <div className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-brand-glow">
                {loc.role}
              </div>
              <h2
                className="mt-3 font-display font-black uppercase leading-[0.82] tracking-tighter text-white drop-shadow-[0_6px_30px_rgba(0,0,0,0.75)]"
                style={{ fontSize: "clamp(3rem, 12vw, 10rem)" }}
              >
                {loc.city}
              </h2>
              <p className="mt-4 max-w-lg font-display text-lg font-bold italic leading-tight text-white/85 drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] md:text-2xl">
                "{loc.quote}"
              </p>
            </div>

            {/* corner brackets */}
            {(["top-4 left-4", "top-4 right-4", "bottom-4 left-4", "bottom-4 right-4"] as const).map((p) => (
              <span
                key={p}
                aria-hidden
                className={`absolute ${p} h-5 w-5`}
                style={{
                  borderColor: "var(--brand-glow)",
                  borderTopWidth: p.includes("top") ? 2 : 0,
                  borderBottomWidth: p.includes("bottom") ? 2 : 0,
                  borderLeftWidth: p.includes("left") ? 2 : 0,
                  borderRightWidth: p.includes("right") ? 2 : 0,
                  opacity: 0.75,
                }}
              />
            ))}
          </div>

          {/* INFO STRIP */}
          <div className="grid grid-cols-2 gap-px border-t border-border bg-border md:grid-cols-6">
            {[
              ["Country", loc.country],
              ["Studio", loc.neighborhood],
              ["Team", `${loc.team} people`],
              ["Since", loc.since],
              ["Landmark", loc.landmark],
              ["Timezone", `${loc.tzShort} · ${t.hh}:${t.mm}`],
            ].map(([k, v]) => (
              <div key={k} className="bg-card p-4 md:p-5">
                <div className="font-mono-tight text-[9px] uppercase tracking-[0.25em] text-brand">{k}</div>
                <div className="mt-1 font-display text-sm font-bold uppercase tabular-nums">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* connector to next */}
      {idx < total - 1 && (
        <div className="mx-auto my-10 flex max-w-[100rem] items-center gap-4 px-6 md:px-10">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          <span className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <Clock className="mr-1 inline h-3 w-3 text-brand" /> next stop
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
      )}
    </section>
  );
}