import { ArrowRight, CheckCircle2, HardHat, Phone } from "lucide-react";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { LinkButton } from "@/components/ui/Button";
import { SITE, TARGET_MARKETS } from "@/lib/data";

export function Hero() {
  return (
    <section className="relative overflow-hidden" id="hero">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--accent-muted)_0%,transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--secondary-muted)_0%,transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,var(--background)_100%)] opacity-60" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="opacity-0-start animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-muted px-4 py-1.5 text-sm font-semibold tracking-wide text-accent">
              <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_8pxvar(--accent)]" />
              Trusted by 5,000+ professionals
            </span>

            <h1 className="mt-8 text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Professional Equipment Rentals{" "}
              <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                Without The Hassle
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Reliable tools, cleaning equipment, and operational rentals for
              businesses and professionals.
            </p>

            <ul className="mt-8 flex flex-wrap gap-2.5">
              {TARGET_MARKETS.map((market) => (
                <li
                  key={market}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-elevated px-3 py-1.5 text-sm text-foreground/90 transition-colors hover:border-secondary/40"
                >
                  <CheckCircle2 className="h-4 w-4 text-secondary" aria-hidden />
                  {market}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <LinkButton href="/equipment" size="lg" className="hover-lift">
                View Equipment
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </LinkButton>
              <a
                href={SITE.phoneHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface-elevated px-8 py-3.5 text-base font-semibold text-foreground transition-all duration-300 hover:border-secondary hover:text-secondary hover:shadow-lg hover:shadow-secondary/15 hover-lift"
              >
                <Phone className="h-5 w-5 text-secondary" />
                Call Now
              </a>
            </div>
          </div>

          <div className="relative opacity-0-start animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <div className="relative overflow-hidden rounded-2xl border border-border/80 shadow-2xl shadow-black/50 glow-accent">
              <PlaceholderMedia
                seed="hero-jobsite"
                label="Construction and industrial equipment on a jobsite"
                aspectClass="aspect-[4/3] w-full"
                icon={HardHat}
                className="transition-transform duration-700 hover:scale-[1.02]"
                overlay
              />
            </div>

            <div className="absolute -bottom-4 -left-4 rounded-xl border border-border bg-surface-elevated/95 p-4 shadow-xl backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 sm:-bottom-6 sm:-left-6">
              <p className="text-3xl font-bold text-accent">2,400+</p>
              <p className="text-sm text-muted">Equipment units available</p>
            </div>

            <div className="absolute -right-4 -top-4 rounded-xl border border-border bg-surface-elevated/95 p-4 shadow-xl backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 sm:-right-6 sm:-top-6">
              <p className="text-3xl font-bold text-secondary">Same Day</p>
              <p className="text-sm text-muted">Pickup on popular items</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
