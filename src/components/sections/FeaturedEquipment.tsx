import { EquipmentCard } from "@/components/cards/EquipmentCard";
import { LinkButton } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { INVENTORY_RECORDS } from "@/lib/equipment/inventory-records";
import type { EquipmentItem } from "@/lib/equipment/types";

function toEquipmentItem(record: (typeof INVENTORY_RECORDS)[number]): EquipmentItem {
  return {
    id: record.itemId,
    itemId: record.itemId,
    name: record.equipmentName,
    category: record.category,
    categorySlug: record.categorySlug,
    description: record.description,
    dailyRate: record.dailyRate,
    weeklyRate: record.weeklyRate,
    monthlyRate: record.monthlyRate,
    quantityAvailable: record.quantityAvailable,
    quantityTotal: record.quantityTotal,
    availabilityStatus: record.availabilityStatus,
    imageUrl: record.imageUrl,
    featured: record.featured,
    comingSoon: record.comingSoon,
  };
}

export function FeaturedEquipment() {
  const featured = INVENTORY_RECORDS.filter((item) => item.featured)
    .slice(0, 4)
    .map(toEquipmentItem);

  return (
    <section className="py-20 lg:py-28" id="featured">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Featured Equipment"
          title="Popular Rentals This Week"
          description="Our most requested equipment—maintained, tested, and ready for your next job."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((item, index) => (
            <div
              key={item.itemId}
              className="opacity-0-start animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <EquipmentCard equipment={item} />
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <LinkButton href="/equipment" className="hover-lift">
            View Full Catalog
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
