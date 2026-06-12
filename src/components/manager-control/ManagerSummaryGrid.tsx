import type { ManagerDashboardSummary } from "@/lib/manager-control/types";

const CARDS: {
  key: keyof ManagerDashboardSummary;
  label: string;
  tone: string;
}[] = [
  { key: "pendingBookings", label: "Pending bookings", tone: "text-accent" },
  { key: "activeRentals", label: "Active rentals", tone: "text-secondary" },
  { key: "upcomingReturns", label: "Upcoming returns", tone: "text-tertiary" },
  { key: "outstandingInvoices", label: "Outstanding invoices", tone: "text-red-300" },
  { key: "openMaintenance", label: "Open maintenance", tone: "text-tertiary" },
  { key: "lowStockAlerts", label: "Low stock alerts", tone: "text-accent" },
  { key: "equipmentUtilizationPct", label: "Utilization %", tone: "text-foreground" },
  { key: "pendingQuotes", label: "Pending quotes", tone: "text-muted" },
  { key: "openServiceRequests", label: "Service requests", tone: "text-muted" },
  { key: "staffActiveJobs", label: "Staff active jobs", tone: "text-secondary" },
  { key: "staffCompletedJobs", label: "Completed jobs", tone: "text-muted" },
];

export function ManagerSummaryGrid({ summary }: { summary: ManagerDashboardSummary }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {CARDS.map((card) => (
        <div key={card.key} className="card-industrial p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            {card.label}
          </p>
          <p className={`mt-2 text-2xl font-bold ${card.tone}`}>
            {card.key === "equipmentUtilizationPct"
              ? `${summary[card.key]}%`
              : summary[card.key]}
          </p>
        </div>
      ))}
    </div>
  );
}
