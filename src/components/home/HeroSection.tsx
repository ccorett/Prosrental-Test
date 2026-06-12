import { Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { SITE } from "@/lib/data";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <MediaPlaceholder
        seed="hero"
        label="Industrial equipment warehouse"
        className="absolute inset-0 h-full w-full"
        overlay="hero"
      />

      <Container className="relative z-10 py-12 sm:py-14 lg:py-16">
        <span className="label-caps mb-4 inline-flex w-fit rounded-full border border-border/80 bg-background/40 px-4 py-2 text-accent backdrop-blur-sm">
          Est. 1994 · {SITE.location}
        </span>

        <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.25rem]">
          Industry Standards.{" "}
          <span className="text-accent">Professional Service.</span>
        </h1>

        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          Pro Rentals is your local equipment rental partner—browse inventory and
          request quotes for contractors, businesses, homeowners, and facility
          managers.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <LinkButton href="/contact" size="lg" className="glow-accent">
            Request a Quote
          </LinkButton>
          <LinkButton href="/equipment" variant="outline" size="lg">
            Browse Equipment
          </LinkButton>
          <a
            href={SITE.phoneHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface/80 px-8 py-3.5 text-base font-semibold text-foreground backdrop-blur-sm transition-colors hover:border-secondary hover:text-secondary"
          >
            <Phone className="h-5 w-5 text-secondary" />
            Call Now
          </a>
        </div>
      </Container>
    </section>
  );
}
