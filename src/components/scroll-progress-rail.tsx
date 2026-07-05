import { useEffect, useMemo, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

type RailItem = {
  id: string;
  label: string;
};

function labelFor(section: HTMLElement, index: number) {
  const explicit = section.getAttribute("aria-label") || section.dataset.railLabel;
  const heading = section.querySelector("h1,h2,h3")?.textContent;
  return (explicit || heading || `Section ${index + 1}`).replace(/\s+/g, " ").trim().slice(0, 32);
}

export function ScrollProgressRail() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [items, setItems] = useState<RailItem[]>([]);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let sections: HTMLElement[] = [];
    let observer: IntersectionObserver | null = null;

    const scan = () => {
      sections = Array.from(document.querySelectorAll<HTMLElement>("main section"));
      sections.forEach((section, i) => {
        if (!section.id) section.id = `page-section-${i + 1}`;
      });
      setItems(sections.map((section, i) => ({ id: section.id, label: labelFor(section, i) })));
      setActive(0);

      observer?.disconnect();
      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (!visible) return;
          const idx = sections.indexOf(visible.target as HTMLElement);
          if (idx >= 0) setActive(idx);
        },
        { rootMargin: "-30% 0px -55% 0px", threshold: [0.12, 0.35, 0.6] },
      );
      sections.forEach((section) => observer?.observe(section));
    };

    const raf = requestAnimationFrame(scan);
    const retry = window.setTimeout(scan, 450);
    const retryMid = window.setTimeout(scan, 800);
    const retryLate = window.setTimeout(scan, 1200);

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(retry);
      window.clearTimeout(retryMid);
      window.clearTimeout(retryLate);
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  const visibleItems = useMemo(() => items.slice(0, 10), [items]);

  if (visibleItems.length < 1) return null;

  return (
    <aside className="pointer-events-none fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 md:block" aria-label="Page progress">
      <div className="pointer-events-auto relative flex flex-col items-center gap-3 rounded-full border border-border bg-background/65 px-2 py-3 shadow-[0_20px_70px_-35px_var(--brand)] backdrop-blur-2xl">
        <span aria-hidden className="absolute bottom-3 top-3 left-1/2 w-px -translate-x-1/2 bg-border/70" />
        <span
          aria-hidden
          className="absolute left-1/2 top-3 w-px -translate-x-1/2 bg-brand shadow-[0_0_12px_var(--brand)] transition-[height] duration-300"
          style={{ height: `calc((100% - 1.5rem) * ${progress})` }}
        />
        {visibleItems.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className={`group relative z-10 flex items-center justify-center transition-all ${
              active === i
                ? "h-7 w-2 rounded-full bg-brand shadow-[0_0_14px_var(--brand)]"
                : "h-2.5 w-2.5 rounded-full border border-border bg-background hover:border-brand/70 hover:bg-brand/50"
            }`}
            aria-label={item.label}
          >
            <span className="absolute left-6 whitespace-nowrap rounded-md border border-border bg-background/95 px-2 py-1 font-mono-tight text-[9px] uppercase tracking-[0.2em] text-foreground opacity-0 shadow-xl backdrop-blur transition-opacity group-hover:opacity-100">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}