"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { logoutEmployee } from "@/lib/employee-auth/actions";
import { RoleBadge } from "@/components/employee-portal/app/RoleBadge";
import { EMPLOYEE_PORTAL_NAV } from "@/lib/employee-portal/nav";
import { cn } from "@/lib/utils";
import type { EmployeeModule, StaffRoleCode } from "@prisma/client";

type EmployeePortalSidebarProps = {
  employeeName: string;
  roleLabel: string;
  roleCode: StaffRoleCode;
  allowedModules: EmployeeModule[];
};

export function EmployeePortalSidebar({
  employeeName,
  roleLabel,
  roleCode,
  allowedModules,
}: EmployeePortalSidebarProps) {
  const pathname = usePathname();
  const allowed = new Set(allowedModules);
  const navItems = EMPLOYEE_PORTAL_NAV.filter((item) => allowed.has(item.module));

  return (
    <aside className="card-industrial h-fit p-4 lg:sticky lg:top-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">Signed in</p>
      <p className="mt-1 font-semibold text-foreground">{employeeName}</p>
      <div className="mt-2">
        <RoleBadge label={roleLabel} code={roleCode} />
      </div>

      <nav className="mt-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-secondary/15 text-secondary"
                  : "text-muted hover:bg-surface-elevated hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <form action={logoutEmployee} className="mt-6 border-t border-border pt-4">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-elevated hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </form>
    </aside>
  );
}
