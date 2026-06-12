import { requireDatabaseUrl } from "@/lib/db/require-database";
import type { SessionEmployee } from "@/lib/employee-auth/session";
import { isSuperAdmin } from "@/lib/employee-auth/session";
import { canAccessModule } from "@/lib/employee-portal/permissions";
import { prisma } from "@/lib/prisma";
import type { EmployeeModule } from "@prisma/client";

function ensureDb(): void {
  requireDatabaseUrl();
}

export async function getEmployeeDashboardStats(employee: SessionEmployee) {
  ensureDb();
  const [
    assignedJobs,
    openDispatches,
    pendingReturns,
    maintenanceDue,
    openRepairs,
    lowStock,
    pendingDeliveries,
    pendingLeave,
    openIncidents,
    unreadNotifications,
  ] = await Promise.all([
    prisma.assignedJob.count({
      where: {
        employeeId: employee.id,
        status: { in: ["PENDING", "ASSIGNED", "IN_PROGRESS"] },
      },
    }),
    prisma.equipmentDispatch.count({
      where: { status: { in: ["SCHEDULED", "DISPATCHED"] } },
    }),
    prisma.equipmentReturn.count({ where: { status: "PENDING" } }),
    prisma.maintenanceSchedule.count({
      where: { status: { in: ["SCHEDULED", "OVERDUE"] } },
    }),
    prisma.repairTicket.count({
      where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
    }),
    prisma.inventoryItem
      .findMany({ select: { quantityOnHand: true, reorderLevel: true } })
      .then((items) => items.filter((i) => i.quantityOnHand <= i.reorderLevel).length),
    prisma.deliverySchedule.count({
      where: { status: { in: ["SCHEDULED", "IN_TRANSIT"] } },
    }),
    prisma.leaveRequest.count({ where: { status: "PENDING" } }),
    prisma.incidentReport.count({
      where: { status: { in: ["OPEN", "INVESTIGATING"] } },
    }),
    prisma.employeeNotification.count({
      where: { employeeId: employee.id, readStatus: "UNREAD" },
    }),
  ]);

  return {
    assignedJobs,
    openDispatches,
    pendingReturns,
    maintenanceDue,
    openRepairs,
    lowStock,
    pendingDeliveries,
    pendingLeave,
    openIncidents,
    unreadNotifications,
  };
}

export async function getAccessibleModules(
  employee: SessionEmployee
): Promise<EmployeeModule[]> {
  const { EMPLOYEE_PORTAL_NAV } = await import("@/lib/employee-portal/nav");
  const { canAccessManagerControl } = await import("@/lib/manager-control/guard");
  const modules: EmployeeModule[] = [];
  for (const item of EMPLOYEE_PORTAL_NAV) {
    if (item.module === "MANAGER_CONTROL") {
      if (await canAccessManagerControl(employee)) {
        modules.push(item.module);
      }
      continue;
    }
    if (await canAccessModule(employee, item.module, "view")) {
      modules.push(item.module);
    }
  }
  return modules;
}

export async function guardModuleQuery(
  employee: SessionEmployee,
  module: EmployeeModule
) {
  if (isSuperAdmin(employee)) return;
  const allowed = await canAccessModule(employee, module, "view");
  if (!allowed) {
    throw new Error("Access denied");
  }
}

export async function getEquipmentOperations() {
  ensureDb();
  const [dispatches, returns, inspections] = await Promise.all([
    prisma.equipmentDispatch.findMany({ orderBy: { scheduledAt: "desc" }, take: 50 }),
    prisma.equipmentReturn.findMany({ orderBy: { returnedAt: "desc" }, take: 50 }),
    prisma.equipmentInspection.findMany({ orderBy: { inspectedAt: "desc" }, take: 50 }),
  ]);
  return { dispatches, returns, inspections };
}

export async function getMaintenanceData() {
  ensureDb();
  const [schedules, repairs] = await Promise.all([
    prisma.maintenanceSchedule.findMany({ orderBy: { scheduledAt: "asc" } }),
    prisma.repairTicket.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  return { schedules, repairs };
}

export async function getInventoryData() {
  ensureDb();
  const [items, purchases] = await Promise.all([
    prisma.inventoryItem.findMany({ orderBy: { name: "asc" } }),
    prisma.purchaseRequest.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  return { items, purchases };
}

export async function getFleetDeliveryData() {
  ensureDb();
  const [vehicles, deliveries] = await Promise.all([
    prisma.fleetVehicle.findMany({ orderBy: { plateNumber: "asc" } }),
    prisma.deliverySchedule.findMany({ orderBy: { scheduledAt: "asc" } }),
  ]);
  return { vehicles, deliveries };
}

export async function getHrData() {
  ensureDb();
  const [leaveRequests, documents] = await Promise.all([
    prisma.leaveRequest.findMany({
      include: { employee: { select: { fullName: true, email: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.employeeDocument.findMany({
      include: { employee: { select: { fullName: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);
  return { leaveRequests, documents };
}

export async function getSafetyData() {
  ensureDb();
  return prisma.incidentReport.findMany({
    include: { reporter: { select: { fullName: true } } },
    orderBy: { occurredAt: "desc" },
  });
}

export async function getEmployeeNotifications(employeeId: string) {
  ensureDb();
  return prisma.employeeNotification.findMany({
    where: { employeeId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getEmployeeProfile(employeeId: string) {
  ensureDb();
  return prisma.employee.findUnique({
    where: { id: employeeId },
    include: {
      role: true,
      assignedJobs: { orderBy: { dueDate: "asc" }, take: 10 },
    },
  });
}

export async function getAdminEmployees() {
  ensureDb();
  return prisma.employee.findMany({
    include: { role: true },
    orderBy: { fullName: "asc" },
  });
}

export async function getAuditLogs(limit = 50) {
  ensureDb();
  return prisma.auditLog.findMany({
    include: { actor: { select: { fullName: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getAllRoles() {
  ensureDb();
  return prisma.employeeRole.findMany({ orderBy: { level: "asc" } });
}
