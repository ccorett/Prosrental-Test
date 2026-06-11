import type { EquipmentCategorySlug } from "@/lib/equipment/categories";

export const AVAILABILITY_STATUSES = [
  "AVAILABLE",
  "RESERVED",
  "OUT_OF_SERVICE",
  "COMING_SOON",
] as const;

export type AvailabilityStatus = (typeof AVAILABILITY_STATUSES)[number];

export type InventoryRecord = {
  itemId: string;
  csvCategory: string;
  categorySlug: EquipmentCategorySlug;
  category: string;
  equipmentName: string;
  description: string;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  quantityAvailable: number;
  quantityTotal: number;
  availabilityStatus: AvailabilityStatus;
  imageUrl: string | null;
  featured: boolean;
  comingSoon: boolean;
};

export type EquipmentItem = {
  id: string;
  itemId: string;
  name: string;
  category: string;
  categorySlug: EquipmentCategorySlug;
  description: string;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  quantityAvailable: number;
  quantityTotal: number;
  availabilityStatus: AvailabilityStatus;
  imageUrl: string | null;
  featured: boolean;
  comingSoon: boolean;
};

export function getAvailabilityLabel(status: AvailabilityStatus): string {
  switch (status) {
    case "AVAILABLE":
      return "Available";
    case "RESERVED":
      return "Reserved";
    case "OUT_OF_SERVICE":
      return "Out of Service";
    case "COMING_SOON":
      return "Coming Soon";
  }
}
