import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";
import { getPublicEquipmentOptions } from "@/lib/equipment/queries";

type QuoteRequestFormSectionProps = {
  defaultEquipment?: string;
  submitLabel?: string;
  successTitle?: string;
};

export async function QuoteRequestFormSection({
  defaultEquipment = "",
  submitLabel,
  successTitle,
}: QuoteRequestFormSectionProps) {
  const equipmentOptions = await getPublicEquipmentOptions();

  return (
    <QuoteRequestForm
      defaultEquipment={defaultEquipment}
      equipmentOptions={equipmentOptions}
      submitLabel={submitLabel}
      successTitle={successTitle}
    />
  );
}
