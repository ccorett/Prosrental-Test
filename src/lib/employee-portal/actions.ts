"use server";

import { revalidatePath } from "next/cache";
import { hashPassword } from "@/lib/auth/password";
import { requireEmployee } from "@/lib/employee-auth/session";
import { writeAuditLog } from "@/lib/employee-portal/audit";
import {
  canAssignRoleToNewEmployee,
  canChangeEmployeeRole,
  canCreateAdminAccount,
  canDeleteEmployee,
  canManageEmployeeAccounts,
  requireModuleAccess,
} from "@/lib/employee-portal/permissions";
import { requireDatabaseUrl } from "@/lib/db/require-database";
import { prisma } from "@/lib/prisma";

export type EmployeeActionResult = { error?: string; success?: string };

export async function markEmployeeNotificationRead(notificationId: string) {
  requireDatabaseUrl();
  const employee = await requireEmployee();
  await prisma.employeeNotification.updateMany({
    where: { id: notificationId, employeeId: employee.id },
    data: { readStatus: "READ" },
  });
  revalidatePath("/employee-portal/notifications");
}

export async function createEmployeeUser(
  _prev: EmployeeActionResult,
  formData: FormData
): Promise<EmployeeActionResult> {
  requireDatabaseUrl();
  const actor = await requireEmployee();
  if (!canManageEmployeeAccounts(actor)) {
    return { error: "Only Admin and Super Admin can create employee accounts." };
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const roleId = String(formData.get("roleId") ?? "");
  const phone = String(formData.get("phone") ?? "").trim();
  const department = String(formData.get("department") ?? "").trim();
  const jobTitle = String(formData.get("jobTitle") ?? "").trim();

  if (!fullName || !email || !password || !roleId) {
    return { error: "Name, email, password, and role are required." };
  }

  const role = await prisma.employeeRole.findUnique({ where: { id: roleId } });
  if (!role || !canAssignRoleToNewEmployee(actor, role.code)) {
    return { error: "Invalid role selection." };
  }

  const existing = await prisma.employee.findUnique({ where: { email } });
  if (existing) {
    return { error: "An employee with this email already exists." };
  }

  const passwordHash = await hashPassword(password);
  const created = await prisma.employee.create({
    data: {
      fullName,
      email,
      phone: phone || null,
      department: department || null,
      jobTitle: jobTitle || null,
      passwordHash,
      roleId,
      status: "ACTIVE",
    },
  });

  await writeAuditLog({
    actorId: actor.id,
    action: "ACCOUNT_CREATED",
    entityType: "Employee",
    entityId: created.id,
    description: `Created employee account for ${fullName} (${email})`,
    metadata: { roleCode: role.code },
  });

  revalidatePath("/employee-portal/admin");
  return { success: "Employee account created." };
}

export async function updateEmployeeRole(
  _prev: EmployeeActionResult,
  formData: FormData
): Promise<EmployeeActionResult> {
  requireDatabaseUrl();
  const actor = await requireEmployee();
  try {
    await requireModuleAccess(actor, "ADMIN_MANAGEMENT", "edit");
  } catch {
    return { error: "You do not have permission to change roles." };
  }

  const employeeId = String(formData.get("employeeId") ?? "");
  const roleId = String(formData.get("roleId") ?? "");

  const target = await prisma.employee.findUnique({
    where: { id: employeeId },
    include: { role: true },
  });
  if (!target) return { error: "Employee not found." };

  if (
    !canChangeEmployeeRole(actor, {
      isProtected: target.isProtected,
      roleCode: target.role.code,
      roleLevel: target.role.level,
    })
  ) {
    return { error: "You cannot change this employee's role." };
  }

  const newRole = await prisma.employeeRole.findUnique({ where: { id: roleId } });
  if (!newRole || !canAssignRoleToNewEmployee(actor, newRole.code)) {
    return { error: "Invalid role selection." };
  }

  if (newRole.code === "ADMIN" && !canCreateAdminAccount(actor)) {
    return { error: "Only Super Admin can assign the Admin role." };
  }

  await prisma.employee.update({
    where: { id: employeeId },
    data: { roleId },
  });

  await writeAuditLog({
    actorId: actor.id,
    action: "ROLE_CHANGE",
    entityType: "Employee",
    entityId: employeeId,
    description: `Changed role for ${target.fullName} to ${newRole.label}`,
    metadata: { from: target.role.code, to: newRole.code },
  });

  revalidatePath("/employee-portal/admin");
  return { success: "Role updated." };
}

export async function disableEmployee(
  _prev: EmployeeActionResult,
  formData: FormData
): Promise<EmployeeActionResult> {
  requireDatabaseUrl();
  const actor = await requireEmployee();
  if (!canManageEmployeeAccounts(actor)) {
    return { error: "Only Admin and Super Admin can disable employee accounts." };
  }

  const employeeId = String(formData.get("employeeId") ?? "");
  const target = await prisma.employee.findUnique({
    where: { id: employeeId },
    include: { role: true },
  });
  if (!target) return { error: "Employee not found." };

  if (target.isProtected || target.role.code === "SUPER_ADMIN") {
    return { error: "This account cannot be disabled." };
  }

  if (
    !canChangeEmployeeRole(actor, {
      isProtected: target.isProtected,
      roleCode: target.role.code,
      roleLevel: target.role.level,
    })
  ) {
    return { error: "You cannot disable this account." };
  }

  await prisma.employee.update({
    where: { id: employeeId },
    data: { status: "DISABLED" },
  });

  await writeAuditLog({
    actorId: actor.id,
    action: "ACCOUNT_DISABLED",
    entityType: "Employee",
    entityId: employeeId,
    description: `Disabled employee account for ${target.fullName}`,
  });

  revalidatePath("/employee-portal/admin");
  return { success: "Employee disabled." };
}

export async function deleteEmployee(
  _prev: EmployeeActionResult,
  formData: FormData
): Promise<EmployeeActionResult> {
  requireDatabaseUrl();
  const actor = await requireEmployee();
  try {
    await requireModuleAccess(actor, "ADMIN_MANAGEMENT", "delete");
  } catch {
    return { error: "You do not have permission to delete accounts." };
  }

  const employeeId = String(formData.get("employeeId") ?? "");
  const target = await prisma.employee.findUnique({
    where: { id: employeeId },
    include: { role: true },
  });
  if (!target) return { error: "Employee not found." };

  if (
    !canDeleteEmployee(actor, {
      isProtected: target.isProtected,
      roleCode: target.role.code,
      roleLevel: target.role.level,
    })
  ) {
    return { error: "This account cannot be deleted." };
  }

  await prisma.employee.delete({ where: { id: employeeId } });

  await writeAuditLog({
    actorId: actor.id,
    action: "ACCOUNT_DELETED",
    entityType: "Employee",
    entityId: employeeId,
    description: `Deleted employee account for ${target.fullName}`,
  });

  revalidatePath("/employee-portal/admin");
  return { success: "Employee deleted." };
}
