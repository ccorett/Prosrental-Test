import { redirect } from "next/navigation";
import type { SessionEmployee } from "@/lib/employee-auth/session";
import { canAccessModule } from "@/lib/employee-portal/permissions";
import type { EmployeeModule } from "@prisma/client";

export async function ensureModulePage(
  employee: SessionEmployee,
  module: EmployeeModule
): Promise<void> {
  const allowed = await canAccessModule(employee, module, "view");
  if (!allowed) {
    redirect("/employee-portal/dashboard?access=denied");
  }
}
