import type { LucideIcon } from "lucide-react";
import {
  Bell,
  CalendarPlus,
  ClipboardList,
  FileText,
  FolderOpen,
  History,
  LayoutDashboard,
  Receipt,
  User,
  Wrench,
} from "lucide-react";

export const PORTAL_PATH = "/customer-portal" as const;

export type PortalNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const PORTAL_NAV: PortalNavItem[] = [
  { href: "/customer-portal/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customer-portal/book-equipment", label: "Book Equipment", icon: CalendarPlus },
  { href: "/customer-portal/bookings", label: "My Bookings", icon: ClipboardList },
  { href: "/customer-portal/quotes", label: "Quotes", icon: FileText },
  { href: "/customer-portal/rentals", label: "Rentals", icon: History },
  { href: "/customer-portal/invoices", label: "Invoices", icon: Receipt },
  { href: "/customer-portal/documents", label: "Documents", icon: FolderOpen },
  { href: "/customer-portal/service-requests", label: "Service Requests", icon: Wrench },
  { href: "/customer-portal/notifications", label: "Notifications", icon: Bell },
  { href: "/customer-portal/account", label: "Account", icon: User },
];

export function isPortalAppPath(pathname: string): boolean {
  return PORTAL_NAV.some(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );
}

export function isPortalAuthPath(pathname: string): boolean {
  return (
    pathname === "/customer-portal/login" ||
    pathname === "/customer-portal/register"
  );
}

export function shouldHidePublicCta(pathname: string): boolean {
  return (
    pathname === PORTAL_PATH ||
    isPortalAppPath(pathname) ||
    isPortalAuthPath(pathname) ||
    pathname === "/employee-portal" ||
    pathname.startsWith("/employee-portal/")
  );
}
