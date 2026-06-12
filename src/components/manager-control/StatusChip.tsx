import { cn } from "@/lib/utils";

type Tone = "green" | "amber" | "red" | "accent" | "muted";

const STYLES: Record<Tone, string> = {
  green: "border-secondary/40 bg-secondary-muted text-secondary",
  amber: "border-tertiary/40 bg-tertiary/10 text-tertiary",
  red: "border-red-500/30 bg-red-500/10 text-red-300",
  accent: "border-accent/30 bg-accent/10 text-accent",
  muted: "border-border bg-surface text-muted",
};

export function StatusChip({ label, tone = "muted" }: { label: string; tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide",
        STYLES[tone]
      )}
    >
      {label}
    </span>
  );
}
