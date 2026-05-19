import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { getPlaceholderGradient } from "@/lib/placeholders";

type PlaceholderMediaProps = {
  seed: string;
  label: string;
  aspectClass?: string;
  className?: string;
  overlay?: boolean;
  icon?: LucideIcon;
  children?: ReactNode;
};

export function PlaceholderMedia({
  seed,
  label,
  aspectClass = "aspect-[4/3]",
  className = "",
  overlay = false,
  icon: Icon,
  children,
}: PlaceholderMediaProps) {
  const gradient = getPlaceholderGradient(seed);

  return (
    <div
      role="img"
      aria-label={label}
      className={`relative overflow-hidden ${aspectClass} ${gradient} ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-12deg, transparent, transparent 12px, rgba(0,198,255,0.04) 12px, rgba(0,198,255,0.04) 13px)",
        }}
      />
      <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-accent/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-secondary/10 blur-2xl" />

      {Icon && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon
            className="h-16 w-16 text-foreground/10 transition-transform duration-500"
            aria-hidden
          />
        </div>
      )}

      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      )}

      {children}
    </div>
  );
}
