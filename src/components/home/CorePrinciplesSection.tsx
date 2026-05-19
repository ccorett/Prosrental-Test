import { Lightbulb, Shield, Wrench } from "lucide-react";
import { Container } from "@/components/ui/Container";

const PRINCIPLES = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "Telemetry-enabled fleet tracking and predictive maintenance keep your projects ahead of schedule.",
    accent: "bg-accent/15 text-accent",
  },
  {
    icon: Shield,
    title: "Safety",
    description:
      "Every unit meets OSHA-aligned inspection standards with documented compliance for your site audits.",
    accent: "bg-secondary/15 text-secondary",
  },
  {
    icon: Wrench,
    title: "Expert Support",
    description:
      "Certified technicians on call 24/7—field deployment, operator guidance, and rapid swap-out logistics.",
    accent: "bg-tertiary/15 text-tertiary",
  },
] as const;

export function CorePrinciplesSection() {
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <header className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Our Core Principles
          </h2>
          <span className="mx-auto mt-4 block h-0.5 w-12 bg-accent" aria-hidden />
        </header>

        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {PRINCIPLES.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="card-industrial flex flex-col p-8 lg:p-10"
              >
                <span
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${item.accent}`}
                >
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-6 text-xl font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted sm:text-base">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
