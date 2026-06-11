import { ArrowRight, Phone } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { SITE } from "@/lib/data";

export function CtaBanner() {
  return (
    <section className="py-16 lg:py-24" id="cta">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-accent/25 bg-gradient-to-br from-surface-elevated via-surface to-surface-elevated p-8 sm:p-12 lg:p-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-secondary/15 blur-3xl" />

          <div className="relative max-w-2xl">
            <p className="label-caps text-accent">Get Started</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ready to Rent?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Request a quote, browse our catalogue, or call our team in{" "}
              {SITE.location} for availability and delivery options.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <LinkButton href="/contact" size="lg" className="glow-accent">
                Request a Quote
                <ArrowRight className="h-5 w-5" />
              </LinkButton>
              <LinkButton href="/equipment" variant="outline" size="lg">
                Browse Equipment
              </LinkButton>
              <a
                href={SITE.phoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-8 py-3.5 text-base font-semibold text-foreground transition-all duration-300 hover:border-secondary hover:text-secondary"
              >
                <Phone className="h-5 w-5 text-secondary" />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
