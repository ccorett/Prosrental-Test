import { Container } from "@/components/ui/Container";
import { WHY_CHOOSE_US } from "@/lib/data";

export function ServiceHighlightsSection() {
  return (
    <section className="border-y border-border/60 bg-canvas py-16 lg:py-[5rem]">
      <Container>
        <header className="mx-auto mb-12 max-w-2xl text-center">
          <p className="label-caps text-accent">Why Pro Rentals</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Service Highlights
          </h2>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {WHY_CHOOSE_US.map((item) => (
            <article key={item.title} className="card-industrial p-6 lg:p-8">
              <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
