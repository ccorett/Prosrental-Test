import type { StaffRoleCode } from "@prisma/client";
import type { SessionEmployee } from "@/lib/employee-auth/session";

export const ROLE_LEVELS = {
  EMPLOYEE: 1,
  DRIVER: 2,
  MECHANIC: 3,
  SUPERVISOR: 4,
  MANAGER: 5,
  ADMIN: 6,
  SUPER_ADMIN: 7,
} as const;

export const MANAGER_MIN_LEVEL = ROLE_LEVELS.MANAGER;
export const ADMIN_MIN_LEVEL = ROLE_LEVELS.ADMIN;
export const SUPERVISOR_MIN_LEVEL = ROLE_LEVELS.SUPERVISOR;

export function isRoleAtLeast(employee: SessionEmployee, minLevel: number): boolean {
  return employee.roleLevel >= minLevel;
}

export function isManagerOrAbove(employee: SessionEmployee): boolean {
  return employee.roleCode === "SUPER_ADMIN" || employee.roleLevel >= MANAGER_MIN_LEVEL;
}

export function isAdminOrAbove(employee: SessionEmployee): boolean {
  return employee.roleCode === "SUPER_ADMIN" || employee.roleLevel >= ADMIN_MIN_LEVEL;
}

export function isSupervisorOrAbove(employee: SessionEmployee): boolean {
  return employee.roleLevel >= SUPERVISOR_MIN_LEVEL;
}

export function canAssignRole(actor: SessionEmployee, targetRole: StaffRoleCode): boolean {
  if (actor.roleCode === "SUPER_ADMIN") return true;
  if (targetRole === "SUPER_ADMIN" || targetRole === "ADMIN") return false;
  const targetLevel = ROLE_LEVELS[targetRole];
  return actor.roleLevel > targetLevel;
}

export function canCreateAdminAccount(actor: SessionEmployee): boolean {
  return actor.roleCode === "SUPER_ADMIN";
}

export function canManageEmployeeAccounts(actor: SessionEmployee): boolean {
  return isAdminOrAbove(actor);
}

export function roleBadgeTone(
  code: StaffRoleCode
): "accent" | "secondary" | "tertiary" | "muted" | "danger" {
  switch (code) {
    case "SUPER_ADMIN":
      return "danger";
    case "ADMIN":
      return "accent";
    case "MANAGER":
      return "secondary";
    case "SUPERVISOR":
      return "tertiary";
    default:
      return "muted";
  }
}
