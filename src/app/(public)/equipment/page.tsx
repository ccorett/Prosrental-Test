import type { Metadata } from "next";
import { EquipmentCatalog } from "@/components/equipment/EquipmentCatalog";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { getActiveCategories, getAllEquipment } from "@/lib/equipment/queries";

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
  const [equipment, categories] = await Promise.all([
    getAllEquipment(),
    getActiveCategories(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Equipment Catalogue"
        title="Browse Our Fleet"
        description="Search and filter by category. View daily, weekly, and monthly rates—then inquire or request a quote in one click."
      />
      <section className="py-16 lg:py-24">
        <Container>
          <EquipmentCatalog
            equipment={equipment}
            categories={categories}
            initialCategory={category ?? "all"}
          />
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
