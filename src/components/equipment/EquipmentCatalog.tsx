"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { EquipmentCard } from "@/components/cards/EquipmentCard";
import {
  EQUIPMENT_CATEGORY_LABELS,
  EQUIPMENT_CATEGORY_SLUGS,
} from "@/lib/equipment/categories";
import type { EquipmentItem } from "@/lib/equipment/types";

const INPUT_CLASS =
  "w-full rounded-lg border border-border bg-surface py-3 pl-11 pr-4 text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

type EquipmentCatalogProps = {
  equipment: EquipmentItem[];
  initialCategory?: string;
};

export function EquipmentCatalog({
  equipment,
  initialCategory = "all",
}: EquipmentCatalogProps) {
  const [query, setQuery] = useState("");
  const [categorySlug, setCategorySlug] = useState(initialCategory);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return equipment.filter((item) => {
      const matchesCategory =
        categorySlug === "all" || item.categorySlug === categorySlug;
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.itemId.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [equipment, query, categorySlug]);

  const featured = filtered.filter((item) => item.featured);
  const regular = filtered.filter((item) => !item.featured);

  return (
    <div>
      <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search equipment, category, or item ID..."
            className={INPUT_CLASS}
            aria-label="Search equipment"
          />
        </label>
        <select
          value={categorySlug}
          onChange={(e) => setCategorySlug(e.target.value)}
          className="rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {EQUIPMENT_CATEGORY_SLUGS.map((slug) => (
            <option key={slug} value={slug}>
              {EQUIPMENT_CATEGORY_LABELS[slug]}
            </option>
          ))}
        </select>
      </div>

      <p className="mb-6 text-sm text-muted">
        Showing {filtered.length} of {equipment.length} items
      </p>

      {filtered.length === 0 ? (
        <div className="card-industrial p-10 text-center">
          <p className="text-foreground">No equipment matches your search.</p>
          <p className="mt-2 text-sm text-muted">Try another category or keyword.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {featured.length > 0 && (
            <section>
              <header className="mb-6">
                <p className="label-caps text-accent">Featured Equipment</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  Popular Rentals
                </h2>
              </header>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {featured.map((item) => (
                  <EquipmentCard key={item.itemId} equipment={item} />
                ))}
              </div>
            </section>
          )}

          {regular.length > 0 && (
            <section>
              {featured.length > 0 && (
                <header className="mb-6">
                  <h2 className="text-2xl font-semibold tracking-tight">All Equipment</h2>
                </header>
              )}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {regular.map((item) => (
                  <EquipmentCard key={item.itemId} equipment={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
