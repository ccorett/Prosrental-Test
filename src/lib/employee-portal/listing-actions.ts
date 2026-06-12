"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { calculateAvailabilityStatus } from "@/lib/equipment/availability";
import { CONDITION_STATUSES } from "@/lib/equipment/types";
import { syncEquipmentAvailability } from "@/lib/equipment/stock";
import { writeAuditLog } from "@/lib/employee-portal/audit";
import { requireModuleAccess } from "@/lib/employee-portal/permissions";
import { getSessionEmployee, isSuperAdmin } from "@/lib/employee-auth/session";
import { prisma } from "@/lib/prisma";

export type ListingFormState = {
  ok: boolean;
  message: string;
};

const EMPTY_STATE: ListingFormState = { ok: false, message: "" };

function parseGallery(value: string): string[] {
  return value
    .split(/[\n,]+/)
    .map((url) => url.trim())
    .filter(Boolean);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function requireListingEditor(action: "create" | "edit" | "delete") {
  const employee = await getSessionEmployee();
  if (!employee) {
    redirect("/employee-portal/login");
  }
  await requireModuleAccess(employee, "EQUIPMENT_LISTINGS", action);
  return employee;
}

export async function createEquipmentListing(
  _prev: ListingFormState,
  formData: FormData
): Promise<ListingFormState> {
  const employee = await requireListingEditor("create");

  const itemId = String(formData.get("itemId") ?? "")
    .trim()
    .toUpperCase();
  const name = String(formData.get("name") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "").trim();

  if (!itemId || !name || !categoryId) {
    return { ok: false, message: "Item code, name, and category are required." };
  }

  const category = await prisma.equipmentCategory.findUnique({
    where: { id: categoryId },
  });
  if (!category) {
    return { ok: false, message: "Selected category was not found." };
  }

  const slug = slugify(String(formData.get("slug") ?? itemId) || itemId);
  const maxSort = await prisma.equipmentInventory.aggregate({
    _max: { sortOrder: true },
  });

  const listingData = buildListingData(formData, {
    itemId,
    slug,
    category,
    sortOrder: (maxSort._max.sortOrder ?? 0) + 1,
  });

  try {
    const created = await prisma.equipmentInventory.create({
      data: {
        ...listingData,
        availabilityStatus: calculateAvailabilityStatus({
          comingSoon: listingData.comingSoon,
          quantityAvailable: listingData.quantityAvailable,
          lowStockThreshold: listingData.lowStockThreshold,
          reorderLevel: listingData.reorderLevel,
          manualAvailabilityOverride: false,
          overrideStatus: null,
        }),
      },
    });

    await syncEquipmentAvailability(created.id);

    await writeAuditLog({
      actorId: employee.id,
      action: "EQUIPMENT_LISTING_CREATED",
      entityType: "EquipmentInventory",
      entityId: created.id,
      description: `Created public equipment listing ${created.itemId}`,
      metadata: { itemId: created.itemId, name: created.equipmentName },
    });

    revalidatePublicPaths();
    return { ok: true, message: "Equipment listing created." };
  } catch {
    return { ok: false, message: "Could not create listing. Check item code and slug are unique." };
  }
}

export async function updateEquipmentListing(
  _prev: ListingFormState,
  formData: FormData
): Promise<ListingFormState> {
  const employee = await requireListingEditor("edit");
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { ok: false, message: "Listing id is required." };
  }

  const existing = await prisma.equipmentInventory.findUnique({ where: { id } });
  if (!existing) {
    return { ok: false, message: "Listing not found." };
  }

  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const category = await prisma.equipmentCategory.findUnique({
    where: { id: categoryId },
  });
  if (!category) {
    return { ok: false, message: "Selected category was not found." };
  }

  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    return { ok: false, message: "Name is required." };
  }

  const slug = slugify(String(formData.get("slug") ?? existing.slug));
  const listingData = buildListingData(formData, {
    itemId: existing.itemId,
    slug,
    category,
    sortOrder: Number(formData.get("sortOrder") ?? existing.sortOrder),
  });

  const stockChanged =
    listingData.quantityAvailable !== existing.quantityAvailable ||
    listingData.quantityTotal !== existing.quantityTotal ||
    listingData.quantityReserved !== existing.quantityReserved;

  try {
    const updated = await prisma.$transaction(async (tx) => {
      await tx.equipmentInventory.update({
        where: { id },
        data: listingData,
      });

      if (listingData.quantityAvailable !== existing.quantityAvailable) {
        await tx.equipmentStockMovement.create({
          data: {
            equipmentId: id,
            movementType: "ADJUSTED",
            quantity: listingData.quantityAvailable,
            previousQuantityAvailable: existing.quantityAvailable,
            newQuantityAvailable: listingData.quantityAvailable,
            reason:
              String(formData.get("stockChangeReason") ?? "").trim() ||
              "Listing stock update",
            changedById: employee.id,
          },
        });
      }

      return syncEquipmentAvailability(id, tx);
    });

    await writeAuditLog({
      actorId: employee.id,
      action: stockChanged ? "EQUIPMENT_STOCK_CHANGED" : "EQUIPMENT_LISTING_UPDATED",
      entityType: "EquipmentInventory",
      entityId: updated.id,
      description: stockChanged
        ? `Updated stock for ${updated.itemId}`
        : `Updated public equipment listing ${updated.itemId}`,
      metadata: diffListingChanges(existing, updated) as Prisma.InputJsonValue,
    });

    revalidatePublicPaths();
    return { ok: true, message: "Equipment listing saved." };
  } catch {
    return { ok: false, message: "Could not save listing." };
  }
}

export async function archiveEquipmentListing(id: string): Promise<ListingFormState> {
  const employee = await requireListingEditor("edit");

  const existing = await prisma.equipmentInventory.findUnique({ where: { id } });
  if (!existing) {
    return { ok: false, message: "Listing not found." };
  }

  const updated = await prisma.equipmentInventory.update({
    where: { id },
    data: { publicVisible: false },
  });

  await writeAuditLog({
    actorId: employee.id,
    action: "EQUIPMENT_LISTING_ARCHIVED",
    entityType: "EquipmentInventory",
    entityId: updated.id,
    description: `Archived public equipment listing ${updated.itemId}`,
    metadata: { itemId: updated.itemId },
  });

  revalidatePublicPaths();
  return { ok: true, message: "Listing hidden from public website." };
}

export async function deleteEquipmentListing(id: string): Promise<ListingFormState> {
  const employee = await requireListingEditor("delete");
  if (!isSuperAdmin(employee)) {
    return { ok: false, message: "Only Super Admin can permanently delete listings." };
  }

  const existing = await prisma.equipmentInventory.findUnique({ where: { id } });
  if (!existing) {
    return { ok: false, message: "Listing not found." };
  }

  await prisma.equipmentInventory.delete({ where: { id } });

  await writeAuditLog({
    actorId: employee.id,
    action: "EQUIPMENT_LISTING_DELETED",
    entityType: "EquipmentInventory",
    entityId: id,
    description: `Deleted public equipment listing ${existing.itemId}`,
    metadata: { itemId: existing.itemId, name: existing.equipmentName },
  });

  revalidatePublicPaths();
  return { ok: true, message: "Listing permanently deleted." };
}

export async function reorderEquipmentListings(
  orderedIds: string[]
): Promise<ListingFormState> {
  const employee = await requireListingEditor("edit");

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.equipmentInventory.update({
        where: { id },
        data: { sortOrder: index + 1 },
      })
    )
  );

  await writeAuditLog({
    actorId: employee.id,
    action: "EQUIPMENT_LISTING_UPDATED",
    entityType: "EquipmentInventory",
    entityId: null,
    description: "Reordered public equipment listings",
    metadata: { orderedIds },
  });

  revalidatePublicPaths();
  return { ok: true, message: "Listing order updated." };
}

function buildListingData(
  formData: FormData,
  ctx: {
    itemId: string;
    slug: string;
    category: { id: string; name: string };
    sortOrder: number;
  }
) {
  const description =
    String(formData.get("fullDescription") ?? formData.get("description") ?? "").trim() ||
    String(formData.get("shortDescription") ?? "").trim();

  const conditionStatus = parseEnum(
    formData.get("conditionStatus"),
    CONDITION_STATUSES,
    "GOOD"
  );

  return {
    categoryId: ctx.category.id,
    category: ctx.category.name,
    itemId: ctx.itemId,
    slug: ctx.slug,
    equipmentName: String(formData.get("name") ?? "").trim(),
    description,
    shortDescription: String(formData.get("shortDescription") ?? "").trim() || null,
    fullDescription: description || null,
    specifications: String(formData.get("specifications") ?? "").trim() || null,
    dailyRate: Number(formData.get("dailyRate") ?? 0),
    weeklyRate: Number(formData.get("weeklyRate") ?? 0),
    monthlyRate: Number(formData.get("monthlyRate") ?? 0),
    depositAmount: Number(formData.get("depositAmount") ?? 0),
    quantityTotal: Number(formData.get("quantityTotal") ?? 0),
    quantityAvailable: Number(formData.get("quantityAvailable") ?? 0),
    quantityReserved: Number(formData.get("quantityReserved") ?? 0),
    reorderLevel: Number(formData.get("reorderLevel") ?? 1),
    lowStockThreshold: Number(formData.get("lowStockThreshold") ?? 1),
    conditionStatus,
    imageUrl: String(formData.get("imageUrl") ?? "").trim() || null,
    galleryImages: parseGallery(String(formData.get("galleryImages") ?? "")),
    featured: formData.has("featured"),
    publicVisible: formData.has("publicVisible"),
    comingSoon: formData.has("comingSoon"),
    sortOrder: ctx.sortOrder,
  };
}

function parseEnum<T extends string>(
  value: FormDataEntryValue | null,
  allowed: readonly T[],
  fallback: T
): T {
  const raw = String(value ?? "");
  return allowed.includes(raw as T) ? (raw as T) : fallback;
}

function diffListingChanges(
  before: Awaited<ReturnType<typeof prisma.equipmentInventory.findUnique>>,
  after: Awaited<ReturnType<typeof prisma.equipmentInventory.update>>
) {
  if (!before) return {};
  const changes: Record<string, { from: unknown; to: unknown }> = {};
  const fields = [
    "equipmentName",
    "categoryId",
    "dailyRate",
    "weeklyRate",
    "monthlyRate",
    "depositAmount",
    "quantityTotal",
    "quantityAvailable",
    "quantityReserved",
    "reorderLevel",
    "lowStockThreshold",
    "conditionStatus",
    "featured",
    "publicVisible",
    "comingSoon",
    "imageUrl",
    "sortOrder",
  ] as const;

  for (const field of fields) {
    const from = before[field];
    const to = after[field];
    if (String(from) !== String(to)) {
      changes[field] = { from, to };
    }
  }
  return changes;
}

function revalidatePublicPaths() {
  revalidatePath("/");
  revalidatePath("/equipment");
  revalidatePath("/categories");
  revalidatePath("/employee-portal/equipment-listings");
  revalidatePath("/employee-portal/inventory");
}

export { EMPTY_STATE as LISTING_FORM_INITIAL };
