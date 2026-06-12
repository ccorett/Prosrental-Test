import { ManagerSubNav } from "@/components/manager-control/ManagerSubNav";
import { EmployeePageHeader } from "@/components/employee-portal/app/EmployeePageHeader";
import { requireManagerControlAccess } from "@/lib/access/guards";

export const dynamic = "force-dynamic";

export default async function ManagerControlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireManagerControlAccess();

  return (
    <div>
      <EmployeePageHeader
        title="Manager Control Centre"
        description="Operational oversight, approvals, financial control, and reporting."
      />
      <ManagerSubNav />
      {children}
    </div>
  );
}
