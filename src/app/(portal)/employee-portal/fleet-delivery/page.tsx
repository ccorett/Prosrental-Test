import { EmployeePageHeader } from "@/components/employee-portal/app/EmployeePageHeader";
import { requireEmployee } from "@/lib/employee-auth/session";
import { ensureModulePage } from "@/lib/employee-portal/guard";
import { getFleetDeliveryData } from "@/lib/employee-portal/queries";

export const metadata = { title: "Fleet & Delivery" };

export default async function FleetDeliveryPage() {
  const employee = await requireEmployee();
  await ensureModulePage(employee, "FLEET_DELIVERY");
  const { vehicles, deliveries } = await getFleetDeliveryData();

  return (
    <div className="space-y-8">
      <EmployeePageHeader title="Fleet & Delivery" description="Vehicles and delivery schedules." />
      <section className="card-industrial p-5">
        <h2 className="text-lg font-semibold">Fleet vehicles</h2>
        <ul className="mt-4 space-y-2">
          {vehicles.map((v) => (
            <li key={v.id} className="rounded-lg border border-border/60 bg-surface px-3 py-2 text-sm text-muted">
              {v.plateNumber} — {v.year} {v.make} {v.model} ({v.status})
            </li>
          ))}
        </ul>
      </section>
      <section className="card-industrial p-5">
        <h2 className="text-lg font-semibold">Delivery schedules</h2>
        <ul className="mt-4 space-y-2">
          {deliveries.map((d) => (
            <li key={d.id} className="rounded-lg border border-border/60 bg-surface px-3 py-2 text-sm text-muted">
              {d.customerName} → {d.destination} — {d.status}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
