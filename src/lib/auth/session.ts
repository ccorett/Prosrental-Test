import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Customer } from "@prisma/client";

export const SESSION_COOKIE = "pr_portal_session";
const SESSION_DAYS = 14;

export type SessionCustomer = Pick<
  Customer,
  "id" | "fullName" | "email" | "phone" | "companyName" | "address" | "status" | "role"
>;

function sessionExpiry(): Date {
  const expires = new Date();
  expires.setDate(expires.getDate() + SESSION_DAYS);
  return expires;
}

export async function createSession(customerId: string): Promise<string> {
  const token = crypto.randomUUID();
  const expiresAt = sessionExpiry();

  await prisma.customerSession.create({
    data: { customerId, token, expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return token;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await prisma.customerSession.deleteMany({ where: { token } });
    cookieStore.delete(SESSION_COOKIE);
  }
}

export async function getSessionCustomer(): Promise<SessionCustomer | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.customerSession.findUnique({
    where: { token },
    include: {
      customer: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          companyName: true,
          address: true,
          status: true,
          role: true,
        },
      },
    },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.customerSession.delete({ where: { id: session.id } });
    }
    cookieStore.delete(SESSION_COOKIE);
    return null;
  }

  if (session.customer.status !== "ACTIVE") {
    return null;
  }

  return session.customer;
}

export async function requireCustomer(): Promise<SessionCustomer> {
  const customer = await getSessionCustomer();
  if (!customer) {
    redirect("/customer-portal/login");
  }
  return customer;
}
