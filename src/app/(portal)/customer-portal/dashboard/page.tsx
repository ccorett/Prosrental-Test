import {
  Bell,
  ClipboardList,
  FileText,
  History,
  Receipt,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { PortalPageHeader } from "@/components/portal/app/PortalPageHeader";
import { PortalStatCard } from "@/components/portal/app/PortalStatCard";
import { StatusChip } from "@/components/portal/app/StatusChip";
import { requireCustomer } from "@/lib/auth/session";
import { formatPortalDate } from "@/lib/portal/format";
import {
  getCustomerBookings,
  getCustomerNotifications,
  getDashboardStats,
} from "@/lib/portal/queries";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const customer = await requireCustomer();
  const stats = await getDashboardStats(customer.id);
  const notifications = await getCustomerNotifications(customer.id);
  const recentBookings = (await getCustomerBookings(customer.id)).slice(0, 3);

  return (
    <div>
      <PortalPageHeader
        title={`Welcome, ${customer.fullName.split(" ")[0]}`}
        description="Your rental activity, requests, and account updates at a glance."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <PortalStatCard
          label="Active rentals"
          value={stats.activeRentals}
          icon={History}
          href="/customer-portal/rentals"
          accent="accent"
        />
        <PortalStatCard
          label="Upcoming returns"
          value={stats.upcomingReturns}
          icon={RotateCcw}
          href="/customer-portal/rentals"
          accent="secondary"
        />
        <PortalStatCard
          label="Outstanding invoices"
          value={stats.outstandingInvoices}
          icon={Receipt}
          href="/customer-portal/invoices"
          accent="tertiary"
        />
        <PortalStatCard
          label="Account notifications"
          value={stats.unreadNotifications}
          icon={Bell}
          href="/customer-portal/notifications"
        />
        <PortalStatCard
          label="Pending quotations"
          value={stats.pendingQuotes}
          icon={FileText}
          href="/customer-portal/quotes"
          accent="secondary"
        />
        <PortalStatCard
          label="Open service requests"
          value={stats.openServiceRequests}
          icon={ClipboardList}
          href="/customer-portal/service-requests"
          accent="tertiary"
        />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="card-industrial p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Notifications</h2>
            <Link href="/customer-portal/notifications" className="text-sm text-accent">
              View all
            </Link>
          </div>
          <ul className="space-y-3">
            {notifications.slice(0, 4).map((item) => (
              <li key={item.id} className="rounded-lg border border-border/60 bg-surface p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <StatusChip status={item.readStatus} />
                </div>
                <p className="mt-1 text-xs text-muted">{item.message}</p>
              </li>
            ))}
            {notifications.length === 0 && (
              <p className="text-sm text-muted">No notifications yet.</p>
            )}
          </ul>
        </section>

        <section className="card-industrial p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Booking Requests</h2>
            <Link href="/customer-portal/bookings" className="text-sm text-accent">
              View all
            </Link>
          </div>
          <ul className="space-y-3">
            {recentBookings.map((item) => (
              <li key={item.id} className="rounded-lg border border-border/60 bg-surface p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{item.equipmentName}</p>
                  <StatusChip status={item.requestStatus} />
                </div>
                <p className="mt-1 text-xs text-muted">
                  {formatPortalDate(item.rentalStartDate)} – {formatPortalDate(item.rentalEndDate)}
                </p>
              </li>
            ))}
            {recentBookings.length === 0 && (
              <p className="text-sm text-muted">No booking requests yet.</p>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
