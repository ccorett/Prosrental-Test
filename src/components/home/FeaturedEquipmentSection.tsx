import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EquipmentCard } from "@/components/cards/EquipmentCard";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { getFeaturedEquipment } from "@/lib/equipment/queries";

export async function FeaturedEquipmentSection() {
  const featured = await getFeaturedEquipment(4);

  return (
    <section className="py-16 lg:py-[5rem]">
      <Container>
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label-caps text-accent">Featured Equipment</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Popular Rentals
            </h2>
            <p className="mt-3 max-w-xl text-muted">
              Browse rates, availability, and details—then inquire in one click.
            </p>
          </div>
          <Link
            href="/equipment"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-hover"
          >
            View full catalogue
            <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((item) => (
            <EquipmentCard key={item.itemId} equipment={item} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <LinkButton href="/equipment" variant="outline" size="lg">
            Browse Equipment
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
