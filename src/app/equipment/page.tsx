import type { Metadata } from "next";
import { EquipmentCard } from "@/components/cards/EquipmentCard";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PageHero } from "@/components/sections/PageHero";
import { EQUIPMENT } from "@/lib/data";

export const metadata: Metadata = {
  title: "Equipment Rentals",
  description:
    "Browse our full catalog of cleaning equipment, DIY tools, construction tools, and facility rentals.",
};

export default function EquipmentPage() {
  return (
    <>
      <PageHero
        eyebrow="Equipment Rentals"
        title="Full Equipment Catalog"
        description="Explore our fleet of professionally maintained rental equipment. Daily, weekly, and monthly rates available."
      />
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-10 text-muted">
            Showing {EQUIPMENT.length} items. Contact us for availability and
            custom rental packages.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {EQUIPMENT.map((item) => (
              <EquipmentCard key={item.id} equipment={item} />
            ))}
          </div>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
