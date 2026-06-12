import { EmployeePageHeader } from "@/components/employee-portal/app/EmployeePageHeader";
import { HrApprovalPanel } from "@/components/employee-portal/hr/HrApprovalPanel";
import { canApproveLeave, canApprovePurchase } from "@/lib/access/approvals";
import { requireEmployee } from "@/lib/employee-auth/session";
import { ensureModulePage } from "@/lib/employee-portal/guard";
import { getHrData, getInventoryData } from "@/lib/employee-portal/queries";

export const metadata = { title: "HR" };

export default async function HrPage() {
  const employee = await requireEmployee();
  await ensureModulePage(employee, "HR");
  const [{ leaveRequests, documents }, { purchases }] = await Promise.all([
    getHrData(),
    getInventoryData(),
  ]);

  const leaveWithActions = leaveRequests.map((l) => ({
    ...l,
    canAct: canApproveLeave(employee, l.status),
  }));
  const purchaseWithActions = purchases.map((p) => ({
    ...p,
    canAct: canApprovePurchase(employee, p.status),
  }));

  return (
    <div className="space-y-8">
      <EmployeePageHeader title="HR" description="Leave requests, purchase approvals, and employee documents." />
      <HrApprovalPanel
        leaveRequests={leaveWithActions}
        purchaseRequests={purchaseWithActions}
      />
      <section className="card-industrial p-5">
        <h2 className="text-lg font-semibold">Employee documents</h2>
        <ul className="mt-4 space-y-2">
          {documents.map((d) => (
            <li key={d.id} className="rounded-lg border border-border/60 bg-surface px-3 py-2 text-sm text-muted">
              {d.title} — {d.employee.fullName}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
