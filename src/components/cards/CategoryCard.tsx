import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import type { Category } from "@/lib/data";

type CategoryCardProps = {
  category: Category;
};

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = category.icon;

  return (
    <Link
      href={category.href}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface-elevated transition-all duration-300 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10 hover-lift"
    >
      <PlaceholderMedia
        seed={category.id}
        label={category.title}
        aspectClass="aspect-[16/10] w-full"
        overlay
        icon={Icon}
        className="transition-transform duration-500 group-hover:scale-[1.02]"
      >
        <span className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-background shadow-lg shadow-accent/30 transition-transform duration-300 group-hover:scale-110">
          <Icon className="h-6 w-6" aria-hidden />
        </span>
      </PlaceholderMedia>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-semibold text-foreground transition-colors group-hover:text-accent">
          {category.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
          {category.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium text-secondary">
            {category.itemCount}+ items
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent">
            Explore
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
