import { EmployeePageHeader } from "@/components/employee-portal/app/EmployeePageHeader";
import { requireEmployee } from "@/lib/employee-auth/session";
import { ensureModulePage } from "@/lib/employee-portal/guard";
import { getMaintenanceData } from "@/lib/employee-portal/queries";

export const metadata = { title: "Maintenance" };

export default async function MaintenancePage() {
  const employee = await requireEmployee();
  await ensureModulePage(employee, "MAINTENANCE");
  const { schedules, repairs } = await getMaintenanceData();

  return (
    <div className="space-y-8">
      <EmployeePageHeader title="Maintenance" description="Schedules and repair tickets." />
      <DataSection
        title="Maintenance schedules"
        items={schedules.map((s) => `${s.equipmentName} — ${s.taskType} (${s.status})`)}
      />
      <DataSection
        title="Repair tickets"
        items={repairs.map((r) => `${r.title} — ${r.equipmentName} (${r.status})`)}
      />
    </div>
  );
}

function DataSection({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="card-industrial p-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      <ul className="mt-4 space-y-2">
        {items.length === 0 ? (
          <li className="text-sm text-muted">No records.</li>
        ) : (
          items.map((item, i) => (
            <li key={i} className="rounded-lg border border-border/60 bg-surface px-3 py-2 text-sm text-muted">
              {item}
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
