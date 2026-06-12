import { PortalDataTable } from "@/components/portal/app/PortalDataTable";
import { PortalPageHeader } from "@/components/portal/app/PortalPageHeader";
import { StatusChip } from "@/components/portal/app/StatusChip";
import { requireCustomer } from "@/lib/auth/session";
import { formatPortalDate } from "@/lib/portal/format";
import { getCustomerInvoices } from "@/lib/portal/queries";
import { formatTTD } from "@/lib/utils";

export const metadata = { title: "Invoices" };

export default async function InvoicesPage() {
  const customer = await requireCustomer();
  const invoices = await getCustomerInvoices(customer.id);

  return (
    <div>
      <PortalPageHeader
        title="Invoice Management"
        description="View invoices, payment status, and download PDF placeholders."
      />
      <PortalDataTable
        rows={invoices}
        emptyMessage="No invoices yet."
        columns={[
          { key: "number", header: "Invoice #", render: (r) => r.invoiceNumber },
          {
            key: "amount",
            header: "Amount",
            render: (r) => formatTTD(Number(r.amount)),
          },
          {
            key: "due",
            header: "Due Date",
            render: (r) => formatPortalDate(r.dueDate),
          },
          {
            key: "status",
            header: "Status",
            render: (r) => <StatusChip status={r.status} />,
          },
          {
            key: "pdf",
            header: "PDF",
            render: (r) =>
              r.pdfUrl ? (
                <a
                  href={r.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-accent hover:text-accent-hover"
                >
                  Download
                </a>
              ) : (
                "—"
              ),
          },
        ]}
      />
    </div>
  );
}
