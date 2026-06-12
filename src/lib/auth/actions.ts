"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/auth/session";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { requireDatabaseUrl } from "@/lib/db/require-database";
import { prisma } from "@/lib/prisma";

export type AuthResult = { error?: string };

export async function registerCustomer(
  _prev: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  requireDatabaseUrl();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const companyName = String(formData.get("companyName") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!fullName || !email || !password) {
    return { error: "Full name, email, and password are required." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await hashPassword(password);

  const customer = await prisma.customer.create({
    data: {
      fullName,
      email,
      phone: phone || null,
      companyName: companyName || null,
      address: address || null,
      passwordHash,
      status: "ACTIVE",
      role: "CUSTOMER",
    },
  });

  await createSession(customer.id);
  redirect("/customer-portal/dashboard");
}

export async function loginCustomer(
  _prev: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  requireDatabaseUrl();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer) {
    return { error: "Invalid email or password." };
  }

  if (customer.status !== "ACTIVE") {
    return { error: "Your account is not active. Contact Pro Rentals support." };
  }

  const valid = await verifyPassword(password, customer.passwordHash);
  if (!valid) {
    return { error: "Invalid email or password." };
  }

  await createSession(customer.id);
  redirect("/customer-portal/dashboard");
}

export async function logoutCustomer(): Promise<void> {
  await destroySession();
  redirect("/customer-portal/login");
}
