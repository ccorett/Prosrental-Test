"use client";

import { useSearchParams } from "next/navigation";
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";

type QuoteRequestFormLoaderProps = {
  equipmentOptions: { itemId: string; name: string }[];
};

export function QuoteRequestFormLoader({
  equipmentOptions,
}: QuoteRequestFormLoaderProps) {
  const searchParams = useSearchParams();
  const equipment = searchParams.get("equipment") ?? "";

  return (
    <QuoteRequestForm
      defaultEquipment={equipment}
      equipmentOptions={equipmentOptions}
      submitLabel={equipment ? "Send Equipment Inquiry" : "Submit request"}
      successTitle={equipment ? "Inquiry received" : "Quote request received"}
    />
  );
}
