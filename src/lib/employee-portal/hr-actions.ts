"use server";

import { revalidatePath } from "next/cache";
import {
  canApproveLeave,
  canApprovePurchase,
  nextLeaveStatus,
  nextPurchaseStatus,
} from "@/lib/access/approvals";
import { requireEmployee } from "@/lib/employee-auth/session";
import { isSuperAdmin } from "@/lib/employee-auth/session";
import { writeAuditLog } from "@/lib/employee-portal/audit";
import { canAccessModule } from "@/lib/employee-portal/permissions";
import { requireDatabaseUrl } from "@/lib/db/require-database";
import { prisma } from "@/lib/prisma";

export type HrActionResult = { error?: string; success?: string };

export async function approvePurchaseRequest(
  _prev: HrActionResult,
  formData: FormData
): Promise<HrActionResult> {
  requireDatabaseUrl();
  const actor = await requireEmployee();
  const id = String(formData.get("requestId") ?? "");

  const allowed = await canAccessModule(actor, "HR", "approve");
  if (!allowed) {
    return { error: "You do not have permission to approve purchase requests." };
  }

  const request = await prisma.purchaseRequest.findUnique({ where: { id } });
  if (!request) return { error: "Purchase request not found." };

  if (!canApprovePurchase(actor, request.status)) {
    return { error: "Your role cannot approve this request at its current stage." };
  }

  const next = nextPurchaseStatus(actor, request.status);
  if (!next) return { error: "Unable to advance approval for this request." };

  await prisma.purchaseRequest.update({
    where: { id },
    data: { status: next },
  });

  await writeAuditLog({
    actorId: actor.id,
    action: isSuperAdmin(actor) && next === "APPROVED" ? "SUPER_ADMIN_OVERRIDE" : "HR_APPROVAL",
    entityType: "PurchaseRequest",
    entityId: id,
    description: `Purchase request for ${request.itemName} advanced to ${next}`,
    metadata: { from: request.status, to: next, tier: actor.roleCode },
  });

  revalidatePath("/employee-portal/hr");
  revalidatePath("/employee-portal/inventory");
  return { success: `Purchase request ${next === "APPROVED" ? "approved" : "advanced"} successfully.` };
}

export async function approveLeaveRequest(
  _prev: HrActionResult,
  formData: FormData
): Promise<HrActionResult> {
  requireDatabaseUrl();
  const actor = await requireEmployee();
  const id = String(formData.get("requestId") ?? "");

  const allowed = await canAccessModule(actor, "HR", "approve");
  if (!allowed) {
    return { error: "You do not have permission to approve leave requests." };
  }

  const request = await prisma.leaveRequest.findUnique({
    where: { id },
    include: { employee: { select: { fullName: true } } },
  });
  if (!request) return { error: "Leave request not found." };

  if (!canApproveLeave(actor, request.status)) {
    return { error: "Your role cannot approve this request at its current stage." };
  }

  const next = nextLeaveStatus(actor, request.status);
  if (!next) return { error: "Unable to advance approval for this request." };

  await prisma.leaveRequest.update({
    where: { id },
    data: { status: next },
  });

  await writeAuditLog({
    actorId: actor.id,
    action: isSuperAdmin(actor) && next === "APPROVED" ? "SUPER_ADMIN_OVERRIDE" : "HR_APPROVAL",
    entityType: "LeaveRequest",
    entityId: id,
    description: `Leave request for ${request.employee.fullName} advanced to ${next}`,
    metadata: { from: request.status, to: next, tier: actor.roleCode },
  });

  revalidatePath("/employee-portal/hr");
  return { success: `Leave request ${next === "APPROVED" ? "approved" : "advanced"} successfully.` };
}
