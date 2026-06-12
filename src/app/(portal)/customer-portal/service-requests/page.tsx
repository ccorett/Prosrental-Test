import { PortalDataTable } from "@/components/portal/app/PortalDataTable";
import { PortalPageHeader } from "@/components/portal/app/PortalPageHeader";
import { StatusChip } from "@/components/portal/app/StatusChip";
import { LinkButton } from "@/components/ui/Button";
import { requireCustomer } from "@/lib/auth/session";
import { formatEnumLabel } from "@/lib/portal/labels";
import { formatPortalDate } from "@/lib/portal/format";
import { getCustomerServiceRequests } from "@/lib/portal/queries";

export const metadata = { title: "Service Requests" };

export default async function ServiceRequestsPage() {
  const customer = await requireCustomer();
  const requests = await getCustomerServiceRequests(customer.id);

  return (
    <div>
      <PortalPageHeader
        title="Service Requests"
        description="Report equipment issues, request support, and track return requests."
        action={
          <LinkButton href="/customer-portal/service-requests/new">
            New Request
          </LinkButton>
        }
      />
      <PortalDataTable
        rows={requests}
        emptyMessage="No service requests yet."
        columns={[
          { key: "subject", header: "Subject", render: (r) => r.subject },
          {
            key: "type",
            header: "Type",
            render: (r) => formatEnumLabel(r.requestType),
          },
          {
            key: "priority",
            header: "Priority",
            render: (r) => <StatusChip status={r.priority} />,
          },
          {
            key: "status",
            header: "Status",
            render: (r) => <StatusChip status={r.status} />,
          },
          {
            key: "date",
            header: "Submitted",
            render: (r) => formatPortalDate(r.createdAt),
          },
        ]}
      />
    </div>
  );
}
