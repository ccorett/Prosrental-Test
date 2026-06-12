import type { EmployeeModule, StaffRoleCode } from "@prisma/client";
import type { SessionEmployee } from "@/lib/employee-auth/session";
import { isSuperAdmin } from "@/lib/employee-auth/session";
import {
  canCreateAdminAccount,
  canManageEmployeeAccounts,
  isAdminOrAbove,
  isManagerOrAbove,
} from "@/lib/access/roles";
import { prisma } from "@/lib/prisma";

export { canCreateAdminAccount, canManageEmployeeAccounts, isAdminOrAbove, isManagerOrAbove };

export type PermissionAction =
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "approve"
  | "override";

export type ModulePermission = {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canOverride: boolean;
};

export async function getRolePermissions(
  roleId: string
): Promise<Map<EmployeeModule, ModulePermission>> {
  const rows = await prisma.employeePermission.findMany({
    where: { roleId },
  });

  const map = new Map<EmployeeModule, ModulePermission>();
  for (const row of rows) {
    map.set(row.module, {
      canView: row.canView,
      canCreate: row.canCreate,
      canEdit: row.canEdit,
      canDelete: row.canDelete,
      canApprove: row.canApprove,
      canOverride: row.canOverride,
    });
  }
  return map;
}

export async function canAccessModule(
  employee: SessionEmployee,
  module: EmployeeModule,
  action: PermissionAction = "view"
): Promise<boolean> {
  if (isSuperAdmin(employee)) {
    return true;
  }

  const permissions = await getRolePermissions(employee.roleId);
  const perm = permissions.get(module);
  if (!perm) return false;

  switch (action) {
    case "view":
      return perm.canView;
    case "create":
      return perm.canCreate;
    case "edit":
      return perm.canEdit;
    case "delete":
      return perm.canDelete;
    case "approve":
      return perm.canApprove;
    case "override":
      return perm.canOverride;
    default:
      return false;
  }
}

export async function requireModuleAccess(
  employee: SessionEmployee,
  module: EmployeeModule,
  action: PermissionAction = "view"
): Promise<void> {
  const allowed = await canAccessModule(employee, module, action);
  if (!allowed) {
    throw new Error("You do not have permission to access this area.");
  }
}

export function canManageTargetRole(
  actor: SessionEmployee,
  targetRoleCode: StaffRoleCode,
  targetLevel: number
): boolean {
  if (isSuperAdmin(actor)) {
    return true;
  }
  if (targetRoleCode === "SUPER_ADMIN") {
    return false;
  }
  return actor.roleLevel > targetLevel;
}

export function canDeleteEmployee(
  actor: SessionEmployee,
  target: { isProtected: boolean; roleCode: StaffRoleCode; roleLevel: number }
): boolean {
  if (target.isProtected || target.roleCode === "SUPER_ADMIN") {
    return false;
  }
  return canManageTargetRole(actor, target.roleCode, target.roleLevel);
}

export function canChangeEmployeeRole(
  actor: SessionEmployee,
  target: { isProtected: boolean; roleCode: StaffRoleCode; roleLevel: number }
): boolean {
  if (target.isProtected || target.roleCode === "SUPER_ADMIN") {
    return false;
  }
  if (!canManageEmployeeAccounts(actor)) {
    return false;
  }
  return canManageTargetRole(actor, target.roleCode, target.roleLevel);
}

export function canAssignRoleToNewEmployee(
  actor: SessionEmployee,
  roleCode: StaffRoleCode
): boolean {
  if (roleCode === "SUPER_ADMIN") return false;
  if (roleCode === "ADMIN" && !canCreateAdminAccount(actor)) return false;
  if (!canManageEmployeeAccounts(actor)) return false;
  if (isSuperAdmin(actor)) return true;
  const levels: Record<StaffRoleCode, number> = {
    EMPLOYEE: 1,
    DRIVER: 2,
    MECHANIC: 3,
    SUPERVISOR: 4,
    MANAGER: 5,
    ADMIN: 6,
    SUPER_ADMIN: 7,
  };
  return actor.roleLevel > levels[roleCode];
}
