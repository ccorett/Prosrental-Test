import { Award, Clock, Shield, Users } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { WHY_CHOOSE_US } from "@/lib/data";

const icons = [Shield, Clock, Award, Users];

export function WhyChooseUs() {
  return (
    <section
      className="border-y border-border bg-surface py-20 lg:py-28"
      id="why-us"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Why Choose Us"
          title="Built for Professionals Who Need Results"
          description="We understand your deadlines. Our fleet, team, and processes are designed to keep your projects moving."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_CHOOSE_US.map((item, index) => {
            const Icon = icons[index];
            return (
              <article
                key={item.title}
                className="group rounded-xl border border-border bg-surface-elevated p-6 opacity-0-start animate-fade-in-up transition-all duration-300 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 hover-lift"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent-muted text-accent transition-all duration-300 group-hover:bg-accent group-hover:text-background group-hover:shadow-lg group-hover:shadow-accent/30">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
