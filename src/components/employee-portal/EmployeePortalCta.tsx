"use client";

import { ArrowRight, Building2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import {
  EMPLOYEE_PORTAL_PATH,
  shouldHideEmployeePublicCta,
} from "@/lib/employee-portal/nav";

export function EmployeePortalCta() {
  const pathname = usePathname();

  if (shouldHideEmployeePublicCta(pathname)) {
    return null;
  }

  return (
    <section className="border-t border-border/60 bg-background py-14 lg:py-16">
      <Container>
        <div className="relative overflow-hidden rounded-2xl border border-secondary/25 bg-gradient-to-br from-surface-elevated/90 via-surface to-background p-8 backdrop-blur-sm sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-secondary/15 blur-3xl" />
          <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                <Building2 className="h-3.5 w-3.5" aria-hidden />
                Employee Portal
              </span>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Internal operations hub
              </h2>
              <p className="mt-3 text-muted">
                Manage equipment, fleet, maintenance, HR, safety, and admin workflows
                from one secure employee platform.
              </p>
            </div>
            <Link
              href={EMPLOYEE_PORTAL_PATH}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-secondary/40 bg-secondary px-8 py-3.5 text-sm font-semibold text-background transition-colors hover:bg-secondary-hover"
            >
              Employee Portal
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
