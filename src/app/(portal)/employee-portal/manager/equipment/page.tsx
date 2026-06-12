import Link from "next/link";
import { StatusChip } from "@/components/manager-control/StatusChip";
import {
  getManagerCategories,
  getManagerEquipmentRegister,
} from "@/lib/manager-control/queries";
import { getInternalAvailabilityLabel } from "@/lib/equipment/types";
import { formatTTD } from "@/lib/utils";

export const metadata = { title: "Equipment — Manager Control" };

export default async function ManagerEquipmentPage() {
  const [equipment, categories] = await Promise.all([
    getManagerEquipmentRegister(),
    getManagerCategories(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">
          Full listing edits, stock, rates, and images in Equipment Listings.
        </p>
        <Link
          href="/employee-portal/equipment-listings"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background"
        >
          Open Equipment Listings
        </Link>
      </div>

      <section className="card-industrial overflow-x-auto p-5">
        <h2 className="text-lg font-semibold">Equipment register ({equipment.length})</h2>
        <table className="mt-4 min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-muted">
              <th className="px-3 py-2">Item</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Stock</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Rates</th>
              <th className="px-3 py-2">Flags</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {equipment.map((item) => (
              <tr key={item.id}>
                <td className="px-3 py-2">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted">{item.itemId}</p>
                </td>
                <td className="px-3 py-2 text-muted">{item.category}</td>
                <td className="px-3 py-2 text-muted">
                  {item.quantityAvailable}/{item.quantityTotal}
                  <span className="block text-xs">{item.quantityReserved} reserved</span>
                </td>
                <td className="px-3 py-2">
                  <StatusChip
                    label={getInternalAvailabilityLabel(item.availabilityStatus)}
                    tone={
                      item.availabilityStatus === "AVAILABLE"
                        ? "green"
                        : item.availabilityStatus === "OUT_OF_STOCK"
                          ? "red"
                          : "amber"
                    }
                  />
                </td>
                <td className="px-3 py-2 text-muted">{formatTTD(item.dailyRate)}/day</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {item.featured && <StatusChip label="Featured" tone="accent" />}
                    {!item.publicVisible && <StatusChip label="Hidden" tone="muted" />}
                    {item.comingSoon && <StatusChip label="Coming soon" tone="accent" />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card-industrial p-5">
        <h2 className="text-lg font-semibold">Categories ({categories.length})</h2>
        <ul className="mt-4 space-y-3">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="flex flex-wrap justify-between gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm"
            >
              <span>
                <span className="font-medium">{cat.name}</span>
                <span className="text-muted"> — {cat._count.equipment} items</span>
              </span>
              <StatusChip label={cat.active ? "Active" : "Inactive"} tone={cat.active ? "green" : "muted"} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
