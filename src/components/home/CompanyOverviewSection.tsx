import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { COMPANY_OVERVIEW, SITE } from "@/lib/data";

export function CompanyOverviewSection() {
  return (
    <section className="border-b border-border/60 bg-background py-16 lg:py-[5rem]">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="label-caps text-accent">Digital Storefront</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Equipment Rentals for Every Project
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
            {COMPANY_OVERVIEW} Based in {SITE.location}, we help you browse inventory,
            estimate costs, and request quotes—all in one place.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <LinkButton href="/contact" size="lg">
              Request a Quote
            </LinkButton>
            <LinkButton href="/equipment" variant="outline" size="lg">
              Browse Equipment
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
