import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { EquipmentMedia } from "@/components/equipment/EquipmentMedia";
import { getAvailabilityLabel, type EquipmentItem } from "@/lib/equipment/types";
import { cn, formatTTD } from "@/lib/utils";

type EquipmentCardProps = {
  equipment: EquipmentItem;
};

const AVAILABILITY_STYLES = {
  AVAILABLE: "border-secondary/40 bg-secondary-muted text-secondary",
  RESERVED: "border-tertiary/40 bg-tertiary/10 text-tertiary",
  OUT_OF_SERVICE: "border-border bg-surface text-muted",
  COMING_SOON: "border-accent/30 bg-accent/10 text-accent",
} as const;

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  const detailHref = `/equipment/${equipment.itemId}`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface-elevated transition-all duration-300 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10">
      <Link href={detailHref} className="block">
        <EquipmentMedia
          itemId={equipment.itemId}
          name={equipment.name}
          imageUrl={equipment.imageUrl}
          comingSoon={equipment.comingSoon}
          featured={equipment.featured}
          aspectClass="aspect-[4/3] w-full"
          className="transition-transform duration-500 group-hover:scale-[1.02]"
        >
          {equipment.featured && (
            <span className="absolute left-3 top-3 z-10 rounded-md bg-accent px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-background">
              Featured
            </span>
          )}
          <span
            className={cn(
              "absolute right-3 top-3 z-10 rounded-md border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
              AVAILABILITY_STYLES[equipment.availabilityStatus]
            )}
          >
            {getAvailabilityLabel(equipment.availabilityStatus)}
          </span>
        </EquipmentMedia>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
          {equipment.category}
        </span>
        <h3 className="mt-2 text-lg font-semibold text-foreground transition-colors group-hover:text-accent">
          <Link href={detailHref}>{equipment.name}</Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{equipment.description}</p>
        <div className="mt-4 space-y-1 text-sm text-muted">
          <p>
            <span className="text-foreground">{formatTTD(equipment.dailyRate)}</span> / day
          </p>
          <p>
            {formatTTD(equipment.weeklyRate)} / week · {formatTTD(equipment.monthlyRate)} / month
          </p>
        </div>
        <div className="mt-auto flex items-end justify-between pt-5">
          <p className="text-xs text-muted">
            {equipment.quantityAvailable} of {equipment.quantityTotal} available
          </p>
          <Link
            href={`/contact?equipment=${encodeURIComponent(equipment.name)}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-accent transition-colors hover:text-accent-hover"
          >
            Inquire
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
