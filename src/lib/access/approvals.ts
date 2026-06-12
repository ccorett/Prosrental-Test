import type { SessionEmployee } from "@/lib/employee-auth/session";
import { isSuperAdmin } from "@/lib/employee-auth/session";
import { isAdminOrAbove, isManagerOrAbove } from "@/lib/access/roles";
import type { LeaveRequestStatus, PurchaseRequestStatus } from "@prisma/client";

export type ApprovalTier = "supervisor" | "manager" | "admin";

export function canSupervisorApprove(actor: SessionEmployee): boolean {
  return actor.roleCode === "SUPERVISOR" || isSuperAdmin(actor);
}

export function canManagerApprove(actor: SessionEmployee): boolean {
  return isManagerOrAbove(actor);
}

export function canAdminFinalApprove(actor: SessionEmployee): boolean {
  return isAdminOrAbove(actor);
}

export function canApprovePurchase(
  actor: SessionEmployee,
  status: PurchaseRequestStatus
): boolean {
  if (isSuperAdmin(actor)) return true;
  if (status === "PENDING" && actor.roleCode === "SUPERVISOR") return true;
  if (status === "SUPERVISOR_APPROVED" && isManagerOrAbove(actor)) return true;
  if (status === "PENDING" && isManagerOrAbove(actor)) return true;
  if (isAdminOrAbove(actor) && status !== "APPROVED" && status !== "REJECTED") return true;
  return false;
}

export function canApproveLeave(
  actor: SessionEmployee,
  status: LeaveRequestStatus
): boolean {
  if (isSuperAdmin(actor)) return true;
  if (status === "PENDING" && actor.roleCode === "SUPERVISOR") return true;
  if (status === "SUPERVISOR_APPROVED" && isManagerOrAbove(actor)) return true;
  if (status === "PENDING" && isManagerOrAbove(actor)) return true;
  if (isAdminOrAbove(actor) && status !== "APPROVED" && status !== "REJECTED") return true;
  return false;
}

export function nextPurchaseStatus(
  actor: SessionEmployee,
  current: PurchaseRequestStatus
): PurchaseRequestStatus | null {
  if (!canApprovePurchase(actor, current)) return null;
  if (isSuperAdmin(actor) || isAdminOrAbove(actor)) return "APPROVED";
  if (current === "PENDING" && actor.roleCode === "SUPERVISOR") return "SUPERVISOR_APPROVED";
  if (current === "SUPERVISOR_APPROVED" && isManagerOrAbove(actor)) return "APPROVED";
  if (current === "PENDING" && isManagerOrAbove(actor)) return "APPROVED";
  return null;
}

export function nextLeaveStatus(
  actor: SessionEmployee,
  current: LeaveRequestStatus
): LeaveRequestStatus | null {
  if (!canApproveLeave(actor, current)) return null;
  if (isSuperAdmin(actor) || isAdminOrAbove(actor)) return "APPROVED";
  if (current === "PENDING" && actor.roleCode === "SUPERVISOR") return "SUPERVISOR_APPROVED";
  if (current === "SUPERVISOR_APPROVED" && isManagerOrAbove(actor)) return "APPROVED";
  if (current === "PENDING" && isManagerOrAbove(actor)) return "APPROVED";
  return null;
}
