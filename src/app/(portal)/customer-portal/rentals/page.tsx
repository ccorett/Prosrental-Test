import { PortalDataTable } from "@/components/portal/app/PortalDataTable";
import { PortalPageHeader } from "@/components/portal/app/PortalPageHeader";
import { StatusChip } from "@/components/portal/app/StatusChip";
import { LinkButton } from "@/components/ui/Button";
import { requireCustomer } from "@/lib/auth/session";
import { formatPortalDate } from "@/lib/portal/format";
import { getCustomerActiveRentals } from "@/lib/portal/queries";

export const metadata = { title: "Rentals" };

export default async function RentalsPage() {
  const customer = await requireCustomer();
  const rentals = await getCustomerActiveRentals(customer.id);

  return (
    <div>
      <PortalPageHeader
        title="Active Rentals"
        description="View your current rentals and upcoming return dates."
        action={
          <LinkButton href="/customer-portal/rental-history" variant="outline">
            Rental History
          </LinkButton>
        }
      />
      <PortalDataTable
        rows={rentals}
        emptyMessage="No active rentals."
        columns={[
          { key: "equipment", header: "Equipment", render: (r) => r.equipmentName },
          {
            key: "start",
            header: "Start",
            render: (r) => formatPortalDate(r.rentalStartDate),
          },
          {
            key: "end",
            header: "Return Due",
            render: (r) => formatPortalDate(r.rentalEndDate),
          },
          {
            key: "status",
            header: "Status",
            render: (r) => <StatusChip status={r.status} />,
          },
          {
            key: "notes",
            header: "Performance Notes",
            render: (r) => r.performanceNotes ?? "—",
          },
        ]}
      />
    </div>
  );
}
