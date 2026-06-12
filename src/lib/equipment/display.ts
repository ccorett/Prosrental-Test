import { calculateAvailabilityStatus } from "@/lib/equipment/availability";
import type { AvailabilityStatus, EquipmentItem } from "@/lib/equipment/types";
import { getAvailabilityLabel } from "@/lib/equipment/types";

export function showsComingSoonPlaceholder(item: EquipmentItem): boolean {
  return item.comingSoon || !item.imageUrl;
}

export function getEffectiveAvailabilityStatus(item: EquipmentItem): AvailabilityStatus {
  return calculateAvailabilityStatus({
    comingSoon: item.comingSoon,
    quantityAvailable: item.quantityAvailable,
    lowStockThreshold: item.lowStockThreshold,
    reorderLevel: item.reorderLevel,
    manualAvailabilityOverride: item.manualAvailabilityOverride,
    overrideStatus: item.overrideStatus,
  });
}

export function canRequestQuote(item: EquipmentItem): boolean {
  if (!item.publicVisible) return false;
  const status = getEffectiveAvailabilityStatus(item);
  return status !== "OUT_OF_STOCK";
}

export function getPublicDisplayLabel(item: EquipmentItem): string {
  return getAvailabilityLabel(getEffectiveAvailabilityStatus(item));
}

export function getCardAvailabilityStatus(item: EquipmentItem): AvailabilityStatus {
  return getEffectiveAvailabilityStatus(item);
}

export function getCardAvailabilityLabel(item: EquipmentItem): string {
  return getPublicDisplayLabel(item);
}
