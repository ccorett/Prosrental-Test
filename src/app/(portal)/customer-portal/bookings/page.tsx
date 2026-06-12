import { PortalDataTable } from "@/components/portal/app/PortalDataTable";
import { PortalPageHeader } from "@/components/portal/app/PortalPageHeader";
import { StatusChip } from "@/components/portal/app/StatusChip";
import { requireCustomer } from "@/lib/auth/session";
import { formatPortalDate } from "@/lib/portal/format";
import { getCustomerBookings } from "@/lib/portal/queries";
import { LinkButton } from "@/components/ui/Button";

export const metadata = { title: "My Bookings" };

export default async function BookingsPage() {
  const customer = await requireCustomer();
  const bookings = await getCustomerBookings(customer.id);

  return (
    <div>
      <PortalPageHeader
        title="My Bookings"
        description="Track the status of your equipment booking requests."
        action={<LinkButton href="/customer-portal/book-equipment">New Booking</LinkButton>}
      />
      <PortalDataTable
        rows={bookings}
        emptyMessage="No booking requests yet."
        columns={[
          { key: "equipment", header: "Equipment", render: (r) => r.equipmentName },
          {
            key: "dates",
            header: "Rental Period",
            render: (r) =>
              `${formatPortalDate(r.rentalStartDate)} – ${formatPortalDate(r.rentalEndDate)}`,
          },
          {
            key: "delivery",
            header: "Delivery",
            render: (r) => (r.deliveryRequired ? "Yes" : "No"),
          },
          {
            key: "status",
            header: "Status",
            render: (r) => <StatusChip status={r.requestStatus} />,
          },
        ]}
      />
    </div>
  );
}
