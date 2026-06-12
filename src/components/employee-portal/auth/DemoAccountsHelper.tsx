import { DEMO_CREDENTIALS } from "@/lib/access/demo-credentials";

const DEV_ACCOUNTS = [
  { label: "Super Admin", ...DEMO_CREDENTIALS.superAdmin },
  { label: "Admin", ...DEMO_CREDENTIALS.admin },
  { label: "Manager", ...DEMO_CREDENTIALS.manager },
  { label: "Supervisor", ...DEMO_CREDENTIALS.supervisor },
  { label: "Mechanic", ...DEMO_CREDENTIALS.mechanic },
  { label: "Driver", ...DEMO_CREDENTIALS.driver },
  { label: "Employee", ...DEMO_CREDENTIALS.employee },
] as const;

export function DemoAccountsHelper() {
  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="mt-6 rounded-lg border border-dashed border-border bg-surface/50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
        Development demo accounts
      </p>
      <ul className="mt-3 space-y-1.5 text-xs text-muted">
        {DEV_ACCOUNTS.map((account) => (
          <li key={account.email}>
            <span className="font-medium text-foreground">{account.label}:</span>{" "}
            {account.email} / {account.password}
          </li>
        ))}
      </ul>
    </div>
  );
}
