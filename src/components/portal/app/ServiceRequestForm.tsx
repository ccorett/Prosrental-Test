"use client";

import { useActionState } from "react";
import { createServiceRequest, type ActionResult } from "@/lib/portal/actions";
import { Button } from "@/components/ui/Button";

const INPUT =
  "mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

type RentalOption = {
  id: string;
  equipmentName: string;
};

type ServiceRequestFormProps = {
  rentals: RentalOption[];
};

export function ServiceRequestForm({ rentals }: ServiceRequestFormProps) {
  const [state, action, pending] = useActionState<ActionResult, FormData>(
    createServiceRequest,
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
        <span className="text-sm font-medium text-foreground">Request type</span>
        <select name="requestType" required className={INPUT}>
          <option value="EQUIPMENT_ISSUE">Equipment Issue</option>
          <option value="SUPPORT_REQUEST">Support Request</option>
          <option value="RETURN_REQUEST">Return Request</option>
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-medium text-foreground">Related rental (optional)</span>
        <select name="rentalId" className={INPUT} defaultValue="">
          <option value="">None</option>
          {rentals.map((r) => (
            <option key={r.id} value={r.id}>
              {r.equipmentName}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-medium text-foreground">Priority</span>
        <select name="priority" className={INPUT} defaultValue="MEDIUM">
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-medium text-foreground">Subject</span>
        <input type="text" name="subject" required className={INPUT} />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-foreground">Description</span>
        <textarea name="description" rows={4} required className={INPUT} />
      </label>

      <Button type="submit" disabled={pending}>
        {pending ? "Submitting..." : "Submit Request"}
      </Button>
    </form>
  );
}
