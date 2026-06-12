import { calculateAvailabilityStatus } from "@/lib/equipment/availability";
import type { EquipmentCategory, EquipmentItem } from "@/lib/equipment/types";
import { prisma } from "@/lib/prisma";
import type { EquipmentInventory, Prisma } from "@prisma/client";

type EquipmentWithCategory = EquipmentInventory & {
  equipmentCategory: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    displayOrder: number;
    imageUrl: string | null;
    active: boolean;
  };
  overrideBy?: { fullName: string } | null;
};

function decimalToNumber(value: Prisma.Decimal | number): number {
  return typeof value === "number" ? value : Number(value);
}

export function mapDbRow(row: EquipmentWithCategory): EquipmentItem {
  const fullDescription = row.fullDescription ?? row.description;
  const availabilityStatus = calculateAvailabilityStatus({
    comingSoon: row.comingSoon,
    quantityAvailable: row.quantityAvailable,
    lowStockThreshold: row.lowStockThreshold,
    reorderLevel: row.reorderLevel,
    manualAvailabilityOverride: row.manualAvailabilityOverride,
    overrideStatus: row.overrideStatus,
  });

  return {
    id: row.id,
    itemId: row.itemId,
    slug: row.slug,
    name: row.equipmentName,
    category: row.equipmentCategory.name,
    categoryId: row.categoryId,
    categorySlug: row.equipmentCategory.slug,
    description: fullDescription,
    shortDescription: row.shortDescription,
    fullDescription,
    specifications: row.specifications,
    dailyRate: decimalToNumber(row.dailyRate),
    weeklyRate: decimalToNumber(row.weeklyRate),
    monthlyRate: decimalToNumber(row.monthlyRate),
    depositAmount: decimalToNumber(row.depositAmount),
    quantityAvailable: row.quantityAvailable,
    quantityTotal: row.quantityTotal,
    quantityReserved: row.quantityReserved,
    reorderLevel: row.reorderLevel,
    lowStockThreshold: row.lowStockThreshold,
    availabilityStatus,
    manualAvailabilityOverride: row.manualAvailabilityOverride,
    overrideStatus: row.overrideStatus,
    overrideReason: row.overrideReason,
    overrideByName: row.overrideBy?.fullName ?? null,
    overrideAt: row.overrideAt?.toISOString() ?? null,
    conditionStatus: row.conditionStatus,
    imageUrl: row.imageUrl,
    galleryImages: row.galleryImages,
    featured: row.featured,
    publicVisible: row.publicVisible,
    comingSoon: row.comingSoon,
    sortOrder: row.sortOrder,
  };
}

const publicInclude = {
  equipmentCategory: true,
  overrideBy: { select: { fullName: true } },
} as const;

const publicWhere = {
  publicVisible: true,
  equipmentCategory: { active: true },
} as const;

export async function getActiveCategories(): Promise<EquipmentCategory[]> {
  const categories = await prisma.equipmentCategory.findMany({
    where: { active: true },
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    include: {
      _count: {
        select: {
          equipment: {
            where: { publicVisible: true },
          },
        },
      },
    },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    displayOrder: category.displayOrder,
    imageUrl: category.imageUrl,
    active: category.active,
    itemCount: category._count.equipment,
  }));
}

export async function getAllPublicEquipment(): Promise<EquipmentItem[]> {
  const rows = await prisma.equipmentInventory.findMany({
    where: publicWhere,
    include: publicInclude,
    orderBy: [{ sortOrder: "asc" }, { equipmentName: "asc" }],
  });
  return rows.map(mapDbRow);
}

export async function getAllEquipment(): Promise<EquipmentItem[]> {
  return getAllPublicEquipment();
}

export async function getFeaturedEquipment(limit = 9): Promise<EquipmentItem[]> {
  const rows = await prisma.equipmentInventory.findMany({
    where: { ...publicWhere, featured: true },
    include: publicInclude,
    orderBy: [{ sortOrder: "asc" }, { equipmentName: "asc" }],
    take: limit,
  });
  return rows.map(mapDbRow);
}

export async function getEquipmentByItemId(
  itemId: string
): Promise<EquipmentItem | null> {
  const normalized = itemId.toUpperCase();
  const row = await prisma.equipmentInventory.findFirst({
    where: {
      OR: [{ itemId: normalized }, { slug: itemId.toLowerCase() }],
      publicVisible: true,
      equipmentCategory: { active: true },
    },
    include: publicInclude,
  });
  return row ? mapDbRow(row) : null;
}

export async function getEquipmentByCategorySlug(
  categorySlug: string
): Promise<EquipmentItem[]> {
  const rows = await prisma.equipmentInventory.findMany({
    where: {
      ...publicWhere,
      equipmentCategory: { slug: categorySlug, active: true },
    },
    include: publicInclude,
    orderBy: [{ sortOrder: "asc" }, { equipmentName: "asc" }],
  });
  return rows.map(mapDbRow);
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const categories = await getActiveCategories();
  return Object.fromEntries(
    categories.map((category) => [category.slug, category.itemCount ?? 0])
  );
}

export async function getPublicEquipmentOptions(): Promise<
  { itemId: string; name: string }[]
> {
  const rows = await prisma.equipmentInventory.findMany({
    where: publicWhere,
    select: { itemId: true, equipmentName: true },
    orderBy: { equipmentName: "asc" },
  });
  return rows.map((row) => ({ itemId: row.itemId, name: row.equipmentName }));
}
