type Status = "active" | "idle" | "offline";

const config: Record<Status, { label: string; color: string; ring: string; bg: string; text: string }> = {
  active: {
    label: "System: Active",
    color: "bg-emerald-400",
    ring: "bg-emerald-400/70",
    bg: "bg-emerald-400/10",
    text: "text-emerald-400",
  },
  idle: {
    label: "System: Idle",
    color: "bg-amber-400",
    ring: "bg-amber-400/70",
    bg: "bg-amber-400/10",
    text: "text-amber-400",
  },
  offline: {
    label: "System: Offline",
    color: "bg-rose-500",
    ring: "bg-rose-500/70",
    bg: "bg-rose-500/10",
    text: "text-rose-400",
  },
};

export function StatusPill({ status = "active" }: { status?: Status }) {
  const c = config[status];
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 backdrop-blur-md ${c.bg}`}
      style={{ borderColor: "color-mix(in oklab, currentColor 35%, transparent)" }}
    >
      <span className="relative flex h-2 w-2">
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${c.ring}`} />
        <span className={`relative inline-flex h-2 w-2 rounded-full ${c.color}`} />
      </span>
      <span className={`font-mono-tight text-[10px] uppercase tracking-[0.25em] ${c.text}`}>
        {c.label}
      </span>
    </div>
  );
}
