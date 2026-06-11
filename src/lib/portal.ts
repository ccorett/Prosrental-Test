import type { LucideIcon } from "lucide-react";
import {
  Bell,
  CalendarPlus,
  FileText,
  FolderOpen,
  History,
  LayoutDashboard,
  Receipt,
  Wrench,
} from "lucide-react";

export const PORTAL_PATH = "/customer-portal" as const;

export type PortalFeature = {
  id: string;
  title: string;
  icon: LucideIcon;
  accent: "accent" | "secondary" | "tertiary";
  bullets: string[];
};

export const PORTAL_FEATURES: PortalFeature[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: LayoutDashboard,
    accent: "accent",
    bullets: [
      "Active rentals",
      "Upcoming returns",
      "Outstanding invoices",
      "Account notifications",
    ],
  },
  {
    id: "booking",
    title: "Equipment Booking",
    icon: CalendarPlus,
    accent: "secondary",
    bullets: [
      "Reserve equipment online",
      "Select rental dates",
      "Submit booking requests",
    ],
  },
  {
    id: "quotes",
    title: "Quote Management",
    icon: FileText,
    accent: "accent",
    bullets: [
      "Request quotations",
      "View quotation history",
      "Accept quotations online",
    ],
  },
  {
    id: "history",
    title: "Rental History",
    icon: History,
    accent: "tertiary",
    bullets: ["Previous rentals", "Rental performance records"],
  },
  {
    id: "invoices",
    title: "Invoice Management",
    icon: Receipt,
    accent: "secondary",
    bullets: [
      "View invoices",
      "Download PDF invoices",
      "Payment status tracking",
    ],
  },
  {
    id: "documents",
    title: "Document Centre",
    icon: FolderOpen,
    accent: "accent",
    bullets: [
      "Rental agreements",
      "Safety documents",
      "Equipment manuals",
    ],
  },
  {
    id: "service",
    title: "Service Requests",
    icon: Wrench,
    accent: "tertiary",
    bullets: [
      "Report equipment issues",
      "Request support",
      "Submit return requests",
    ],
  },
  {
    id: "notifications",
    title: "Notifications",
    icon: Bell,
    accent: "secondary",
    bullets: [
      "Rental reminders",
      "Return reminders",
      "Invoice reminders",
    ],
  },
];

export type PortalRoadmapItem = {
  phase: string;
  title: string;
  description: string;
  status: "available" | "in-progress" | "planned";
};

export const PORTAL_ROADMAP: PortalRoadmapItem[] = [
  {
    phase: "Phase 1",
    title: "Portal preview & requests",
    description:
      "Browse portal capabilities and submit quote or booking requests through the public site.",
    status: "available",
  },
  {
    phase: "Phase 2",
    title: "Customer accounts & login",
    description:
      "Secure sign-in, profile management, and personalised dashboard views.",
    status: "in-progress",
  },
  {
    phase: "Phase 3",
    title: "Online booking & quotes",
    description:
      "Reserve equipment, manage quotations, and accept quotes in the portal.",
    status: "planned",
  },
  {
    phase: "Phase 4",
    title: "Invoices & documents",
    description:
      "Download invoices, track payments, and access agreements and manuals.",
    status: "planned",
  },
  {
    phase: "Phase 5",
    title: "Service & notifications",
    description:
      "Service requests, return scheduling, and automated rental reminders.",
    status: "planned",
  },
];
