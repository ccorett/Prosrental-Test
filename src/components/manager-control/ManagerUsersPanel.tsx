"use client";

import { useState, useTransition } from "react";
import { StatusChip } from "@/components/manager-control/StatusChip";
import type { ManagerCustomerRow, ManagerEmployeeRow } from "@/lib/manager-control/types";
import { setCustomerStatus } from "@/lib/manager-control/actions";

export function ManagerUsersPanel({
  customers,
  employees,
  rolePreview,
}: {
  customers: ManagerCustomerRow[];
  employees: ManagerEmployeeRow[];
  rolePreview: {
    code: string;
    label: string;
    level: number;
    permissions: { module: string; canView: boolean; canEdit: boolean; canApprove: boolean }[];
  }[];
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function toggleCustomer(id: string, current: string) {
    const next = current === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    startTransition(async () => {
      const result = await setCustomerStatus(id, next as "ACTIVE" | "SUSPENDED");
      setMessage(result.message);
    });
  }

  return (
    <div className="space-y-8">
      {message && (
        <p className="rounded-lg border border-border bg-surface px-4 py-3 text-sm">{message}</p>
      )}

      <section className="card-industrial overflow-x-auto p-5">
        <h2 className="text-lg font-semibold">Customers</h2>
        <table className="mt-4 min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-muted">
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Activity</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {customers.map((c) => (
              <tr key={c.id}>
                <td className="px-3 py-2 font-medium">{c.fullName}</td>
                <td className="px-3 py-2 text-muted">{c.email}</td>
                <td className="px-3 py-2">
                  <StatusChip
                    label={c.status}
                    tone={c.status === "ACTIVE" ? "green" : "red"}
                  />
                </td>
                <td className="px-3 py-2 text-muted">
                  {c.bookingCount} bookings · {c.rentalCount} rentals
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => toggleCustomer(c.id, c.status)}
                    className="text-xs font-medium text-accent"
                  >
                    {c.status === "ACTIVE" ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card-industrial overflow-x-auto p-5">
        <h2 className="text-lg font-semibold">Employees</h2>
        <p className="mt-1 text-sm text-muted">View only — role hierarchy finalisation in next phase.</p>
        <table className="mt-4 min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-muted">
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Jobs</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {employees.map((e) => (
              <tr key={e.id}>
                <td className="px-3 py-2 font-medium">{e.fullName}</td>
                <td className="px-3 py-2 text-muted">{e.roleLabel}</td>
                <td className="px-3 py-2">
                  <StatusChip label={e.status} tone={e.status === "ACTIVE" ? "green" : "muted"} />
                </td>
                <td className="px-3 py-2 text-muted">{e.jobCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card-industrial p-5">
        <h2 className="text-lg font-semibold">Permissions preview</h2>
        <p className="mt-1 text-sm text-muted">Prepared for final Manager / Admin / Super Admin hierarchy.</p>
        <div className="mt-4 space-y-4">
          {rolePreview.map((role) => (
            <div key={role.code} className="rounded-lg border border-border/60 p-3">
              <p className="font-medium text-foreground">
                {role.label} <span className="text-muted">(level {role.level})</span>
              </p>
              <p className="mt-2 text-xs text-muted">
                Modules with access:{" "}
                {role.permissions
                  .filter((p) => p.canView)
                  .map((p) => p.module)
                  .join(", ") || "None"}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
