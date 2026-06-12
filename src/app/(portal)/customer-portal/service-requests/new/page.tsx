import { PortalPageHeader } from "@/components/portal/app/PortalPageHeader";
import { ServiceRequestForm } from "@/components/portal/app/ServiceRequestForm";
import { requireCustomer } from "@/lib/auth/session";
import { getCustomerRentalsForSelect } from "@/lib/portal/queries";

export const metadata = { title: "New Service Request" };

export default async function NewServiceRequestPage() {
  const customer = await requireCustomer();
  const rentals = await getCustomerRentalsForSelect(customer.id);

  return (
    <div>
      <PortalPageHeader
        title="New Service Request"
        description="Report an equipment issue, request support, or schedule a return."
      />
      <ServiceRequestForm rentals={rentals} />
    </div>
  );
}
