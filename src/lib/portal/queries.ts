import { requireDatabaseUrl } from "@/lib/db/require-database";
import { prisma } from "@/lib/prisma";

function ensurePortalDatabase(): void {
  requireDatabaseUrl();
}

export async function getDashboardStats(customerId: string) {
  ensurePortalDatabase();
  const [
    activeRentals,
    upcomingReturns,
    outstandingInvoices,
    unreadNotifications,
    pendingQuotes,
    openServiceRequests,
  ] = await Promise.all([
    prisma.rental.count({
      where: { customerId, status: "ACTIVE" },
    }),
    prisma.rental.count({
      where: {
        customerId,
        status: "ACTIVE",
        rentalEndDate: { gte: new Date(), lte: new Date(Date.now() + 7 * 86400000) },
      },
    }),
    prisma.invoice.count({
      where: { customerId, status: { in: ["UNPAID", "OVERDUE", "PARTIALLY_PAID"] } },
    }),
    prisma.notification.count({
      where: { customerId, readStatus: "UNREAD" },
    }),
    prisma.quote.count({
      where: { customerId, status: { in: ["DRAFT", "SENT"] } },
    }),
    prisma.serviceRequest.count({
      where: { customerId, status: { in: ["OPEN", "IN_PROGRESS"] } },
    }),
  ]);

  return {
    activeRentals,
    upcomingReturns,
    outstandingInvoices,
    unreadNotifications,
    pendingQuotes,
    openServiceRequests,
  };
}

export async function getCustomerBookings(customerId: string) {
  ensurePortalDatabase();
  return prisma.bookingRequest.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCustomerQuotes(customerId: string) {
  ensurePortalDatabase();
  return prisma.quote.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCustomerActiveRentals(customerId: string) {
  ensurePortalDatabase();
  return prisma.rental.findMany({
    where: { customerId, status: { in: ["ACTIVE", "OVERDUE"] } },
    orderBy: { rentalEndDate: "asc" },
  });
}

export async function getCustomerRentalHistory(customerId: string) {
  ensurePortalDatabase();
  return prisma.rental.findMany({
    where: { customerId, status: { in: ["RETURNED", "CANCELLED"] } },
    orderBy: { rentalEndDate: "desc" },
  });
}

export async function getCustomerInvoices(customerId: string) {
  ensurePortalDatabase();
  return prisma.invoice.findMany({
    where: { customerId },
    orderBy: { dueDate: "desc" },
  });
}

export async function getCustomerDocuments(customerId: string) {
  ensurePortalDatabase();
  return prisma.customerDocument.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCustomerServiceRequests(customerId: string) {
  ensurePortalDatabase();
  return prisma.serviceRequest.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCustomerNotifications(customerId: string) {
  ensurePortalDatabase();
  return prisma.notification.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCustomerRentalsForSelect(customerId: string) {
  ensurePortalDatabase();
  return prisma.rental.findMany({
    where: { customerId, status: { in: ["ACTIVE", "OVERDUE"] } },
    select: { id: true, equipmentName: true },
    orderBy: { rentalStartDate: "desc" },
  });
}

export async function getBookableEquipment() {
  ensurePortalDatabase();
  return prisma.equipmentInventory.findMany({
    where: { availabilityStatus: "AVAILABLE" },
    orderBy: [{ featured: "desc" }, { equipmentName: "asc" }],
    select: {
      itemId: true,
      equipmentName: true,
      category: true,
      dailyRate: true,
    },
  });
}
