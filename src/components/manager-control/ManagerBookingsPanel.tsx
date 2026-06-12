"use client";

import { useState, useTransition } from "react";
import { StatusChip } from "@/components/manager-control/StatusChip";
import type { ManagerBookingRow } from "@/lib/manager-control/types";
import {
  approveBookingRequest,
  rejectBookingRequest,
  scheduleBookingRequest,
  updateBookingStatus,
} from "@/lib/manager-control/actions";

function statusTone(status: string): "green" | "amber" | "red" | "accent" | "muted" {
  if (status === "APPROVED" || status === "ACTIVE" || status === "COMPLETED") return "green";
  if (status === "PENDING") return "accent";
  if (status === "REJECTED" || status === "CANCELLED") return "red";
  return "amber";
}

export function ManagerBookingsPanel({ bookings }: { bookings: ManagerBookingRow[] }) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<{ ok: boolean; message: string }>) {
    startTransition(async () => {
      const result = await action();
      setMessage(result.message);
    });
  }

  if (bookings.length === 0) {
    return (
      <div className="card-industrial p-8 text-center text-sm text-muted">
        No booking requests found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {message && (
        <p className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground">
          {message}
        </p>
      )}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-surface">
            <tr className="text-left text-xs uppercase tracking-wider text-muted">
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Equipment</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {bookings.map((booking) => (
              <tr key={booking.id} className="bg-surface-elevated/40">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{booking.customerName}</p>
                  {booking.deliveryRequired && (
                    <p className="text-xs text-muted">Delivery required</p>
                  )}
                </td>
                <td className="px-4 py-3 text-muted">
                  {booking.equipmentName}
                  <span className="block text-xs">{booking.equipmentId}</span>
                </td>
                <td className="px-4 py-3 text-muted">
                  {new Date(booking.rentalStartDate).toLocaleDateString()} –{" "}
                  {new Date(booking.rentalEndDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <StatusChip label={booking.requestStatus} tone={statusTone(booking.requestStatus)} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {booking.requestStatus === "PENDING" && (
                      <>
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => run(() => approveBookingRequest(booking.id))}
                          className="rounded-md bg-accent px-2 py-1 text-xs font-semibold text-background"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => run(() => rejectBookingRequest(booking.id))}
                          className="rounded-md border border-red-500/30 px-2 py-1 text-xs text-red-300"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {booking.requestStatus === "APPROVED" && (
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() =>
                          run(() =>
                            scheduleBookingRequest(
                              booking.id,
                              booking.rentalStartDate
                            )
                          )
                        }
                        className="rounded-md border border-border px-2 py-1 text-xs"
                      >
                        Schedule
                      </button>
                    )}
                    {booking.requestStatus === "SCHEDULED" && (
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => run(() => updateBookingStatus(booking.id, "ACTIVE"))}
                        className="rounded-md border border-border px-2 py-1 text-xs"
                      >
                        Mark active
                      </button>
                    )}
                    {booking.requestStatus === "ACTIVE" && (
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => run(() => updateBookingStatus(booking.id, "COMPLETED"))}
                        className="rounded-md border border-border px-2 py-1 text-xs"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
