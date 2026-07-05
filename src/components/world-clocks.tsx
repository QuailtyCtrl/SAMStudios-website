import { useEffect, useState } from "react";

export type CityInfo = {
  city: string;
  tz: string;
  code: string;
  landmark: string;
  image: string;
  emoji: string;
  blurb: string;
};

export const CITIES: readonly CityInfo[] = [
  {
    city: "New York",
    tz: "America/New_York",
    code: "NYC",
    landmark: "Statue of Liberty",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1000&q=80",
    emoji: "🗽",
    blurb: "Brand systems and film for downtown startups and Madison Ave incumbents.",
  },
  {
    city: "Toronto",
    tz: "America/Toronto",
    code: "YYZ",
    landmark: "CN Tower",
    image: "https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=1000&q=80",
    emoji: "🍁",
    blurb: "Home base. Studio HQ. Where the coffee is strong and the deadlines are stronger.",
  },
  {
    city: "London",
    tz: "Europe/London",
    code: "LON",
    landmark: "Big Ben",
    image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=1000&q=80",
    emoji: "🎡",
    blurb: "Editorial and luxury clients across Shoreditch, Mayfair, and everywhere between.",
  },
  {
    city: "Paris",
    tz: "Europe/Paris",
    code: "PAR",
    landmark: "Eiffel Tower",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1000&q=80",
    emoji: "🗼",
    blurb: "Fashion, fragrance, and hospitality — art direction with a little joie de vivre.",
  },
  {
    city: "Moscow",
    tz: "Europe/Moscow",
    code: "MOW",
    landmark: "St. Basil's Cathedral",
    image: "https://images.unsplash.com/photo-1513326738677-b964603b136d?w=1000&q=80",
    emoji: "🏛️",
    blurb: "Type systems, editorial, and cultural work with Eastern European partners.",
  },
  {
    city: "Mumbai",
    tz: "Asia/Kolkata",
    code: "BOM",
    landmark: "Gateway of India",
    image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1000&q=80",
    emoji: "🕌",
    blurb: "Fast-moving consumer brands, film production, and D2C launches.",
  },
  {
    city: "Tokyo",
    tz: "Asia/Tokyo",
    code: "TYO",
    landmark: "Tokyo Tower",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1000&q=80",
    emoji: "🗾",
    blurb: "Product design, apparel drops, and packaging with obsessive craft.",
  },
];

function fmtTime(tz: string, now: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: tz,
  }).format(now);
}

function fmtDate(tz: string, now: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    timeZone: tz,
  }).format(now);
}

function getHour(tz: string, now: Date) {
  return parseInt(
    new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hour12: false, timeZone: tz }).format(now),
    10,
  );
}

export function WorldClocks({ onCityClick }: { onCityClick?: (c: CityInfo) => void }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {CITIES.map((c, i) => {
        const h = now ? getHour(c.tz, now) : 12;
        const isDay = h >= 6 && h < 19;
        return (
          <button
            key={c.code}
            type="button"
            onClick={() => onCityClick?.(c)}
            className="group relative flex flex-col items-stretch overflow-hidden rounded-2xl border border-border bg-card/60 text-left backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-brand/70 hover:shadow-[0_25px_60px_-20px_var(--brand)]"
            style={{ animation: `fade-up 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.05}s both` }}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <img
                src={c.image}
                alt={c.landmark}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
              <span className="absolute right-2 top-2 rounded-full bg-background/70 px-2 py-0.5 font-mono-tight text-[9px] uppercase tracking-[0.25em] text-brand backdrop-blur">
                {c.code}
              </span>
              <span className="absolute left-2 top-2 text-lg drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">{c.emoji}</span>
              <span
                className={`absolute right-2 bottom-2 h-1.5 w-1.5 rounded-full ${isDay ? "bg-amber-400" : "bg-indigo-400"} shadow-[0_0_10px_currentColor]`}
                aria-hidden
              />
            </div>
            <div className="space-y-1 p-3">
              <div className="font-display text-lg font-black tabular-nums leading-none tracking-tight md:text-xl">
                {now ? fmtTime(c.tz, now) : "--:--:--"}
              </div>
              <div className="font-mono-tight text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {c.city}
              </div>
            </div>
            <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-brand to-brand-glow transition-transform duration-500 group-hover:scale-x-100" />
          </button>
        );
      })}
    </div>
  );
}

export function TorontoDateTime({ className = "" }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div
      suppressHydrationWarning
      className={`flex items-center gap-2 font-mono-tight text-[10px] uppercase tracking-[0.22em] text-muted-foreground ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
      </span>
      <span suppressHydrationWarning className="tabular-nums">
        {now ? fmtDate("America/Toronto", now) : "———"}
      </span>
      <span className="text-border">·</span>
      <span suppressHydrationWarning className="tabular-nums text-foreground/80">
        {now ? fmtTime("America/Toronto", now) : "--:--:--"}
      </span>
      <span className="text-brand">YYZ</span>
    </div>
  );
}