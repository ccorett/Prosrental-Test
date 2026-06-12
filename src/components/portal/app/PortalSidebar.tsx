"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { logoutCustomer } from "@/lib/auth/actions";
import { PORTAL_NAV } from "@/lib/portal/nav";
import { cn } from "@/lib/utils";

type PortalSidebarProps = {
  customerName: string;
};

export function PortalSidebar({ customerName }: PortalSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="mb-4 inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground lg:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        Portal Menu
      </button>

      <aside
        className={cn(
          "lg:block",
          open ? "block" : "hidden"
        )}
      >
        <div className="card-industrial sticky top-24 p-4">
          <p className="label-caps text-accent">Customer Portal</p>
          <p className="mt-1 truncate text-sm font-semibold text-foreground">
            {customerName}
          </p>

          <nav className="mt-6 space-y-1" aria-label="Portal navigation">
            {PORTAL_NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-accent/15 text-accent"
                      : "text-muted hover:bg-surface hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <form action={logoutCustomer} className="mt-6 border-t border-border pt-4">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Sign Out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
