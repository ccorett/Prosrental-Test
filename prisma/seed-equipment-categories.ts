import type { PrismaClient } from "@prisma/client";
import { calculateAvailabilityStatus } from "../src/lib/equipment/availability";
import { INVENTORY_RECORDS } from "../src/lib/equipment/inventory-records";

const CATEGORY_SEEDS = [
  {
    id: "cat_cleaning",
    name: "Cleaning Equipment",
    slug: "cleaning",
    description: "Pressure washers, scrubbers, and site cleaning tools.",
    displayOrder: 1,
  },
  {
    id: "cat_construction",
    name: "Construction Equipment",
    slug: "construction",
    description: "Mixers, compactors, and heavy-duty site equipment.",
    displayOrder: 2,
  },
  {
    id: "cat_diy",
    name: "DIY Tools",
    slug: "diy",
    description: "Drills, saws, and homeowner-friendly rental tools.",
    displayOrder: 3,
  },
  {
    id: "cat_landscaping",
    name: "Landscaping Equipment",
    slug: "landscaping",
    description: "Mowers, trimmers, and outdoor maintenance gear.",
    displayOrder: 4,
  },
  {
    id: "cat_access",
    name: "Access Equipment",
    slug: "access",
    description: "Scaffolding, ladders, and elevated work platforms.",
    displayOrder: 5,
  },
  {
    id: "cat_sanitation",
    name: "Sanitation & Hygiene Equipment",
    slug: "sanitation",
    description: "Portable sanitation and hygiene solutions.",
    displayOrder: 6,
  },
  {
    id: "cat_event",
    name: "Event & Site Facilities",
    slug: "event",
    description: "Fencing, lighting, and temporary site facilities.",
    displayOrder: 7,
  },
] as const;

const SLUG_TO_CATEGORY_ID: Record<string, string> = Object.fromEntries(
  CATEGORY_SEEDS.map((c) => [c.slug, c.id])
);

function slugifyItemId(itemId: string): string {
  return itemId.toLowerCase().replace(/\s+/g, "-");
}

export async function seedEquipmentCategories(prisma: PrismaClient) {
  for (const category of CATEGORY_SEEDS) {
    await prisma.equipmentCategory.upsert({
      where: { slug: category.slug },
      create: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        displayOrder: category.displayOrder,
        active: true,
      },
      update: {
        name: category.name,
        description: category.description,
        displayOrder: category.displayOrder,
        active: true,
      },
    });
  }
}

export async function seedEquipmentInventory(prisma: PrismaClient) {
  await seedEquipmentCategories(prisma);

  let sortOrder = 0;
  for (const record of INVENTORY_RECORDS) {
    const categoryId = SLUG_TO_CATEGORY_ID[record.categorySlug];
    if (!categoryId) {
      throw new Error(`Missing category seed for slug: ${record.categorySlug}`);
    }

    sortOrder += 1;
    const slug = slugifyItemId(record.itemId);
    const reorderLevel = 1;
    const lowStockThreshold = Math.max(reorderLevel, 1);
    const availabilityStatus = calculateAvailabilityStatus({
      comingSoon: record.comingSoon,
      quantityAvailable: record.quantityAvailable,
      lowStockThreshold,
      reorderLevel,
      manualAvailabilityOverride: false,
      overrideStatus: null,
    });

    await prisma.equipmentInventory.upsert({
      where: { itemId: record.itemId },
      create: {
        categoryId,
        itemId: record.itemId,
        slug,
        category: record.category,
        equipmentName: record.equipmentName,
        description: record.description,
        shortDescription: record.description.slice(0, 200),
        fullDescription: record.description,
        dailyRate: record.dailyRate,
        weeklyRate: record.weeklyRate,
        monthlyRate: record.monthlyRate,
        depositAmount: 0,
        quantityAvailable: record.quantityAvailable,
        quantityTotal: record.quantityTotal,
        quantityReserved: 0,
        reorderLevel,
        lowStockThreshold,
        availabilityStatus,
        conditionStatus: "GOOD",
        imageUrl: record.imageUrl,
        galleryImages: [],
        featured: record.featured,
        publicVisible: true,
        comingSoon: record.comingSoon,
        sortOrder,
      },
      update: {
        categoryId,
        slug,
        category: record.category,
        equipmentName: record.equipmentName,
        description: record.description,
        shortDescription: record.description.slice(0, 200),
        fullDescription: record.description,
        dailyRate: record.dailyRate,
        weeklyRate: record.weeklyRate,
        monthlyRate: record.monthlyRate,
        quantityAvailable: record.quantityAvailable,
        quantityTotal: record.quantityTotal,
        quantityReserved: 0,
        reorderLevel,
        lowStockThreshold,
        availabilityStatus,
        imageUrl: record.imageUrl,
        featured: record.featured,
        comingSoon: record.comingSoon,
        publicVisible: true,
        sortOrder,
      },
    });
  }
}
