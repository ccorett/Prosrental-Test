import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PortalFeatureCard } from "@/components/portal/PortalFeatureCard";
import { PortalHero } from "@/components/portal/PortalHero";
import { PortalRoadmap } from "@/components/portal/PortalRoadmap";
import { Container } from "@/components/ui/Container";
import { getSessionCustomer } from "@/lib/auth/session";
import { PORTAL_FEATURES } from "@/lib/portal";

export const metadata: Metadata = {
  title: "Customer Portal",
  description:
    "Manage Pro Rentals bookings, quotations, invoices, documents, and service requests online.",
};

export const dynamic = "force-dynamic";

export default async function CustomerPortalPage() {
  const customer = await getSessionCustomer();
  if (customer) {
    redirect("/customer-portal/dashboard");
  }

  return (
    <>
      <PortalHero />

      <section className="py-16 lg:py-24">
        <Container>
          <header className="mx-auto mb-12 max-w-2xl text-center">
            <p className="label-caps text-accent">Portal Features</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything in One Place
            </h2>
            <p className="mt-4 text-muted">
              Designed for contractors, businesses, homeowners, and facility
              managers who need full visibility over their rentals.
            </p>
          </header>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {PORTAL_FEATURES.map((feature) => (
              <PortalFeatureCard key={feature.id} feature={feature} />
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/customer-portal/login"
              className="inline-flex rounded-2xl bg-accent px-8 py-3.5 text-sm font-semibold text-canvas glow-accent transition-colors hover:bg-accent-hover"
            >
              Sign In
            </Link>
            <Link
              href="/customer-portal/register"
              className="inline-flex rounded-2xl border border-accent/40 px-8 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent/10"
            >
              Create Account
            </Link>
          </div>
        </Container>
      </section>

      <section className="border-t border-border/60 bg-canvas py-16 lg:py-24">
        <Container>
          <header className="mb-10 max-w-2xl">
            <p className="label-caps text-accent">Portal Roadmap</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Built for Self-Service
            </h2>
            <p className="mt-4 text-muted">
              Phase 1 is live—create your account to manage bookings, quotes,
              invoices, documents, and service requests online.
            </p>
          </header>
          <PortalRoadmap />
        </Container>
      </section>
    </>
  );
}
