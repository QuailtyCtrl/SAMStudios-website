import { useEffect, useRef, useState } from "react";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { TorontoDateTime } from "./world-clocks";
import logo from "@/assets/logo.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/workspace", label: "Workspace" },
  { to: "/contact", label: "Contact" },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [indicator, setIndicator] = useState<{ x: number; w: number; visible: boolean }>({ x: 0, w: 0, visible: false });
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // slide indicator to hovered or active link
  useEffect(() => {
    const active = links.findIndex((l) => (l.to === "/" ? pathname === "/" : pathname.startsWith(l.to)));
    const idx = hoverIdx ?? (active >= 0 ? active : null);
    if (idx == null || !trackRef.current || !linkRefs.current[idx]) {
      setIndicator((s) => ({ ...s, visible: false }));
      return;
    }
    const track = trackRef.current.getBoundingClientRect();
    const el = linkRefs.current[idx]!.getBoundingClientRect();
    setIndicator({ x: el.left - track.left, w: el.width, visible: true });
  }, [hoverIdx, pathname, scrolled]);

  const smoothHash = (hash: string) => (e: React.MouseEvent) => {
    if (router.state.location.pathname !== "/") return; // let default nav happen
    const el = document.getElementById(hash);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${hash}`);
  };

  const handleNavMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = navRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--nav-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--nav-y", `${e.clientY - rect.top}px`);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 md:pt-5">
      <nav
        ref={navRef}
        onMouseMove={handleNavMove}
        className={`group/nav relative mx-auto flex max-w-7xl items-center justify-between gap-3 overflow-hidden rounded-2xl border px-3 py-2 transition-all duration-500 sm:px-4 ${
          scrolled
            ? "border-border/80 bg-background/70 shadow-[0_10px_50px_-20px_color-mix(in_oklab,var(--brand)_45%,transparent)] backdrop-blur-2xl"
            : "border-border/30 bg-background/40 backdrop-blur-xl"
        }`}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/nav:opacity-100"
          style={{
            background:
              "radial-gradient(260px circle at var(--nav-x, 50%) var(--nav-y, 50%), color-mix(in oklab, var(--brand) 24%, transparent), transparent 65%)",
          }}
        />
        <span aria-hidden className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-brand/70 to-transparent opacity-70" />
        {/* LOGO */}
        <Link to="/" className="group relative z-10 flex items-center gap-2.5 pr-2">
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-brand to-brand-glow shadow-[0_0_24px_color-mix(in_oklab,var(--brand)_45%,transparent)] transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-[1.08] group-active:scale-95">
            <span aria-hidden className="absolute inset-0 rounded-xl bg-brand-glow opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-70" />
            <img src={logo} alt="" width={32} height={32} className="relative h-7 w-7 brightness-0 invert" />
            <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-18deg] bg-gradient-to-r from-transparent via-primary-foreground/70 to-transparent opacity-0 transition-opacity group-hover:animate-[shine-sweep_1s_cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100" />
          </span>
          <span className="hidden font-display text-[13px] font-black uppercase leading-none tracking-[0.18em] sm:inline">
            <span className="inline-block transition-transform duration-500 group-hover:-translate-y-0.5">SAM</span>
            <span className="text-brand transition-transform duration-500 group-hover:scale-125 inline-block">.</span>
            <span className="inline-block transition-transform duration-500 group-hover:translate-y-0.5">Studios</span>
            <span className="ml-0.5 align-top text-[8px] opacity-60">®</span>
          </span>
        </Link>

        {/* CENTER LINKS — animated sliding indicator */}
        <div
          ref={trackRef}
          className="relative z-10 hidden items-center gap-1 lg:flex"
          onMouseLeave={() => setHoverIdx(null)}
        >
          {/* Sliding pill indicator */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-1 rounded-full bg-gradient-to-br from-brand/25 to-brand-glow/25 ring-1 ring-brand/40 shadow-[0_0_24px_-6px_var(--brand)] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] before:absolute before:inset-0 before:rounded-full before:bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.26),transparent)] before:opacity-0 before:transition-opacity group-hover/nav:before:opacity-100"
            style={{
              transform: `translateX(${indicator.x}px)`,
              width: `${indicator.w}px`,
              opacity: indicator.visible ? 1 : 0,
            }}
          />
          {links.map((l, i) => (
            <Link
              key={l.label}
              to={l.to.startsWith("/#") ? "/" : l.to}
              hash={l.to.startsWith("/#") ? l.to.slice(2) : undefined}
              activeOptions={{ exact: l.to === "/" }}
              onClick={l.to.startsWith("/#") ? smoothHash(l.to.slice(2)) : undefined}
              onMouseEnter={() => setHoverIdx(i)}
              ref={(el) => { linkRefs.current[i] = el; }}
              className="group relative rounded-full px-4 py-2 font-display text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:text-foreground data-[status=active]:text-foreground"
            >
              <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-60" style={{ background: "color-mix(in oklab, var(--brand) 18%, transparent)" }} />
              <span className="relative z-10 flex items-center gap-1.5 transition-transform duration-500 group-hover:[transform:perspective(500px)_rotateX(10deg)]">
                <span
                  aria-hidden
                  className="h-1 w-1 rounded-full bg-brand opacity-0 shadow-[0_0_6px_var(--brand)] transition-all duration-500 group-hover:opacity-100 group-data-[status=active]:opacity-100"
                />
                <span className="relative inline-block">
                  {l.label}
                  {/* letter jiggle on hover */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-brand via-brand-glow to-transparent transition-transform duration-500 group-hover:scale-x-100"
                  />
                  <span aria-hidden className="absolute -top-1 right-0 h-1 w-1 rounded-full bg-brand opacity-0 shadow-[0_0_10px_var(--brand)] transition-all duration-500 group-hover:-translate-y-1 group-hover:opacity-100" />
                </span>
              </span>
            </Link>
          ))}
        </div>

        {/* RIGHT */}
        <div className="relative z-10 flex items-center gap-2">
          {/* ADMIN LOGIN — always visible on desktop */}
          <Link
            to="/admin/login"
            className="group relative hidden items-center gap-1.5 overflow-hidden rounded-full border border-brand/50 bg-gradient-to-br from-brand/10 to-brand-glow/10 px-3.5 py-1.5 font-mono-tight text-[10px] font-bold uppercase tracking-[0.22em] text-brand backdrop-blur-md transition-all duration-500 hover:-translate-y-0.5 hover:scale-105 hover:border-brand hover:from-brand/25 hover:to-brand-glow/25 hover:text-foreground hover:shadow-[0_0_25px_-4px_var(--brand)] lg:inline-flex"
          >
            <ShieldCheck className="h-3 w-3 transition-transform duration-500 group-hover:rotate-12" />
            Admin
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-18deg] bg-gradient-to-r from-transparent via-brand/50 to-transparent opacity-0 transition-opacity group-hover:animate-[shine-sweep_1s_cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100"
            />
          </Link>
          <TorontoDateTime className="hidden rounded-full border border-border/60 bg-card/40 px-3 py-1.5 backdrop-blur-md xl:flex" />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-card/40 backdrop-blur-md transition-all hover:scale-105 hover:border-brand/60 lg:hidden"
          >
            <span className="relative flex h-3 w-4 flex-col justify-between">
              <span className={`block h-px w-full bg-foreground transition-all duration-300 ${open ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`block h-px w-full bg-foreground transition-all duration-300 ${open ? "opacity-0" : ""}`} />
              <span className={`block h-px w-full bg-foreground transition-all duration-300 ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </nav>

      {/* MOBILE SHEET */}
      <div
        className={`mx-auto mt-2 max-w-7xl overflow-hidden rounded-2xl border border-border bg-background/85 backdrop-blur-2xl transition-all duration-500 lg:hidden ${
          open ? "max-h-[28rem] opacity-100" : "max-h-0 border-transparent opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1 p-3">
          {links.map((l, i) => (
            <Link
              key={l.label + "m"}
              to={l.to.startsWith("/#") ? "/" : l.to}
              hash={l.to.startsWith("/#") ? l.to.slice(2) : undefined}
              onClick={(e) => {
                if (l.to.startsWith("/#")) smoothHash(l.to.slice(2))(e);
                setOpen(false);
              }}
              className="flex items-center justify-between rounded-xl px-4 py-3 font-display text-sm font-bold uppercase tracking-[0.14em] transition-all hover:-translate-y-0.5 hover:bg-brand/10"
              style={{ animation: open ? `fade-up 0.35s cubic-bezier(0.16,1,0.3,1) ${i * 0.045}s both` : undefined }}
            >
              <span>{l.label}</span>
              <span className="font-mono-tight text-[10px] text-brand">/{String(i + 1).padStart(2, "0")}</span>
            </Link>
          ))}
          <Link
            to="/admin/login"
            onClick={() => setOpen(false)}
            className="mt-2 flex items-center justify-between rounded-xl border border-brand/50 bg-brand/10 px-4 py-3 font-display text-sm font-bold uppercase tracking-[0.14em] text-brand"
          >
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Admin Login</span>
            <span className="font-mono-tight text-[10px]">/ADM</span>
          </Link>
          <div className="mt-2 border-t border-border pt-3">
            <TorontoDateTime />
          </div>
        </div>
      </div>
    </header>
  );
}
