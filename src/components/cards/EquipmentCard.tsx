import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import type { Equipment } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

type EquipmentCardProps = {
  equipment: Equipment;
};

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface-elevated transition-all duration-300 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10 hover-lift">
      <PlaceholderMedia
        seed={equipment.id}
        label={equipment.name}
        aspectClass="aspect-[4/3] w-full"
        className="bg-surface transition-transform duration-500 group-hover:scale-[1.02]"
      >
        {equipment.featured && (
          <span className="absolute left-3 top-3 z-10 rounded-md bg-accent px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-background">
            Featured
          </span>
        )}
      </PlaceholderMedia>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
          {equipment.category}
        </span>
        <h3 className="mt-2 text-lg font-semibold text-foreground transition-colors group-hover:text-accent">
          {equipment.name}
        </h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {equipment.specs.map((spec) => (
            <li
              key={spec}
              className="rounded-md border border-border/60 bg-surface px-2 py-1 text-xs text-muted"
            >
              {spec}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-end justify-between pt-5">
          <div>
            <span className="text-2xl font-bold text-foreground">
              {formatCurrency(equipment.dailyRate)}
            </span>
            <span className="text-sm text-muted"> / day</span>
          </div>
          <Link
            href="/contact"
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
