"use client";

import { ArrowRight, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PORTAL_PATH } from "@/lib/portal";

export function CustomerPortalCta() {
  const pathname = usePathname();

  if (pathname === PORTAL_PATH) {
    return null;
  }

  return (
    <section className="border-t border-border/60 bg-background py-14 lg:py-16">
      <Container>
        <div className="relative overflow-hidden rounded-2xl border border-accent/25 bg-gradient-to-br from-surface-elevated/90 via-surface to-background p-8 backdrop-blur-sm sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-secondary/10 blur-3xl" />

          <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                <LayoutGrid className="h-3.5 w-3.5" aria-hidden />
                Customer Portal
              </span>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Ready to manage your rentals online?
              </h2>
              <p className="mt-3 text-muted">
                Self-manage bookings, quotes, invoices, documents, and service
                requests from one secure portal.
              </p>
            </div>
            <Link
              href={PORTAL_PATH}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-accent/40 bg-accent px-8 py-3.5 text-sm font-semibold text-canvas glow-accent transition-colors hover:bg-accent-hover"
            >
              Access Customer Portal
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
