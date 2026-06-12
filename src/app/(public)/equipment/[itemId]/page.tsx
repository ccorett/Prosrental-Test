import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { EquipmentMedia } from "@/components/equipment/EquipmentMedia";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import {
  canRequestQuote,
  getCardAvailabilityLabel,
  getCardAvailabilityStatus,
  showsComingSoonPlaceholder,
} from "@/lib/equipment/display";
import { getEquipmentByItemId } from "@/lib/equipment/queries";
import { getConditionLabel } from "@/lib/equipment/types";
import { cn, formatTTD } from "@/lib/utils";

type PageProps = {
  params: Promise<{ itemId: string }>;
};

export const dynamic = "force-dynamic";

const AVAILABILITY_STYLES = {
  AVAILABLE: "border-secondary/40 bg-secondary-muted text-secondary",
  RESERVED: "border-tertiary/40 bg-tertiary/10 text-tertiary",
  OUT_OF_STOCK: "border-border bg-surface text-muted",
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
    description: equipment.shortDescription ?? equipment.description,
  };
}

export default async function EquipmentDetailPage({ params }: PageProps) {
  const { itemId } = await params;
  const equipment = await getEquipmentByItemId(itemId);

  if (!equipment) {
    notFound();
  }

  const inquiryHref = `/contact?equipment=${encodeURIComponent(equipment.name)}`;
  const displayStatus = getCardAvailabilityStatus(equipment);
  const showPlaceholder = showsComingSoonPlaceholder(equipment);
  const allowInquiry = canRequestQuote(equipment);
  const specs = equipment.specifications
    ?.split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

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
          <div className="space-y-4">
            <EquipmentMedia
              itemId={equipment.itemId}
              name={equipment.name}
              imageUrl={equipment.imageUrl}
              comingSoon={showPlaceholder}
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
                  AVAILABILITY_STYLES[displayStatus]
                )}
              >
                {getCardAvailabilityLabel(equipment)}
              </span>
            </EquipmentMedia>

            {equipment.galleryImages.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {equipment.galleryImages.map((url) => (
                  <div
                    key={url}
                    className="relative aspect-square overflow-hidden rounded-lg border border-border bg-surface"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="label-caps text-accent">{equipment.category}</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {equipment.name}
            </h1>
            <p className="mt-2 text-sm text-muted">Item code: {equipment.itemId}</p>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              {equipment.fullDescription ?? equipment.description}
            </p>

            {specs && specs.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
                  Specifications
                </h2>
                <ul className="mt-3 space-y-2 text-sm text-foreground">
                  {specs.map((spec) => (
                    <li key={spec} className="rounded-lg border border-border/60 bg-surface px-3 py-2">
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
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
              <div className="card-industrial p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Deposit
                </p>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {formatTTD(equipment.depositAmount)}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              {allowInquiry ? (
                <LinkButton href={inquiryHref} size="lg" className="gap-2">
                  Request Quote
                </LinkButton>
              ) : (
                <span className="inline-flex items-center rounded-lg border border-border px-6 py-3 text-sm font-semibold text-muted">
                  Not available for booking
                </span>
              )}
              <LinkButton href="/equipment" variant="outline" size="lg">
                Browse more equipment
              </LinkButton>
            </div>

            <dl className="mt-10 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-muted">Availability</dt>
                <dd className="mt-1 font-medium text-foreground">
                  {getCardAvailabilityLabel(equipment)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Condition</dt>
                <dd className="mt-1 font-medium text-foreground">
                  {getConditionLabel(equipment.conditionStatus)}
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
