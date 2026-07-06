import Image from "next/image";

type HeroBadgeProps = {
  title: string;
  subtitle: string;
  className?: string;
  animationClass?: string;
};

function HeroBadge({ title, subtitle, className = "", animationClass = "hero-float" }: HeroBadgeProps) {
  return (
    <div
      className={`hero-glass-badge ${animationClass} ${className}`}
    >
      <p className="text-sm font-bold leading-tight text-foreground sm:text-base">{title}</p>
      <p className="mt-0.5 text-xs font-medium text-muted sm:text-sm">{subtitle}</p>
    </div>
  );
}

export function HeroShowcase() {
  return (
    <div className="hero-showcase relative mt-10 w-full lg:mt-0">
      {/* Industrial blueprint background — CSS only */}
      <div className="hero-showcase-bg pointer-events-none absolute inset-0 overflow-hidden rounded-2xl border border-border/40" aria-hidden>
        <div className="hero-showcase-grid absolute inset-0" />
        <div className="hero-showcase-lines absolute inset-0" />
        <div className="hero-showcase-geo absolute inset-0" />
        <div className="hero-showcase-radial absolute inset-0" />
      </div>

      <div className="relative flex min-h-[280px] flex-col items-center justify-center px-4 py-10 sm:min-h-[320px] sm:py-12 lg:min-h-[420px] lg:py-16">
        {/* Logo composition */}
        <div className="relative mx-auto flex w-full max-w-xl items-center justify-center">
          {/* Cyan radial glow — breathing */}
          <div
            className="hero-glow-breathe pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl"
            aria-hidden
          />

          {/* Logo */}
          <div className="hero-float relative z-10 w-[60%] sm:w-[65%] lg:w-[78%]">
            <Image
              src="/images/pro-rentals-logo.png"
              alt="Pro Rentals — Built for Performance"
              width={640}
              height={280}
              priority
              className="h-auto w-full object-contain"
              sizes="(max-width: 640px) 60vw, (max-width: 1024px) 65vw, 38vw"
            />
          </div>

          {/* Desktop / tablet — floating badges around logo */}
          <HeroBadge
            title="500+"
            subtitle="Equipment Available"
            className="absolute left-0 top-0 z-20 hidden max-w-[140px] sm:max-w-[155px] md:block lg:-left-6 lg:top-6 xl:-left-10"
            animationClass="hero-float hero-float-delay-1"
          />
          <HeroBadge
            title="Same Day"
            subtitle="Delivery Available"
            className="absolute right-0 top-2 z-20 hidden max-w-[140px] sm:max-w-[155px] md:block lg:-right-4 lg:top-10 xl:-right-8"
            animationClass="hero-float hero-float-delay-2"
          />
          <HeroBadge
            title="Maintained"
            subtitle="Safety Inspected"
            className="absolute bottom-0 left-1/2 z-20 hidden max-w-[160px] -translate-x-1/2 md:block lg:bottom-2"
            animationClass="hero-float hero-float-delay-3"
          />
        </div>

        {/* Mobile / small tablet — stacked badges */}
        <div className="mt-8 flex w-full max-w-md flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:justify-center md:hidden">
          <HeroBadge
            title="500+"
            subtitle="Equipment Available"
            className="sm:max-w-[155px] sm:flex-1"
            animationClass="hero-float hero-float-delay-1"
          />
          <HeroBadge
            title="Same Day"
            subtitle="Delivery Available"
            className="sm:max-w-[155px] sm:flex-1"
            animationClass="hero-float hero-float-delay-2"
          />
          <HeroBadge
            title="Maintained"
            subtitle="Safety Inspected"
            className="sm:max-w-[180px] sm:w-full"
            animationClass="hero-float hero-float-delay-3"
          />
        </div>
      </div>
    </div>
  );
}
