import { SectionHeader } from "@/components/ui/SectionHeader";
import { RENTAL_STEPS } from "@/lib/data";

export function RentalProcess() {
  return (
    <section className="py-20 lg:py-28" id="process">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="How It Works"
          title="Simple Rental Process"
          description="Get the equipment you need in four straightforward steps."
        />
        <ol className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {RENTAL_STEPS.map((step, index) => (
            <li
              key={step.step}
              className="group relative opacity-0-start animate-fade-in-up rounded-xl border border-border bg-surface-elevated p-6 transition-all duration-300 hover:border-secondary/40 hover:shadow-lg hover:shadow-secondary/10 hover-lift"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-secondary text-2xl font-bold text-background shadow-lg shadow-accent/20 transition-transform duration-300 group-hover:scale-105">
                {step.step}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.description}
              </p>
              {index < RENTAL_STEPS.length - 1 && (
                <span
                  className="absolute right-0 top-10 hidden h-0.5 w-full translate-x-1/2 bg-gradient-to-r from-accent/50 to-secondary/50 lg:block"
                  aria-hidden
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
