import type { StaffRoleCode } from "@prisma/client";
import { roleBadgeTone } from "@/lib/access/roles";
import { cn } from "@/lib/utils";

const TONE_STYLES = {
  accent: "border-accent/40 bg-accent/10 text-accent",
  secondary: "border-secondary/40 bg-secondary-muted text-secondary",
  tertiary: "border-tertiary/40 bg-tertiary/10 text-tertiary",
  muted: "border-border bg-surface text-muted",
  danger: "border-red-500/40 bg-red-500/10 text-red-300",
} as const;

export function RoleBadge({
  label,
  code,
}: {
  label: string;
  code: StaffRoleCode;
}) {
  const tone = roleBadgeTone(code);
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide",
        TONE_STYLES[tone]
      )}
    >
      {label}
    </span>
  );
}
