import { AcceptQuoteButton } from "@/components/portal/app/AcceptQuoteButton";
import { PortalDataTable } from "@/components/portal/app/PortalDataTable";
import { PortalPageHeader } from "@/components/portal/app/PortalPageHeader";
import { StatusChip } from "@/components/portal/app/StatusChip";
import { LinkButton } from "@/components/ui/Button";
import { requireCustomer } from "@/lib/auth/session";
import { formatPortalDate } from "@/lib/portal/format";
import { getCustomerQuotes } from "@/lib/portal/queries";
import { formatTTD } from "@/lib/utils";

export const metadata = { title: "Quotes" };

export default async function QuotesPage() {
  const customer = await requireCustomer();
  const quotes = await getCustomerQuotes(customer.id);

  return (
    <div>
      <PortalPageHeader
        title="Quote Management"
        description="View quotation history and accept sent quotes online."
        action={
          <LinkButton href="/customer-portal/request-quote" variant="outline">
            Request Quote
          </LinkButton>
        }
      />
      <PortalDataTable
        rows={quotes}
        emptyMessage="No quotations yet."
        columns={[
          { key: "number", header: "Quote #", render: (r) => r.quoteNumber },
          { key: "equipment", header: "Equipment", render: (r) => r.equipmentRequested },
          { key: "duration", header: "Duration", render: (r) => r.rentalDuration },
          {
            key: "total",
            header: "Estimated Total",
            render: (r) => formatTTD(Number(r.estimatedTotal)),
          },
          {
            key: "valid",
            header: "Valid Until",
            render: (r) => formatPortalDate(r.validUntil),
          },
          {
            key: "status",
            header: "Status",
            render: (r) => <StatusChip status={r.status} />,
          },
          {
            key: "action",
            header: "Action",
            render: (r) =>
              r.status === "SENT" ? <AcceptQuoteButton quoteId={r.id} /> : "—",
          },
        ]}
      />
    </div>
  );
}
