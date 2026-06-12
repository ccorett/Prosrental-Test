"use client";

import { useActionState } from "react";
import {
  approveLeaveRequest,
  approvePurchaseRequest,
  type HrActionResult,
} from "@/lib/employee-portal/hr-actions";
import type { LeaveRequest, PurchaseRequest, Employee } from "@prisma/client";

type LeaveRow = LeaveRequest & { employee: Pick<Employee, "fullName">; canAct: boolean };
type PurchaseRow = PurchaseRequest & { canAct: boolean };

type HrApprovalPanelProps = {
  leaveRequests: LeaveRow[];
  purchaseRequests: PurchaseRow[];
};

export function HrApprovalPanel({
  leaveRequests,
  purchaseRequests,
}: HrApprovalPanelProps) {
  const [leaveState, leaveAction, leavePending] = useActionState<HrActionResult, FormData>(
    approveLeaveRequest,
    {}
  );
  const [purchaseState, purchaseAction, purchasePending] = useActionState<
    HrActionResult,
    FormData
  >(approvePurchaseRequest, {});

  const feedback =
    leaveState.error ||
    leaveState.success ||
    purchaseState.error ||
    purchaseState.success;

  const pendingLeave = leaveRequests.filter(
    (l) => l.status === "PENDING" || l.status === "SUPERVISOR_APPROVED"
  );
  const pendingPurchase = purchaseRequests.filter(
    (p) => p.status === "PENDING" || p.status === "SUPERVISOR_APPROVED"
  );

  return (
    <div className="space-y-6">
      {feedback && (
        <p
          className={`rounded-lg border px-4 py-3 text-sm ${
            feedback.includes("cannot") || feedback.includes("permission") || feedback.includes("not found")
              ? "border-red-500/30 bg-red-500/10 text-red-300"
              : "border-secondary/30 bg-secondary-muted text-foreground"
          }`}
        >
          {feedback}
        </p>
      )}

      <section className="card-industrial p-5">
        <h2 className="text-lg font-semibold">Leave approvals</h2>
        {pendingLeave.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No pending leave requests.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {pendingLeave.map((l) => (
              <li
                key={l.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-surface px-3 py-2 text-sm"
              >
                <span className="text-muted">
                  {l.employee.fullName} — {l.startDate.toLocaleDateString()} to{" "}
                  {l.endDate.toLocaleDateString()} ({l.status})
                </span>
                {l.canAct && (
                  <form action={leaveAction}>
                    <input type="hidden" name="requestId" value={l.id} />
                    <button
                      type="submit"
                      disabled={leavePending}
                      className="rounded bg-secondary/20 px-3 py-1 text-xs font-medium text-secondary"
                    >
                      Approve
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card-industrial p-5">
        <h2 className="text-lg font-semibold">Purchase approvals</h2>
        {pendingPurchase.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No pending purchase requests.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {pendingPurchase.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-surface px-3 py-2 text-sm"
              >
                <span className="text-muted">
                  {p.itemName} × {p.quantity} — {p.status}
                </span>
                {p.canAct && (
                  <form action={purchaseAction}>
                    <input type="hidden" name="requestId" value={p.id} />
                    <button
                      type="submit"
                      disabled={purchasePending}
                      className="rounded bg-secondary/20 px-3 py-1 text-xs font-medium text-secondary"
                    >
                      Approve
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
