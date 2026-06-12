import { EmployeePageHeader } from "@/components/employee-portal/app/EmployeePageHeader";
import { StockDashboard } from "@/components/employee-portal/listings/StockDashboard";
import { requireEmployee } from "@/lib/employee-auth/session";
import { ensureModulePage } from "@/lib/employee-portal/guard";
import {
  getReadOnlyEquipmentAvailability,
  getStockDashboardStats,
} from "@/lib/employee-portal/listing-queries";
import { getInventoryData } from "@/lib/employee-portal/queries";
import { getInternalAvailabilityLabel } from "@/lib/equipment/types";

export const metadata = { title: "Inventory" };
export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const employee = await requireEmployee();
  await ensureModulePage(employee, "INVENTORY");
  const [{ items, purchases }, equipment, stats] = await Promise.all([
    getInventoryData(),
    getReadOnlyEquipmentAvailability(),
    getStockDashboardStats(),
  ]);

  return (
    <div className="space-y-8">
      <EmployeePageHeader
        title="Inventory"
        description="Operational stock levels and public equipment availability (read-only)."
      />

      <StockDashboard stats={stats} />

      <section className="card-industrial p-5">
        <h2 className="text-lg font-semibold">Public equipment availability</h2>
        <p className="mt-1 text-sm text-muted">
          Stock-derived status for catalogue items. Edit listings from Equipment Listings (Manager+).
        </p>
        <ul className="mt-4 max-h-96 space-y-2 overflow-y-auto">
          {equipment.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 bg-surface px-3 py-2 text-sm"
            >
              <span>
                <span className="font-medium text-foreground">{item.name}</span>
                <span className="text-muted"> — {item.itemId}</span>
              </span>
              <span className="text-muted">
                {item.quantityAvailable}/{item.quantityTotal} ·{" "}
                {getInternalAvailabilityLabel(item.availabilityStatus)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card-industrial p-5">
        <h2 className="text-lg font-semibold">Inventory items</h2>
        <ul className="mt-4 space-y-2">
          {items.map((item) => (
            <li key={item.id} className="rounded-lg border border-border/60 bg-surface px-3 py-2 text-sm">
              <span className="font-medium text-foreground">{item.name}</span>
              <span className="text-muted"> — {item.quantityOnHand} {item.unit} ({item.sku})</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card-industrial p-5">
        <h2 className="text-lg font-semibold">Purchase requests</h2>
        <ul className="mt-4 space-y-2">
          {purchases.map((p) => (
            <li key={p.id} className="rounded-lg border border-border/60 bg-surface px-3 py-2 text-sm text-muted">
              {p.itemName} × {p.quantity} — {p.status}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
