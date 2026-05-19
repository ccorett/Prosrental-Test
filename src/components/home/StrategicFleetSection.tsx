import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";

const SIDE_CARDS = [
  {
    seed: "logistics" as const,
    title: "Precision Logistics",
    tag: "Next Day Deployment",
  },
  {
    seed: "power" as const,
    title: "Power Generation",
    tag: "24/7 Redundancy",
  },
];

export function StrategicFleetSection() {
  return (
    <section className="border-y border-border/60 bg-background py-16 lg:py-[5rem]">
      <Container>
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label-caps text-accent">The Infrastructure</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Our Strategic Fleet
            </h2>
          </div>
          <Link
            href="/equipment"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-accent-hover"
          >
            Full Specifications
            <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
          <Link
            href="/categories#construction"
            className="group card-industrial relative block min-h-[320px] overflow-hidden lg:min-h-[480px]"
          >
            <MediaPlaceholder
              seed="cranes"
              label="Heavy earthmoving equipment"
              className="absolute inset-0 h-full w-full"
              overlay="bottom"
            />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <h3 className="text-2xl font-semibold text-foreground sm:text-3xl">
                Heavy Earthmovers
              </h3>
              <p className="mt-2 max-w-md text-sm text-muted">
                Excavators, loaders, and compaction systems for large-scale site
                preparation.
              </p>
            </div>
          </Link>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            {SIDE_CARDS.map((card) => (
              <Link
                key={card.title}
                href="/equipment"
                className="group card-industrial relative block min-h-[220px] overflow-hidden lg:min-h-[228px]"
              >
                <MediaPlaceholder
                  seed={card.seed}
                  label={card.title}
                  className="absolute inset-0 h-full w-full"
                  overlay="bottom"
                />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="label-caps text-accent">{card.tag}</p>
                  <h3 className="mt-2 text-xl font-semibold text-foreground">
                    {card.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
