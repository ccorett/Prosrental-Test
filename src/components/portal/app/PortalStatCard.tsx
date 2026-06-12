import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type PortalStatCardProps = {
  label: string;
  value: number | string;
  icon: LucideIcon;
  href?: string;
  accent?: "accent" | "secondary" | "tertiary";
};

const ACCENT_STYLES = {
  accent: "text-accent bg-accent/10 border-accent/25",
  secondary: "text-secondary bg-secondary-muted border-secondary/25",
  tertiary: "text-tertiary bg-tertiary/10 border-tertiary/25",
};

export function PortalStatCard({
  label,
  value,
  icon: Icon,
  href,
  accent = "accent",
}: PortalStatCardProps) {
  const content = (
    <div className="card-industrial flex h-full flex-col p-5 transition-colors hover:border-accent/40">
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg border",
            ACCENT_STYLES[accent]
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <p className="text-3xl font-bold text-foreground">{value}</p>
      </div>
      <p className="mt-4 text-sm font-medium text-muted">{label}</p>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
