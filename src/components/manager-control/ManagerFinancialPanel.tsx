"use client";

import { useState, useTransition } from "react";
import { StatusChip } from "@/components/manager-control/StatusChip";
import type { ManagerInvoiceRow, ManagerQuoteRow } from "@/lib/manager-control/types";
import { updateInvoiceRecord, updateQuoteRecord } from "@/lib/manager-control/actions";
import { formatTTD } from "@/lib/utils";

export function ManagerFinancialPanel({
  quotes,
  invoices,
  revenue,
}: {
  quotes: ManagerQuoteRow[];
  invoices: ManagerInvoiceRow[];
  revenue: { totalRevenue: number; outstandingTotal: number };
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-8">
      {message && (
        <p className="rounded-lg border border-border bg-surface px-4 py-3 text-sm">{message}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card-industrial p-4">
          <p className="text-xs uppercase text-muted">Total revenue (paid)</p>
          <p className="mt-2 text-2xl font-bold text-secondary">{formatTTD(revenue.totalRevenue)}</p>
        </div>
        <div className="card-industrial p-4">
          <p className="text-xs uppercase text-muted">Outstanding</p>
          <p className="mt-2 text-2xl font-bold text-red-300">
            {formatTTD(revenue.outstandingTotal)}
          </p>
        </div>
      </div>

      <section className="card-industrial overflow-x-auto p-5">
        <h2 className="text-lg font-semibold">Quotations</h2>
        <table className="mt-4 min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-muted">
              <th className="px-3 py-2">Quote</th>
              <th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Update</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((q) => (
              <tr key={q.id} className="border-t border-border/60">
                <td className="px-3 py-2">{q.quoteNumber}</td>
                <td className="px-3 py-2 text-muted">{q.customerName}</td>
                <td className="px-3 py-2">{formatTTD(q.estimatedTotal)}</td>
                <td className="px-3 py-2">
                  <StatusChip label={q.status} tone="amber" />
                </td>
                <td className="px-3 py-2">
                  <select
                    disabled={pending}
                    defaultValue={q.status}
                    onChange={(e) =>
                      startTransition(async () => {
                        const r = await updateQuoteRecord(
                          q.id,
                          e.target.value as ManagerQuoteRow["status"]
                        );
                        setMessage(r.message);
                      })
                    }
                    className="rounded border border-border bg-surface px-2 py-1 text-xs"
                  >
                    {["DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED"].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card-industrial overflow-x-auto p-5">
        <h2 className="text-lg font-semibold">Invoices</h2>
        <table className="mt-4 min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-muted">
              <th className="px-3 py-2">Invoice</th>
              <th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Due</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-t border-border/60">
                <td className="px-3 py-2">{inv.invoiceNumber}</td>
                <td className="px-3 py-2 text-muted">{inv.customerName}</td>
                <td className="px-3 py-2">{formatTTD(inv.amount)}</td>
                <td className="px-3 py-2 text-muted">
                  {new Date(inv.dueDate).toLocaleDateString()}
                </td>
                <td className="px-3 py-2">
                  <select
                    disabled={pending}
                    defaultValue={inv.status}
                    onChange={(e) =>
                      startTransition(async () => {
                        const r = await updateInvoiceRecord(
                          inv.id,
                          e.target.value as ManagerInvoiceRow["status"]
                        );
                        setMessage(r.message);
                      })
                    }
                    className="rounded border border-border bg-surface px-2 py-1 text-xs"
                  >
                    {["PAID", "UNPAID", "OVERDUE", "PARTIALLY_PAID"].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
