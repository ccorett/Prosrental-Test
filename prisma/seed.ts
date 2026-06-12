import { PrismaClient } from "@prisma/client";
import { seedEmployeePortal } from "./seed-employee";
import { seedEquipmentInventory } from "./seed-equipment-categories";
import { DEMO_CREDENTIALS, seedDemoAccounts } from "./seed-demo-accounts";

const prisma = new PrismaClient();

async function main() {
  await seedEquipmentInventory(prisma);
  const { superAdmin, roleIds, credentials } = await seedEmployeePortal(prisma);
  await seedDemoAccounts(prisma, roleIds, superAdmin.id);

  const equipmentCount = await prisma.equipmentInventory.count();
  const employeeCount = await prisma.employee.count();
  const customerCount = await prisma.customer.count();
  console.log(`Seeded ${equipmentCount} equipment inventory records.`);
  console.log(`Seeded ${employeeCount} employee accounts.`);
  console.log(`Seeded ${customerCount} customer accounts.`);
  console.log(`Super Admin: ${credentials.email} / ${credentials.password}`);
  console.log("Demo accounts:");
  for (const [role, cred] of Object.entries(DEMO_CREDENTIALS)) {
    if (role === "superAdmin") continue;
    console.log(`  ${role}: ${cred.email} / ${cred.password}`);
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
