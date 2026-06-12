"use client";

import { useActionState } from "react";
import {
  createEmployeeUser,
  type EmployeeActionResult,
} from "@/lib/employee-portal/actions";
import type { EmployeeRole } from "@prisma/client";
import { Button } from "@/components/ui/Button";

const INPUT =
  "mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary";

type CreateEmployeeFormProps = {
  roles: EmployeeRole[];
};

export function CreateEmployeeForm({ roles }: CreateEmployeeFormProps) {
  const [state, action, pending] = useActionState<EmployeeActionResult, FormData>(
    createEmployeeUser,
    {}
  );

  const assignableRoles = roles.filter((r) => r.code !== "SUPER_ADMIN");

  return (
    <form action={action} className="card-industrial space-y-4 p-6">
      <h2 className="text-lg font-semibold text-foreground">Create Employee Account</h2>
      {state.error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="rounded-lg border border-secondary/30 bg-secondary-muted px-4 py-3 text-sm">
          {state.success}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Full name</span>
          <input name="fullName" required className={INPUT} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input type="email" name="email" required className={INPUT} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Password</span>
          <input type="password" name="password" required minLength={8} className={INPUT} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Role</span>
          <select name="roleId" required className={INPUT}>
            {assignableRoles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium">Phone</span>
          <input name="phone" className={INPUT} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Department</span>
          <input name="department" className={INPUT} />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium">Job title</span>
          <input name="jobTitle" className={INPUT} />
        </label>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Creating..." : "Create Account"}
      </Button>
    </form>
  );
}
