import { getStockAlertLevel } from "@/lib/equipment/availability";
import { mapDbRow } from "@/lib/equipment/queries";
import type {
  EquipmentCategory,
  EquipmentItem,
  StockDashboardStats,
  StockMovementRecord,
} from "@/lib/equipment/types";
import { prisma } from "@/lib/prisma";

const listingInclude = {
  equipmentCategory: true,
  overrideBy: { select: { fullName: true } },
} as const;

export async function getListingManagementCategories(): Promise<EquipmentCategory[]> {
  const categories = await prisma.equipmentCategory.findMany({
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
  });
  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    displayOrder: category.displayOrder,
    imageUrl: category.imageUrl,
    active: category.active,
  }));
}

export async function getAllEquipmentListings(): Promise<EquipmentItem[]> {
  const rows = await prisma.equipmentInventory.findMany({
    include: listingInclude,
    orderBy: [{ sortOrder: "asc" }, { equipmentName: "asc" }],
  });
  return rows.map(mapDbRow);
}

export async function getEquipmentListingById(id: string): Promise<EquipmentItem | null> {
  const row = await prisma.equipmentInventory.findUnique({
    where: { id },
    include: listingInclude,
  });
  return row ? mapDbRow(row) : null;
}

export async function getStockDashboardStats(): Promise<StockDashboardStats> {
  const listings = await getAllEquipmentListings();
  return {
    total: listings.length,
    available: listings.filter((item) => item.availabilityStatus === "AVAILABLE").length,
    reserved: listings.filter((item) => item.availabilityStatus === "RESERVED").length,
    outOfStock: listings.filter((item) => item.availabilityStatus === "OUT_OF_STOCK").length,
    comingSoon: listings.filter((item) => item.availabilityStatus === "COMING_SOON").length,
    lowStock: listings.filter(
      (item) =>
        getStockAlertLevel(item) === "low" || getStockAlertLevel(item) === "reorder"
    ).length,
    reorderAlerts: listings.filter((item) => getStockAlertLevel(item) === "reorder").length,
  };
}

export async function getStockMovements(
  equipmentId?: string,
  limit = 100
): Promise<StockMovementRecord[]> {
  const rows = await prisma.equipmentStockMovement.findMany({
    where: equipmentId ? { equipmentId } : undefined,
    include: {
      equipment: { select: { equipmentName: true, itemId: true } },
      changedBy: { select: { fullName: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return rows.map((row) => ({
    id: row.id,
    equipmentId: row.equipmentId,
    equipmentName: row.equipment.equipmentName,
    itemId: row.equipment.itemId,
    movementType: row.movementType,
    quantity: row.quantity,
    previousQuantityAvailable: row.previousQuantityAvailable,
    newQuantityAvailable: row.newQuantityAvailable,
    reason: row.reason,
    changedByName: row.changedBy?.fullName ?? null,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function getReadOnlyEquipmentAvailability(): Promise<EquipmentItem[]> {
  const rows = await prisma.equipmentInventory.findMany({
    where: { publicVisible: true },
    include: listingInclude,
    orderBy: [{ equipmentName: "asc" }],
  });
  return rows.map(mapDbRow);
}
