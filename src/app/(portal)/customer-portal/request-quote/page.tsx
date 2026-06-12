import { PortalPageHeader } from "@/components/portal/app/PortalPageHeader";
import { PortalQuoteForm } from "@/components/portal/app/PortalQuoteForm";

export const metadata = { title: "Request Quote" };

export default function RequestQuotePage() {
  return (
    <div>
      <PortalPageHeader
        title="Request Quotation"
        description="Submit a quote request and our team will prepare pricing for your rental."
      />
      <PortalQuoteForm />
    </div>
  );
}
