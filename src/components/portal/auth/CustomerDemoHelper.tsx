import { DEMO_CREDENTIALS } from "@/lib/access/demo-credentials";

export function CustomerDemoHelper() {
  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="mt-6 rounded-lg border border-dashed border-border bg-surface/50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
        Development demo account
      </p>
      <p className="mt-2 text-xs text-muted">
        {DEMO_CREDENTIALS.customer.email} / {DEMO_CREDENTIALS.customer.password}
      </p>
    </div>
  );
}
