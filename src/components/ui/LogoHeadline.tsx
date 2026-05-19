import type { ReactNode } from "react";
import { Logo, type LogoSize } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

type LogoHeadlineProps = {
  title: string;
  as?: "h1" | "h2";
  logoSize?: LogoSize;
  priority?: boolean;
  className?: string;
  titleClassName?: string;
  children?: ReactNode;
};

export function LogoHeadline({
  title,
  as: Heading = "h1",
  logoSize = "hero",
  priority = false,
  className,
  titleClassName,
  children,
}: LogoHeadlineProps) {
  const isHero = logoSize === "hero";

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-5 rounded-2xl border border-border/60 bg-background/25 p-5 backdrop-blur-md sm:flex-row sm:items-center sm:gap-8 sm:p-6 lg:gap-10",
        className
      )}
    >
      <Logo size={logoSize} priority={priority} />
      <div className="min-w-0 flex-1 text-center sm:text-left">
        <Heading
          className={cn(
            "font-bold tracking-tight text-foreground",
            isHero
              ? "text-3xl leading-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
              : "text-2xl leading-tight sm:text-3xl lg:text-4xl",
            titleClassName
          )}
        >
          {title}
        </Heading>
        {children ? <div className="mt-3">{children}</div> : null}
      </div>
    </div>
  );
}
