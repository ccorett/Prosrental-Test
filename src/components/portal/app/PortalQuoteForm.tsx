"use client";

import { useActionState } from "react";
import { createQuoteRequest, type ActionResult } from "@/lib/portal/actions";
import { Button } from "@/components/ui/Button";

const INPUT =
  "mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

export function PortalQuoteForm() {
  const [state, action, pending] = useActionState<ActionResult, FormData>(
    createQuoteRequest,
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
        <span className="text-sm font-medium text-foreground">Equipment requested</span>
        <input type="text" name="equipmentRequested" required className={INPUT} />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-foreground">Rental duration</span>
        <input
          type="text"
          name="rentalDuration"
          required
          placeholder="e.g. 5 days, 2 weeks"
          className={INPUT}
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-foreground">Notes</span>
        <textarea name="notes" rows={3} className={INPUT} />
      </label>
      <Button type="submit" disabled={pending}>
        {pending ? "Submitting..." : "Request Quotation"}
      </Button>
    </form>
  );
}
