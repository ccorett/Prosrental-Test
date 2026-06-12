import { config } from "dotenv";

config();

import { PrismaClient } from "@prisma/client";
import { verifyPassword } from "../src/lib/auth/password";

const prisma = new PrismaClient();
const EMAIL = "superadmin@prorentals.co";
const PASSWORD = "SuperAdmin123!";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const employee = await prisma.employee.findUnique({
    where: { email: EMAIL },
    include: { role: true },
  });

  if (!employee) {
    console.error("NOT FOUND:", EMAIL);
    process.exit(1);
  }

  console.log({
    email: employee.email,
    status: employee.status,
    role: employee.role.code,
    isProtected: employee.isProtected,
  });

  const valid = await verifyPassword(PASSWORD, employee.passwordHash);
  console.log("password valid:", valid);

  if (!valid) {
    process.exit(1);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
