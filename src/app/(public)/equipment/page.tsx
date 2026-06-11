import type { Metadata } from "next";
import { EquipmentCatalog } from "@/components/equipment/EquipmentCatalog";
import { RentalCostEstimator } from "@/components/estimator/RentalCostEstimator";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { getAllEquipment } from "@/lib/equipment/queries";

export const metadata: Metadata = {
  title: "Equipment Catalogue",
  description:
    "Browse Pro Rentals equipment by category. Search inventory, view rates, availability, and rental details in TTD.",
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function EquipmentPage({ searchParams }: PageProps) {
  const { category } = await searchParams;
  const equipment = await getAllEquipment();

  return (
    <>
      <PageHero
        eyebrow="Equipment Catalogue"
        title="Browse Our Fleet"
        description="Search and filter by category. View daily, weekly, and monthly rates—then inquire or request a quote in one click."
      />
      <section className="py-16 lg:py-24">
        <Container>
          <EquipmentCatalog equipment={equipment} initialCategory={category ?? "all"} />
        </Container>
      </section>

      <section className="border-t border-border/60 bg-canvas py-16 lg:py-24">
        <Container>
          <header className="mb-10 max-w-2xl">
            <p className="label-caps text-accent">Estimate Costs</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Rental Cost Estimator
            </h2>
            <p className="mt-4 text-muted">
              Calculate rental duration, delivery fees, and sanitation service packages in TTD.
            </p>
          </header>
          <RentalCostEstimator />
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
