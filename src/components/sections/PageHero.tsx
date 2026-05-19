import { LogoHeadline } from "@/components/ui/LogoHeadline";

type PageHeroProps = {
  title: string;
  description: string;
  eyebrow?: string;
  withLogo?: boolean;
};

export function PageHero({
  title,
  description,
  eyebrow,
  withLogo = false,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-surface">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--accent-muted)_0%,transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {eyebrow && (
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">
            {eyebrow}
          </span>
        )}

        {withLogo ? (
          <LogoHeadline
            as="h1"
            title={title}
            logoSize="hero"
            priority
            className={eyebrow ? "mt-4" : undefined}
          >
            <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {description}
            </p>
          </LogoHeadline>
        ) : (
          <>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">{description}</p>
          </>
        )}
      </div>
    </section>
  );
}
