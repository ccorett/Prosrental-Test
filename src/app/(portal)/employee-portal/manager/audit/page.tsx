import { getManagerAuditLogs } from "@/lib/manager-control/queries";

export const metadata = { title: "Audit — Manager Control" };

export default async function ManagerAuditPage() {
  const logs = await getManagerAuditLogs(100);

  return (
    <section className="card-industrial overflow-x-auto p-5">
      <h2 className="text-lg font-semibold">Audit log</h2>
      <p className="mt-1 text-sm text-muted">
        Manager actions across bookings, equipment, finance, and maintenance.
      </p>
      {logs.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No audit entries yet.</p>
      ) : (
        <table className="mt-4 min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-muted">
              <th className="px-3 py-2">When</th>
              <th className="px-3 py-2">Actor</th>
              <th className="px-3 py-2">Action</th>
              <th className="px-3 py-2">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-3 py-2 text-muted whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-3 py-2 text-muted">
                  {log.actor?.fullName ?? "System"}
                </td>
                <td className="px-3 py-2 font-medium">{log.action}</td>
                <td className="px-3 py-2 text-muted">{log.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
