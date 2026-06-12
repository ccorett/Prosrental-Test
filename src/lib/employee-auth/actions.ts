"use server";

import { redirect } from "next/navigation";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createEmployeeSession, destroyEmployeeSession } from "@/lib/employee-auth/session";
import { requireDatabaseUrl } from "@/lib/db/require-database";
import { prisma } from "@/lib/prisma";

export type EmployeeAuthResult = { error?: string };

export async function loginEmployee(
  _prev: EmployeeAuthResult,
  formData: FormData
): Promise<EmployeeAuthResult> {
  requireDatabaseUrl();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const employee = await prisma.employee.findUnique({
    where: { email },
    include: { role: true },
  });

  if (!employee) {
    return { error: "Invalid email or password." };
  }

  if (employee.status !== "ACTIVE") {
    return { error: "Your account is not active. Contact your administrator." };
  }

  const valid = await verifyPassword(password, employee.passwordHash);
  if (!valid) {
    return { error: "Invalid email or password." };
  }

  await createEmployeeSession(employee.id);
  redirect("/employee-portal/dashboard");
}

export async function logoutEmployee(): Promise<void> {
  await destroyEmployeeSession();
  redirect("/employee-portal/login");
}

export async function createEmployeeAccount(
  actorId: string,
  data: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    department?: string;
    jobTitle?: string;
    roleId: string;
  }
) {
  const passwordHash = await hashPassword(data.password);
  return prisma.employee.create({
    data: {
      fullName: data.fullName,
      email: data.email.toLowerCase(),
      phone: data.phone ?? null,
      department: data.department ?? null,
      jobTitle: data.jobTitle ?? null,
      passwordHash,
      roleId: data.roleId,
      status: "ACTIVE",
    },
    include: { role: true },
  });
}
