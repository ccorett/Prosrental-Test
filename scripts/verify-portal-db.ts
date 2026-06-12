import { config } from "dotenv";

config();

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEMO_EMAIL = "demo@prorentals.co";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Customer Portal requires Neon PostgreSQL.");
  }

  const [
    customers,
    sessions,
    equipment,
    bookings,
    quotes,
    rentals,
    invoices,
    documents,
    serviceRequests,
    notifications,
  ] = await Promise.all([
    prisma.customer.count(),
    prisma.customerSession.count(),
    prisma.equipmentInventory.count(),
    prisma.bookingRequest.count(),
    prisma.quote.count(),
    prisma.rental.count(),
    prisma.invoice.count(),
    prisma.customerDocument.count(),
    prisma.serviceRequest.count(),
    prisma.notification.count(),
  ]);

  const demo = await prisma.customer.findUnique({
    where: { email: DEMO_EMAIL },
    include: {
      bookingRequests: true,
      quotes: true,
      rentals: true,
      invoices: true,
      documents: true,
      serviceRequests: true,
      notifications: true,
    },
  });

  console.log("--- Customer Portal Neon verification ---");
  console.log(`customers: ${customers}`);
  console.log(`customer_sessions: ${sessions}`);
  console.log(`equipment_inventory: ${equipment}`);
  console.log(`booking_requests: ${bookings}`);
  console.log(`quotes: ${quotes}`);
  console.log(`rentals: ${rentals}`);
  console.log(`invoices: ${invoices}`);
  console.log(`customer_documents: ${documents}`);
  console.log(`service_requests: ${serviceRequests}`);
  console.log(`notifications: ${notifications}`);

  if (!demo) {
    throw new Error(`Demo customer ${DEMO_EMAIL} not found. Run: npm run db:seed`);
  }

  console.log(`\nDemo customer (${DEMO_EMAIL}):`);
  console.log(`  bookings: ${demo.bookingRequests.length}`);
  console.log(`  quotes: ${demo.quotes.length}`);
  console.log(`  rentals: ${demo.rentals.length}`);
  console.log(`  invoices: ${demo.invoices.length}`);
  console.log(`  documents: ${demo.documents.length}`);
  console.log(`  service requests: ${demo.serviceRequests.length}`);
  console.log(`  notifications: ${demo.notifications.length}`);

  if (equipment < 1) {
    throw new Error("Equipment inventory is empty. Run: npm run db:seed");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
