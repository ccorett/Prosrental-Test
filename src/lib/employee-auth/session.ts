import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { EmployeeModule, StaffRoleCode } from "@prisma/client";

export const EMPLOYEE_SESSION_COOKIE = "pr_employee_session";
const SESSION_DAYS = 14;

export type SessionEmployee = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  department: string | null;
  jobTitle: string | null;
  status: string;
  isProtected: boolean;
  roleId: string;
  roleCode: StaffRoleCode;
  roleLabel: string;
  roleLevel: number;
};

function sessionExpiry(): Date {
  const expires = new Date();
  expires.setDate(expires.getDate() + SESSION_DAYS);
  return expires;
}

export async function createEmployeeSession(employeeId: string): Promise<string> {
  const token = crypto.randomUUID();
  const expiresAt = sessionExpiry();

  await prisma.employeeSession.create({
    data: { employeeId, token, expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(EMPLOYEE_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return token;
}

export async function destroyEmployeeSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(EMPLOYEE_SESSION_COOKIE)?.value;

  if (token) {
    await prisma.employeeSession.deleteMany({ where: { token } });
    cookieStore.delete(EMPLOYEE_SESSION_COOKIE);
  }
}

const employeeSelect = {
  id: true,
  fullName: true,
  email: true,
  phone: true,
  department: true,
  jobTitle: true,
  status: true,
  isProtected: true,
  roleId: true,
  role: {
    select: {
      code: true,
      label: true,
      level: true,
    },
  },
} as const;

export async function getSessionEmployee(): Promise<SessionEmployee | null> {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(EMPLOYEE_SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const session = await prisma.employeeSession.findUnique({
      where: { token },
      include: { employee: { select: employeeSelect } },
    });

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await prisma.employeeSession.delete({ where: { id: session.id } });
      }
      cookieStore.delete(EMPLOYEE_SESSION_COOKIE);
      return null;
    }

    if (session.employee.status !== "ACTIVE") {
      return null;
    }

    const { employee } = session;
    return {
      id: employee.id,
      fullName: employee.fullName,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      jobTitle: employee.jobTitle,
      status: employee.status,
      isProtected: employee.isProtected,
      roleId: employee.roleId,
      roleCode: employee.role.code,
      roleLabel: employee.role.label,
      roleLevel: employee.role.level,
    };
  } catch {
    return null;
  }
}

export async function requireEmployee(): Promise<SessionEmployee> {
  const employee = await getSessionEmployee();
  if (!employee) {
    redirect("/employee-portal/login");
  }
  return employee;
}

export function isSuperAdmin(employee: SessionEmployee): boolean {
  return employee.roleCode === "SUPER_ADMIN";
}
