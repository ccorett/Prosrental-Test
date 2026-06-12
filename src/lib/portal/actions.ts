"use server";

import { revalidatePath } from "next/cache";
import { requireCustomer } from "@/lib/auth/session";
import { requireDatabaseUrl } from "@/lib/db/require-database";
import { prisma } from "@/lib/prisma";

function ensurePortalDatabase(): void {
  requireDatabaseUrl();
}

export type ActionResult = { error?: string; success?: string };

export async function createBookingRequest(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  ensurePortalDatabase();
  const customer = await requireCustomer();

  const equipmentId = String(formData.get("equipmentId") ?? "");
  let equipmentName = String(formData.get("equipmentName") ?? "");
  const rentalStartDate = String(formData.get("rentalStartDate") ?? "");
  const rentalEndDate = String(formData.get("rentalEndDate") ?? "");
  const deliveryRequired = formData.get("deliveryRequired") === "on";
  const deliveryAddress = String(formData.get("deliveryAddress") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!equipmentId || !rentalStartDate || !rentalEndDate) {
    return { error: "Equipment and rental dates are required." };
  }

  if (!equipmentName) {
    const equipment = await prisma.equipmentInventory.findUnique({
      where: { itemId: equipmentId },
      select: { equipmentName: true },
    });
    equipmentName = equipment?.equipmentName ?? equipmentId;
  }

  const start = new Date(rentalStartDate);
  const end = new Date(rentalEndDate);
  if (end <= start) {
    return { error: "End date must be after start date." };
  }

  await prisma.bookingRequest.create({
    data: {
      customerId: customer.id,
      equipmentId,
      equipmentName: equipmentName || equipmentId,
      rentalStartDate: start,
      rentalEndDate: end,
      deliveryRequired,
      deliveryAddress: deliveryRequired ? deliveryAddress || null : null,
      notes: notes || null,
      requestStatus: "PENDING",
    },
  });

  revalidatePath("/customer-portal/bookings");
  revalidatePath("/customer-portal/dashboard");
  return { success: "Booking request submitted successfully." };
}

export async function createQuoteRequest(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  ensurePortalDatabase();
  const customer = await requireCustomer();

  const equipmentRequested = String(formData.get("equipmentRequested") ?? "").trim();
  const rentalDuration = String(formData.get("rentalDuration") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!equipmentRequested || !rentalDuration) {
    return { error: "Equipment and rental duration are required." };
  }

  const quoteNumber = `QT-${Date.now().toString(36).toUpperCase()}`;
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 14);

  await prisma.quote.create({
    data: {
      customerId: customer.id,
      quoteNumber,
      equipmentRequested,
      rentalDuration,
      estimatedTotal: 0,
      status: "DRAFT",
      validUntil,
      notes: notes || null,
    },
  });

  revalidatePath("/customer-portal/quotes");
  revalidatePath("/customer-portal/dashboard");
  return { success: "Quote request submitted. Our team will respond shortly." };
}

export async function acceptQuote(quoteId: string): Promise<ActionResult> {
  ensurePortalDatabase();
  const customer = await requireCustomer();

  const quote = await prisma.quote.findFirst({
    where: { id: quoteId, customerId: customer.id },
  });

  if (!quote) {
    return { error: "Quote not found." };
  }

  if (quote.status !== "SENT") {
    return { error: "Only sent quotations can be accepted." };
  }

  await prisma.quote.update({
    where: { id: quoteId },
    data: { status: "ACCEPTED" },
  });

  revalidatePath("/customer-portal/quotes");
  return { success: "Quote accepted." };
}

export async function createServiceRequest(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  ensurePortalDatabase();
  const customer = await requireCustomer();

  const requestType = String(formData.get("requestType") ?? "") as
    | "EQUIPMENT_ISSUE"
    | "SUPPORT_REQUEST"
    | "RETURN_REQUEST";
  const subject = String(formData.get("subject") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priority = String(formData.get("priority") ?? "MEDIUM") as
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "URGENT";
  const rentalId = String(formData.get("rentalId") ?? "").trim() || null;

  if (!subject || !description || !requestType) {
    return { error: "Subject, description, and request type are required." };
  }

  if (rentalId) {
    const rental = await prisma.rental.findFirst({
      where: { id: rentalId, customerId: customer.id },
    });
    if (!rental) {
      return { error: "Invalid rental selected." };
    }
  }

  await prisma.serviceRequest.create({
    data: {
      customerId: customer.id,
      rentalId,
      requestType,
      subject,
      description,
      priority,
      status: "OPEN",
    },
  });

  revalidatePath("/customer-portal/service-requests");
  revalidatePath("/customer-portal/dashboard");
  return { success: "Service request submitted." };
}

export async function markNotificationRead(
  notificationId: string
): Promise<ActionResult> {
  ensurePortalDatabase();
  const customer = await requireCustomer();

  await prisma.notification.updateMany({
    where: { id: notificationId, customerId: customer.id },
    data: { readStatus: "READ" },
  });

  revalidatePath("/customer-portal/notifications");
  revalidatePath("/customer-portal/dashboard");
  return { success: "Marked as read." };
}
