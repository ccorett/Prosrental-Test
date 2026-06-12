import { getStockAlertLevel } from "@/lib/equipment/availability";
import { mapDbRow } from "@/lib/equipment/queries";
import type { EquipmentItem } from "@/lib/equipment/types";
import { prisma } from "@/lib/prisma";
import type {
  ActivityReport,
  ManagerBookingRow,
  ManagerCustomerRow,
  ManagerDashboardSummary,
  ManagerEmployeeRow,
  ManagerInvoiceRow,
  ManagerQuoteRow,
  ManagerRentalRow,
  RevenueReport,
  UtilizationReport,
} from "@/lib/manager-control/types";
import type { Prisma } from "@prisma/client";

function decimal(n: Prisma.Decimal | number): number {
  return typeof n === "number" ? n : Number(n);
}

export async function getManagerDashboardSummary(): Promise<ManagerDashboardSummary> {
  const now = new Date();
  const inSevenDays = new Date(now.getTime() + 7 * 86400000);

  const [
    pendingBookings,
    activeRentals,
    upcomingReturns,
    outstandingInvoices,
    openMaintenance,
    equipment,
    pendingQuotes,
    openServiceRequests,
    staffActiveJobs,
    staffCompletedJobs,
  ] = await Promise.all([
    prisma.bookingRequest.count({ where: { requestStatus: "PENDING" } }),
    prisma.rental.count({ where: { status: "ACTIVE" } }),
    prisma.rental.count({
      where: { status: "ACTIVE", rentalEndDate: { lte: inSevenDays } },
    }),
    prisma.invoice.count({
      where: { status: { in: ["UNPAID", "OVERDUE", "PARTIALLY_PAID"] } },
    }),
    prisma.maintenanceSchedule.count({
      where: { status: { in: ["SCHEDULED", "IN_PROGRESS", "OVERDUE"] } },
    }),
    prisma.equipmentInventory.findMany({
      include: { equipmentCategory: true },
    }),
    prisma.quote.count({ where: { status: { in: ["DRAFT", "SENT"] } } }),
    prisma.serviceRequest.count({
      where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
    }),
    prisma.assignedJob.count({
      where: { status: { in: ["PENDING", "ASSIGNED", "IN_PROGRESS"] } },
    }),
    prisma.assignedJob.count({ where: { status: "COMPLETED" } }),
  ]);

  const mapped = equipment.map(mapDbRow);
  const lowStockAlerts = mapped.filter(
    (item) => getStockAlertLevel(item) !== "none" && !item.comingSoon
  ).length;

  const utilizationPct =
    equipment.length === 0
      ? 0
      : Math.round((activeRentals / Math.max(equipment.length, 1)) * 100);

  return {
    pendingBookings,
    activeRentals,
    upcomingReturns,
    outstandingInvoices,
    openMaintenance,
    lowStockAlerts,
    equipmentUtilizationPct: Math.min(utilizationPct, 100),
    pendingQuotes,
    openServiceRequests,
    staffActiveJobs,
    staffCompletedJobs: staffCompletedJobs,
  };
}

export async function getManagerCustomers(): Promise<ManagerCustomerRow[]> {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { bookingRequests: true, rentals: true } },
    },
  });
  return customers.map((c) => ({
    id: c.id,
    fullName: c.fullName,
    email: c.email,
    companyName: c.companyName,
    status: c.status,
    bookingCount: c._count.bookingRequests,
    rentalCount: c._count.rentals,
    createdAt: c.createdAt.toISOString(),
  }));
}

export async function getManagerEmployees(): Promise<ManagerEmployeeRow[]> {
  const employees = await prisma.employee.findMany({
    orderBy: { fullName: "asc" },
    include: {
      role: { select: { label: true, code: true } },
      _count: { select: { assignedJobs: true } },
    },
  });
  return employees.map((e) => ({
    id: e.id,
    fullName: e.fullName,
    email: e.email,
    roleLabel: e.role.label,
    roleCode: e.role.code,
    status: e.status,
    department: e.department,
    jobCount: e._count.assignedJobs,
  }));
}

export async function getManagerEquipmentRegister(): Promise<EquipmentItem[]> {
  const rows = await prisma.equipmentInventory.findMany({
    include: { equipmentCategory: true, overrideBy: { select: { fullName: true } } },
    orderBy: [{ sortOrder: "asc" }, { equipmentName: "asc" }],
  });
  return rows.map(mapDbRow);
}

export async function getManagerCategories() {
  return prisma.equipmentCategory.findMany({
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { equipment: true } } },
  });
}

export async function getManagerBookings(): Promise<ManagerBookingRow[]> {
  const rows = await prisma.bookingRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { customer: { select: { fullName: true } } },
  });
  return rows.map((b) => ({
    id: b.id,
    customerName: b.customer.fullName,
    equipmentName: b.equipmentName,
    equipmentId: b.equipmentId,
    rentalStartDate: b.rentalStartDate.toISOString(),
    rentalEndDate: b.rentalEndDate.toISOString(),
    deliveryRequired: b.deliveryRequired,
    requestStatus: b.requestStatus,
    notes: b.notes,
    createdAt: b.createdAt.toISOString(),
  }));
}

export async function getManagerQuotes(): Promise<ManagerQuoteRow[]> {
  const rows = await prisma.quote.findMany({
    orderBy: { createdAt: "desc" },
    include: { customer: { select: { fullName: true } } },
  });
  return rows.map((q) => ({
    id: q.id,
    quoteNumber: q.quoteNumber,
    customerName: q.customer.fullName,
    equipmentRequested: q.equipmentRequested,
    estimatedTotal: decimal(q.estimatedTotal),
    status: q.status,
    validUntil: q.validUntil.toISOString(),
  }));
}

export async function getManagerInvoices(): Promise<ManagerInvoiceRow[]> {
  const rows = await prisma.invoice.findMany({
    orderBy: { dueDate: "asc" },
    include: { customer: { select: { fullName: true } } },
  });
  return rows.map((inv) => ({
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    customerName: inv.customer.fullName,
    amount: decimal(inv.amount),
    status: inv.status,
    dueDate: inv.dueDate.toISOString(),
  }));
}

export async function getManagerRentals(): Promise<ManagerRentalRow[]> {
  const rows = await prisma.rental.findMany({
    orderBy: { rentalStartDate: "desc" },
    include: { customer: { select: { fullName: true } } },
  });
  return rows.map((r) => ({
    id: r.id,
    customerName: r.customer.fullName,
    equipmentName: r.equipmentName,
    status: r.status,
    rentalStartDate: r.rentalStartDate.toISOString(),
    rentalEndDate: r.rentalEndDate.toISOString(),
  }));
}

export async function getManagerMaintenanceOverview() {
  const [schedules, repairs, inspections] = await Promise.all([
    prisma.maintenanceSchedule.findMany({
      orderBy: { scheduledAt: "asc" },
      include: { assignee: { select: { fullName: true } } },
    }),
    prisma.repairTicket.findMany({
      orderBy: { createdAt: "desc" },
      include: { assignee: { select: { fullName: true } } },
    }),
    prisma.equipmentInspection.findMany({
      orderBy: { inspectedAt: "desc" },
      include: { inspector: { select: { fullName: true } } },
      take: 50,
    }),
  ]);
  return { schedules, repairs, inspections };
}

export async function getRevenueReport(): Promise<RevenueReport> {
  const paidInvoices = await prisma.invoice.findMany({
    where: { status: "PAID" },
    select: { amount: true, createdAt: true },
  });
  const outstanding = await prisma.invoice.findMany({
    where: { status: { in: ["UNPAID", "OVERDUE", "PARTIALLY_PAID"] } },
    select: { amount: true },
  });

  const totalRevenue = paidInvoices.reduce((sum, inv) => sum + decimal(inv.amount), 0);
  const outstandingTotal = outstanding.reduce((sum, inv) => sum + decimal(inv.amount), 0);

  const byMonth = new Map<string, number>();
  for (const inv of paidInvoices) {
    const key = inv.createdAt.toISOString().slice(0, 7);
    byMonth.set(key, (byMonth.get(key) ?? 0) + decimal(inv.amount));
  }

  const rentals = await prisma.rental.findMany({
    select: { equipmentName: true },
  });
  const categoryMap = new Map<string, number>();
  for (const rental of rentals) {
    const equipment = await prisma.equipmentInventory.findFirst({
      where: { equipmentName: rental.equipmentName },
      include: { equipmentCategory: true },
    });
    const cat = equipment?.equipmentCategory.name ?? "Uncategorised";
    categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + 1);
  }

  return {
    totalRevenue,
    outstandingTotal,
    revenueByMonth: [...byMonth.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, total]) => ({ month, total })),
    revenueByCategory: [...categoryMap.entries()]
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total),
  };
}

export async function getUtilizationReport(): Promise<UtilizationReport> {
  const rentals = await prisma.rental.groupBy({
    by: ["equipmentName"],
    _count: { equipmentName: true },
    orderBy: { _count: { equipmentName: "desc" } },
  });

  const allEquipment = await prisma.equipmentInventory.findMany({
    select: { equipmentName: true },
  });
  const rentalCounts = new Map(rentals.map((r) => [r.equipmentName, r._count.equipmentName]));

  const maintenance = await prisma.maintenanceSchedule.groupBy({
    by: ["equipmentName"],
    _count: { equipmentName: true },
    orderBy: { _count: { equipmentName: "desc" } },
  });

  const mostRented = rentals.slice(0, 10).map((r) => ({
    name: r.equipmentName,
    count: r._count.equipmentName,
  }));

  const underused = allEquipment
    .map((e) => ({ name: e.equipmentName, count: rentalCounts.get(e.equipmentName) ?? 0 }))
    .filter((e) => e.count <= 1)
    .slice(0, 10);

  return {
    mostRented,
    underused,
    maintenanceFrequency: maintenance.slice(0, 10).map((m) => ({
      name: m.equipmentName,
      count: m._count.equipmentName,
    })),
  };
}

export async function getActivityReport(): Promise<ActivityReport> {
  const [activeCustomers, quoteConversions, assignedJobs, completedJobs] =
    await Promise.all([
      prisma.customer.count({ where: { status: "ACTIVE" } }),
      prisma.quote.count({ where: { status: "ACCEPTED" } }),
      prisma.assignedJob.count(),
      prisma.assignedJob.count({ where: { status: "COMPLETED" } }),
    ]);
  return { activeCustomers, quoteConversions, assignedJobs, completedJobs };
}

export async function getManagerAuditLogs(limit = 50) {
  return prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { actor: { select: { fullName: true, email: true } } },
  });
}

export async function getRolePermissionPreview() {
  return prisma.employeeRole.findMany({
    orderBy: { level: "asc" },
    include: { permissions: true },
  });
}
