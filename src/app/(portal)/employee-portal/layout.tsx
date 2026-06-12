import { EmployeePortalShell } from "@/components/employee-portal/app/EmployeePortalShell";
import { requireEmployeePortalAccess } from "@/lib/access/guards";
import { requireDatabaseUrl } from "@/lib/db/require-database";
import { getAccessibleModules } from "@/lib/employee-portal/queries";

export const dynamic = "force-dynamic";

export default async function EmployeePortalAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  requireDatabaseUrl();
  const employee = await requireEmployeePortalAccess();
  const allowedModules = await getAccessibleModules(employee);

  return (
    <EmployeePortalShell employee={employee} allowedModules={allowedModules}>
      {children}
    </EmployeePortalShell>
  );
}
