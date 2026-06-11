import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { EquipmentMedia } from "@/components/equipment/EquipmentMedia";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getEquipmentByItemId } from "@/lib/equipment/queries";
import { getAvailabilityLabel } from "@/lib/equipment/types";
import { cn, formatTTD } from "@/lib/utils";

type PageProps = {
  params: Promise<{ itemId: string }>;
};

const AVAILABILITY_STYLES = {
  AVAILABLE: "border-secondary/40 bg-secondary-muted text-secondary",
  RESERVED: "border-tertiary/40 bg-tertiary/10 text-tertiary",
  OUT_OF_SERVICE: "border-border bg-surface text-muted",
  COMING_SOON: "border-accent/30 bg-accent/10 text-accent",
} as const;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { itemId } = await params;
  const equipment = await getEquipmentByItemId(itemId);

  if (!equipment) {
    return { title: "Equipment Not Found" };
  }

  return {
    title: equipment.name,
    description: equipment.description,
  };
}

export default async function EquipmentDetailPage({ params }: PageProps) {
  const { itemId } = await params;
  const equipment = await getEquipmentByItemId(itemId);

  if (!equipment) {
    notFound();
  }

  const inquiryHref = `/contact?equipment=${encodeURIComponent(equipment.name)}`;

  return (
    <section className="py-12 lg:py-20">
      <Container>
        <Link
          href="/equipment"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to catalogue
        </Link>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <EquipmentMedia
            itemId={equipment.itemId}
            name={equipment.name}
            imageUrl={equipment.imageUrl}
            comingSoon={equipment.comingSoon}
            featured={equipment.featured}
            aspectClass="aspect-[4/3] w-full rounded-2xl border border-border"
          >
            {equipment.featured && (
              <span className="absolute left-4 top-4 z-10 rounded-md bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-background">
                Featured
              </span>
            )}
            <span
              className={cn(
                "absolute right-4 top-4 z-10 rounded-md border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
                AVAILABILITY_STYLES[equipment.availabilityStatus]
              )}
            >
              {getAvailabilityLabel(equipment.availabilityStatus)}
            </span>
          </EquipmentMedia>

          <div>
            <p className="label-caps text-accent">{equipment.category}</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {equipment.name}
            </h1>
            <p className="mt-2 text-sm text-muted">Item ID: {equipment.itemId}</p>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              {equipment.description}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="card-industrial p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Daily
                </p>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {formatTTD(equipment.dailyRate)}
                </p>
              </div>
              <div className="card-industrial p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Weekly
                </p>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {formatTTD(equipment.weeklyRate)}
                </p>
              </div>
              <div className="card-industrial p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Monthly
                </p>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {formatTTD(equipment.monthlyRate)}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <LinkButton href={inquiryHref} size="lg" className="gap-2">
                Request Quote
              </LinkButton>
              <LinkButton href="/equipment" variant="outline" size="lg">
                Browse more equipment
              </LinkButton>
            </div>

            <dl className="mt-10 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-muted">Availability</dt>
                <dd className="mt-1 font-medium text-foreground">
                  {getAvailabilityLabel(equipment.availabilityStatus)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Units available</dt>
                <dd className="mt-1 font-medium text-foreground">
                  {equipment.quantityAvailable} of {equipment.quantityTotal}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}
