import type { EquipmentCategorySlug } from "@/lib/equipment/categories";

export const AVAILABILITY_STATUSES = [
  "AVAILABLE",
  "RESERVED",
  "OUT_OF_STOCK",
  "COMING_SOON",
] as const;

export type AvailabilityStatus = (typeof AVAILABILITY_STATUSES)[number];

export const STOCK_MOVEMENT_TYPES = [
  "ADDED_STOCK",
  "REMOVED_STOCK",
  "RESERVED",
  "RELEASED_RESERVATION",
  "CHECKED_OUT",
  "RETURNED",
  "DAMAGED",
  "ADJUSTED",
] as const;

export type StockMovementType = (typeof STOCK_MOVEMENT_TYPES)[number];

export const CONDITION_STATUSES = [
  "NEW",
  "GOOD",
  "FAIR",
  "NEEDS_REPAIR",
  "OUT_OF_SERVICE",
] as const;

export type ConditionStatus = (typeof CONDITION_STATUSES)[number];

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

export type EquipmentCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
  imageUrl: string | null;
  active: boolean;
  itemCount?: number;
};

export type EquipmentItem = {
  id: string;
  itemId: string;
  slug: string;
  name: string;
  category: string;
  categoryId: string;
  categorySlug: string;
  description: string;
  shortDescription: string | null;
  fullDescription: string | null;
  specifications: string | null;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  depositAmount: number;
  quantityAvailable: number;
  quantityTotal: number;
  quantityReserved: number;
  reorderLevel: number;
  lowStockThreshold: number;
  availabilityStatus: AvailabilityStatus;
  manualAvailabilityOverride: boolean;
  overrideStatus: AvailabilityStatus | null;
  overrideReason: string | null;
  overrideByName: string | null;
  overrideAt: string | null;
  conditionStatus: ConditionStatus;
  imageUrl: string | null;
  galleryImages: string[];
  featured: boolean;
  publicVisible: boolean;
  comingSoon: boolean;
  sortOrder: number;
};

export type StockMovementRecord = {
  id: string;
  equipmentId: string;
  equipmentName: string;
  itemId: string;
  movementType: StockMovementType;
  quantity: number;
  previousQuantityAvailable: number;
  newQuantityAvailable: number;
  reason: string | null;
  changedByName: string | null;
  createdAt: string;
};

export type StockDashboardStats = {
  total: number;
  available: number;
  reserved: number;
  outOfStock: number;
  comingSoon: number;
  lowStock: number;
  reorderAlerts: number;
};

export function getAvailabilityLabel(status: AvailabilityStatus): string {
  switch (status) {
    case "AVAILABLE":
      return "Available";
    case "RESERVED":
      return "Limited / Reserved";
    case "OUT_OF_STOCK":
      return "Out of Stock";
    case "COMING_SOON":
      return "Coming Soon";
  }
}

export function getInternalAvailabilityLabel(status: AvailabilityStatus): string {
  switch (status) {
    case "AVAILABLE":
      return "Available";
    case "RESERVED":
      return "Reserved";
    case "OUT_OF_STOCK":
      return "Out of Stock";
    case "COMING_SOON":
      return "Coming Soon";
  }
}

export function getConditionLabel(status: ConditionStatus): string {
  switch (status) {
    case "NEW":
      return "New";
    case "GOOD":
      return "Good";
    case "FAIR":
      return "Fair";
    case "NEEDS_REPAIR":
      return "Needs Repair";
    case "OUT_OF_SERVICE":
      return "Out of Service";
  }
}

export function getStockMovementLabel(type: StockMovementType): string {
  switch (type) {
    case "ADDED_STOCK":
      return "Added Stock";
    case "REMOVED_STOCK":
      return "Removed Stock";
    case "RESERVED":
      return "Reserved";
    case "RELEASED_RESERVATION":
      return "Released Reservation";
    case "CHECKED_OUT":
      return "Checked Out";
    case "RETURNED":
      return "Returned";
    case "DAMAGED":
      return "Damaged";
    case "ADJUSTED":
      return "Adjusted";
  }
}
