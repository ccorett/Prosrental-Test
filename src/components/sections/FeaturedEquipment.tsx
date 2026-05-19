import { EquipmentCard } from "@/components/cards/EquipmentCard";
import { LinkButton } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EQUIPMENT } from "@/lib/data";

export function FeaturedEquipment() {
  const featured = EQUIPMENT.filter((item) => item.featured);

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
              key={item.id}
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
