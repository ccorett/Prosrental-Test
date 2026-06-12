import { AdminEmployeeTable } from "@/components/employee-portal/app/AdminEmployeeTable";
import { CreateEmployeeForm } from "@/components/employee-portal/app/CreateEmployeeForm";
import { EmployeePageHeader } from "@/components/employee-portal/app/EmployeePageHeader";
import { requireEmployeePortalAccess } from "@/lib/access/guards";
import {
  canCreateAdminAccount,
  canManageEmployeeAccounts,
} from "@/lib/employee-portal/permissions";
import { ensureModulePage } from "@/lib/employee-portal/guard";
import { getAdminEmployees, getAllRoles, getAuditLogs } from "@/lib/employee-portal/queries";

export const metadata = { title: "Admin Management" };

export default async function AdminManagementPage() {
  const employee = await requireEmployeePortalAccess();
  await ensureModulePage(employee, "ADMIN_MANAGEMENT");

  const [employees, roles, auditLogs] = await Promise.all([
    getAdminEmployees(),
    getAllRoles(),
    getAuditLogs(30),
  ]);

  const canManage = canManageEmployeeAccounts(employee);
  const canCreateAdmin = canCreateAdminAccount(employee);
  const assignableRoles = roles.filter((r) => {
    if (r.code === "SUPER_ADMIN") return false;
    if (r.code === "ADMIN" && !canCreateAdmin) return false;
    return true;
  });

  return (
    <div className="space-y-10">
      <EmployeePageHeader
        title="Admin Management"
        description="Employee accounts, roles, permissions, and audit history."
      />

      {canManage && <CreateEmployeeForm roles={assignableRoles} />}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Employee accounts</h2>
        <AdminEmployeeTable
          employees={employees}
          roles={assignableRoles}
          canManage={canManage}
        />
      </section>

      <section className="card-industrial p-5">
        <h2 className="text-lg font-semibold">Recent audit log</h2>
        <ul className="mt-4 space-y-2">
          {auditLogs.map((log) => (
            <li key={log.id} className="rounded-lg border border-border/60 bg-surface px-3 py-2 text-sm text-muted">
              <span className="text-foreground">{log.action}</span> — {log.description}
              {log.actor && <span> · by {log.actor.fullName}</span>}
              <span className="block text-xs">{log.createdAt.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
