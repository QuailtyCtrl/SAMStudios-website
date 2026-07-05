import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  Delete,
  Download,
  FileText,
  FolderLock,
  LockKeyhole,
  MessageSquare,
  Send,
  Sparkles,
  User,
  ShieldCheck,
  KeyRound,
  X,
  AlertTriangle,
} from "lucide-react";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { StatusPill } from "@/components/status-pill";

export const Route = createFileRoute("/workspace")({
  head: () => ({
    meta: [
      { title: "Workspace — SAM Studios®" },
      {
        name: "description",
        content:
          "SAM Studios® client workspace — secure access to project files, timelines, and updates.",
      },
      { property: "og:title", content: "Workspace — SAM Studios®" },
      { property: "og:description", content: "Secure SAM Studios® client workspace." },
    ],
  }),
  component: ClientPortal,
});

const files = [
  { name: "Brand System v2", type: "PDF", size: "18.4 MB", status: "Approved" },
  { name: "Launch Cut 01", type: "MP4", size: "420 MB", status: "Review" },
  { name: "Source Assets", type: "ZIP", size: "1.2 GB", status: "Ready" },
  { name: "Invoice + Scope", type: "PDF", size: "2.1 MB", status: "Signed" },
];

const timeline = [
  { phase: "Discovery", progress: 100 },
  { phase: "Design System", progress: 92 },
  { phase: "Production", progress: 64 },
  { phase: "Delivery", progress: 24 },
];

const tabs = ["Overview", "Files", "Timeline", "Messages"] as const;

const EMAIL_DOMAINS = ["@gmail.com", "@outlook.com", "@yahoo.com", "@icloud.com", "@hotmail.com"] as const;
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "back"] as const;
const CODE_LEN = 4;
// Correct Project ID for the 2-step verification (UI demo).
const VALID_PROJECT_ID = "AA-00";

function ClientPortal() {
  const [unlocked, setUnlocked] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [keypadOpen, setKeypadOpen] = useState(false);
  const [step2Open, setStep2Open] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [step2Error, setStep2Error] = useState<string | null>(null);
  const [step2Verified, setStep2Verified] = useState(false);
  const canPreview = useMemo(() => /.+@.+\..+/.test(email) && code.length === CODE_LEN, [email, code]);

  const pressKey = (k: (typeof KEYS)[number]) => {
    if (k === "back") setCode((c) => c.slice(0, -1));
    else if (k === "clear") setCode("");
    else if (code.length < CODE_LEN) setCode((c) => (c + k).slice(0, CODE_LEN));
  };

  // Keyboard support: digits, backspace, escape (only when keypad is open / not unlocked)
  useEffect(() => {
    if (unlocked || step2Open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        setCode((c) => (c.length < CODE_LEN ? (c + e.key).slice(0, CODE_LEN) : c));
      } else if (e.key === "Backspace") {
        setCode((c) => c.slice(0, -1));
      } else if (e.key === "Escape") {
        setCode("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [unlocked, step2Open]);

  const appendDomain = (d: (typeof EMAIL_DOMAINS)[number]) => {
    setEmail((e) => {
      const at = e.indexOf("@");
      const local = at >= 0 ? e.slice(0, at) : e;
      return (local || "you") + d;
    });
  };

  const openPortal = () => {
    if (!canPreview || authenticating) return;
    // Open 2-step verification dialog.
    setProjectId("");
    setStep2Error(null);
    setStep2Open(true);
  };

  const verifyProjectId = () => {
    const entered = `${projectId.slice(0, 2)}-${projectId.slice(2)}`;
    if (entered !== VALID_PROJECT_ID) {
      setStep2Error("Incorrect Project ID. Please try again.");
      return;
    }
    setStep2Error(null);
    setStep2Verified(true);
    window.setTimeout(() => {
      setStep2Open(false);
      setStep2Verified(false);
      setAuthenticating(true);
      window.setTimeout(() => {
        setUnlocked(true);
        setAuthenticating(false);
      }, 1400);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="relative mx-auto max-w-7xl px-6 pt-32 pb-20 md:px-10 md:pt-40">
        <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-32 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-brand/20 blur-[150px]" />
          <div className="absolute right-0 bottom-0 h-[26rem] w-[26rem] rounded-full bg-brand-glow/15 blur-[130px]" />
        </div>

        <section className="relative grid gap-6 lg:grid-cols-12">
          <div
            className="lg:col-span-7"
            style={{ animation: "fade-up 0.8s cubic-bezier(0.16,1,0.3,1) both" }}
          >
            <div className="mb-5 flex items-center gap-3">
              <StatusPill status={unlocked ? "active" : "idle"} />
              <span className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                /client_access
              </span>
            </div>
            <h1 className="font-display text-5xl leading-[0.9] font-black tracking-normal uppercase md:text-7xl">
              CLIENT <span className="bg-gradient-to-r from-brand to-brand-glow bg-clip-text text-transparent">PORTAL</span>.
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-muted-foreground md:text-lg">
              Secure project rooms for files, milestones, approvals, and the details clients need in one place.
            </p>
          </div>

          <div
            className="lg:col-span-5"
            style={{ animation: "fade-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both" }}
          >
            {!unlocked ? (
              <div className="grain relative overflow-hidden rounded-3xl border border-border bg-card/70 p-6 backdrop-blur-xl md:p-8">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_12%,color-mix(in_oklab,var(--brand)_28%,transparent),transparent_34%)]" />
                <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-brand to-transparent [animation:portal-scan-x_2.8s_ease-in-out_infinite]" />
                <div className="relative mb-6 flex items-center justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand shadow-[inset_0_0_24px_color-mix(in_oklab,var(--brand)_16%,transparent)]">
                    <LockKeyhole className="h-5 w-5" />
                  </div>
                  <div className="rounded-full border border-border bg-background/45 px-3 py-1 font-mono-tight text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
                    Backend-ready UI
                  </div>
                </div>
                <div className="relative space-y-4">
                  <label className="block space-y-2">
                    <span className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-brand">Email</span>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="client@company.com"
                      className="w-full rounded-2xl border border-border bg-background/60 px-5 py-4 font-display text-base outline-none transition-all focus:border-brand focus:ring-4 focus:ring-brand/20"
                    />
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {EMAIL_DOMAINS.map((d, i) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => appendDomain(d)}
                          className="group/dom rounded-full border border-border bg-background/40 px-2.5 py-1 font-mono-tight text-[10px] tracking-[0.05em] text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-brand/60 hover:bg-brand/10 hover:text-foreground"
                          style={{ animation: `fade-up 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.04}s both` }}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-brand">Access Code</span>
                      <button
                        type="button"
                        onClick={() => setKeypadOpen((v) => !v)}
                        className="font-mono-tight text-[9px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {keypadOpen ? "Hide keypad" : "Show keypad"}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setKeypadOpen(true)}
                      className="grid w-full grid-cols-4 gap-2"
                      aria-label="Open access code keypad"
                    >
                      {Array.from({ length: CODE_LEN }).map((_, i) => {
                        const v = code[i];
                        const active = code.length === i;
                        return (
                          <span
                            key={i}
                            className={`relative flex h-16 items-center justify-center rounded-2xl border bg-background/60 font-display text-2xl font-black tabular-nums transition-all duration-300 ${
                              v
                                ? "border-brand text-foreground shadow-[0_0_25px_color-mix(in_oklab,var(--brand)_35%,transparent)]"
                                : active && keypadOpen
                                  ? "border-brand/60 text-muted-foreground"
                                  : "border-border text-muted-foreground/50"
                            }`}
                          >
                            <span
                              key={v || "_"}
                              style={{ animation: v ? "modal-rise 220ms cubic-bezier(0.16,1,0.3,1) both" : undefined }}
                            >
                              {v ?? "_"}
                            </span>
                            {active && keypadOpen && !v && (
                              <span className="absolute bottom-3 h-0.5 w-5 animate-pulse rounded-full bg-brand" />
                            )}
                          </span>
                        );
                      })}
                    </button>
                    <div
                      className={`grid origin-top overflow-hidden transition-all duration-400 ease-out ${
                        keypadOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="rounded-2xl border border-border bg-background/45 p-3 backdrop-blur-md">
                        <div className="grid grid-cols-3 gap-2">
                          {KEYS.map((k, i) => {
                            const isAction = k === "back" || k === "clear";
                            return (
                              <button
                                key={k}
                                type="button"
                                onClick={() => pressKey(k)}
                                aria-label={k === "back" ? "Delete last digit" : k === "clear" ? "Clear code" : `Digit ${k}`}
                                className={`group/key relative flex h-14 items-center justify-center overflow-hidden rounded-xl border font-display text-lg font-bold transition-all duration-200 active:scale-95 ${
                                  isAction
                                    ? "border-border bg-card/40 text-muted-foreground hover:border-brand/50 hover:text-foreground"
                                    : "border-border bg-card/60 hover:-translate-y-0.5 hover:border-brand hover:bg-brand/10 hover:text-foreground hover:shadow-[0_10px_30px_-15px_var(--brand)]"
                                }`}
                                style={{ animation: keypadOpen ? `fade-up 0.35s cubic-bezier(0.16,1,0.3,1) ${i * 0.025}s both` : undefined }}
                              >
                                {k === "back" ? (
                                  <Delete className="h-4 w-4" />
                                ) : k === "clear" ? (
                                  <span className="font-mono-tight text-[9px] uppercase tracking-[0.2em]">CLR</span>
                                ) : (
                                  <span className="tabular-nums">{k}</span>
                                )}
                                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-brand/25 to-transparent transition-transform duration-500 group-hover/key:translate-x-full" />
                              </button>
                            );
                          })}
                        </div>
                        <p className="mt-3 text-center font-mono-tight text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
                          {code.length}/{CODE_LEN} entered
                        </p>
                      </div>
                    </div>
                  </div>
                  {authenticating && <AccessLoader />}
                  <button
                    type="button"
                    disabled={!canPreview || authenticating}
                    onClick={openPortal}
                    className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-brand px-7 py-4 font-display text-xs font-bold tracking-widest text-primary-foreground uppercase transition-all hover:shadow-[0_0_40px_var(--brand)] disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
                  >
                    {authenticating ? "Authenticating access" : "Open Portal Preview"}
                    {authenticating ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    )}
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary-foreground/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  </button>
                </div>
              </div>
            ) : (
              <ProjectPulse />
            )}
          </div>
        </section>

        {unlocked && (
          <section
            className="relative mt-12 grid gap-6 lg:grid-cols-12"
            style={{ animation: "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both" }}
          >
            <aside className="lg:col-span-3">
              <div className="sticky top-32 rounded-3xl border border-border bg-card/50 p-3 backdrop-blur-xl">
                {tabs.map((item) => (
                  <button
                    key={item}
                    onClick={() => setTab(item)}
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left font-display text-sm font-bold uppercase transition-all ${
                      tab === item
                        ? "bg-brand text-primary-foreground shadow-[0_0_24px_var(--brand)]"
                        : "text-muted-foreground hover:bg-brand/10 hover:text-foreground"
                    }`}
                  >
                    {item}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                ))}
              </div>
            </aside>

            <div className="lg:col-span-9">
              <PortalPanel key={tab} tab={tab} setTab={setTab} />
            </div>
          </section>
        )}

        {!unlocked && (
          <section className="relative mt-12 grid gap-4 md:grid-cols-3">
            {[
              { icon: FolderLock, title: "Project Rooms", copy: "Each client gets a focused room for active work." },
              { icon: FileText, title: "File Library", copy: "Contracts, assets, cuts, decks, and deliveries." },
              { icon: MessageSquare, title: "Approvals", copy: "Fast review loops for milestones and notes." },
            ].map((card, i) => (
              <div
                key={card.title}
                className="group rounded-3xl border border-border bg-card/40 p-6 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-brand/60"
                style={{ animation: `fade-up 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s both` }}
              >
                <card.icon className="mb-8 h-6 w-6 text-brand" />
                <h2 className="font-display text-xl font-black tracking-normal uppercase">{card.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.copy}</p>
              </div>
            ))}
          </section>
        )}
      </main>
      <Footer />
      {step2Open && (
        <Step2Dialog
          value={projectId}
          setValue={setProjectId}
          error={step2Error}
          verified={step2Verified}
          onClose={() => setStep2Open(false)}
          onSubmit={verifyProjectId}
        />
      )}
    </div>
  );
}

function normalizeProjectIdInput(input: string) {
  const chars = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  let next = "";
  for (const ch of chars) {
    if (next.length < 2) {
      if (/[A-Z]/.test(ch)) next += ch;
    } else if (next.length < 4 && /\d/.test(ch)) {
      next += ch;
    }
  }
  return next.slice(0, 4);
}

function Step2Dialog({
  value,
  setValue,
  error,
  verified,
  onClose,
  onSubmit,
}: {
  value: string;
  setValue: (v: string) => void;
  error: string | null;
  verified: boolean;
  onClose: () => void;
  onSubmit: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") onSubmit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onSubmit]);

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="step2-title"
    >
      {/* backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-background/70 backdrop-blur-md"
        style={{ animation: "fade-in 0.3s ease-out both" }}
      />
      {/* card */}
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-brand/50 bg-card/95 p-6 backdrop-blur-2xl shadow-[0_40px_120px_-30px_var(--brand)] md:p-8"
        style={{ animation: "modal-rise 0.35s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-brand to-transparent [animation:portal-scan-x_2.4s_ease-in-out_infinite]" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/60 text-muted-foreground transition-all hover:border-brand/60 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/15 text-brand shadow-[inset_0_0_20px_color-mix(in_oklab,var(--brand)_18%,transparent)]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-brand">Step 2 of 2 · Verification</div>
            <h2 id="step2-title" className="mt-1 font-display text-xl font-black uppercase tracking-tight">
              Enter Project ID
            </h2>
          </div>
        </div>

        <p className="relative mt-4 text-sm text-muted-foreground">
          For your security, confirm the Project ID your studio contact shared with you. Format: <span className="font-mono-tight text-brand">AA-00</span>.
        </p>

        <label className="relative mt-5 block space-y-2">
          <span className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-brand">Project ID</span>
          <div className="relative rounded-2xl border border-border bg-background/60 px-4 py-4 focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/20">
            <input
              autoFocus
              value={value}
              onChange={(e) => setValue(normalizeProjectIdInput(e.target.value))}
              onKeyDown={(e) => {
                if (["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Enter", "Escape"].includes(e.key)) return;
                if (value.length < 2 && !/^[a-zA-Z]$/.test(e.key)) e.preventDefault();
                if (value.length >= 2 && value.length < 4 && !/^\d$/.test(e.key)) e.preventDefault();
                if (value.length >= 4) e.preventDefault();
              }}
              inputMode={value.length < 2 ? "text" : "numeric"}
              aria-label="Project ID"
              className="absolute inset-0 h-full w-full cursor-text bg-transparent text-transparent caret-transparent outline-none"
            />
            <div className="pointer-events-none flex items-center gap-3">
              <KeyRound className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span key={i} className="flex h-12 w-10 items-center justify-center rounded-xl border border-border bg-card/50 font-display text-lg font-black uppercase tabular-nums tracking-normal text-foreground">
                    {value[i] ?? "_"}
                  </span>
                )).slice(0, 2)}
                <span className="px-1 font-display text-xl font-black text-brand">-</span>
                {Array.from({ length: 4 }).map((_, i) => (
                  <span key={i} className="flex h-12 w-10 items-center justify-center rounded-xl border border-border bg-card/50 font-display text-lg font-black uppercase tabular-nums tracking-normal text-foreground">
                    {value[i] ?? "_"}
                  </span>
                )).slice(2)}
              </div>
            </div>
          </div>
        </label>

        {error && (
          <div
            className="relative mt-3 flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 font-mono-tight text-[10px] uppercase tracking-[0.22em] text-destructive"
            style={{ animation: "fade-up 0.25s cubic-bezier(0.16,1,0.3,1) both" }}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            {error}
          </div>
        )}

        {verified && (
          <div
            className="relative mt-3 flex items-center gap-2 rounded-xl border border-brand/50 bg-brand/10 px-3 py-2 font-mono-tight text-[10px] uppercase tracking-[0.24em] text-brand"
            style={{ animation: "fade-up 0.25s cubic-bezier(0.16,1,0.3,1) both" }}
          >
            <CheckCircle2 className="h-4 w-4" />
            Verified · unlocking portal
          </div>
        )}

        <div className="relative mt-5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onSubmit}
            disabled={value.length !== 4}
            className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 font-display text-xs font-bold uppercase tracking-widest text-primary-foreground transition-all hover:shadow-[0_0_30px_var(--brand)] disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
          >
            Verify & Continue <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full border border-border bg-background/50 px-4 py-3 font-mono-tight text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-all hover:border-brand/60 hover:text-foreground"
          >
            Cancel
          </button>
        </div>

        <div className="relative mt-4 font-mono-tight text-[9px] uppercase tracking-[0.22em] text-muted-foreground/70">
          Demo hint · use <span className="text-brand">{VALID_PROJECT_ID}</span>
        </div>
      </div>
    </div>
  );
}

function AccessLoader() {
  return (
    <div
      className="rounded-2xl border border-brand/30 bg-brand/8 p-4"
      style={{ animation: "fade-up 0.35s cubic-bezier(0.16,1,0.3,1) both" }}
    >
      <div className="mb-3 flex items-center justify-between font-mono-tight text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
        <span>Verifying room</span>
        <span className="text-brand">encrypting</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full border border-border bg-background/55 p-0.5">
        <div className="h-full rounded-full bg-gradient-to-r from-brand to-brand-glow shadow-[0_0_18px_var(--brand)] [animation:intro-progress_1.55s_ease-in-out_forwards]" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {["files", "timeline", "messages"].map((label, i) => (
          <div key={label} className="rounded-xl border border-border bg-background/35 p-2 text-center font-mono-tight text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="mb-1 block h-1 rounded-full bg-brand" style={{ animation: `data-blink 0.9s ease-in-out ${i * 0.12}s infinite` }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectPulse() {
  const totalPhases = timeline.length;
  const overall = Math.round(timeline.reduce((s, t) => s + t.progress, 0) / totalPhases);
  const activeIdx = timeline.findIndex((t) => t.progress < 100);
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl md:p-8">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/25 blur-3xl" style={{ animation: "float 9s ease-in-out infinite" }} />
      <div className="relative mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono-tight text-[10px] uppercase tracking-[0.28em] text-brand">Live · Project Pipeline</div>
          <h2 className="mt-2 font-display text-2xl font-black uppercase tracking-tight">Aether Launch</h2>
          <div className="mt-1 font-mono-tight text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Phase {activeIdx + 1} of {totalPhases} · {timeline[Math.max(0, activeIdx)].phase}</div>
        </div>
        <div className="text-right">
          <div className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Overall</div>
          <div className="font-display text-4xl font-black tabular-nums text-brand">
            {overall}<span className="text-lg text-muted-foreground">%</span>
          </div>
        </div>
      </div>

      {/* Pipeline segmented bar */}
      <div className="relative">
        <div className="grid grid-cols-4 gap-1.5">
          {timeline.map((t, i) => {
            const isDone = t.progress === 100;
            const isActive = i === activeIdx;
            return (
              <div key={t.phase} className="space-y-2">
                <div className="relative h-3 overflow-hidden rounded-full border border-border bg-background/60">
                  <div
                    className={`h-full rounded-full ${isDone ? "bg-gradient-to-r from-brand to-brand-glow" : isActive ? "bg-gradient-to-r from-brand to-brand-glow shadow-[0_0_18px_var(--brand)]" : "bg-brand/40"}`}
                    style={{ width: `${t.progress}%`, animation: "fade-in 0.8s ease-out both" }}
                  />
                  {isActive && (
                    <span className="absolute inset-y-0 right-0 w-px bg-brand-glow shadow-[0_0_10px_var(--brand-glow)]" />
                  )}
                </div>
                <div className="flex items-center justify-between font-mono-tight text-[9px] uppercase tracking-[0.22em]">
                  <span className={isActive ? "text-brand" : "text-muted-foreground"}>{String(i + 1).padStart(2, "0")} · {t.phase}</span>
                  <span className={`tabular-nums ${isDone ? "text-brand" : isActive ? "text-foreground" : "text-muted-foreground/70"}`}>{t.progress}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today snapshot */}
      <div className="mt-6 grid grid-cols-3 gap-2">
        {[
          { k: "Team on it", v: "6", sub: "designers + film" },
          { k: "Hours logged", v: "128", sub: "this sprint" },
          { k: "Deliverables", v: "12", sub: "8 done · 4 open" },
        ].map((s, i) => (
          <div
            key={s.k}
            className="rounded-2xl border border-border bg-background/45 p-3"
            style={{ animation: `fade-up 0.45s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s both` }}
          >
            <div className="font-mono-tight text-[9px] uppercase tracking-[0.22em] text-brand">{s.k}</div>
            <div className="mt-1 font-display text-xl font-black tabular-nums">{s.v}</div>
            <div className="font-mono-tight text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const OVERVIEW_STATS = [
  { label: "Current Phase", value: "Production", detailLabel: "Phase progress", detail: "64% complete", icon: Sparkles },
  { label: "Next Delivery", value: "Fri · 4:00 PM", detailLabel: "What's due", detail: "Launch film · Cut 02 review", icon: Clock },
  { label: "Open Approvals", value: "02", detailLabel: "Your action", detail: "Awaiting your sign-off", icon: Bell },
  { label: "Project Health", value: "On Track", detailLabel: "Blockers", detail: "None reported", icon: CheckCircle2 },
] as const;

function OverviewPanel({ setTab }: { setTab: (t: (typeof tabs)[number]) => void }) {
  const [approved, setApproved] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);
  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };
  const statActions: Array<() => void> = [
    () => setTab("Timeline"),
    () => setTab("Files"),
    () => setTab("Messages"),
    () => flash("Health report exported."),
  ];
  const approvals = [
    { id: "APR-14", title: "Launch Film · Cut 02", due: "Fri 4:00 PM" },
    { id: "APR-15", title: "Brand Deck · Revision 3", due: "Mon 10:00 AM" },
  ];
  return (
    <div className="relative space-y-4" style={{ animation: "fade-up 0.45s cubic-bezier(0.16,1,0.3,1) both" }}>
      {/* hero card */}
      <div className="relative overflow-hidden rounded-3xl border border-brand/40 bg-gradient-to-br from-brand/15 via-card/60 to-card/60 p-6 backdrop-blur-xl md:p-8">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand/25 blur-3xl" style={{ animation: "float 8s ease-in-out infinite" }} />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-brand">Active Project</div>
            <h2 className="mt-3 font-display text-3xl font-black uppercase tracking-tight md:text-5xl">Aether Launch</h2>
            <div className="mt-3 font-mono-tight text-[9px] uppercase tracking-[0.28em] text-muted-foreground/70">Summary</div>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Multi-surface identity, film, and product launch. Cross-team production across NYC + Toronto.
            </p>
          </div>
          <div className="text-right">
            <div className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Overall Progress</div>
            <div className="font-display text-5xl font-black tabular-nums text-brand">64<span className="text-2xl text-muted-foreground">%</span></div>
            <div className="mt-1 font-mono-tight text-[8px] uppercase tracking-[0.28em] text-muted-foreground/70">Across all phases</div>
          </div>
        </div>
        <div className="relative mt-6 h-2 overflow-hidden rounded-full bg-border/70">
          <div className="h-full rounded-full bg-gradient-to-r from-brand to-brand-glow shadow-[0_0_20px_var(--brand)]" style={{ width: "64%", animation: "fade-in 0.8s ease-out both" }} />
        </div>
        <div className="relative mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTab("Files")}
            className="group inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 font-mono-tight text-[10px] uppercase tracking-[0.25em] text-primary-foreground transition-all hover:shadow-[0_0_25px_var(--brand)] active:scale-95"
          >
            <Download className="h-3.5 w-3.5" /> Latest Files
          </button>
          <button
            type="button"
            onClick={() => setTab("Messages")}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2 font-mono-tight text-[10px] uppercase tracking-[0.25em] text-foreground transition-all hover:-translate-y-0.5 hover:border-brand/60"
          >
            <MessageSquare className="h-3.5 w-3.5" /> Message Studio
          </button>
          <button
            type="button"
            onClick={() => setTab("Timeline")}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2 font-mono-tight text-[10px] uppercase tracking-[0.25em] text-foreground transition-all hover:-translate-y-0.5 hover:border-brand/60"
          >
            <Calendar className="h-3.5 w-3.5" /> View Timeline
          </button>
        </div>
      </div>
      {/* stat grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {OVERVIEW_STATS.map((s, i) => (
          <button
            key={s.label}
            type="button"
            onClick={statActions[i]}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card/50 p-6 text-left backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-brand/60 hover:shadow-[0_25px_60px_-30px_var(--brand)]"
            style={{ animation: `fade-up 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s both` }}
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand/15 blur-2xl transition-all duration-500 group-hover:scale-150" />
            <div className="relative flex items-start justify-between">
              <div>
                <div className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-brand">/0{i + 1} · {s.label}</div>
                <div className="mt-4 font-display text-2xl font-black uppercase tracking-tight">{s.value}</div>
                <div className="mt-3 border-t border-border/70 pt-2">
                  <div className="font-mono-tight text-[9px] uppercase tracking-[0.25em] text-muted-foreground/70">{s.detailLabel}</div>
                  <div className="mt-0.5 font-mono-tight text-[10px] uppercase tracking-[0.2em] text-foreground/85">{s.detail}</div>
                </div>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/15 text-brand transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                <s.icon className="h-4 w-4" />
              </span>
            </div>
            <div className="relative mt-4 flex items-center gap-1 font-mono-tight text-[9px] uppercase tracking-[0.25em] text-muted-foreground transition-colors group-hover:text-brand">
              Open <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
            <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-brand/20 to-transparent opacity-0 transition-opacity group-hover:animate-[shine-sweep_1.15s_cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100" />
          </button>
        ))}
      </div>

      {/* Pending approvals — functional */}
      <div className="rounded-3xl border border-border bg-card/50 p-6 backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-brand">Pending Approvals</div>
            <h3 className="mt-1 font-display text-lg font-black uppercase tracking-tight">Needs your sign-off</h3>
          </div>
          <span className="rounded-full border border-brand/40 bg-brand/10 px-3 py-1 font-mono-tight text-[9px] uppercase tracking-[0.25em] text-brand tabular-nums">
            {approvals.filter((a) => !approved[a.id]).length} open
          </span>
        </div>
        <div className="space-y-2">
          {approvals.map((a) => {
            const done = approved[a.id];
            return (
              <div key={a.id} className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 transition-all ${done ? "border-brand/40 bg-brand/8" : "border-border bg-background/40"}`}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-brand tabular-nums">{a.id}</span>
                    <span className="font-mono-tight text-[9px] uppercase tracking-[0.25em] text-muted-foreground">due {a.due}</span>
                  </div>
                  <div className="mt-1 font-display text-sm font-bold uppercase tracking-tight">{a.title}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTab("Files")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1.5 font-mono-tight text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-all hover:border-brand/60 hover:text-foreground"
                  >
                    <FileText className="h-3 w-3" /> Review
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setApproved((s) => ({ ...s, [a.id]: !s[a.id] }));
                      flash(done ? "Approval reverted." : `Approved: ${a.title}`);
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono-tight text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 ${
                      done
                        ? "border border-brand/40 bg-brand/15 text-brand"
                        : "bg-brand text-primary-foreground hover:shadow-[0_0_20px_var(--brand)]"
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" /> {done ? "Approved" : "Approve"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="pointer-events-none fixed bottom-8 left-1/2 z-[90] -translate-x-1/2 rounded-full border border-brand/50 bg-card/95 px-5 py-2.5 font-mono-tight text-[10px] uppercase tracking-[0.25em] text-brand shadow-[0_20px_60px_-20px_var(--brand)] backdrop-blur-xl"
          style={{ animation: "fade-up 0.35s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          ✓ {toast}
        </div>
      )}
    </div>
  );
}

const TIMELINE_EVENTS = [
  { date: "Mar 04", phase: "Discovery", title: "Kickoff + creative brief signed", status: "done" },
  { date: "Mar 18", phase: "Design System", title: "Identity direction approved", status: "done" },
  { date: "Apr 02", phase: "Production", title: "Film cut 01 delivered", status: "done" },
  { date: "Apr 26", phase: "Production", title: "Cut 02 review + revisions", status: "active" },
  { date: "May 10", phase: "Delivery", title: "Launch assets handoff", status: "upcoming" },
  { date: "May 24", phase: "Delivery", title: "Go-live + post-launch review", status: "upcoming" },
] as const;

function TimelinePanel() {
  return (
    <div className="space-y-6" style={{ animation: "fade-up 0.45s cubic-bezier(0.16,1,0.3,1) both" }}>
      <ProjectPulse />
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card/50 p-6 backdrop-blur-xl md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-brand" />
            <h3 className="font-display text-xl font-black uppercase tracking-tight">Milestones</h3>
          </div>
          <span className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {TIMELINE_EVENTS.filter((e) => e.status === "done").length}/{TIMELINE_EVENTS.length} complete
          </span>
        </div>
        <ol className="relative space-y-4 border-l border-border pl-6">
          {TIMELINE_EVENTS.map((e, i) => {
            const isDone = e.status === "done";
            const isActive = e.status === "active";
            return (
              <li
                key={e.title}
                className="group relative"
                style={{ animation: `fade-up 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s both` }}
              >
                <span className="absolute -left-[33px] top-3 flex h-3 w-3 items-center justify-center">
                  {isActive && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand/60" />}
                  <span className={`relative h-3 w-3 rounded-full transition-all ${
                    isDone ? "bg-brand shadow-[0_0_10px_var(--brand)]" : isActive ? "bg-brand-glow shadow-[0_0_16px_var(--brand-glow)]" : "bg-border ring-1 ring-border"
                  }`} />
                </span>
                <div className={`flex flex-wrap items-baseline justify-between gap-3 rounded-2xl border p-4 transition-all group-hover:-translate-y-0.5 group-hover:border-brand/60 ${
                  isActive ? "border-brand/60 bg-brand/8" : "border-border bg-background/40"
                }`}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-brand tabular-nums">{e.date}</span>
                      <span className="font-mono-tight text-[9px] uppercase tracking-[0.25em] text-muted-foreground">{e.phase}</span>
                    </div>
                    <div className="mt-1 font-display text-sm font-bold uppercase tracking-tight md:text-base">{e.title}</div>
                  </div>
                  <span className={`rounded-full border px-3 py-1 font-mono-tight text-[9px] uppercase tracking-[0.25em] ${
                    isDone ? "border-brand/40 bg-brand/10 text-brand" : isActive ? "border-brand-glow/50 bg-brand-glow/10 text-brand-glow" : "border-border text-muted-foreground"
                  }`}>
                    {e.status}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

const THREAD = [
  { from: "SAM Studios", initials: "SS", side: "them", body: "Film cut 02 is ready for your review. Notes welcome inline.", time: "10:24 AM" },
  { from: "You", initials: "YOU", side: "me", body: "Looks great. Small note on the color at 00:42 — a touch cooler?", time: "11:02 AM" },
  { from: "SAM Studios", initials: "SS", side: "them", body: "On it. New pass will be up by Friday 4 PM alongside the launch deck.", time: "11:18 AM" },
  { from: "SAM Studios", initials: "SS", side: "them", body: "Brand deck revision uploaded to files. Approve when ready.", time: "2:44 PM" },
] as const;

function MessagesPanel() {
  const [draft, setDraft] = useState("");
  const [items, setItems] = useState(() => [...THREAD] as any[]);
  const send = () => {
    if (!draft.trim()) return;
    setItems((arr) => [...arr, { from: "You", initials: "YOU", side: "me", body: draft.trim(), time: "now" }]);
    setDraft("");
  };
  return (
    <div className="rounded-3xl border border-border bg-card/50 p-5 backdrop-blur-xl md:p-7" style={{ animation: "fade-up 0.45s cubic-bezier(0.16,1,0.3,1) both" }}>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-brand/15 text-brand">
            <MessageSquare className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-pulse rounded-full bg-brand shadow-[0_0_8px_var(--brand)]" />
          </div>
          <div>
            <div className="font-display text-sm font-bold uppercase tracking-tight">Studio Thread</div>
            <div className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground">SAM Studios · Aether Launch</div>
          </div>
        </div>
        <span className="rounded-full border border-brand/30 bg-brand/10 px-3 py-1 font-mono-tight text-[9px] uppercase tracking-[0.25em] text-brand">Live</span>
      </div>
      <div className="max-h-[26rem] space-y-3 overflow-y-auto pr-2">
        {items.map((m, i) => (
          <div
            key={i}
            className={`flex items-end gap-3 ${m.side === "me" ? "flex-row-reverse" : ""}`}
            style={{ animation: `fade-up 0.45s cubic-bezier(0.16,1,0.3,1) ${i * 0.05}s both` }}
          >
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
              m.side === "me" ? "bg-brand text-primary-foreground" : "bg-card border border-border text-brand"
            }`}>
              {m.side === "me" ? <User className="h-3.5 w-3.5" /> : m.initials}
            </div>
            <div className={`max-w-[75%] rounded-2xl border px-4 py-3 backdrop-blur ${
              m.side === "me" ? "border-brand/40 bg-brand/15 text-foreground" : "border-border bg-background/50"
            }`}>
              <p className="text-sm leading-relaxed">{m.body}</p>
              <div className="mt-1.5 font-mono-tight text-[9px] uppercase tracking-[0.25em] text-muted-foreground">{m.from} · {m.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-2 rounded-2xl border border-border bg-background/60 p-2 transition-all focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/20">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") send(); }}
          placeholder="Reply to the studio…"
          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/60"
        />
        <button
          type="button"
          onClick={send}
          className="group inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 font-mono-tight text-[10px] uppercase tracking-[0.25em] text-primary-foreground transition-all hover:shadow-[0_0_25px_var(--brand)] active:scale-95"
        >
          Send <Send className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}

function PortalPanel({ tab, setTab }: { tab: (typeof tabs)[number]; setTab: (t: (typeof tabs)[number]) => void }) {
  if (tab === "Files") {
    return (
      <div className="grid gap-3" style={{ animation: "fade-up 0.45s cubic-bezier(0.16,1,0.3,1) both" }}>
        {files.map((file, i) => (
          <div
            key={file.name}
            className="group relative flex flex-wrap items-center justify-between gap-4 overflow-hidden rounded-3xl border border-border bg-card/50 p-5 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-brand/60 hover:shadow-[0_20px_50px_-30px_var(--brand)]"
            style={{ animation: `fade-up 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s both` }}
          >
            <div className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-brand/20 to-transparent opacity-0 transition-opacity group-hover:animate-[shine-sweep_1.15s_cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100" />
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-black tracking-normal uppercase">{file.name}</h3>
                <p className="font-mono-tight text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{file.type} · {file.size} · {file.status}</p>
              </div>
            </div>
            <FileDownloadButton file={file} />
          </div>
        ))}
      </div>
    );
  }

  if (tab === "Timeline") return <TimelinePanel />;
  if (tab === "Messages") return <MessagesPanel />;
  return <OverviewPanel setTab={setTab} />;
}

function FileDownloadButton({ file }: { file: (typeof files)[number] }) {
  const [downloading, setDownloading] = useState(false);

  const downloadFile = () => {
    if (downloading) return;
    setDownloading(true);
    window.setTimeout(() => {
      const content = `SAM Studios® Client Portal\n\nFile: ${file.name}\nType: ${file.type}\nSize: ${file.size}\nStatus: ${file.status}\n\nThis front-end download is ready to connect to the real backend file storage.`;
      const mime = file.type === "PDF" ? "application/pdf" : file.type === "ZIP" ? "application/zip" : "video/mp4";
      const blob = new Blob([content], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.${file.type.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setDownloading(false);
    }, 650);
  };

  return (
    <button
      type="button"
      onClick={downloadFile}
      className="relative inline-flex min-w-[8.5rem] items-center justify-center gap-2 overflow-hidden rounded-full border border-border px-4 py-2 font-mono-tight text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-all hover:border-brand/60 hover:text-foreground disabled:cursor-wait"
      disabled={downloading}
    >
      {downloading ? (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-brand/30 border-t-brand" />
      ) : (
        <Download className="h-3.5 w-3.5" />
      )}
      {downloading ? "Preparing" : "Download"}
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-brand/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
    </button>
  );
}