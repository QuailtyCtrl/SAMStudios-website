import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggle}
      aria-label="Toggle color theme"
      className="relative h-9 w-16 rounded-full border border-border bg-card/60 backdrop-blur-md transition-colors hover:border-brand/60"
    >
      <span
        className="absolute top-1 left-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-glow text-primary-foreground shadow-[0_0_20px_var(--brand)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: isDark ? "translateX(0)" : "translateX(28px)" }}
      >
        {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
      </span>
    </button>
  );
}