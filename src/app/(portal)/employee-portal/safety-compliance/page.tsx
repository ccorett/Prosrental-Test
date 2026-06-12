import { EmployeePageHeader } from "@/components/employee-portal/app/EmployeePageHeader";
import { requireEmployee } from "@/lib/employee-auth/session";
import { ensureModulePage } from "@/lib/employee-portal/guard";
import { getSafetyData } from "@/lib/employee-portal/queries";

export const metadata = { title: "Safety & Compliance" };

export default async function SafetyCompliancePage() {
  const employee = await requireEmployee();
  await ensureModulePage(employee, "SAFETY_COMPLIANCE");
  const incidents = await getSafetyData();

  return (
    <div>
      <EmployeePageHeader title="Safety & Compliance" description="Incident reports and investigations." />
      <section className="card-industrial p-5">
        <ul className="space-y-2">
          {incidents.map((inc) => (
            <li key={inc.id} className="rounded-lg border border-border/60 bg-surface p-4">
              <p className="font-medium text-foreground">{inc.title}</p>
              <p className="mt-1 text-sm text-muted">
                {inc.severity} · {inc.status} · {inc.reporter.fullName} · {inc.occurredAt.toLocaleDateString()}
              </p>
              <p className="mt-2 text-sm text-muted">{inc.description}</p>
            </li>
          ))}
          {incidents.length === 0 && <p className="text-sm text-muted">No incidents recorded.</p>}
        </ul>
      </section>
    </div>
  );
}
