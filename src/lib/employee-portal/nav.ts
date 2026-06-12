import type { LucideIcon } from "lucide-react";
import {
  Bell,
  ClipboardList,
  Gauge,
  LayoutDashboard,
  ListChecks,
  Package,
  Shield,
  Truck,
  User,
  Users,
  Wrench,
} from "lucide-react";
import type { EmployeeModule } from "@prisma/client";

export const EMPLOYEE_PORTAL_PATH = "/employee-portal" as const;

export type EmployeeNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  module: EmployeeModule;
};

export const EMPLOYEE_PORTAL_NAV: EmployeeNavItem[] = [
  { href: "/employee-portal/dashboard", label: "Dashboard", icon: LayoutDashboard, module: "DASHBOARD" },
  { href: "/employee-portal/equipment-operations", label: "Equipment Operations", icon: ClipboardList, module: "EQUIPMENT_OPERATIONS" },
  { href: "/employee-portal/maintenance", label: "Maintenance", icon: Wrench, module: "MAINTENANCE" },
  { href: "/employee-portal/inventory", label: "Inventory", icon: Package, module: "INVENTORY" },
  { href: "/employee-portal/equipment-listings", label: "Equipment Listings", icon: ListChecks, module: "EQUIPMENT_LISTINGS" },
  { href: "/employee-portal/manager", label: "Manager Control Centre", icon: Gauge, module: "MANAGER_CONTROL" },
  { href: "/employee-portal/fleet-delivery", label: "Fleet & Delivery", icon: Truck, module: "FLEET_DELIVERY" },
  { href: "/employee-portal/hr", label: "HR", icon: Users, module: "HR" },
  { href: "/employee-portal/safety-compliance", label: "Safety & Compliance", icon: Shield, module: "SAFETY_COMPLIANCE" },
  { href: "/employee-portal/notifications", label: "Notifications", icon: Bell, module: "NOTIFICATIONS" },
  { href: "/employee-portal/profile", label: "My Profile", icon: User, module: "PROFILE" },
  { href: "/employee-portal/admin", label: "Admin Management", icon: Users, module: "ADMIN_MANAGEMENT" },
];

export function isEmployeePortalAppPath(pathname: string): boolean {
  if (pathname === "/employee-portal/manager" || pathname.startsWith("/employee-portal/manager/")) {
    return true;
  }
  return EMPLOYEE_PORTAL_NAV.some(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );
}

export function isEmployeePortalAuthPath(pathname: string): boolean {
  return pathname === "/employee-portal/login";
}

export function shouldHideEmployeePublicCta(pathname: string): boolean {
  return (
    pathname === EMPLOYEE_PORTAL_PATH ||
    isEmployeePortalAppPath(pathname) ||
    isEmployeePortalAuthPath(pathname)
  );
}
