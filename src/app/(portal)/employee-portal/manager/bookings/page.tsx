import { ManagerBookingsPanel } from "@/components/manager-control/ManagerBookingsPanel";
import { getManagerBookings } from "@/lib/manager-control/queries";

export const metadata = { title: "Bookings — Manager Control" };

export default async function ManagerBookingsPage() {
  const bookings = await getManagerBookings();
  return <ManagerBookingsPanel bookings={bookings} />;
}
