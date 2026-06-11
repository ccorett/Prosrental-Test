"use client";

import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { INVENTORY_RECORDS } from "@/lib/equipment/inventory-records";
import { Button } from "@/components/ui/Button";

const INPUT_CLASS =
  "mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

type QuoteRequestFormProps = {
  defaultEquipment?: string;
  submitLabel?: string;
  successTitle?: string;
};

export function QuoteRequestForm({
  defaultEquipment = "",
  submitLabel = "Request a Quote",
  successTitle = "Quote request received",
}: QuoteRequestFormProps) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-secondary/30 bg-secondary-muted p-8 text-center">
        <h3 className="text-xl font-semibold text-foreground">{successTitle}</h3>
        <p className="mt-2 text-muted">
          We&apos;ve received your details and will respond within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block">
        <span className="text-sm font-medium text-foreground">Full name</span>
        <input type="text" name="fullName" required className={INPUT_CLASS} />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-foreground">Phone number</span>
          <input
            type="tel"
            name="phone"
            required
            className={INPUT_CLASS}
            placeholder="868 734 9490"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-foreground">Email</span>
          <input
            type="email"
            name="email"
            required
            className={INPUT_CLASS}
            placeholder="info@prorentals.co"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-foreground">Equipment needed</span>
        <input
          type="text"
          name="equipment"
          required
          defaultValue={defaultEquipment}
          list="equipment-options"
          className={INPUT_CLASS}
          placeholder="e.g. Floor Scrubber, Scissor Lift"
        />
        <datalist id="equipment-options">
          {INVENTORY_RECORDS.map((item) => (
            <option key={item.itemId} value={item.equipmentName} />
          ))}
        </datalist>
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-foreground">Rental start date</span>
          <input type="date" name="startDate" required className={INPUT_CLASS} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-foreground">Rental duration</span>
          <input
            type="text"
            name="duration"
            required
            className={INPUT_CLASS}
            placeholder="e.g. 3 days, 2 weeks"
          />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-foreground">Delivery required?</span>
          <select name="delivery" required className={INPUT_CLASS}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-foreground">Location</span>
          <input
            type="text"
            name="location"
            required
            className={INPUT_CLASS}
            placeholder="Plymouth, Tobago"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-foreground">
          Message / special requirements
        </span>
        <textarea
          name="message"
          rows={4}
          className={`${INPUT_CLASS} resize-none`}
          placeholder="Site access, operator needs, sanitation servicing frequency..."
        />
      </label>

      <Button type="submit" size="lg" className="w-full sm:w-auto">
        <Send className="h-5 w-5" />
        {submitLabel}
      </Button>
      <p className="text-xs text-muted">
        Client-side demo only—no data is sent to a server yet.
      </p>
    </form>
  );
}
