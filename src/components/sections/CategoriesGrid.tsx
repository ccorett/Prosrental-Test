import { CategoryCard } from "@/components/cards/CategoryCard";
import { LinkButton } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CATEGORIES } from "@/lib/data";

export function CategoriesGrid() {
  return (
    <section className="py-20 lg:py-28" id="categories">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Our Categories"
          title="Equipment for Every Job"
          description="Cleaning equipment, DIY tools, construction gear, and facility rentals—all maintained and ready to deploy."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category, index) => (
            <div
              key={category.id}
              className="opacity-0-start animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <LinkButton href="/categories" variant="outline" className="hover-lift">
            View All Categories
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
