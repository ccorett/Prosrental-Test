import type { PrismaClient, StaffRoleCode } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";
import { DEMO_CREDENTIALS } from "../src/lib/access/demo-credentials";

export { DEMO_CREDENTIALS };

async function upsertEmployee(
  prisma: PrismaClient,
  roleIds: Map<StaffRoleCode, string>,
  code: StaffRoleCode,
  data: {
    email: string;
    password: string;
    fullName: string;
    department: string;
    jobTitle: string;
    phone?: string;
  }
) {
  return prisma.employee.upsert({
    where: { email: data.email },
    create: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone ?? "868 734 9490",
      department: data.department,
      jobTitle: data.jobTitle,
      passwordHash: await hashPassword(data.password),
      roleId: roleIds.get(code)!,
      status: "ACTIVE",
    },
    update: {
      fullName: data.fullName,
      passwordHash: await hashPassword(data.password),
      roleId: roleIds.get(code)!,
      status: "ACTIVE",
      department: data.department,
      jobTitle: data.jobTitle,
    },
  });
}

export async function seedDemoAccounts(
  prisma: PrismaClient,
  roleIds: Map<StaffRoleCode, string>,
  superAdminId: string
) {
  const now = new Date();
  const day = 86400000;

  const admin = await upsertEmployee(prisma, roleIds, "ADMIN", {
    ...DEMO_CREDENTIALS.admin,
    fullName: "Demo Admin",
    department: "Administration",
    jobTitle: "Platform Administrator",
  });
  const manager = await upsertEmployee(prisma, roleIds, "MANAGER", {
    ...DEMO_CREDENTIALS.manager,
    fullName: "Demo Manager",
    department: "Operations",
    jobTitle: "Operations Manager",
  });
  const supervisor = await upsertEmployee(prisma, roleIds, "SUPERVISOR", {
    ...DEMO_CREDENTIALS.supervisor,
    fullName: "Demo Supervisor",
    department: "Field Operations",
    jobTitle: "Field Supervisor",
  });
  const mechanic = await upsertEmployee(prisma, roleIds, "MECHANIC", {
    ...DEMO_CREDENTIALS.mechanic,
    fullName: "Demo Mechanic",
    department: "Maintenance",
    jobTitle: "Equipment Mechanic",
  });
  const driver = await upsertEmployee(prisma, roleIds, "DRIVER", {
    ...DEMO_CREDENTIALS.driver,
    fullName: "Demo Driver",
    department: "Fleet",
    jobTitle: "Delivery Driver",
  });
  const employee = await upsertEmployee(prisma, roleIds, "EMPLOYEE", {
    ...DEMO_CREDENTIALS.employee,
    fullName: "Demo Employee",
    department: "Operations",
    jobTitle: "Operations Staff",
  });

  const teamPasswordHash = await hashPassword("Team2026!");
  const teamMembers = [];
  for (let i = 1; i <= 4; i++) {
    teamMembers.push(
      await prisma.employee.upsert({
        where: { email: `team${i}@prorentals.com` },
        create: {
          fullName: `Field Team Member ${i}`,
          email: `team${i}@prorentals.com`,
          department: "Field Operations",
          jobTitle: "Field Technician",
          passwordHash: teamPasswordHash,
          roleId: roleIds.get("EMPLOYEE")!,
          status: "ACTIVE",
        },
        update: {
          department: "Field Operations",
          roleId: roleIds.get("EMPLOYEE")!,
          status: "ACTIVE",
        },
      })
    );
  }

  // Admin: 20 customers + 10 employees (6 demo + 4 team = 10)
  for (let i = 1; i <= 19; i++) {
    await prisma.customer.upsert({
      where: { email: `client${i}@example.com` },
      create: {
        fullName: `Client Account ${i}`,
        email: `client${i}@example.com`,
        phone: "868 555 0100",
        companyName: `Tobago Client ${i} Ltd`,
        passwordHash: await hashPassword("Client2026!"),
        status: "ACTIVE",
      },
      update: { status: "ACTIVE" },
    });
  }

  // Customer demo account
  const customerHash = await hashPassword(DEMO_CREDENTIALS.customer.password);
  const customer = await prisma.customer.upsert({
    where: { email: DEMO_CREDENTIALS.customer.email },
    create: {
      fullName: "Demo Customer",
      email: DEMO_CREDENTIALS.customer.email,
      phone: "868 734 9490",
      companyName: "Tobago Build Co.",
      address: "Plymouth, Tobago",
      passwordHash: customerHash,
      status: "ACTIVE",
    },
    update: {
      fullName: "Demo Customer",
      passwordHash: customerHash,
      status: "ACTIVE",
    },
  });

  await prisma.rental.deleteMany({ where: { customerId: customer.id } });
  await prisma.bookingRequest.deleteMany({ where: { customerId: customer.id } });
  await prisma.quote.deleteMany({ where: { customerId: customer.id } });
  await prisma.invoice.deleteMany({ where: { customerId: customer.id } });
  await prisma.customerDocument.deleteMany({ where: { customerId: customer.id } });
  await prisma.serviceRequest.deleteMany({ where: { customerId: customer.id } });

  const customerRental1 = await prisma.rental.create({
    data: {
      customerId: customer.id,
      equipmentName: "Industrial Floor Scrubber",
      rentalStartDate: new Date(now.getTime() - 10 * day),
      rentalEndDate: new Date(now.getTime() + 5 * day),
      status: "ACTIVE",
    },
  });
  await prisma.rental.create({
    data: {
      customerId: customer.id,
      equipmentName: "Pressure Washer 4000 PSI",
      rentalStartDate: new Date(now.getTime() - 7 * day),
      rentalEndDate: new Date(now.getTime() + 10 * day),
      status: "ACTIVE",
    },
  });
  await prisma.quote.create({
    data: {
      customerId: customer.id,
      quoteNumber: "QT-CUST-001",
      equipmentRequested: "Scissor Lift 19ft",
      rentalDuration: "2 weeks",
      estimatedTotal: 12000,
      status: "SENT",
      validUntil: new Date(now.getTime() + 14 * day),
    },
  });
  await prisma.invoice.createMany({
    data: [
      {
        customerId: customer.id,
        invoiceNumber: "INV-CUST-1001",
        amount: 4250,
        status: "UNPAID",
        dueDate: new Date(now.getTime() + 7 * day),
      },
      {
        customerId: customer.id,
        invoiceNumber: "INV-CUST-1002",
        amount: 1800,
        status: "PAID",
        dueDate: new Date(now.getTime() - 14 * day),
      },
      {
        customerId: customer.id,
        invoiceNumber: "INV-CUST-1003",
        amount: 950,
        status: "OVERDUE",
        dueDate: new Date(now.getTime() - 5 * day),
      },
    ],
  });
  await prisma.customerDocument.createMany({
    data: [
      {
        customerId: customer.id,
        title: "Floor Scrubber Rental Agreement",
        documentType: "RENTAL_AGREEMENT",
        equipmentName: "Industrial Floor Scrubber",
        fileUrl: "/documents/placeholder-rental-agreement.pdf",
      },
      {
        customerId: customer.id,
        title: "Pressure Washer Safety Sheet",
        documentType: "SAFETY_DOCUMENT",
        equipmentName: "Pressure Washer 4000 PSI",
        fileUrl: "/documents/placeholder-safety.pdf",
      },
    ],
  });
  await prisma.serviceRequest.create({
    data: {
      customerId: customer.id,
      rentalId: customerRental1.id,
      requestType: "EQUIPMENT_ISSUE",
      subject: "Intermittent power indicator",
      description: "Power indicator flickers during startup.",
      status: "OPEN",
      priority: "MEDIUM",
    },
  });

  // Manager: 15 active rentals, 8 pending bookings, 4 pending quotes, 3 overdue invoices, 5 maintenance alerts
  const managerCustomers = await prisma.customer.findMany({ take: 8 });
  for (let i = 0; i < 15; i++) {
    const c = managerCustomers[i % managerCustomers.length];
    await prisma.rental.create({
      data: {
        customerId: c.id,
        equipmentName: `Rental Unit ${i + 1}`,
        rentalStartDate: new Date(now.getTime() - (i + 1) * day),
        rentalEndDate: new Date(now.getTime() + (10 + i) * day),
        status: "ACTIVE",
      },
    });
  }
  for (let i = 0; i < 8; i++) {
    const c = managerCustomers[i % managerCustomers.length];
    await prisma.bookingRequest.create({
      data: {
        customerId: c.id,
        equipmentId: `CE00${(i % 9) + 1}`,
        equipmentName: `Equipment Booking ${i + 1}`,
        rentalStartDate: new Date(now.getTime() + (i + 3) * day),
        rentalEndDate: new Date(now.getTime() + (i + 8) * day),
        requestStatus: "PENDING",
      },
    });
  }
  for (let i = 0; i < 4; i++) {
    const c = managerCustomers[i % managerCustomers.length];
    await prisma.quote.create({
      data: {
        customerId: c.id,
        quoteNumber: `QT-MGR-${100 + i}`,
        equipmentRequested: `Quote Equipment ${i + 1}`,
        rentalDuration: "1 week",
        estimatedTotal: 2500 + i * 500,
        status: "SENT",
        validUntil: new Date(now.getTime() + 10 * day),
      },
    });
  }
  for (let i = 0; i < 3; i++) {
    const c = managerCustomers[i % managerCustomers.length];
    await prisma.invoice.create({
      data: {
        customerId: c.id,
        invoiceNumber: `INV-OVD-${200 + i}`,
        amount: 3000 + i * 200,
        status: "OVERDUE",
        dueDate: new Date(now.getTime() - (i + 2) * day),
      },
    });
  }

  await prisma.maintenanceSchedule.deleteMany({});
  const maintTasks = [
    "Oil change",
    "Belt inspection",
    "Hydraulic check",
    "Filter replacement",
    "Safety inspection",
  ];
  for (let i = 0; i < 5; i++) {
    await prisma.maintenanceSchedule.create({
      data: {
        equipmentName: `Alert Unit ${i + 1}`,
        equipmentId: `CT00${i + 1}`,
        assigneeId: mechanic.id,
        taskType: maintTasks[i],
        status: i < 2 ? "OVERDUE" : "SCHEDULED",
        scheduledAt: new Date(now.getTime() + (i - 2) * day),
      },
    });
  }

  // Supervisor: team jobs, leave approvals, purchase requests
  await prisma.assignedJob.deleteMany({
    where: {
      employeeId: { in: [supervisor.id, ...teamMembers.map((t) => t.id), employee.id] },
    },
  });
  for (let i = 0; i < 5; i++) {
    await prisma.assignedJob.create({
      data: {
        employeeId: teamMembers[i % teamMembers.length].id,
        title: `Supervisor team job ${i + 1}`,
        status: i < 2 ? "IN_PROGRESS" : "ASSIGNED",
        dueDate: new Date(now.getTime() + (i + 1) * day),
      },
    });
  }

  await prisma.leaveRequest.deleteMany({});
  await prisma.leaveRequest.createMany({
    data: [
      {
        employeeId: teamMembers[0].id,
        startDate: new Date(now.getTime() + 14 * day),
        endDate: new Date(now.getTime() + 16 * day),
        reason: "Annual leave",
        status: "PENDING",
      },
      {
        employeeId: teamMembers[1].id,
        startDate: new Date(now.getTime() + 21 * day),
        endDate: new Date(now.getTime() + 23 * day),
        reason: "Medical appointment",
        status: "PENDING",
      },
    ],
  });

  await prisma.purchaseRequest.deleteMany({});
  await prisma.purchaseRequest.createMany({
    data: [
      {
        requesterId: teamMembers[2].id,
        itemName: "Safety gloves (box)",
        quantity: 10,
        estimatedCost: 150,
        status: "PENDING",
      },
      {
        requesterId: employee.id,
        itemName: "Cleaning solvent",
        quantity: 5,
        estimatedCost: 280,
        status: "PENDING",
      },
    ],
  });

  // Mechanic: 6 schedules, 4 repair tickets, 2 overdue inspections
  for (let i = 0; i < 6; i++) {
    await prisma.maintenanceSchedule.create({
      data: {
        equipmentName: `Service Unit ${i + 1}`,
        equipmentId: `MECH-${i + 1}`,
        assigneeId: mechanic.id,
        taskType: `Scheduled service ${i + 1}`,
        status: i === 5 ? "OVERDUE" : "SCHEDULED",
        scheduledAt: new Date(now.getTime() + (i - 1) * day),
      },
    });
  }
  await prisma.repairTicket.deleteMany({});
  for (let i = 0; i < 4; i++) {
    await prisma.repairTicket.create({
      data: {
        equipmentName: `Repair Unit ${i + 1}`,
        equipmentId: `REP-${i + 1}`,
        assigneeId: mechanic.id,
        title: `Repair ticket ${i + 1}`,
        description: "Reported defect requiring mechanic attention.",
        status: i < 2 ? "OPEN" : "IN_PROGRESS",
        priority: i === 0 ? "HIGH" : "MEDIUM",
      },
    });
  }
  await prisma.equipmentInspection.deleteMany({});
  for (let i = 0; i < 2; i++) {
    await prisma.equipmentInspection.create({
      data: {
        equipmentName: `Overdue Inspection ${i + 1}`,
        equipmentId: `INS-${i + 1}`,
        inspectorId: mechanic.id,
        result: "PENDING",
        inspectedAt: new Date(now.getTime() - (5 + i) * day),
      },
    });
  }

  // Driver: 3 deliveries, 2 collections, 1 vehicle
  await prisma.deliverySchedule.deleteMany({});
  for (let i = 0; i < 3; i++) {
    await prisma.deliverySchedule.create({
      data: {
        driverId: driver.id,
        customerName: `Delivery Customer ${i + 1}`,
        destination: `Site ${i + 1}, Tobago`,
        equipmentSummary: `Equipment load ${i + 1}`,
        status: i === 0 ? "IN_TRANSIT" : "SCHEDULED",
        scheduledAt: new Date(now.getTime() + i * day),
      },
    });
  }
  await prisma.equipmentReturn.deleteMany({});
  for (let i = 0; i < 2; i++) {
    await prisma.equipmentReturn.create({
      data: {
        equipmentName: `Collection Unit ${i + 1}`,
        equipmentId: `COL-${i + 1}`,
        customerName: `Return Customer ${i + 1}`,
        inspectorId: driver.id,
        status: "PENDING",
        returnedAt: new Date(now.getTime() + i * day),
      },
    });
  }
  await prisma.fleetVehicle.deleteMany({});
  await prisma.fleetVehicle.create({
    data: {
      plateNumber: "TBG-4821",
      make: "Toyota",
      model: "HiAce",
      year: 2022,
      status: "ACTIVE",
      assignedDriverId: driver.id,
    },
  });

  // Employee: 3 jobs, 1 inspection, 1 purchase request
  for (let i = 0; i < 3; i++) {
    await prisma.assignedJob.create({
      data: {
        employeeId: employee.id,
        title: `Assigned job ${i + 1}`,
        status: i === 0 ? "IN_PROGRESS" : "ASSIGNED",
        dueDate: new Date(now.getTime() + (i + 2) * day),
      },
    });
  }
  await prisma.equipmentInspection.create({
    data: {
      equipmentName: "Warehouse Forklift",
      equipmentId: "WH-001",
      inspectorId: employee.id,
      result: "PENDING",
      inspectedAt: new Date(now.getTime() + 2 * day),
      notes: "Routine inspection due",
    },
  });
  await prisma.purchaseRequest.create({
    data: {
      requesterId: employee.id,
      itemName: "Work gloves",
      quantity: 2,
      estimatedCost: 45,
      status: "PENDING",
    },
  });

  // Shared inventory for admin visibility
  await prisma.inventoryItem.deleteMany({});
  await prisma.inventoryItem.createMany({
    data: [
      { sku: "PART-001", name: "Pressure washer hose", category: "Parts", quantityOnHand: 8, reorderLevel: 5, location: "Main depot" },
      { sku: "PART-002", name: "Floor scrubber pad set", category: "Consumables", quantityOnHand: 3, reorderLevel: 6, location: "Main depot" },
      { sku: "PART-003", name: "Hydraulic fluid", category: "Fluids", quantityOnHand: 12, reorderLevel: 4, location: "Main depot" },
    ],
  });

  // Notifications for demo accounts
  const notifyTargets = [admin, manager, supervisor, mechanic, driver, employee];
  for (const emp of notifyTargets) {
    await prisma.employeeNotification.deleteMany({ where: { employeeId: emp.id } });
    await prisma.employeeNotification.create({
      data: {
        employeeId: emp.id,
        title: "Welcome to Pro Rentals Ops",
        message: `Signed in as ${emp.jobTitle}. Your role dashboard is ready.`,
        readStatus: "UNREAD",
      },
    });
  }

  // Audit entries for hierarchy seed
  const auditEntries = [
    { actorId: superAdminId, action: "ACCOUNT_CREATED" as const, entityId: admin.id, desc: "Demo Admin account provisioned", meta: { role: "ADMIN" } },
    { actorId: superAdminId, action: "ACCOUNT_CREATED" as const, entityId: manager.id, desc: "Demo Manager account provisioned", meta: { role: "MANAGER" } },
    { actorId: superAdminId, action: "ACCOUNT_CREATED" as const, entityId: supervisor.id, desc: "Demo Supervisor account provisioned", meta: { role: "SUPERVISOR" } },
    { actorId: superAdminId, action: "ACCOUNT_CREATED" as const, entityId: customer.id, desc: "Demo Customer account provisioned", meta: { role: "CUSTOMER" } },
    { actorId: admin.id, action: "PERMISSION_CHANGE" as const, entityId: roleIds.get("ADMIN")!, desc: "Admin role permissions synchronized", meta: { module: "ADMIN_MANAGEMENT" } },
  ];
  for (const entry of auditEntries) {
    await prisma.auditLog.create({
      data: {
        actorId: entry.actorId,
        action: entry.action,
        entityType: entry.action === "PERMISSION_CHANGE" ? "EmployeePermission" : "Employee",
        entityId: entry.entityId,
        description: entry.desc,
        metadata: entry.meta,
      },
    });
  }

  return { admin, manager, supervisor, mechanic, driver, employee, customer };
}
