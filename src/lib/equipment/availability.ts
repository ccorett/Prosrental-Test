import type { AvailabilityStatus } from "@/lib/equipment/types";

export type StockAvailabilityInput = {
  comingSoon: boolean;
  quantityAvailable: number;
  lowStockThreshold: number;
  reorderLevel: number;
  manualAvailabilityOverride: boolean;
  overrideStatus: AvailabilityStatus | null;
};

export function calculateAvailabilityStatus(
  input: StockAvailabilityInput
): AvailabilityStatus {
  if (input.manualAvailabilityOverride && input.overrideStatus) {
    return input.overrideStatus;
  }
  if (input.comingSoon) {
    return "COMING_SOON";
  }
  if (input.quantityAvailable <= 0) {
    return "OUT_OF_STOCK";
  }
  if (
    input.quantityAvailable <= input.lowStockThreshold ||
    input.quantityAvailable <= input.reorderLevel
  ) {
    return "RESERVED";
  }
  return "AVAILABLE";
}

export function getStockAlertLevel(
  input: Pick<
    StockAvailabilityInput,
    "comingSoon" | "quantityAvailable" | "lowStockThreshold" | "reorderLevel"
  >
): "none" | "reorder" | "low" | "out" {
  if (input.comingSoon) return "none";
  if (input.quantityAvailable <= 0) return "out";
  if (input.quantityAvailable <= input.reorderLevel) return "reorder";
  if (input.quantityAvailable <= input.lowStockThreshold) return "low";
  return "none";
}
