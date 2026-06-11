import { PrismaClient } from "@prisma/client";
import { INVENTORY_RECORDS } from "../src/lib/equipment/inventory-records";

const prisma = new PrismaClient();

async function main() {
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

  const count = await prisma.equipmentInventory.count();
  console.log(`Seeded ${count} equipment inventory records.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
