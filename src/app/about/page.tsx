import type { Metadata } from "next";
import { Warehouse } from "lucide-react";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PageHero } from "@/components/sections/PageHero";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import { ABOUT_STATS, TARGET_MARKETS } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Pro Rentals—your trusted partner for professional equipment rentals since 2010.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Equipment Rentals Built on Trust"
        description="For over 15 years, Pro Rentals has helped contractors, businesses, and homeowners get the tools they need—when they need them."
      />

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Your Partner in Every Project
              </h2>
              <p className="mt-6 leading-relaxed text-muted">
                Pro Rentals started with a simple mission: make professional-grade
                equipment accessible without the complexity. Today we maintain one
                of the region&apos;s largest fleets of cleaning, construction, DIY,
                and facility equipment—each unit inspected and ready to perform.
              </p>
              <p className="mt-4 leading-relaxed text-muted">
                Whether you&apos;re a contractor on a tight deadline, a facility
                manager planning a deep clean, or a homeowner tackling a weekend
                project, our team delivers the right equipment with honest pricing
                and responsive support.
              </p>
              <ul className="mt-8 flex flex-wrap gap-2">
                {TARGET_MARKETS.map((market) => (
                  <li
                    key={market}
                    className="rounded-lg border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-foreground"
                  >
                    {market}
                  </li>
                ))}
              </ul>
            </div>
            <PlaceholderMedia
              seed="about-fleet"
              label="Pro Rentals warehouse and equipment fleet"
              aspectClass="aspect-[4/3] w-full rounded-2xl border border-border"
              icon={Warehouse}
            />
          </div>

          <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT_STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-surface-elevated p-6 text-center"
              >
                <p className="text-4xl font-bold text-accent">{stat.value}</p>
                <p className="mt-2 text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
