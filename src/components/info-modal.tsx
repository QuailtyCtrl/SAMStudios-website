import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

export type ModalContent = {
  eyebrow?: string;
  title: string;
  image?: string;
  emoji?: string;
  body: ReactNode;
  meta?: { label: string; value: string }[];
  accent?: string;
};

export function InfoModal({
  open,
  onClose,
  content,
}: {
  open: boolean;
  onClose: () => void;
  content: ModalContent | null;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !content) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-xl"
        onClick={onClose}
        style={{ animation: "fade-in 0.3s ease-out both" }}
      />
      <div
        className="relative grid w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-card shadow-[0_40px_120px_-30px_var(--brand)] md:grid-cols-2"
        style={{ animation: "modal-rise 0.45s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        {/* Visual side */}
        <div className="relative min-h-[220px] overflow-hidden bg-gradient-to-br from-brand to-brand-glow md:min-h-[440px]">
          {content.image ? (
            <>
              <img
                src={content.image}
                alt={content.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </>
          ) : (
            <>
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
              <div className="absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-white/25 blur-3xl" />
            </>
          )}
          {content.emoji && (
            <span
              className="absolute right-6 bottom-6 text-[6rem] leading-none drop-shadow-[0_6px_30px_rgba(0,0,0,0.6)]"
              style={{ animation: "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s both" }}
            >
              {content.emoji}
            </span>
          )}
          {content.accent && (
            <div className="absolute left-6 top-6 rounded-full bg-background/80 px-3 py-1 font-mono-tight text-[10px] uppercase tracking-[0.25em] text-brand backdrop-blur">
              {content.accent}
            </div>
          )}
        </div>

        {/* Content side */}
        <div className="relative flex flex-col gap-5 p-6 md:p-10">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/60 text-muted-foreground transition-all hover:rotate-90 hover:border-brand hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>

          {content.eyebrow && (
            <div className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-brand">
              {content.eyebrow}
            </div>
          )}
          <h3 className="font-display text-3xl font-black uppercase leading-tight tracking-tight md:text-4xl">
            {content.title}
          </h3>
          <div className="prose prose-sm max-w-none text-sm leading-relaxed text-muted-foreground md:text-base">
            {content.body}
          </div>

          {content.meta && content.meta.length > 0 && (
            <dl className="mt-auto grid grid-cols-2 gap-3 border-t border-border pt-5">
              {content.meta.map((m) => (
                <div key={m.label}>
                  <dt className="font-mono-tight text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
                    {m.label}
                  </dt>
                  <dd className="mt-1 font-display text-sm font-bold text-foreground">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}