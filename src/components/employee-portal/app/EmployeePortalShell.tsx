import Link from "next/link";
import type { SessionEmployee } from "@/lib/employee-auth/session";
import { EmployeePortalSidebar } from "@/components/employee-portal/app/EmployeePortalSidebar";
import { RoleBadge } from "@/components/employee-portal/app/RoleBadge";
import type { EmployeeModule } from "@prisma/client";

type EmployeePortalShellProps = {
  employee: SessionEmployee;
  allowedModules: EmployeeModule[];
  children: React.ReactNode;
};

export function EmployeePortalShell({
  employee,
  allowedModules,
  children,
}: EmployeePortalShellProps) {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-border bg-surface/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/employee-portal/dashboard" className="text-lg font-bold text-foreground">
            Pro Rentals <span className="text-secondary">Ops</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <RoleBadge label={employee.roleLabel} code={employee.roleCode} />
            <Link href="/" className="font-medium text-muted transition-colors hover:text-secondary">
              Back to website
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8 lg:py-10">
        <EmployeePortalSidebar
          employeeName={employee.fullName}
          roleLabel={employee.roleLabel}
          roleCode={employee.roleCode}
          allowedModules={allowedModules}
        />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
