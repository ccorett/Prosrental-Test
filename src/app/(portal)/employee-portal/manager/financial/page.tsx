import { ManagerFinancialPanel } from "@/components/manager-control/ManagerFinancialPanel";
import {
  getManagerInvoices,
  getManagerQuotes,
  getRevenueReport,
} from "@/lib/manager-control/queries";

export const metadata = { title: "Financial — Manager Control" };

export default async function ManagerFinancialPage() {
  const [quotes, invoices, revenue] = await Promise.all([
    getManagerQuotes(),
    getManagerInvoices(),
    getRevenueReport(),
  ]);

  return (
    <ManagerFinancialPanel
      quotes={quotes}
      invoices={invoices}
      revenue={{
        totalRevenue: revenue.totalRevenue,
        outstandingTotal: revenue.outstandingTotal,
      }}
    />
  );
}
