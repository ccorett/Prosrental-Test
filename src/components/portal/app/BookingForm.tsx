"use client";

import { useActionState } from "react";
import { createBookingRequest, type ActionResult } from "@/lib/portal/actions";
import { Button } from "@/components/ui/Button";
import { formatTTD } from "@/lib/utils";

const INPUT =
  "mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

type EquipmentOption = {
  itemId: string;
  equipmentName: string;
  category: string;
  dailyRate: { toString(): string };
};

type BookingFormProps = {
  equipment: EquipmentOption[];
};

export function BookingForm({ equipment }: BookingFormProps) {
  const [state, action, pending] = useActionState<ActionResult, FormData>(
    createBookingRequest,
    {}
  );

  return (
    <form action={action} className="card-industrial space-y-5 p-6">
      {state.error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="rounded-lg border border-secondary/30 bg-secondary-muted px-4 py-3 text-sm text-secondary">
          {state.success}
        </p>
      )}

      <label className="block">
        <span className="text-sm font-medium text-foreground">Equipment</span>
        <select name="equipmentId" required className={INPUT} defaultValue="">
          <option value="" disabled>
            Select equipment
          </option>
          {equipment.map((item) => (
            <option key={item.itemId} value={item.itemId}>
              {item.equipmentName} — {formatTTD(Number(item.dailyRate))}/day
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-foreground">Start date</span>
          <input type="date" name="rentalStartDate" required className={INPUT} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-foreground">End date</span>
          <input type="date" name="rentalEndDate" required className={INPUT} />
        </label>
      </div>

      <label className="flex items-center gap-3">
        <input type="checkbox" name="deliveryRequired" className="h-4 w-4 rounded border-border" />
        <span className="text-sm text-foreground">Delivery required</span>
      </label>

      <label className="block">
        <span className="text-sm font-medium text-foreground">Delivery address</span>
        <input type="text" name="deliveryAddress" className={INPUT} />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-foreground">Notes</span>
        <textarea name="notes" rows={3} className={INPUT} />
      </label>

      <Button type="submit" disabled={pending}>
        {pending ? "Submitting..." : "Submit Booking Request"}
      </Button>
    </form>
  );
}
