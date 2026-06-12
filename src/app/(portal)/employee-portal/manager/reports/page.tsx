import {
  getActivityReport,
  getRevenueReport,
  getUtilizationReport,
} from "@/lib/manager-control/queries";
import { formatTTD } from "@/lib/utils";

export const metadata = { title: "Reports — Manager Control" };

export default async function ManagerReportsPage() {
  const [revenue, utilization, activity] = await Promise.all([
    getRevenueReport(),
    getUtilizationReport(),
    getActivityReport(),
  ]);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card-industrial p-4">
          <p className="text-xs uppercase text-muted">Total revenue</p>
          <p className="mt-2 text-xl font-bold">{formatTTD(revenue.totalRevenue)}</p>
        </div>
        <div className="card-industrial p-4">
          <p className="text-xs uppercase text-muted">Outstanding</p>
          <p className="mt-2 text-xl font-bold text-red-300">
            {formatTTD(revenue.outstandingTotal)}
          </p>
        </div>
        <div className="card-industrial p-4">
          <p className="text-xs uppercase text-muted">Active customers</p>
          <p className="mt-2 text-xl font-bold">{activity.activeCustomers}</p>
        </div>
        <div className="card-industrial p-4">
          <p className="text-xs uppercase text-muted">Quote conversions</p>
          <p className="mt-2 text-xl font-bold">{activity.quoteConversions}</p>
        </div>
      </div>

      <section className="card-industrial p-5">
        <h2 className="text-lg font-semibold">Revenue by month</h2>
        <table className="mt-4 w-full text-sm">
          <tbody>
            {revenue.revenueByMonth.length === 0 ? (
              <tr>
                <td className="text-muted">No paid invoice data yet.</td>
              </tr>
            ) : (
              revenue.revenueByMonth.map((row) => (
                <tr key={row.month} className="border-t border-border/60">
                  <td className="py-2">{row.month}</td>
                  <td className="py-2 text-right">{formatTTD(row.total)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card-industrial p-5">
          <h2 className="text-lg font-semibold">Most rented equipment</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {utilization.mostRented.map((item) => (
              <li key={item.name} className="flex justify-between border-b border-border/40 py-2">
                <span>{item.name}</span>
                <span className="text-muted">{item.count} rentals</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-industrial p-5">
          <h2 className="text-lg font-semibold">Underused equipment</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {utilization.underused.map((item) => (
              <li key={item.name} className="flex justify-between border-b border-border/40 py-2">
                <span>{item.name}</span>
                <span className="text-muted">{item.count} rentals</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card-industrial p-5">
        <h2 className="text-lg font-semibold">Staff productivity</h2>
        <p className="mt-2 text-sm text-muted">
          {activity.assignedJobs} assigned jobs · {activity.completedJobs} completed
        </p>
      </section>

      <section className="card-industrial p-5">
        <h2 className="text-lg font-semibold">Maintenance frequency</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {utilization.maintenanceFrequency.map((item) => (
            <li key={item.name} className="flex justify-between border-b border-border/40 py-2">
              <span>{item.name}</span>
              <span className="text-muted">{item.count} tasks</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
