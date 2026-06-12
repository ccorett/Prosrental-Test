import type { EmployeeModule, PrismaClient, StaffRoleCode } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";

const SUPER_ADMIN_EMAIL = "superadmin@prorentals.co";
const SUPER_ADMIN_PASSWORD = "SuperAdmin123!";

const ROLE_DEFS: { code: StaffRoleCode; label: string; level: number; description: string }[] = [
  { code: "EMPLOYEE", label: "Employee", level: 1, description: "General staff access" },
  { code: "DRIVER", label: "Driver", level: 2, description: "Fleet and delivery operations" },
  { code: "MECHANIC", label: "Mechanic", level: 3, description: "Maintenance and repairs" },
  { code: "SUPERVISOR", label: "Supervisor", level: 4, description: "Team supervision and approvals" },
  { code: "MANAGER", label: "Manager", level: 5, description: "Department management" },
  { code: "ADMIN", label: "Admin", level: 6, description: "Platform administration" },
  { code: "SUPER_ADMIN", label: "Super Admin", level: 7, description: "Highest access — full system control" },
];

const ALL_MODULES: EmployeeModule[] = [
  "DASHBOARD",
  "EQUIPMENT_OPERATIONS",
  "MAINTENANCE",
  "INVENTORY",
  "EQUIPMENT_LISTINGS",
  "MANAGER_CONTROL",
  "FLEET_DELIVERY",
  "HR",
  "SAFETY_COMPLIANCE",
  "NOTIFICATIONS",
  "PROFILE",
  "ADMIN_MANAGEMENT",
];

type PermFlags = {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canOverride: boolean;
};

function perm(
  view = false,
  create = false,
  edit = false,
  del = false,
  approve = false,
  override = false
): PermFlags {
  return {
    canView: view,
    canCreate: create,
    canEdit: edit,
    canDelete: del,
    canApprove: approve,
    canOverride: override,
  };
}

function permissionsForRole(code: StaffRoleCode): Record<EmployeeModule, PermFlags> {
  const none = () => perm();
  const view = () => perm(true);
  const viewEdit = () => perm(true, false, true);
  const viewEditCreate = () => perm(true, true, true);
  const full = () => perm(true, true, true, true, true, true);

  const base: Record<EmployeeModule, PermFlags> = Object.fromEntries(
    ALL_MODULES.map((m) => [m, none()])
  ) as Record<EmployeeModule, PermFlags>;

  base.DASHBOARD = view();
  base.PROFILE = viewEdit();
  base.NOTIFICATIONS = view();

  switch (code) {
    case "EMPLOYEE":
      base.EQUIPMENT_OPERATIONS = view();
      base.SAFETY_COMPLIANCE = view();
      base.HR = perm(true, true, false, false, false);
      return base;
    case "DRIVER":
      base.EQUIPMENT_OPERATIONS = view();
      base.FLEET_DELIVERY = viewEdit();
      base.SAFETY_COMPLIANCE = view();
      base.HR = perm(true, true, false, false, false);
      return base;
    case "MECHANIC":
      base.EQUIPMENT_OPERATIONS = view();
      base.MAINTENANCE = viewEditCreate();
      base.SAFETY_COMPLIANCE = view();
      base.HR = perm(true, true, false, false, false);
      return base;
    case "SUPERVISOR":
      base.EQUIPMENT_OPERATIONS = viewEdit();
      base.MAINTENANCE = perm(true, true, true, false, true);
      base.INVENTORY = view();
      base.FLEET_DELIVERY = view();
      base.HR = perm(true, false, false, false, true);
      base.SAFETY_COMPLIANCE = viewEdit();
      return base;
    case "MANAGER":
      base.EQUIPMENT_OPERATIONS = viewEditCreate();
      base.MAINTENANCE = perm(true, true, true, false, true);
      base.INVENTORY = viewEdit();
      base.EQUIPMENT_LISTINGS = perm(true, true, true, false, false);
      base.MANAGER_CONTROL = perm(true, true, true, false, true, true);
      base.FLEET_DELIVERY = perm(true, true, true, false, true);
      base.HR = perm(true, false, false, false, true);
      base.SAFETY_COMPLIANCE = viewEdit();
      return base;
    case "ADMIN":
      for (const mod of ALL_MODULES) {
        if (mod === "ADMIN_MANAGEMENT") {
          base[mod] = perm(true, true, true, false, true, false);
        } else {
          base[mod] = perm(true, true, true, true, true, false);
        }
      }
      return base;
    case "SUPER_ADMIN":
      for (const mod of ALL_MODULES) {
        base[mod] = full();
      }
      return base;
    default:
      return base;
  }
}

export async function seedEmployeePortal(prisma: PrismaClient) {
  const roleIds = new Map<StaffRoleCode, string>();

  for (const def of ROLE_DEFS) {
    const role = await prisma.employeeRole.upsert({
      where: { code: def.code },
      create: def,
      update: { label: def.label, level: def.level, description: def.description },
    });
    roleIds.set(def.code, role.id);

    for (const module of ALL_MODULES) {
      const flags = permissionsForRole(def.code)[module];
      await prisma.employeePermission.upsert({
        where: { roleId_module: { roleId: role.id, module } },
        create: { roleId: role.id, module, ...flags },
        update: flags,
      });
    }
  }

  const superAdminRoleId = roleIds.get("SUPER_ADMIN")!;
  const passwordHash = await hashPassword(SUPER_ADMIN_PASSWORD);

  const superAdmin = await prisma.employee.upsert({
    where: { email: SUPER_ADMIN_EMAIL },
    create: {
      fullName: "Pro Rentals Super Admin",
      email: SUPER_ADMIN_EMAIL,
      phone: "868 734 9490",
      department: "Executive",
      jobTitle: "Super Administrator",
      passwordHash,
      roleId: superAdminRoleId,
      status: "ACTIVE",
      isProtected: true,
    },
    update: {
      fullName: "Pro Rentals Super Admin",
      passwordHash,
      roleId: superAdminRoleId,
      status: "ACTIVE",
      isProtected: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: superAdmin.id,
      action: "ACCOUNT_CREATED",
      entityType: "Employee",
      entityId: superAdmin.id,
      description: "Super Admin seed account provisioned",
      metadata: { role: "SUPER_ADMIN", protected: true },
    },
  });

  return {
    superAdmin,
    roleIds,
    credentials: { email: SUPER_ADMIN_EMAIL, password: SUPER_ADMIN_PASSWORD },
  };
}
