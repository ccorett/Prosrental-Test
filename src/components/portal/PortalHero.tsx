import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function PortalHero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-surface">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--accent-muted)_0%,transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgb(108_200_1_/_0.08)_0%,transparent_50%)]" />

      <Container className="relative py-16 sm:py-20 lg:py-24">
        <span className="label-caps inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-accent">
          <LayoutGrid className="h-4 w-4" aria-hidden />
          Customer Portal
        </span>

        <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-[3.25rem]">
          Manage Your Rentals Anytime, Anywhere
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
          Access bookings, quotations, invoices, rental records, documents, and
          service requests through your secure customer portal.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/customer-portal/login"
            className="inline-flex items-center justify-center rounded-2xl bg-accent px-8 py-3.5 text-sm font-semibold text-canvas glow-accent transition-colors hover:bg-accent-hover"
          >
            Sign In to Portal
          </Link>
          <Link
            href="/customer-portal/register"
            className="inline-flex items-center justify-center rounded-2xl border border-border bg-surface-elevated/80 px-8 py-3.5 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:border-accent/40"
          >
            Create Account
          </Link>
        </div>
      </Container>
    </section>
  );
}
