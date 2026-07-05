import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, KeyRound, Lock, User } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — SAM Studios®" },
      { name: "description", content: "Studio administrator access." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // UI-only stub — no backend yet
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-6 pt-32 pb-20 md:pt-40">
        <section className="w-full" style={{ animation: "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both" }} data-rail-label="Admin Login">
          <div className="mb-8 border-y border-border py-6">
            <div className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-brand">/admin_access</div>
            <h1 className="mt-3 font-display text-4xl font-black uppercase leading-none tracking-tight">Admin Login</h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Backend-ready sign-in shell for future studio management tools.
            </p>
          </div>

          <form onSubmit={submit} className="grid gap-4">
            <label className="block space-y-2">
              <span className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-brand">Email</span>
              <div className="flex items-center gap-3 border-b border-border px-1 focus-within:border-brand">
                <User className="h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@samstudios.com"
                  className="w-full bg-transparent py-4 font-display text-base outline-none"
                />
              </div>
            </label>
            <label className="block space-y-2">
              <span className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-brand">Password</span>
              <div className="flex items-center gap-3 border-b border-border px-1 focus-within:border-brand">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full bg-transparent py-4 font-display text-base tracking-widest outline-none"
                />
              </div>
            </label>
            <label className="block space-y-2">
              <span className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-brand">2FA Code</span>
              <div className="flex items-center gap-3 border-b border-border px-1 focus-within:border-brand">
                <KeyRound className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="6-digit code"
                  className="w-full bg-transparent py-4 font-display text-base tabular-nums tracking-[0.4em] outline-none"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={busy}
              className="group mt-4 inline-flex w-full items-center justify-center gap-3 rounded-full bg-brand px-7 py-4 font-display text-xs font-bold uppercase tracking-widest text-primary-foreground transition-all hover:shadow-[0_0_30px_var(--brand)] disabled:opacity-70"
            >
              {busy ? "Verifying…" : "Sign in to console"}
              {busy ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
              ) : (
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              )}
            </button>
          </form>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span>Login UI only · backend integration pending</span>
            <Link to="/" className="text-brand transition-colors hover:text-foreground">← Back to site</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}