import { Container } from "@/components/ui/Container";
import { RentalCostEstimator } from "@/components/estimator/RentalCostEstimator";

type RentalCostEstimatorSectionProps = {
  className?: string;
};

export function RentalCostEstimatorSection({
  className,
}: RentalCostEstimatorSectionProps) {
  return (
    <section
      className={`border-t border-border/60 bg-canvas py-16 lg:py-[5rem] ${className ?? ""}`}
      id="rental-estimator"
    >
      <Container>
        <header className="mx-auto mb-10 max-w-2xl text-center lg:mb-12">
          <p className="label-caps text-accent">Plan Your Budget</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Rental Cost Estimator
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            Compare renting versus buying—and see full sanitation service package
            costs including recurring servicing.
          </p>
        </header>

        <RentalCostEstimator />
      </Container>
    </section>
  );
}
