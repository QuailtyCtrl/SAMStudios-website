import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Check, ChevronRight, Sparkles } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { StatusPill } from "@/components/status-pill";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — SAM Studios®" },
      { name: "description", content: "Start a project with SAM Studios®. Tell us about your brand, film, product, or installation and we'll get back within 48 hours." },
      { property: "og:title", content: "Contact — SAM Studios®" },
      { property: "og:description", content: "Tell us what you're dreaming up." },
    ],
  }),
  component: Contact,
});

const SERVICES = [
  "Brand & Identity",
  "Film & Motion",
  "Digital Products",
  "Print & Spatial",
  "Packaging",
  "Sound Design",
  "Apparel",
  "Something Else",
];

const BUDGETS = ["< $10k", "$10–25k", "$25–75k", "$75–200k", "$200k+"];
const TIMEFRAMES = ["ASAP", "1–3 months", "3–6 months", "6+ months", "Just exploring"];
const COUNTRIES = [
  { label: "USA", dial: "+1" },
  { label: "CAN", dial: "+1" },
  { label: "GBR", dial: "+44" },
  { label: "MEX", dial: "+52" },
  { label: "JPN", dial: "+81" },
  { label: "DEU", dial: "+49" },
  { label: "FRA", dial: "+33" },
  { label: "AUS", dial: "+61" },
];

function Contact() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    first: "",
    last: "",
    email: "",
    country: COUNTRIES[0].label,
    phone: "",
    budget: "",
    timeframe: "",
    services: [] as string[],
    description: "",
  });

  const steps = ["Identity", "Reach", "Scope", "Brief"] as const;
  const total = steps.length;
  const progress = useMemo(() => ((step + 1) / total) * 100, [step, total]);

  const stepValid = useMemo(() => {
    if (step === 0) return form.first.trim() && form.last.trim();
    if (step === 1) return /.+@.+\..+/.test(form.email) && form.phone.replace(/\D/g, "").length >= 7;
    if (step === 2) return form.budget && form.timeframe;
    if (step === 3) return form.services.length > 0 && form.description.trim().length >= 12;
    return false;
  }, [step, form]);

  const toggleService = (s: string) =>
    setForm((f) => ({
      ...f,
      services: f.services.includes(s) ? f.services.filter((x) => x !== s) : [...f.services, s],
    }));

  const next = () => {
    if (!stepValid) return;
    if (step === total - 1) setSubmitted(true);
    else setStep((s) => s + 1);
  };

  // keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.metaKey) next();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      {/* Ambient backdrop */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-brand/20 blur-[160px]" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-brand-glow/15 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <main className="relative mx-auto max-w-7xl px-6 pt-32 pb-20 md:px-10 md:pt-40">
        {/* Header */}
        <section className="mb-8 grid gap-6 border-y border-border py-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <StatusPill status="active" />
              <span className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                /new_inquiry
              </span>
            </div>
            <h1
              className="font-display font-black leading-[0.9] tracking-tighter"
              style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
            >
              START THE{" "}
              <span className="bg-gradient-to-r from-brand to-brand-glow bg-clip-text text-transparent">
                BRIEF
              </span>
              .
            </h1>
            <p className="max-w-2xl text-pretty text-muted-foreground md:text-lg">
              Four short steps. Tell us who you are and what you want made. We respond within 48 hours.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card/40 p-5 backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              <span>Brief progress</span>
              <span className="text-brand">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-border">
              <div className="h-full rounded-full bg-gradient-to-r from-brand to-brand-glow shadow-[0_0_20px_var(--brand)] transition-[width] duration-700 ease-out" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {steps.map((s, i) => (
                <button
                  key={s}
                  onClick={() => i < step && setStep(i)}
                  className={`min-w-0 rounded-xl border px-2 py-2 text-center transition-all ${i === step ? "border-brand bg-brand/10 text-foreground" : i < step ? "border-border bg-background/50 text-foreground" : "border-border/50 text-muted-foreground"}`}
                >
                  <span className="block font-mono-tight text-[9px] uppercase tracking-[0.16em]">0{i + 1}</span>
                  <span className="mt-1 block truncate font-display text-[10px] font-bold uppercase">{s}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Console layout */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[0.72fr_1.28fr]" data-rail-label="Brief Form">
          <aside className="order-1 space-y-4 lg:sticky lg:top-32 lg:self-start">
            <SummaryCard form={form} step={step} />
            <div className="rounded-3xl border border-border bg-card/40 p-6 backdrop-blur-xl">
              <div className="mb-3 font-mono-tight text-[10px] uppercase tracking-[0.25em] text-brand">/direct</div>
              <div className="space-y-2">
                <a href="mailto:hello@samstudios.com" className="block font-display text-lg font-bold tracking-tight hover:text-brand">
                  hello@samstudios.com
                </a>
                <a href="tel:+12125550100" className="block font-mono-tight text-sm text-muted-foreground hover:text-foreground">
                  +1 (212) 555 0100
                </a>
                <div className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-muted-foreground pt-2">
                  NYC / Everywhere — Open Q3 2026
                </div>
              </div>
            </div>
          </aside>

          <div className="order-2">
            <div className="grain relative overflow-hidden rounded-[2rem] border border-brand/30 bg-card/60 p-6 backdrop-blur-xl transition-all duration-500 ease-out md:p-8">
                {submitted ? (
                  <Success form={form} onReset={() => { setSubmitted(false); setStep(0); setForm({ first: "", last: "", email: "", country: COUNTRIES[0].label, phone: "", budget: "", timeframe: "", services: [], description: "" }); }} />
              ) : (
                <div key={step} className="space-y-8" style={{ animation: "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both" }}>
                  {step === 0 && (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <Field label="First Name" value={form.first} onChange={(v) => setForm({ ...form, first: v })} placeholder="Ada" />
                      <Field label="Last Name" value={form.last} onChange={(v) => setForm({ ...form, last: v })} placeholder="Lovelace" />
                    </div>
                  )}
                  {step === 1 && (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <Field type="email" label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="you@studio.com" />
                      <PhonePad
                        value={form.phone}
                        country={form.country}
                        onCountryChange={(country) => setForm({ ...form, country })}
                        onChange={(phone) => setForm({ ...form, phone })}
                      />
                    </div>
                  )}
                  {step === 2 && (
                    <div className="space-y-8">
                      <ChipGroup label="Budget" options={BUDGETS} value={form.budget} onChange={(v) => setForm({ ...form, budget: v })} />
                      <ChipGroup label="Timeframe" options={TIMEFRAMES} value={form.timeframe} onChange={(v) => setForm({ ...form, timeframe: v })} />
                    </div>
                  )}
                  {step === 3 && (
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <Label>Services</Label>
                        <div className="flex flex-wrap gap-2">
                          {SERVICES.map((s) => {
                            const on = form.services.includes(s);
                            return (
                              <button
                                key={s}
                                type="button"
                                onClick={() => toggleService(s)}
                                className={`group flex items-center gap-2 rounded-full border px-4 py-2 font-mono-tight text-[11px] uppercase tracking-wider transition-all ${
                                  on
                                    ? "border-brand bg-brand text-primary-foreground shadow-[0_0_20px_var(--brand)]"
                                    : "border-border bg-transparent text-muted-foreground hover:border-brand/60 hover:text-foreground"
                                }`}
                              >
                                <span
                                  className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                                    on ? "border-primary-foreground bg-primary-foreground text-brand" : "border-muted-foreground/60"
                                  }`}
                                >
                                  {on && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                                </span>
                                {s}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label>Describe what you need</Label>
                        <textarea
                          value={form.description}
                          onChange={(e) => setForm({ ...form, description: e.target.value })}
                          rows={6}
                          maxLength={2000}
                          placeholder="What are you building? Who's it for? What does success look like?"
                          className="w-full resize-none rounded-2xl border border-border bg-background/60 p-5 font-sans text-base text-foreground placeholder:text-muted-foreground/70 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/20"
                        />
                        <div className="flex justify-end font-mono-tight text-[10px] uppercase text-muted-foreground">
                          {form.description.length} / 2000
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
                    <button
                      onClick={() => setStep((s) => Math.max(0, s - 1))}
                      disabled={step === 0}
                      className="font-mono-tight text-[11px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={next}
                      disabled={!stepValid}
                      className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-brand px-7 py-3.5 font-display text-xs font-bold uppercase tracking-widest text-primary-foreground transition-all hover:shadow-[0_0_40px_var(--brand)] disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {step === total - 1 ? "Transmit" : "Continue"}
                        {step === total - 1 ? <Sparkles className="h-4 w-4" /> : <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
                      </span>
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </section>
      </main>

      <Footer />
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 font-mono-tight text-[10px] uppercase tracking-[0.3em] text-brand">
      <span className="h-px w-6 bg-brand" />
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="group block space-y-3">
      <Label>{label}</Label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={120}
        className="peer w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 font-display text-sm tracking-tight text-foreground placeholder:text-muted-foreground/50 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/20"
      />
    </label>
  );
}

function PhonePad({
  value,
  country,
  onCountryChange,
  onChange,
}: {
  value: string;
  country: string;
  onCountryChange: (v: string) => void;
  onChange: (v: string) => void;
}) {
  const MAX = 10;
  const digits = value.replace(/\D/g, "").slice(0, MAX);
  const addDigit = (digit: string) => onChange((digits + digit).slice(0, MAX));
  const removeDigit = () => onChange(digits.slice(0, -1));
  const pad = (s: string, n: number) => (s + "_".repeat(n)).slice(0, n).split("").join(" ");
  const a = digits.slice(0, 3);
  const b = digits.slice(3, 6);
  const c = digits.slice(6, 10);
  const display = `( ${pad(a, 3)} ) - ${pad(b, 3)} - ${pad(c, 4)}`;

  return (
    <div className="space-y-3 md:col-span-2">
      <Label>Phone</Label>
      <div className="rounded-2xl border border-border bg-background/60 p-3 transition-all focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/20">
        <div className="grid grid-cols-[minmax(0,8rem)_minmax(0,1fr)] gap-2">
          <select
            value={country}
            onChange={(e) => onCountryChange(e.target.value)}
            className="min-w-0 rounded-xl border border-border bg-card px-3 py-3 font-mono-tight text-[10px] uppercase tracking-[0.12em] text-foreground outline-none transition-colors hover:border-brand/60"
            aria-label="Country code"
          >
            {COUNTRIES.map((c) => (
              <option key={c.label} value={c.label}>
                {c.label} · {c.dial}
              </option>
            ))}
          </select>
          <div className="relative flex min-w-0 items-center rounded-xl border border-border bg-card px-3 py-3">
            <span className="mr-2 shrink-0 font-mono-tight text-[11px] uppercase tracking-[0.14em] text-brand">
              {COUNTRIES.find((c) => c.label === country)?.dial ?? "+1"}
            </span>
            <input
              type="tel"
              inputMode="numeric"
              readOnly
              value={display}
              aria-label="Phone number"
              className="w-full min-w-0 bg-transparent font-display text-base tabular-nums tracking-wider text-foreground outline-none placeholder:text-muted-foreground/40"
            />
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => addDigit(n)}
              className="rounded-xl border border-border bg-card py-3 font-display text-lg font-bold transition-all hover:-translate-y-0.5 hover:border-brand/60 hover:bg-brand/10 active:scale-95"
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onChange("")}
            className="rounded-xl border border-border bg-card py-3 font-mono-tight text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-all hover:border-brand/60 hover:text-foreground active:scale-95"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => addDigit("0")}
            className="rounded-xl border border-border bg-card py-3 font-display text-lg font-bold transition-all hover:-translate-y-0.5 hover:border-brand/60 hover:bg-brand/10 active:scale-95"
          >
            0
          </button>
          <button
            type="button"
            onClick={removeDigit}
            aria-label="Delete last digit"
            className="rounded-xl border border-border bg-card py-3 font-display text-lg font-bold transition-all hover:border-brand/60 hover:bg-brand/10 active:scale-95"
          >
            ⌫
          </button>
        </div>
        <div className="mt-3 flex justify-between font-mono-tight text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span>{digits.length} / {MAX} digits</span>
          <span>{digits.length === MAX ? "Complete" : digits.length >= 7 ? "Ready" : "Need 7+"}</span>
        </div>
      </div>
    </div>
  );
}

function ChipGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value === o;
          return (
            <button
              key={o}
              type="button"
              onClick={() => onChange(o)}
              className={`rounded-full border px-4 py-2.5 font-mono-tight text-[11px] uppercase tracking-wider transition-all ${
                on
                  ? "border-brand bg-brand text-primary-foreground shadow-[0_0_20px_var(--brand)]"
                  : "border-border bg-transparent text-muted-foreground hover:border-brand/60 hover:text-foreground"
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SummaryCard({ form, step }: { form: any; step: number }) {
  const rows = [
    { k: "Name", v: [form.first, form.last].filter(Boolean).join(" "), active: step === 0 },
    { k: "Email", v: form.email, active: step === 1 },
    { k: "Phone", v: form.phone ? `${COUNTRIES.find((c) => c.label === form.country)?.dial ?? ""} ${form.phone}` : "", active: step === 1 },
    { k: "Budget", v: form.budget, active: step === 2 },
    { k: "Timeframe", v: form.timeframe, active: step === 2 },
    { k: "Services", v: form.services.join(", "), active: step === 3 },
  ];
  return (
    <div className="rounded-3xl border border-border bg-card/40 p-6 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="font-mono-tight text-[10px] uppercase tracking-[0.25em] text-brand">/signal_capture</div>
        <div className="font-mono-tight text-[10px] tabular-nums text-muted-foreground">{String(step + 1).padStart(2, "0")} / 04</div>
      </div>
      <dl className="space-y-2.5">
        {rows.map((r) => (
          <div key={r.k} className={`flex items-start justify-between gap-3 border-b border-border/40 pb-2 text-sm transition-colors ${r.active ? "text-foreground" : "text-muted-foreground"}`}>
            <dt className="font-mono-tight text-[10px] uppercase tracking-[0.2em]">{r.k}</dt>
            <dd className="truncate text-right font-display text-xs font-medium">
              {r.v || <span className="text-muted-foreground/50">—</span>}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Success({ form, onReset }: { form: any; onReset: () => void }) {
  return (
    <div className="space-y-8 py-10 text-center" style={{ animation: "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both" }}>
      <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-full bg-brand/30" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-glow shadow-[0_0_60px_var(--brand)]">
          <Check className="h-10 w-10 text-primary-foreground" strokeWidth={3} />
        </div>
      </div>
      <div className="space-y-3">
        <h2 className="font-display text-4xl font-black uppercase tracking-tighter md:text-5xl">
          Message received.
        </h2>
        <p className="mx-auto max-w-md text-muted-foreground">
          Thanks {form.first || "friend"} — we'll be in touch at <span className="text-brand">{form.email}</span> within 48 hours.
        </p>
      </div>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 font-mono-tight text-[11px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
      >
        Send another <ArrowUpRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
