import { EmployeePageHeader } from "@/components/employee-portal/app/EmployeePageHeader";
import { requireEmployee } from "@/lib/employee-auth/session";
import { ensureModulePage } from "@/lib/employee-portal/guard";
import { getEquipmentOperations } from "@/lib/employee-portal/queries";

export const metadata = { title: "Equipment Operations" };

export default async function EquipmentOperationsPage() {
  const employee = await requireEmployee();
  await ensureModulePage(employee, "EQUIPMENT_OPERATIONS");
  const { dispatches, returns, inspections } = await getEquipmentOperations();

  return (
    <div className="space-y-8">
      <EmployeePageHeader
        title="Equipment Operations"
        description="Dispatch, returns, and inspection records from Neon."
      />
      <Section title="Dispatches" rows={dispatches.map((d) => [d.equipmentName, d.customerName, d.status, d.scheduledAt.toLocaleDateString()])} />
      <Section title="Returns" rows={returns.map((r) => [r.equipmentName, r.customerName, r.status, r.returnedAt.toLocaleDateString()])} />
      <Section title="Inspections" rows={inspections.map((i) => [i.equipmentName, i.result, i.inspectedAt.toLocaleDateString()])} />
    </div>
  );
}

function Section({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <section className="card-industrial p-5">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-muted">No records yet.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {rows.map((row, idx) => (
            <li key={idx} className="rounded-lg border border-border/60 bg-surface px-3 py-2 text-sm text-muted">
              {row.join(" · ")}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
