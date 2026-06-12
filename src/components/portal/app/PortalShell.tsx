import Link from "next/link";
import type { SessionCustomer } from "@/lib/auth/session";
import { PortalSidebar } from "@/components/portal/app/PortalSidebar";

type PortalShellProps = {
  customer: SessionCustomer;
  children: React.ReactNode;
};

export function PortalShell({ customer, children }: PortalShellProps) {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-border bg-surface/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/customer-portal/dashboard" className="text-lg font-bold text-foreground">
            Pro Rentals <span className="text-accent">Portal</span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-muted transition-colors hover:text-accent"
          >
            Back to website
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8 lg:py-10">
        <PortalSidebar customerName={customer.fullName} />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
