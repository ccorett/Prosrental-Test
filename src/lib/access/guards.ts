import { redirect } from "next/navigation";
import type { StaffRoleCode } from "@prisma/client";
import { requireCustomer, getSessionCustomer } from "@/lib/auth/session";
import {
  getSessionEmployee,
  isSuperAdmin,
  requireEmployee,
  type SessionEmployee,
} from "@/lib/employee-auth/session";
import { canAccessModule } from "@/lib/employee-portal/permissions";
import { canAccessManagerControl } from "@/lib/manager-control/guard";
import {
  isAdminOrAbove,
  isManagerOrAbove,
  MANAGER_MIN_LEVEL,
  ADMIN_MIN_LEVEL,
} from "@/lib/access/roles";

export { requireCustomer, getSessionCustomer };

export async function requireEmployeePortalAccess(): Promise<SessionEmployee> {
  return requireEmployee();
}

export async function requireRole(
  ...allowed: StaffRoleCode[]
): Promise<SessionEmployee> {
  const employee = await requireEmployee();
  if (isSuperAdmin(employee) || allowed.includes(employee.roleCode)) {
    return employee;
  }
  redirect("/employee-portal/dashboard?access=denied");
}

export async function requireManagerOrAbove(): Promise<SessionEmployee> {
  const employee = await requireEmployee();
  if (isManagerOrAbove(employee)) return employee;
  redirect("/employee-portal/dashboard?access=denied");
}

export async function requireAdminOrAbove(): Promise<SessionEmployee> {
  const employee = await requireEmployee();
  if (isAdminOrAbove(employee)) return employee;
  redirect("/employee-portal/dashboard?access=denied");
}

export async function requireSuperAdmin(): Promise<SessionEmployee> {
  const employee = await requireEmployee();
  if (isSuperAdmin(employee)) return employee;
  redirect("/employee-portal/dashboard?access=denied");
}

export async function requireModule(
  module: Parameters<typeof canAccessModule>[1],
  action: Parameters<typeof canAccessModule>[2] = "view"
): Promise<SessionEmployee> {
  const employee = await requireEmployee();
  const allowed = await canAccessModule(employee, module, action);
  if (!allowed) {
    redirect("/employee-portal/dashboard?access=denied");
  }
  return employee;
}

export async function requireManagerControlAccess(): Promise<SessionEmployee> {
  const employee = await requireEmployee();
  const allowed = await canAccessManagerControl(employee);
  if (!allowed) redirect("/employee-portal/dashboard?access=denied");
  return employee;
}

export async function requireEquipmentListingEditor(): Promise<SessionEmployee> {
  return requireModule("EQUIPMENT_LISTINGS", "edit");
}

export async function getOptionalEmployee(): Promise<SessionEmployee | null> {
  return getSessionEmployee();
}

export function meetsMinLevel(employee: SessionEmployee, minLevel: number): boolean {
  return isSuperAdmin(employee) || employee.roleLevel >= minLevel;
}

export { MANAGER_MIN_LEVEL, ADMIN_MIN_LEVEL, isManagerOrAbove, isAdminOrAbove, isSuperAdmin };
