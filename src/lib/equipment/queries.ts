import { categorySlugFromLabel } from "@/lib/equipment/categories";
import { INVENTORY_RECORDS } from "@/lib/equipment/inventory-records";
import type { EquipmentItem } from "@/lib/equipment/types";
import { prisma } from "@/lib/prisma";
import type { EquipmentInventory, Prisma } from "@prisma/client";

function decimalToNumber(value: Prisma.Decimal | number): number {
  return typeof value === "number" ? value : Number(value);
}

function mapDbRow(row: EquipmentInventory): EquipmentItem {
  return {
    id: row.id,
    itemId: row.itemId,
    name: row.equipmentName,
    category: row.category,
    categorySlug: categorySlugFromLabel(row.category),
    description: row.description,
    dailyRate: decimalToNumber(row.dailyRate),
    weeklyRate: decimalToNumber(row.weeklyRate),
    monthlyRate: decimalToNumber(row.monthlyRate),
    quantityAvailable: row.quantityAvailable,
    quantityTotal: row.quantityTotal,
    availabilityStatus: row.availabilityStatus,
    imageUrl: row.imageUrl,
    featured: row.featured,
    comingSoon: row.comingSoon,
  };
}

function mapStaticRecord(record: (typeof INVENTORY_RECORDS)[number]): EquipmentItem {
  return {
    id: record.itemId,
    itemId: record.itemId,
    name: record.equipmentName,
    category: record.category,
    categorySlug: record.categorySlug,
    description: record.description,
    dailyRate: record.dailyRate,
    weeklyRate: record.weeklyRate,
    monthlyRate: record.monthlyRate,
    quantityAvailable: record.quantityAvailable,
    quantityTotal: record.quantityTotal,
    availabilityStatus: record.availabilityStatus,
    imageUrl: record.imageUrl,
    featured: record.featured,
    comingSoon: record.comingSoon,
  };
}

function sortEquipment(items: EquipmentItem[]): EquipmentItem[] {
  return [...items].sort((a, b) => {
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
}

function getStaticInventory(): EquipmentItem[] {
  return sortEquipment(INVENTORY_RECORDS.map(mapStaticRecord));
}

async function fetchFromDatabase(): Promise<EquipmentItem[] | null> {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  try {
    const rows = await prisma.equipmentInventory.findMany({
      orderBy: [{ featured: "desc" }, { equipmentName: "asc" }],
    });

    if (rows.length === 0) {
      return null;
    }

    return rows.map(mapDbRow);
  } catch {
    return null;
  }
}

export async function getAllEquipment(): Promise<EquipmentItem[]> {
  const fromDb = await fetchFromDatabase();
  return fromDb ?? getStaticInventory();
}

export async function getFeaturedEquipment(limit = 9): Promise<EquipmentItem[]> {
  const items = await getAllEquipment();
  return items.filter((item) => item.featured).slice(0, limit);
}

export async function getEquipmentByItemId(
  itemId: string
): Promise<EquipmentItem | null> {
  const normalized = itemId.toUpperCase();

  if (process.env.DATABASE_URL) {
    try {
      const row = await prisma.equipmentInventory.findUnique({
        where: { itemId: normalized },
      });
      if (row) {
        return mapDbRow(row);
      }
    } catch {
      // fall through to static data
    }
  }

  const record = INVENTORY_RECORDS.find((item) => item.itemId === normalized);
  return record ? mapStaticRecord(record) : null;
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const items = await getAllEquipment();
  return items.reduce<Record<string, number>>((counts, item) => {
    counts[item.categorySlug] = (counts[item.categorySlug] ?? 0) + 1;
    return counts;
  }, {});
}
