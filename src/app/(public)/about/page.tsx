import type { Metadata } from "next";
import { Warehouse } from "lucide-react";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PageHero } from "@/components/sections/PageHero";
import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import {
  ABOUT_STATS,
  COMPANY_OVERVIEW,
  CORE_VALUES,
  TARGET_MARKETS,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Pro Rentals—your reliable equipment rental partner in Plymouth, Tobago.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Equipment Rentals Built on Trust"
        description={COMPANY_OVERVIEW}
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
                equipment accessible without the complexity. Today we maintain a diverse
                fleet across DIY, construction, cleaning, landscaping, access, and
                sanitation categories—each unit inspected and ready to perform.
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

          <div className="mt-20">
            <header className="mb-10 max-w-2xl">
              <p className="label-caps text-accent">Mission & Values</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Reliable Equipment. Transparent Service.
              </h2>
              <p className="mt-4 text-muted">
                We position Pro Rentals as a dependable rental partner—not just a
                catalogue, but a team that helps you plan, quote, and execute.
              </p>
            </header>
            <div className="grid gap-6 md:grid-cols-3">
              {CORE_VALUES.map((value) => (
                <article key={value.title} className="card-industrial p-6 lg:p-8">
                  <h3 className="text-xl font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                    {value.description}
                  </p>
                </article>
              ))}
            </div>
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
