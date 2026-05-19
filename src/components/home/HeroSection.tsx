import { Container } from "@/components/ui/Container";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";

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
          Est. 1994
        </span>

        <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.25rem]">
          Industry Standards.{" "}
          <span className="text-accent">Professional Service.</span>
        </h1>

        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          For over three decades, Pro Rentals has powered the world&apos;s most
          demanding infrastructure projects with a fleet maintained to absolute
          precision standards.
        </p>

        <ul className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs uppercase tracking-widest text-muted sm:mt-8 sm:text-sm">
          <li className="text-foreground/90">Nationwide</li>
          <li className="hidden text-border sm:inline" aria-hidden>
            |
          </li>
          <li>24/7 Support</li>
          <li className="hidden text-border sm:inline" aria-hidden>
            |
          </li>
          <li>Certified</li>
        </ul>
      </Container>
    </section>
  );
}
