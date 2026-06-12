import type { StockDashboardStats } from "@/lib/equipment/types";

type StockDashboardProps = {
  stats: StockDashboardStats;
};

const CARDS: {
  key: keyof StockDashboardStats;
  label: string;
  tone: string;
}[] = [
  { key: "total", label: "Total items", tone: "text-foreground" },
  { key: "available", label: "Available", tone: "text-secondary" },
  { key: "reserved", label: "Reserved / Limited", tone: "text-tertiary" },
  { key: "outOfStock", label: "Out of stock", tone: "text-red-300" },
  { key: "comingSoon", label: "Coming soon", tone: "text-accent" },
  { key: "lowStock", label: "Low stock alerts", tone: "text-tertiary" },
  { key: "reorderAlerts", label: "Reorder alerts", tone: "text-accent" },
];

export function StockDashboard({ stats }: StockDashboardProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      {CARDS.map((card) => (
        <div key={card.key} className="card-industrial p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            {card.label}
          </p>
          <p className={`mt-2 text-2xl font-bold ${card.tone}`}>{stats[card.key]}</p>
        </div>
      ))}
    </section>
  );
}
