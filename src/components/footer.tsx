import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-12 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <Link
          to="/"
          className="font-display text-base font-black uppercase tracking-tighter"
        >
          SAM Studios<span className="ml-0.5 align-top text-[8px]">®</span>
        </Link>
        <div className="flex gap-8 font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          <a href="#" className="transition-colors hover:text-brand">Instagram</a>
          <a href="#" className="transition-colors hover:text-brand">Vimeo</a>
          <a href="#" className="transition-colors hover:text-brand">X</a>
          <a href="#" className="transition-colors hover:text-brand">LinkedIn</a>
        </div>
        <div className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          © 2026 — All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
