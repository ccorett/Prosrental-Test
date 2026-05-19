import Link from "next/link";
import { type ComponentPropsWithoutRef } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-background font-semibold hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25",
  secondary:
    "bg-secondary text-background font-semibold hover:bg-secondary-hover hover:shadow-lg hover:shadow-secondary/25",
  outline:
    "border border-border bg-transparent text-foreground hover:border-accent hover:text-accent hover:bg-accent-muted",
  ghost: "text-muted hover:text-foreground hover:bg-surface-elevated",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-base",
};

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: Variant;
  size?: Size;
};

type LinkButtonProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: Variant;
  size?: Size;
};

function baseClasses(variant: Variant, size: Size) {
  return `inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${variants[variant]} ${sizes[size]}`;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={`${baseClasses(variant, size)} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({
  variant = "primary",
  size = "md",
  className = "",
  children,
  href,
  ...props
}: LinkButtonProps) {
  return (
    <Link href={href} className={`${baseClasses(variant, size)} ${className}`} {...props}>
      {children}
    </Link>
  );
}
