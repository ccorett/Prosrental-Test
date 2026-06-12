import { redirect } from "next/navigation";
import type { SessionEmployee } from "@/lib/employee-auth/session";
import { isSuperAdmin } from "@/lib/employee-auth/session";
import { canAccessModule } from "@/lib/employee-portal/permissions";

const MANAGER_MIN_LEVEL = 5;

export function isManagerOrAbove(employee: SessionEmployee): boolean {
  return isSuperAdmin(employee) || employee.roleLevel >= MANAGER_MIN_LEVEL;
}

export async function canAccessManagerControl(employee: SessionEmployee): Promise<boolean> {
  if (isSuperAdmin(employee)) return true;
  if (employee.roleLevel >= MANAGER_MIN_LEVEL) return true;
  return canAccessModule(employee, "MANAGER_CONTROL", "view");
}

export async function requireManagerControl(employee: SessionEmployee): Promise<void> {
  const allowed = await canAccessManagerControl(employee);
  if (!allowed) {
    redirect("/employee-portal/dashboard?access=denied");
  }
}
