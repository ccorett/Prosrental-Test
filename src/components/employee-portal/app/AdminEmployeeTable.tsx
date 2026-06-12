"use client";

import { useActionState } from "react";
import {
  deleteEmployee,
  disableEmployee,
  updateEmployeeRole,
  type EmployeeActionResult,
} from "@/lib/employee-portal/actions";
import type { EmployeeRole, Employee } from "@prisma/client";

type EmployeeRow = Employee & { role: EmployeeRole };

type AdminEmployeeTableProps = {
  employees: EmployeeRow[];
  roles: EmployeeRole[];
  canManage: boolean;
};

export function AdminEmployeeTable({
  employees,
  roles,
  canManage,
}: AdminEmployeeTableProps) {
  const [roleState, roleAction, rolePending] = useActionState<
    EmployeeActionResult,
    FormData
  >(updateEmployeeRole, {});
  const [disableState, disableAction, disablePending] = useActionState<
    EmployeeActionResult,
    FormData
  >(disableEmployee, {});
  const [deleteState, deleteAction, deletePending] = useActionState<
    EmployeeActionResult,
    FormData
  >(deleteEmployee, {});

  const feedback = roleState.error || roleState.success || disableState.error || disableState.success || deleteState.error || deleteState.success;

  return (
    <div className="space-y-4">
      {feedback && (
        <p
          className={`rounded-lg border px-4 py-3 text-sm ${
            feedback.includes("cannot") || feedback.includes("permission") || feedback.includes("Invalid") || feedback.includes("not found")
              ? "border-red-500/30 bg-red-500/10 text-red-300"
              : "border-secondary/30 bg-secondary-muted text-foreground"
          }`}
        >
          {feedback}
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-elevated text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              {canManage && <th className="px-4 py-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-b border-border/60">
                <td className="px-4 py-3 font-medium text-foreground">
                  {emp.fullName}
                  {emp.isProtected && (
                    <span className="ml-2 rounded bg-accent/15 px-2 py-0.5 text-xs text-accent">
                      Protected
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted">{emp.email}</td>
                <td className="px-4 py-3 text-muted">{emp.role.label}</td>
                <td className="px-4 py-3 text-muted">{emp.status}</td>
                {canManage && (
                  <td className="px-4 py-3">
                    {!emp.isProtected && emp.role.code !== "SUPER_ADMIN" ? (
                      <div className="flex flex-wrap gap-2">
                        <form action={roleAction} className="flex items-center gap-2">
                          <input type="hidden" name="employeeId" value={emp.id} />
                          <select
                            name="roleId"
                            defaultValue={emp.roleId}
                            className="rounded border border-border bg-surface px-2 py-1 text-xs"
                          >
                            {roles
                              .filter((r) => r.code !== "SUPER_ADMIN")
                              .map((r) => (
                                <option key={r.id} value={r.id}>
                                  {r.label}
                                </option>
                              ))}
                          </select>
                          <button
                            type="submit"
                            disabled={rolePending}
                            className="rounded bg-secondary/20 px-2 py-1 text-xs font-medium text-secondary"
                          >
                            Set role
                          </button>
                        </form>
                        {emp.status === "ACTIVE" && (
                          <form action={disableAction}>
                            <input type="hidden" name="employeeId" value={emp.id} />
                            <button
                              type="submit"
                              disabled={disablePending}
                              className="rounded border border-border px-2 py-1 text-xs text-muted"
                            >
                              Disable
                            </button>
                          </form>
                        )}
                        <form action={deleteAction}>
                          <input type="hidden" name="employeeId" value={emp.id} />
                          <button
                            type="submit"
                            disabled={deletePending}
                            className="rounded border border-red-500/30 px-2 py-1 text-xs text-red-300"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    ) : (
                      <span className="text-xs text-muted">Locked</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
