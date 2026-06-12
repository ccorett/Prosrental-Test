import { ManagerUsersPanel } from "@/components/manager-control/ManagerUsersPanel";
import {
  getManagerCustomers,
  getManagerEmployees,
  getRolePermissionPreview,
} from "@/lib/manager-control/queries";

export const metadata = { title: "Users — Manager Control" };

export default async function ManagerUsersPage() {
  const [customers, employees, roles] = await Promise.all([
    getManagerCustomers(),
    getManagerEmployees(),
    getRolePermissionPreview(),
  ]);

  const rolePreview = roles.map((r) => ({
    code: r.code,
    label: r.label,
    level: r.level,
    permissions: r.permissions.map((p) => ({
      module: p.module,
      canView: p.canView,
      canEdit: p.canEdit,
      canApprove: p.canApprove,
    })),
  }));

  return (
    <ManagerUsersPanel customers={customers} employees={employees} rolePreview={rolePreview} />
  );
}
