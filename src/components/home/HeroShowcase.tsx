import Image from "next/image";

export function HeroShowcase() {
  return (
    <div className="hero-showcase relative mt-10 flex w-full items-center justify-center lg:mt-0 lg:min-h-[420px]">
      {/* Blueprint grid + soft radial — CSS only */}
      <div className="hero-showcase-bg pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="hero-showcase-grid absolute inset-0" />
        <div className="hero-showcase-radial absolute inset-0" />
      </div>

      <div className="relative flex w-full items-center justify-center px-2 py-10 sm:py-12 lg:py-16">
        <div className="relative flex w-[80%] max-w-none items-center justify-center">
          <div
            className="hero-glow-breathe pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[95%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-3xl"
            aria-hidden
          />
          <div className="hero-float relative z-10 w-full">
            <Image
              src="/images/pro-rentals-logo-transparent.png"
              alt="Pro Rentals — Built for Performance"
              width={812}
              height={410}
              priority
              className="h-auto w-full object-contain"
              sizes="(max-width: 1024px) 80vw, 40vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
