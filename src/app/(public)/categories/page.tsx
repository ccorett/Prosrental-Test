import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PageHero } from "@/components/sections/PageHero";
import { LinkButton } from "@/components/ui/Button";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { getActiveCategories } from "@/lib/equipment/queries";
export const metadata: Metadata = {
  title: "Categories",
  description:
    "Equipment rental categories including cleaning, construction, DIY, landscaping, access, sanitation, and event facilities.",
};

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await getActiveCategories();

  return (
    <>
      <PageHero
        eyebrow="Categories"
        title="Equipment by Category"
        description="Find the right equipment for your industry, project size, and timeline."
      />
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-20 px-4 sm:px-6 lg:px-8">
          {categories.map((category) => (
            <article
              key={category.id}
              id={category.slug}
              className="scroll-mt-24 grid items-center gap-10 lg:grid-cols-2"
            >
              <PlaceholderMedia
                seed={`category-page-${category.slug}`}
                label={category.name}
                aspectClass="aspect-[16/10] w-full rounded-2xl border border-border"
                icon={Wrench}
              />
              <div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent-muted text-accent">
                  <Wrench className="h-6 w-6" aria-hidden />
                </span>
                <h2 className="mt-4 text-3xl font-bold text-foreground">
                  {category.name}
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-muted">
                  {category.description ??
                    `Browse ${category.name.toLowerCase()} available for rent.`}
                </p>
                <p className="mt-2 text-sm text-muted">
                  {category.itemCount ?? 0} items available
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <LinkButton href={`/equipment?category=${category.slug}`}>
                    Browse Equipment
                  </LinkButton>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent-hover"
                  >
                    Request quote
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
