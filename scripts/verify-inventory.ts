import { config } from "dotenv";

config();

import { PrismaClient } from "@prisma/client";
import { INVENTORY_RECORDS, INVENTORY_STATS } from "../src/lib/equipment/inventory-records";

const prisma = new PrismaClient();

async function main() {
  const dbCount = await prisma.equipmentInventory.count();
  const featuredCount = await prisma.equipmentInventory.count({
    where: { featured: true },
  });
  const comingSoonCount = await prisma.equipmentInventory.count({
    where: { comingSoon: true },
  });
  const categories = await prisma.equipmentInventory.groupBy({
    by: ["category"],
    _count: { category: true },
  });

  console.log("--- Inventory verification ---");
  console.log(`Source records: ${INVENTORY_STATS.total}`);
  console.log(`Database records: ${dbCount}`);
  console.log(`Featured (source): ${INVENTORY_STATS.featured}`);
  console.log(`Featured (database): ${featuredCount}`);
  console.log(`Coming soon placeholders (source): ${INVENTORY_STATS.comingSoonPlaceholders}`);
  console.log(`Coming soon placeholders (database): ${comingSoonCount}`);
  console.log(`Categories (database): ${categories.length}`);
  categories.forEach((row) => {
    console.log(`  - ${row.category}: ${row._count.category}`);
  });

  if (dbCount !== INVENTORY_RECORDS.length) {
    throw new Error(`Expected ${INVENTORY_RECORDS.length} records, found ${dbCount}`);
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
