import { PortalDataTable } from "@/components/portal/app/PortalDataTable";
import { PortalPageHeader } from "@/components/portal/app/PortalPageHeader";
import { StatusChip } from "@/components/portal/app/StatusChip";
import { requireCustomer } from "@/lib/auth/session";
import { formatPortalDate } from "@/lib/portal/format";
import { getCustomerRentalHistory } from "@/lib/portal/queries";

export const metadata = { title: "Rental History" };

export default async function RentalHistoryPage() {
  const customer = await requireCustomer();
  const rentals = await getCustomerRentalHistory(customer.id);

  return (
    <div>
      <PortalPageHeader
        title="Rental History"
        description="Previous rentals and performance records."
      />
      <PortalDataTable
        rows={rentals}
        emptyMessage="No rental history yet."
        columns={[
          { key: "equipment", header: "Equipment", render: (r) => r.equipmentName },
          {
            key: "period",
            header: "Rental Period",
            render: (r) =>
              `${formatPortalDate(r.rentalStartDate)} – ${formatPortalDate(r.rentalEndDate)}`,
          },
          {
            key: "returned",
            header: "Returned",
            render: (r) => (r.returnDate ? formatPortalDate(r.returnDate) : "—"),
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
