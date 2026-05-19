"use client";

import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-secondary/30 bg-secondary-muted p-8 text-center">
        <h3 className="text-xl font-semibold text-foreground">Thank you!</h3>
        <p className="mt-2 text-muted">
          We&apos;ve received your inquiry and will respond within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-foreground">First Name</span>
          <input
            type="text"
            name="firstName"
            required
            className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="John"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-foreground">Last Name</span>
          <input
            type="text"
            name="lastName"
            required
            className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Smith"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-medium text-foreground">Email</span>
        <input
          type="email"
          name="email"
          required
          className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="you@company.com"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-foreground">Phone</span>
        <input
          type="tel"
          name="phone"
          className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="868 734 9490"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-foreground">
          Equipment Interest
        </span>
        <select
          name="category"
          className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="cleaning">Cleaning Equipment</option>
          <option value="diy">DIY Tools</option>
          <option value="construction">Construction Tools</option>
          <option value="facility">Sanitation and Hygiene Equipment</option>
          <option value="other">Other / Not Sure</option>
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-medium text-foreground">Message</span>
        <textarea
          name="message"
          rows={4}
          required
          className="mt-2 w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="Tell us about your project, dates, and equipment needs..."
        />
      </label>
      <Button type="submit" size="lg" className="w-full sm:w-auto">
        <Send className="h-5 w-5" />
        Send Inquiry
      </Button>
      <p className="text-xs text-muted">
        This form is for demonstration only. No data is sent to a server.
      </p>
    </form>
  );
}
