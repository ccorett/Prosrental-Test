"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/employee-portal/manager", label: "Dashboard", exact: true },
  { href: "/employee-portal/manager/users", label: "Users" },
  { href: "/employee-portal/manager/equipment", label: "Equipment" },
  { href: "/employee-portal/manager/bookings", label: "Bookings" },
  { href: "/employee-portal/manager/financial", label: "Financial" },
  { href: "/employee-portal/manager/maintenance", label: "Maintenance" },
  { href: "/employee-portal/manager/reports", label: "Reports" },
  { href: "/employee-portal/manager/audit", label: "Audit" },
] as const;

export function ManagerSubNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-8 flex flex-wrap gap-2 border-b border-border pb-4">
      {LINKS.map((link) => {
        const active =
          "exact" in link && link.exact
            ? pathname === link.href
            : pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-accent/15 text-accent"
                : "text-muted hover:bg-surface hover:text-foreground"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
