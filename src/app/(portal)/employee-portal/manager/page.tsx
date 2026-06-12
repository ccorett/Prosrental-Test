import { ManagerSummaryGrid } from "@/components/manager-control/ManagerSummaryGrid";
import { getManagerDashboardSummary, getManagerRentals } from "@/lib/manager-control/queries";
export const metadata = { title: "Manager Control Centre" };

export default async function ManagerDashboardPage() {
  const [summary, rentals] = await Promise.all([
    getManagerDashboardSummary(),
    getManagerRentals(),
  ]);

  const upcoming = rentals
    .filter((r) => r.status === "ACTIVE")
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <ManagerSummaryGrid summary={summary} />

      <section className="card-industrial p-5">
        <h2 className="text-lg font-semibold text-foreground">Active rentals snapshot</h2>
        {upcoming.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No active rentals.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {upcoming.map((rental) => (
              <li
                key={rental.id}
                className="flex flex-wrap justify-between gap-2 rounded-lg border border-border/60 bg-surface px-3 py-2 text-sm"
              >
                <span>
                  <span className="font-medium text-foreground">{rental.equipmentName}</span>
                  <span className="text-muted"> — {rental.customerName}</span>
                </span>
                <span className="text-muted">
                  Until {new Date(rental.rentalEndDate).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card-industrial p-5">
        <h2 className="text-lg font-semibold text-foreground">Quick links</h2>
        <p className="mt-2 text-sm text-muted">
          Use the sections above to approve bookings, manage users, update equipment listings,
          track finances, and review audit activity.
        </p>
        <p className="mt-3 text-sm text-muted">
          Equipment listing edits:{" "}
          <a href="/employee-portal/equipment-listings" className="text-accent hover:underline">
            Equipment Listings
          </a>
        </p>
      </section>
    </div>
  );
}
