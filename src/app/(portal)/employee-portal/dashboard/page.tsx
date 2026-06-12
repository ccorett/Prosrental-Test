import {
  AlertTriangle,
  Bell,
  ClipboardList,
  Package,
  Truck,
  Wrench,
} from "lucide-react";
import { AccessRestricted } from "@/components/employee-portal/app/AccessRestricted";
import { EmployeePageHeader } from "@/components/employee-portal/app/EmployeePageHeader";
import { EmployeeStatCard } from "@/components/employee-portal/app/EmployeeStatCard";
import { requireEmployeePortalAccess } from "@/lib/access/guards";
import { ensureModulePage } from "@/lib/employee-portal/guard";
import { getEmployeeDashboardStats } from "@/lib/employee-portal/queries";

export const metadata = { title: "Employee Dashboard" };

export default async function EmployeeDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ access?: string }>;
}) {
  const employee = await requireEmployeePortalAccess();
  await ensureModulePage(employee, "DASHBOARD");
  const stats = await getEmployeeDashboardStats(employee);
  const params = await searchParams;
  const accessDenied = params.access === "denied";

  return (
    <div>
      {accessDenied && (
        <div className="mb-6">
          <AccessRestricted />
        </div>
      )}
      <EmployeePageHeader
        title={`Welcome, ${employee.fullName.split(" ")[0]}`}
        description={`${employee.roleLabel} — operational overview across Pro Rentals.`}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <EmployeeStatCard label="My assigned jobs" value={stats.assignedJobs} icon={ClipboardList} />
        <EmployeeStatCard label="Open dispatches" value={stats.openDispatches} icon={Truck} href="/employee-portal/equipment-operations" />
        <EmployeeStatCard label="Pending returns" value={stats.pendingReturns} icon={Package} href="/employee-portal/equipment-operations" />
        <EmployeeStatCard label="Maintenance due" value={stats.maintenanceDue} icon={Wrench} href="/employee-portal/maintenance" />
        <EmployeeStatCard label="Open repairs" value={stats.openRepairs} icon={Wrench} href="/employee-portal/maintenance" />
        <EmployeeStatCard label="Low stock items" value={stats.lowStock} icon={Package} href="/employee-portal/inventory" />
        <EmployeeStatCard label="Pending deliveries" value={stats.pendingDeliveries} icon={Truck} href="/employee-portal/fleet-delivery" />
        <EmployeeStatCard label="Leave requests" value={stats.pendingLeave} icon={ClipboardList} href="/employee-portal/hr" />
        <EmployeeStatCard label="Open incidents" value={stats.openIncidents} icon={AlertTriangle} href="/employee-portal/safety-compliance" />
        <EmployeeStatCard label="Unread notifications" value={stats.unreadNotifications} icon={Bell} href="/employee-portal/notifications" />
      </div>
    </div>
  );
}
