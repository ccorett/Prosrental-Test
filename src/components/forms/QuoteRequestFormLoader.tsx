"use client";

import { useSearchParams } from "next/navigation";
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";

export function QuoteRequestFormLoader() {
  const searchParams = useSearchParams();
  const equipment = searchParams.get("equipment") ?? "";

  return (
    <QuoteRequestForm
      defaultEquipment={equipment}
      submitLabel={equipment ? "Send Equipment Inquiry" : "Request a Quote"}
      successTitle={equipment ? "Inquiry received" : "Quote request received"}
    />
  );
}
