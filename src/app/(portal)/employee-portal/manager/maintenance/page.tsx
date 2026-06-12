import { StatusChip } from "@/components/manager-control/StatusChip";
import { getManagerMaintenanceOverview } from "@/lib/manager-control/queries";

export const metadata = { title: "Maintenance — Manager Control" };

export default async function ManagerMaintenancePage() {
  const { schedules, repairs, inspections } = await getManagerMaintenanceOverview();

  return (
    <div className="space-y-8">
      <section className="card-industrial overflow-x-auto p-5">
        <h2 className="text-lg font-semibold">Maintenance schedules</h2>
        {schedules.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No maintenance schedules.</p>
        ) : (
          <table className="mt-4 min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-muted">
                <th className="px-3 py-2">Equipment</th>
                <th className="px-3 py-2">Task</th>
                <th className="px-3 py-2">Scheduled</th>
                <th className="px-3 py-2">Assignee</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {schedules.map((s) => (
                <tr key={s.id}>
                  <td className="px-3 py-2 font-medium">{s.equipmentName}</td>
                  <td className="px-3 py-2 text-muted">{s.taskType}</td>
                  <td className="px-3 py-2 text-muted">
                    {new Date(s.scheduledAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 text-muted">{s.assignee?.fullName ?? "Unassigned"}</td>
                  <td className="px-3 py-2">
                    <StatusChip
                      label={s.status}
                      tone={s.status === "OVERDUE" ? "red" : "amber"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="card-industrial overflow-x-auto p-5">
        <h2 className="text-lg font-semibold">Repair tickets</h2>
        <table className="mt-4 min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-muted">
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Equipment</th>
              <th className="px-3 py-2">Assignee</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {repairs.map((r) => (
              <tr key={r.id}>
                <td className="px-3 py-2 font-medium">{r.title}</td>
                <td className="px-3 py-2 text-muted">{r.equipmentName}</td>
                <td className="px-3 py-2 text-muted">{r.assignee?.fullName ?? "Unassigned"}</td>
                <td className="px-3 py-2">
                  <StatusChip label={r.status} tone="amber" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card-industrial overflow-x-auto p-5">
        <h2 className="text-lg font-semibold">Inspection records</h2>
        <table className="mt-4 min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-muted">
              <th className="px-3 py-2">Equipment</th>
              <th className="px-3 py-2">Inspector</th>
              <th className="px-3 py-2">Result</th>
              <th className="px-3 py-2">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {inspections.map((i) => (
              <tr key={i.id}>
                <td className="px-3 py-2">{i.equipmentName}</td>
                <td className="px-3 py-2 text-muted">{i.inspector.fullName}</td>
                <td className="px-3 py-2">
                  <StatusChip
                    label={i.result}
                    tone={i.result === "PASSED" ? "green" : i.result === "FAILED" ? "red" : "muted"}
                  />
                </td>
                <td className="px-3 py-2 text-muted">
                  {new Date(i.inspectedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
