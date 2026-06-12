import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";
import { INVENTORY_RECORDS } from "../src/lib/equipment/inventory-records";

const prisma = new PrismaClient();

const DEMO_EMAIL = "demo@prorentals.co";
const DEMO_PASSWORD = "Demo123!";

async function seedEquipment() {
  for (const record of INVENTORY_RECORDS) {
    await prisma.equipmentInventory.upsert({
      where: { itemId: record.itemId },
      create: {
        itemId: record.itemId,
        category: record.category,
        equipmentName: record.equipmentName,
        description: record.description,
        dailyRate: record.dailyRate,
        weeklyRate: record.weeklyRate,
        monthlyRate: record.monthlyRate,
        quantityAvailable: record.quantityAvailable,
        quantityTotal: record.quantityTotal,
        availabilityStatus: record.availabilityStatus,
        imageUrl: record.imageUrl,
        featured: record.featured,
        comingSoon: record.comingSoon,
      },
      update: {
        category: record.category,
        equipmentName: record.equipmentName,
        description: record.description,
        dailyRate: record.dailyRate,
        weeklyRate: record.weeklyRate,
        monthlyRate: record.monthlyRate,
        quantityAvailable: record.quantityAvailable,
        quantityTotal: record.quantityTotal,
        availabilityStatus: record.availabilityStatus,
        imageUrl: record.imageUrl,
        featured: record.featured,
        comingSoon: record.comingSoon,
      },
    });
  }
}

async function seedDemoCustomer() {
  const passwordHash = await hashPassword(DEMO_PASSWORD);

  const customer = await prisma.customer.upsert({
    where: { email: DEMO_EMAIL },
    create: {
      fullName: "Demo Customer",
      email: DEMO_EMAIL,
      phone: "868 734 9490",
      companyName: "Tobago Build Co.",
      address: "Plymouth, Tobago",
      passwordHash,
      status: "ACTIVE",
      role: "CUSTOMER",
    },
    update: {
      fullName: "Demo Customer",
      phone: "868 734 9490",
      companyName: "Tobago Build Co.",
      address: "Plymouth, Tobago",
      passwordHash,
      status: "ACTIVE",
    },
  });

  await prisma.bookingRequest.deleteMany({ where: { customerId: customer.id } });
  await prisma.quote.deleteMany({ where: { customerId: customer.id } });
  await prisma.serviceRequest.deleteMany({ where: { customerId: customer.id } });
  await prisma.notification.deleteMany({ where: { customerId: customer.id } });
  await prisma.invoice.deleteMany({ where: { customerId: customer.id } });
  await prisma.customerDocument.deleteMany({ where: { customerId: customer.id } });
  await prisma.rental.deleteMany({ where: { customerId: customer.id } });

  const now = new Date();
  const inThreeDays = new Date(now.getTime() + 3 * 86400000);
  const inSevenDays = new Date(now.getTime() + 7 * 86400000);
  const lastMonth = new Date(now.getTime() - 30 * 86400000);

  const activeRental = await prisma.rental.create({
    data: {
      customerId: customer.id,
      equipmentName: "Industrial Floor Scrubber",
      rentalStartDate: lastMonth,
      rentalEndDate: inThreeDays,
      status: "ACTIVE",
      performanceNotes: "Operating normally. Last service check passed.",
    },
  });

  await prisma.rental.create({
    data: {
      customerId: customer.id,
      equipmentName: "Pressure Washer 4000 PSI",
      rentalStartDate: new Date(now.getTime() - 14 * 86400000),
      rentalEndDate: inSevenDays,
      status: "ACTIVE",
      performanceNotes: "Scheduled for return inspection next week.",
    },
  });

  await prisma.rental.create({
    data: {
      customerId: customer.id,
      equipmentName: "Portable Concrete Mixer",
      rentalStartDate: new Date(now.getTime() - 60 * 86400000),
      rentalEndDate: new Date(now.getTime() - 45 * 86400000),
      returnDate: new Date(now.getTime() - 44 * 86400000),
      status: "RETURNED",
      performanceNotes: "Returned clean. No damage reported.",
    },
  });

  await prisma.bookingRequest.create({
    data: {
      customerId: customer.id,
      equipmentId: "CE005",
      equipmentName: "Pressure Washer 4000 PSI",
      rentalStartDate: inSevenDays,
      rentalEndDate: new Date(inSevenDays.getTime() + 5 * 86400000),
      deliveryRequired: true,
      deliveryAddress: "Scarborough Job Site, Tobago",
      requestStatus: "PENDING",
      notes: "Need early morning delivery if possible.",
    },
  });

  await prisma.quote.createMany({
    data: [
      {
        customerId: customer.id,
        quoteNumber: "QT-DEMO-001",
        equipmentRequested: "Scissor Lift 19ft",
        rentalDuration: "2 weeks",
        estimatedTotal: 12000,
        status: "SENT",
        validUntil: new Date(now.getTime() + 14 * 86400000),
        notes: "Includes delivery to site.",
      },
      {
        customerId: customer.id,
        quoteNumber: "QT-DEMO-002",
        equipmentRequested: "Wood Chipper",
        rentalDuration: "3 days",
        estimatedTotal: 1800,
        status: "ACCEPTED",
        validUntil: new Date(now.getTime() + 7 * 86400000),
      },
    ],
  });

  await prisma.invoice.createMany({
    data: [
      {
        customerId: customer.id,
        invoiceNumber: "INV-DEMO-1042",
        amount: 4250,
        status: "UNPAID",
        dueDate: inSevenDays,
        pdfUrl: "/documents/placeholder-invoice-1042.pdf",
      },
      {
        customerId: customer.id,
        invoiceNumber: "INV-DEMO-1038",
        amount: 850,
        status: "PAID",
        dueDate: lastMonth,
        pdfUrl: "/documents/placeholder-invoice-1038.pdf",
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
      {
        customerId: customer.id,
        title: "Concrete Mixer Operator Manual",
        documentType: "EQUIPMENT_MANUAL",
        equipmentName: "Portable Concrete Mixer",
        fileUrl: "/documents/placeholder-manual.pdf",
      },
    ],
  });

  await prisma.serviceRequest.create({
    data: {
      customerId: customer.id,
      rentalId: activeRental.id,
      requestType: "EQUIPMENT_ISSUE",
      subject: "Intermittent power indicator",
      description: "The floor scrubber power indicator flickers during startup.",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
    },
  });

  await prisma.notification.createMany({
    data: [
      {
        customerId: customer.id,
        title: "Return reminder",
        message: "Industrial Floor Scrubber return is due in 3 days.",
        notificationType: "RETURN_REMINDER",
        readStatus: "UNREAD",
      },
      {
        customerId: customer.id,
        title: "Invoice due soon",
        message: "Invoice INV-DEMO-1042 is due in 7 days.",
        notificationType: "INVOICE_REMINDER",
        readStatus: "UNREAD",
      },
      {
        customerId: customer.id,
        title: "Quote ready for review",
        message: "Quotation QT-DEMO-001 is ready to accept online.",
        notificationType: "ACCOUNT_NOTICE",
        readStatus: "READ",
      },
    ],
  });

  return customer;
}

async function main() {
  await seedEquipment();
  const customer = await seedDemoCustomer();

  const equipmentCount = await prisma.equipmentInventory.count();
  console.log(`Seeded ${equipmentCount} equipment inventory records.`);
  console.log(`Demo customer: ${customer.email} / ${DEMO_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
