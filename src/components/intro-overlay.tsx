import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import logo from "@/assets/logo.png";

const STAGES = [
  "Preparing studio",
  "Loading assets",
  "Composing interface",
  "Ready",
];

export function IntroOverlay() {
  const [visible, setVisible] = useState(true);
  const [closing, setClosing] = useState(false);
  const [complete, setComplete] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 2000;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setPct(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setComplete(true);
        // hold check mark, then slide up
        window.setTimeout(() => setClosing(true), 750);
        window.setTimeout(() => setVisible(false), 750 + 780);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!visible) return null;

  const skip = () => {
    setComplete(true);
    window.setTimeout(() => setClosing(true), 220);
    window.setTimeout(() => setVisible(false), 220 + 780);
  };

  const stage = STAGES[Math.min(STAGES.length - 1, Math.floor((pct / 100) * STAGES.length))];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-background text-foreground"
      style={{
        animation: closing
          ? "slide-up-out 0.75s cubic-bezier(0.7,0,0.3,1) forwards"
          : undefined,
        pointerEvents: closing ? "none" : "auto",
      }}
    >
      {/* subtle radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[100px]"
        style={{ background: "radial-gradient(circle, var(--brand), transparent 65%)" }}
      />

      <button
        type="button"
        onClick={skip}
        className="group absolute right-6 top-6 z-10 flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-2 font-mono-tight text-[10px] uppercase tracking-[0.28em] text-muted-foreground backdrop-blur transition-all hover:border-brand hover:text-foreground"
      >
        Skip
        <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
      </button>

      <div className="absolute left-6 top-6 z-10 font-mono-tight text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
        SAM Studios<span className="align-top text-[7px] opacity-60">®</span>
      </div>

      <div className="relative flex w-[min(92vw,36rem)] flex-col items-center gap-10">
        <div
          className="flex items-center gap-3"
          style={{ animation: "scale-in 0.7s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-glow shadow-[0_0_40px_color-mix(in_oklab,var(--brand)_45%,transparent)]">
            <img src={logo} alt="" className="h-7 w-7 brightness-0 invert" />
          </span>
          <span className="font-display text-lg font-black uppercase tracking-[0.16em] md:text-xl">
            SAM<span className="text-brand">.</span>Studios
            <span className="ml-1 align-top text-[8px] opacity-50">®</span>
          </span>
        </div>

        {/* Chunky vertical-bar equalizer — high-end progress */}
        <div className="w-full space-y-5">
          <div className="relative flex h-24 w-full items-end justify-between gap-[2px] overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-3 backdrop-blur-xl md:h-28">
            {Array.from({ length: 40 }).map((_, i) => {
              const threshold = ((i + 1) / 40) * 100;
              const filled = pct >= threshold;
              const active = !filled && pct >= (i / 40) * 100;
              // Deterministic "waveform" height variation
              const base = 30 + Math.abs(Math.sin(i * 0.55) * 55) + (i % 5) * 4;
              const h = Math.min(100, base);
              return (
                <span
                  key={i}
                  className={`relative flex-1 rounded-[3px] transition-all duration-300 ease-out ${
                    filled
                      ? "bg-gradient-to-t from-brand via-brand to-brand-glow shadow-[0_0_14px_var(--brand)]"
                      : active
                        ? "bg-brand/60"
                        : "bg-border/50"
                  }`}
                  style={{
                    height: `${filled ? h : Math.max(14, h * 0.35)}%`,
                    transform: active ? "scaleY(1.08)" : "scaleY(1)",
                    transitionDelay: `${i * 6}ms`,
                  }}
                >
                  {filled && (
                    <span className="absolute inset-x-0 top-0 h-1 rounded-t-[3px] bg-primary-foreground/70" />
                  )}
                </span>
              );
            })}
            {/* Sweeping light */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-primary-foreground/25 to-transparent blur-md"
              style={{ left: `calc(${pct}% - 3rem)`, transition: "left 120ms ease-out" }}
            />
            {/* grid overlay */}
            <span aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,transparent_calc(25%-1px),color-mix(in_oklab,var(--brand)_18%,transparent)_calc(25%),transparent_calc(25%+1px)),linear-gradient(to_right,transparent_calc(50%-1px),color-mix(in_oklab,var(--brand)_18%,transparent)_calc(50%),transparent_calc(50%+1px)),linear-gradient(to_right,transparent_calc(75%-1px),color-mix(in_oklab,var(--brand)_18%,transparent)_calc(75%),transparent_calc(75%+1px))]" />
          </div>

          {/* Meta row: stage + percentage + segment count */}
          <div className="flex items-center justify-between font-mono-tight text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            <span key={stage} className="flex items-center gap-2" style={{ animation: "fade-up 0.3s cubic-bezier(0.16,1,0.3,1) both" }}>
              {complete ? (
                <>
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_theme(colors.emerald.400)]" />
                  <span className="text-emerald-400">Ready · authenticated</span>
                </>
              ) : (
                <>
                  <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-brand shadow-[0_0_8px_var(--brand)]" />
                  {stage}
                </>
              )}
            </span>
            <div className="flex items-center gap-3">
              {complete && (
                <span
                  className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-[0_0_28px_theme(colors.emerald.400)]"
                  style={{ animation: "check-pop 520ms cubic-bezier(0.34,1.56,0.64,1) both" }}
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full ring-2 ring-emerald-300/60"
                    style={{ animation: "glow-pulse 1.2s ease-out both" }}
                  />
                  <Check className="h-5 w-5" strokeWidth={3} />
                </span>
              )}
              <span className="font-display text-2xl font-black tabular-nums text-foreground md:text-3xl">
                {pct.toString().padStart(3, "0")}<span className="text-muted-foreground">%</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 font-mono-tight text-[10px] uppercase tracking-[0.28em] text-muted-foreground/70">
        Est. 2024
      </div>
    </div>
  );
}