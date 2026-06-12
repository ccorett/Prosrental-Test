"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { BookingRequestStatus, CustomerStatus, InvoiceStatus, QuoteStatus } from "@prisma/client";
import { writeAuditLog } from "@/lib/employee-portal/audit";
import {
  applyStockMovement,
  releaseEquipmentReservation,
  reserveEquipmentStock,
} from "@/lib/equipment/stock";
import { requireManagerControl } from "@/lib/manager-control/guard";
import { getSessionEmployee } from "@/lib/employee-auth/session";
import { prisma } from "@/lib/prisma";

export type ManagerActionResult = { ok: boolean; message: string };

async function requireManager(): Promise<{ id: string }> {
  const employee = await getSessionEmployee();
  if (!employee) redirect("/employee-portal/login");
  await requireManagerControl(employee);
  return employee;
}

function revalidateManager() {
  revalidatePath("/employee-portal/manager");
  revalidatePath("/employee-portal/manager/bookings");
  revalidatePath("/employee-portal/manager/users");
  revalidatePath("/employee-portal/manager/financial");
  revalidatePath("/employee-portal/manager/equipment");
  revalidatePath("/equipment");
  revalidatePath("/customer-portal/bookings");
}

async function findInventoryByItemCode(itemCode: string) {
  return prisma.equipmentInventory.findUnique({
    where: { itemId: itemCode.toUpperCase() },
  });
}

export async function approveBookingRequest(bookingId: string): Promise<ManagerActionResult> {
  const employee = await requireManager();
  const booking = await prisma.bookingRequest.findUnique({ where: { id: bookingId } });
  if (!booking) return { ok: false, message: "Booking not found." };
  if (booking.requestStatus !== "PENDING") {
    return { ok: false, message: "Only pending bookings can be approved." };
  }

  const equipment = await findInventoryByItemCode(booking.equipmentId);
  if (equipment) {
    try {
      await reserveEquipmentStock({
        equipmentId: equipment.id,
        quantity: 1,
        reason: `Booking approved: ${booking.equipmentName}`,
        changedById: employee.id,
        referenceType: "BookingRequest",
        referenceId: booking.id,
      });
    } catch {
      return { ok: false, message: "Insufficient stock to approve this booking." };
    }
  }

  await prisma.bookingRequest.update({
    where: { id: bookingId },
    data: {
      requestStatus: "APPROVED",
      approvedById: employee.id,
      approvedAt: new Date(),
    },
  });

  await writeAuditLog({
    actorId: employee.id,
    action: "BOOKING_APPROVED",
    entityType: "BookingRequest",
    entityId: bookingId,
    description: `Approved booking for ${booking.equipmentName}`,
  });

  revalidateManager();
  return { ok: true, message: "Booking approved and stock reserved." };
}

export async function rejectBookingRequest(
  bookingId: string,
  reason?: string
): Promise<ManagerActionResult> {
  const employee = await requireManager();
  const booking = await prisma.bookingRequest.findUnique({ where: { id: bookingId } });
  if (!booking) return { ok: false, message: "Booking not found." };

  await prisma.bookingRequest.update({
    where: { id: bookingId },
    data: {
      requestStatus: "REJECTED",
      managerNotes: reason?.trim() || booking.managerNotes,
    },
  });

  await writeAuditLog({
    actorId: employee.id,
    action: "BOOKING_REJECTED",
    entityType: "BookingRequest",
    entityId: bookingId,
    description: `Rejected booking for ${booking.equipmentName}`,
    metadata: { reason },
  });

  revalidateManager();
  return { ok: true, message: "Booking rejected." };
}

export async function scheduleBookingRequest(
  bookingId: string,
  scheduledAt: string
): Promise<ManagerActionResult> {
  const employee = await requireManager();
  const booking = await prisma.bookingRequest.findUnique({ where: { id: bookingId } });
  if (!booking) return { ok: false, message: "Booking not found." };

  await prisma.bookingRequest.update({
    where: { id: bookingId },
    data: {
      requestStatus: "SCHEDULED",
      scheduledAt: new Date(scheduledAt),
    },
  });

  await writeAuditLog({
    actorId: employee.id,
    action: "BOOKING_SCHEDULED",
    entityType: "BookingRequest",
    entityId: bookingId,
    description: `Scheduled booking for ${booking.equipmentName}`,
    metadata: { scheduledAt },
  });

  revalidateManager();
  return { ok: true, message: "Booking scheduled." };
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingRequestStatus
): Promise<ManagerActionResult> {
  const employee = await requireManager();
  const booking = await prisma.bookingRequest.findUnique({ where: { id: bookingId } });
  if (!booking) return { ok: false, message: "Booking not found." };

  const equipment = await findInventoryByItemCode(booking.equipmentId);

  if (status === "ACTIVE" && equipment) {
    await applyStockMovement({
      equipmentId: equipment.id,
      movementType: "CHECKED_OUT",
      quantity: 1,
      reason: `Booking active: ${booking.equipmentName}`,
      changedById: employee.id,
      referenceType: "BookingRequest",
      referenceId: booking.id,
    });
  }

  if (status === "COMPLETED" && equipment) {
    await applyStockMovement({
      equipmentId: equipment.id,
      movementType: "RETURNED",
      quantity: 1,
      reason: `Booking completed: ${booking.equipmentName}`,
      changedById: employee.id,
      referenceType: "BookingRequest",
      referenceId: booking.id,
    });
  }

  if (status === "CANCELLED" && booking.requestStatus === "APPROVED" && equipment) {
    await releaseEquipmentReservation({
      equipmentId: equipment.id,
      quantity: 1,
      reason: `Booking cancelled: ${booking.equipmentName}`,
      changedById: employee.id,
      referenceType: "BookingRequest",
      referenceId: booking.id,
    });
  }

  await prisma.bookingRequest.update({
    where: { id: bookingId },
    data: { requestStatus: status },
  });

  if (status === "ACTIVE") {
    await prisma.rental.create({
      data: {
        customerId: booking.customerId,
        equipmentName: booking.equipmentName,
        rentalStartDate: booking.rentalStartDate,
        rentalEndDate: booking.rentalEndDate,
        status: "ACTIVE",
      },
    });
  }

  await writeAuditLog({
    actorId: employee.id,
    action: "BOOKING_STATUS_CHANGED",
    entityType: "BookingRequest",
    entityId: bookingId,
    description: `Booking status changed to ${status}`,
    metadata: { status },
  });

  revalidateManager();
  return { ok: true, message: `Booking marked as ${status}.` };
}

export async function setCustomerStatus(
  customerId: string,
  status: CustomerStatus
): Promise<ManagerActionResult> {
  const employee = await requireManager();
  const customer = await prisma.customer.update({
    where: { id: customerId },
    data: { status },
  });

  await writeAuditLog({
    actorId: employee.id,
    action: "CUSTOMER_STATUS_CHANGED",
    entityType: "Customer",
    entityId: customerId,
    description: `Customer ${customer.email} set to ${status}`,
  });

  revalidateManager();
  return { ok: true, message: `Customer account ${status.toLowerCase()}.` };
}

export async function updateQuoteRecord(
  quoteId: string,
  status: QuoteStatus,
  estimatedTotal?: number
): Promise<ManagerActionResult> {
  const employee = await requireManager();
  await prisma.quote.update({
    where: { id: quoteId },
    data: {
      status,
      ...(estimatedTotal !== undefined ? { estimatedTotal } : {}),
    },
  });

  await writeAuditLog({
    actorId: employee.id,
    action: "QUOTE_UPDATED",
    entityType: "Quote",
    entityId: quoteId,
    description: `Quote updated to ${status}`,
    metadata: { status, estimatedTotal },
  });

  revalidateManager();
  return { ok: true, message: "Quote updated." };
}

export async function updateInvoiceRecord(
  invoiceId: string,
  status: InvoiceStatus
): Promise<ManagerActionResult> {
  const employee = await requireManager();
  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { status },
  });

  await writeAuditLog({
    actorId: employee.id,
    action: "INVOICE_UPDATED",
    entityType: "Invoice",
    entityId: invoiceId,
    description: `Invoice status set to ${status}`,
    metadata: { status },
  });

  revalidateManager();
  return { ok: true, message: "Invoice updated." };
}

export async function updateEquipmentCategory(
  _prev: ManagerActionResult,
  formData: FormData
): Promise<ManagerActionResult> {
  const employee = await requireManager();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false, message: "Category id required." };

  await prisma.equipmentCategory.update({
    where: { id },
    data: {
      name: String(formData.get("name") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim() || null,
      displayOrder: Number(formData.get("displayOrder") ?? 0),
      imageUrl: String(formData.get("imageUrl") ?? "").trim() || null,
      active: formData.has("active"),
    },
  });

  await writeAuditLog({
    actorId: employee.id,
    action: "CATEGORY_UPDATED",
    entityType: "EquipmentCategory",
    entityId: id,
    description: "Equipment category updated from Manager Control Centre",
  });

  revalidateManager();
  revalidatePath("/equipment");
  revalidatePath("/categories");
  return { ok: true, message: "Category saved." };
}

export async function assignMaintenanceTask(
  scheduleId: string,
  assigneeId: string
): Promise<ManagerActionResult> {
  const employee = await requireManager();
  await prisma.maintenanceSchedule.update({
    where: { id: scheduleId },
    data: { assigneeId: assigneeId || null },
  });

  await writeAuditLog({
    actorId: employee.id,
    action: "MAINTENANCE_UPDATE",
    entityType: "MaintenanceSchedule",
    entityId: scheduleId,
    description: "Maintenance task assignee updated",
    metadata: { assigneeId },
  });

  revalidateManager();
  return { ok: true, message: "Maintenance task assigned." };
}
