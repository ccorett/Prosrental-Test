import { BookingForm } from "@/components/portal/app/BookingForm";
import { PortalPageHeader } from "@/components/portal/app/PortalPageHeader";
import { getBookableEquipment } from "@/lib/portal/queries";

export const metadata = { title: "Book Equipment" };

export default async function BookEquipmentPage() {
  const equipment = await getBookableEquipment();

  return (
    <div>
      <PortalPageHeader
        title="Book Equipment"
        description="Select equipment, choose rental dates, and submit a booking request for review."
      />
      <BookingForm equipment={equipment} />
    </div>
  );
}
