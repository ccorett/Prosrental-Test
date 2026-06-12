import type { StockMovementRecord } from "@/lib/equipment/types";
import { getStockMovementLabel } from "@/lib/equipment/types";

type StockMovementHistoryProps = {
  movements: StockMovementRecord[];
  title?: string;
};

export function StockMovementHistory({
  movements,
  title = "Stock movement history",
}: StockMovementHistoryProps) {
  if (movements.length === 0) {
    return (
      <section className="card-industrial p-5">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-3 text-sm text-muted">No stock movements recorded yet.</p>
      </section>
    );
  }

  return (
    <section className="card-industrial overflow-x-auto p-5">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <table className="mt-4 min-w-full divide-y divide-border text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-muted">
            <th className="px-3 py-2">When</th>
            <th className="px-3 py-2">Item</th>
            <th className="px-3 py-2">Type</th>
            <th className="px-3 py-2">Qty</th>
            <th className="px-3 py-2">Available</th>
            <th className="px-3 py-2">Reason</th>
            <th className="px-3 py-2">By</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/70">
          {movements.map((movement) => (
            <tr key={movement.id}>
              <td className="px-3 py-2 text-muted">
                {new Date(movement.createdAt).toLocaleString()}
              </td>
              <td className="px-3 py-2">
                <span className="font-medium text-foreground">{movement.equipmentName}</span>
                <span className="block text-xs text-muted">{movement.itemId}</span>
              </td>
              <td className="px-3 py-2 text-muted">
                {getStockMovementLabel(movement.movementType)}
              </td>
              <td className="px-3 py-2 text-muted">{movement.quantity}</td>
              <td className="px-3 py-2 text-muted">
                {movement.previousQuantityAvailable} → {movement.newQuantityAvailable}
              </td>
              <td className="px-3 py-2 text-muted">{movement.reason ?? "—"}</td>
              <td className="px-3 py-2 text-muted">{movement.changedByName ?? "System"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
