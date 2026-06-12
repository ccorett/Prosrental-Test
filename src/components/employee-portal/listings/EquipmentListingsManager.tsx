"use client";

import { useMemo, useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Search, Trash2, EyeOff } from "lucide-react";
import { getStockAlertLevel } from "@/lib/equipment/availability";
import type {
  EquipmentCategory,
  EquipmentItem,
  StockDashboardStats,
  StockMovementRecord,
} from "@/lib/equipment/types";
import {
  AVAILABILITY_STATUSES,
  getConditionLabel,
  getInternalAvailabilityLabel,
  STOCK_MOVEMENT_TYPES,
  getStockMovementLabel,
} from "@/lib/equipment/types";
import {
  archiveEquipmentListing,
  createEquipmentListing,
  deleteEquipmentListing,
  LISTING_FORM_INITIAL,
  updateEquipmentListing,
  type ListingFormState,
} from "@/lib/employee-portal/listing-actions";
import {
  adjustEquipmentStock,
  applyAvailabilityOverride,
  removeAvailabilityOverride,
} from "@/lib/employee-portal/stock-actions";
import { StockDashboard } from "@/components/employee-portal/listings/StockDashboard";
import { StockMovementHistory } from "@/components/employee-portal/listings/StockMovementHistory";
import { cn, formatTTD } from "@/lib/utils";

type EquipmentListingsManagerProps = {
  listings: EquipmentItem[];
  categories: EquipmentCategory[];
  stats: StockDashboardStats;
  movements: StockMovementRecord[];
  canEdit: boolean;
  canCreate: boolean;
  canDelete: boolean;
};

const INPUT_CLASS =
  "mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

function StatusChip({
  label,
  tone,
}: {
  label: string;
  tone: "green" | "amber" | "muted" | "accent" | "red";
}) {
  const styles = {
    green: "border-secondary/40 bg-secondary-muted text-secondary",
    amber: "border-tertiary/40 bg-tertiary/10 text-tertiary",
    muted: "border-border bg-surface text-muted",
    accent: "border-accent/30 bg-accent/10 text-accent",
    red: "border-red-500/30 bg-red-500/10 text-red-300",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide",
        styles[tone]
      )}
    >
      {label}
    </span>
  );
}

function ListingForm({
  item,
  categories,
  action,
  onCancel,
  submitLabel,
}: {
  item?: EquipmentItem;
  categories: EquipmentCategory[];
  action: (prev: ListingFormState, formData: FormData) => Promise<ListingFormState>;
  onCancel: () => void;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, LISTING_FORM_INITIAL);

  return (
    <form action={formAction} className="card-industrial space-y-4 p-5">
      {item && <input type="hidden" name="id" value={item.id} />}
      {state.message && (
        <p
          className={cn(
            "rounded-lg px-4 py-3 text-sm",
            state.ok
              ? "border border-secondary/30 bg-secondary-muted text-secondary"
              : "border border-red-500/30 bg-red-500/10 text-red-300"
          )}
        >
          {state.message}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {!item && (
          <label className="block text-sm">
            <span className="font-medium text-foreground">Item code</span>
            <input name="itemId" required className={INPUT_CLASS} placeholder="EQ-001" />
          </label>
        )}
        <label className="block text-sm">
          <span className="font-medium text-foreground">Name</span>
          <input
            name="name"
            required
            defaultValue={item?.name}
            className={INPUT_CLASS}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-foreground">Slug</span>
          <input
            name="slug"
            defaultValue={item?.slug}
            className={INPUT_CLASS}
            placeholder="auto from item code"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-foreground">Category</span>
          <select
            name="categoryId"
            required
            defaultValue={item?.categoryId}
            className={INPUT_CLASS}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium text-foreground">Sort order</span>
          <input
            name="sortOrder"
            type="number"
            defaultValue={item?.sortOrder ?? 0}
            className={INPUT_CLASS}
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="font-medium text-foreground">Short description</span>
        <textarea
          name="shortDescription"
          rows={2}
          defaultValue={item?.shortDescription ?? ""}
          className={INPUT_CLASS}
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-foreground">Full description</span>
        <textarea
          name="fullDescription"
          rows={4}
          defaultValue={item?.fullDescription ?? item?.description ?? ""}
          className={INPUT_CLASS}
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-foreground">Specifications</span>
        <textarea
          name="specifications"
          rows={4}
          defaultValue={item?.specifications ?? ""}
          className={INPUT_CLASS}
          placeholder="One spec per line"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block text-sm">
          <span className="font-medium text-foreground">Daily rate</span>
          <input
            name="dailyRate"
            type="number"
            step="0.01"
            defaultValue={item?.dailyRate ?? 0}
            className={INPUT_CLASS}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-foreground">Weekly rate</span>
          <input
            name="weeklyRate"
            type="number"
            step="0.01"
            defaultValue={item?.weeklyRate ?? 0}
            className={INPUT_CLASS}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-foreground">Monthly rate</span>
          <input
            name="monthlyRate"
            type="number"
            step="0.01"
            defaultValue={item?.monthlyRate ?? 0}
            className={INPUT_CLASS}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-foreground">Deposit</span>
          <input
            name="depositAmount"
            type="number"
            step="0.01"
            defaultValue={item?.depositAmount ?? 0}
            className={INPUT_CLASS}
          />
        </label>
      </div>

      <div className="rounded-lg border border-border/60 bg-surface/50 p-4">
        <p className="text-sm font-semibold text-foreground">Stock & availability</p>
        <p className="mt-1 text-xs text-muted">
          Availability is calculated from stock levels. Use manual override only when needed.
        </p>
        {item && (
          <div className="mt-3 flex flex-wrap gap-2">
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
            {item.manualAvailabilityOverride && (
              <StatusChip label="Manual Override Active" tone="red" />
            )}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block text-sm">
          <span className="font-medium text-foreground">Qty total</span>
          <input
            name="quantityTotal"
            type="number"
            min={0}
            defaultValue={item?.quantityTotal ?? 0}
            className={INPUT_CLASS}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-foreground">Qty available</span>
          <input
            name="quantityAvailable"
            type="number"
            min={0}
            defaultValue={item?.quantityAvailable ?? 0}
            className={INPUT_CLASS}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-foreground">Qty reserved</span>
          <input
            name="quantityReserved"
            type="number"
            min={0}
            defaultValue={item?.quantityReserved ?? 0}
            className={INPUT_CLASS}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-foreground">Reorder level</span>
          <input
            name="reorderLevel"
            type="number"
            min={0}
            defaultValue={item?.reorderLevel ?? 1}
            className={INPUT_CLASS}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-foreground">Low stock threshold</span>
          <input
            name="lowStockThreshold"
            type="number"
            min={0}
            defaultValue={item?.lowStockThreshold ?? 1}
            className={INPUT_CLASS}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-foreground">Condition</span>
          <select
            name="conditionStatus"
            defaultValue={item?.conditionStatus ?? "GOOD"}
            className={INPUT_CLASS}
          >
            <option value="NEW">New</option>
            <option value="GOOD">Good</option>
            <option value="FAIR">Fair</option>
            <option value="NEEDS_REPAIR">Needs Repair</option>
            <option value="OUT_OF_SERVICE">Out of Service</option>
          </select>
        </label>
      </div>

      {item && (
        <label className="block text-sm">
          <span className="font-medium text-foreground">Stock change reason</span>
          <input
            name="stockChangeReason"
            className={INPUT_CLASS}
            placeholder="Required when changing available quantity"
          />
        </label>
      )}

      <label className="block text-sm">
        <span className="font-medium text-foreground">Image URL</span>
        <input
          name="imageUrl"
          defaultValue={item?.imageUrl ?? ""}
          className={INPUT_CLASS}
          placeholder="/images/equipment/item.jpg or https://..."
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-foreground">Gallery image URLs</span>
        <textarea
          name="galleryImages"
          rows={3}
          defaultValue={item?.galleryImages.join("\n") ?? ""}
          className={INPUT_CLASS}
          placeholder="One URL per line"
        />
      </label>

      <div className="flex flex-wrap gap-6 text-sm">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={item?.featured}
            className="rounded border-border"
          />
          <span>Featured</span>
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            name="publicVisible"
            defaultChecked={item?.publicVisible ?? true}
            className="rounded border-border"
          />
          <span>Public visible</span>
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            name="comingSoon"
            defaultChecked={item?.comingSoon}
            className="rounded border-border"
          />
          <span>Coming soon</span>
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background hover:bg-accent-hover disabled:opacity-60"
        >
          {pending ? "Saving..." : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function StockAdjustForm({ item }: { item: EquipmentItem }) {
  const [state, formAction, pending] = useActionState(adjustEquipmentStock, LISTING_FORM_INITIAL);

  return (
    <form action={formAction} className="card-industrial space-y-3 p-4">
      <input type="hidden" name="equipmentId" value={item.id} />
      <p className="text-sm font-semibold text-foreground">Quick stock adjustment</p>
      {state.message && (
        <p
          className={cn(
            "rounded-lg px-3 py-2 text-sm",
            state.ok
              ? "border border-secondary/30 bg-secondary-muted text-secondary"
              : "border border-red-500/30 bg-red-500/10 text-red-300"
          )}
        >
          {state.message}
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="font-medium text-foreground">Movement type</span>
          <select name="movementType" className={INPUT_CLASS} defaultValue="ADJUSTED">
            {STOCK_MOVEMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {getStockMovementLabel(type)}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium text-foreground">Quantity</span>
          <input name="quantity" type="number" min={0} required className={INPUT_CLASS} />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-foreground">Reason</span>
          <input name="reason" required className={INPUT_CLASS} placeholder="Required" />
        </label>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background disabled:opacity-60"
      >
        {pending ? "Applying..." : "Apply stock change"}
      </button>
    </form>
  );
}

function OverrideForm({ item }: { item: EquipmentItem }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    applyAvailabilityOverride,
    LISTING_FORM_INITIAL
  );

  return (
    <div className="card-industrial space-y-3 p-4">
      <p className="text-sm font-semibold text-foreground">Manual availability override</p>
      {item.manualAvailabilityOverride && (
        <div className="flex flex-wrap items-center gap-3">
          <StatusChip label="Manual Override Active" tone="red" />
          <button
            type="button"
            onClick={async () => {
              await removeAvailabilityOverride(item.id);
              router.refresh();
            }}
            className="text-sm font-medium text-accent hover:text-accent-hover"
          >
            Remove override
          </button>
        </div>
      )}
      {state.message && (
        <p
          className={cn(
            "rounded-lg px-3 py-2 text-sm",
            state.ok
              ? "border border-secondary/30 bg-secondary-muted text-secondary"
              : "border border-red-500/30 bg-red-500/10 text-red-300"
          )}
        >
          {state.message}
        </p>
      )}
      <form action={formAction} className="grid gap-3 sm:grid-cols-3">
        <input type="hidden" name="equipmentId" value={item.id} />
        <label className="block text-sm">
          <span className="font-medium text-foreground">Override status</span>
          <select name="overrideStatus" className={INPUT_CLASS} required>
            {AVAILABILITY_STATUSES.map((status) => (
              <option key={status} value={status}>
                {getInternalAvailabilityLabel(status)}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="font-medium text-foreground">Reason</span>
          <input name="overrideReason" required className={INPUT_CLASS} />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:border-accent/40 disabled:opacity-60"
        >
          {pending ? "Applying..." : "Apply override"}
        </button>
      </form>
    </div>
  );
}

export function EquipmentListingsManager({
  listings,
  categories,
  stats,
  movements,
  canEdit,
  canCreate,
  canDelete,
}: EquipmentListingsManagerProps) {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [actionMessage, setActionMessage] = useState<ListingFormState | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings.filter((item) => {
      const matchesCategory =
        categoryFilter === "all" || item.categorySlug === categoryFilter;
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.itemId.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [listings, query, categoryFilter]);

  const editingItem = editingId
    ? listings.find((item) => item.id === editingId) ?? null
    : null;

  async function handleArchive(id: string) {
    if (!canEdit) return;
    const result = await archiveEquipmentListing(id);
    setActionMessage(result);
    setEditingId(null);
  }

  async function handleDelete(id: string) {
    if (!canDelete) return;
    if (!window.confirm("Permanently delete this listing? This cannot be undone.")) {
      return;
    }
    const result = await deleteEquipmentListing(id);
    setActionMessage(result);
    setEditingId(null);
  }

  const editingMovements = editingItem
    ? movements.filter((movement) => movement.equipmentId === editingItem.id)
    : [];

  return (
    <div className="space-y-6">
      <StockDashboard stats={stats} />

      {actionMessage?.message && (
        <p
          className={cn(
            "rounded-lg px-4 py-3 text-sm",
            actionMessage.ok
              ? "border border-secondary/30 bg-secondary-muted text-secondary"
              : "border border-red-500/30 bg-red-500/10 text-red-300"
          )}
        >
          {actionMessage.message}
        </p>
      )}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid flex-1 gap-3 sm:grid-cols-[1fr_auto]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search listings..."
              className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground"
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => {
              setCreating(true);
              setEditingId(null);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-background hover:bg-accent-hover"
          >
            <Plus className="h-4 w-4" />
            Add equipment
          </button>
        )}
      </div>

      {creating && canCreate && (
        <ListingForm
          categories={categories}
          action={createEquipmentListing}
          onCancel={() => setCreating(false)}
          submitLabel="Create listing"
        />
      )}

      {editingItem && canEdit && (
        <>
          <ListingForm
            item={editingItem}
            categories={categories}
            action={updateEquipmentListing}
            onCancel={() => setEditingId(null)}
            submitLabel="Save changes"
          />
          <StockAdjustForm item={editingItem} />
          <OverrideForm item={editingItem} />
          <StockMovementHistory
            movements={editingMovements}
            title={`Stock history — ${editingItem.name}`}
          />
        </>
      )}

      {!editingItem && <StockMovementHistory movements={movements.slice(0, 25)} />}

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-surface">
            <tr className="text-left text-xs uppercase tracking-wider text-muted">
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Rates</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Flags</th>
              {canEdit && <th className="px-4 py-3">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {filtered.map((item) => (
              <tr key={item.id} className="bg-surface-elevated/40">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted">{item.itemId}</p>
                </td>
                <td className="px-4 py-3 text-muted">{item.category}</td>
                <td className="px-4 py-3 text-muted">
                  {formatTTD(item.dailyRate)} / day
                </td>
                <td className="px-4 py-3 text-muted">
                  {item.quantityAvailable}/{item.quantityTotal}
                  <span className="block text-xs">({item.quantityReserved} reserved)</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    <StatusChip
                      label={getInternalAvailabilityLabel(item.availabilityStatus)}
                      tone={
                        item.availabilityStatus === "AVAILABLE"
                          ? "green"
                          : item.availabilityStatus === "COMING_SOON"
                            ? "accent"
                            : item.availabilityStatus === "OUT_OF_STOCK"
                              ? "red"
                              : "amber"
                      }
                    />
                    {getStockAlertLevel(item) === "low" && (
                      <StatusChip label="Low stock" tone="amber" />
                    )}
                    {getStockAlertLevel(item) === "reorder" && (
                      <StatusChip label="Reorder" tone="accent" />
                    )}
                    {item.manualAvailabilityOverride && (
                      <StatusChip label="Override" tone="red" />
                    )}
                    <StatusChip
                      label={getConditionLabel(item.conditionStatus)}
                      tone={item.conditionStatus === "OUT_OF_SERVICE" ? "red" : "muted"}
                    />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {item.featured && <StatusChip label="Featured" tone="accent" />}
                    {!item.publicVisible && (
                      <StatusChip label="Hidden" tone="muted" />
                    )}
                    {item.comingSoon && (
                      <StatusChip label="Coming soon" tone="accent" />
                    )}
                  </div>
                </td>
                {canEdit && (
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(item.id);
                          setCreating(false);
                        }}
                        className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-foreground hover:border-accent/40"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      {item.publicVisible && (
                        <button
                          type="button"
                          onClick={() => handleArchive(item.id)}
                          className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-muted hover:text-foreground"
                        >
                          <EyeOff className="h-3.5 w-3.5" />
                          Hide
                        </button>
                      )}
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="inline-flex items-center gap-1 rounded-md border border-red-500/30 px-2 py-1 text-xs font-medium text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-muted">
        Showing {filtered.length} of {listings.length} listings (including hidden).
      </p>
    </div>
  );
}
