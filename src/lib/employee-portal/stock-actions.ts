"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Prisma, StockMovementType } from "@prisma/client";
import { AVAILABILITY_STATUSES } from "@/lib/equipment/types";
import { applyStockMovement, syncEquipmentAvailability } from "@/lib/equipment/stock";
import { writeAuditLog } from "@/lib/employee-portal/audit";
import type { ListingFormState } from "@/lib/employee-portal/listing-actions";
import { requireModuleAccess } from "@/lib/employee-portal/permissions";
import { getSessionEmployee } from "@/lib/employee-auth/session";
import { prisma } from "@/lib/prisma";

async function requireStockEditor() {
  const employee = await getSessionEmployee();
  if (!employee) redirect("/employee-portal/login");
  await requireModuleAccess(employee, "EQUIPMENT_LISTINGS", "edit");
  return employee;
}

function revalidateStockPaths() {
  revalidatePath("/");
  revalidatePath("/equipment");
  revalidatePath("/employee-portal/equipment-listings");
  revalidatePath("/employee-portal/inventory");
}

export async function adjustEquipmentStock(
  _prev: ListingFormState,
  formData: FormData
): Promise<ListingFormState> {
  const employee = await requireStockEditor();
  const equipmentId = String(formData.get("equipmentId") ?? "").trim();
  const movementType = String(formData.get("movementType") ?? "ADJUSTED");
  const reason = String(formData.get("reason") ?? "").trim();

  if (!equipmentId || !reason) {
    return { ok: false, message: "Equipment and reason are required." };
  }

  const quantity = Number(formData.get("quantity") ?? 0);
  if (!Number.isFinite(quantity) || quantity < 0) {
    return { ok: false, message: "Enter a valid quantity." };
  }

  const existing = await prisma.equipmentInventory.findUnique({
    where: { id: equipmentId },
  });
  if (!existing) {
    return { ok: false, message: "Equipment not found." };
  }

  try {
    const updated = await applyStockMovement({
      equipmentId,
      movementType: movementType as StockMovementType,
      quantity: movementType === "ADJUSTED" ? quantity : quantity,
      reason,
      changedById: employee.id,
    });

    await writeAuditLog({
      actorId: employee.id,
      action: "EQUIPMENT_STOCK_CHANGED",
      entityType: "EquipmentInventory",
      entityId: equipmentId,
      description: `Stock ${movementType} for ${existing.itemId}`,
      metadata: {
        movementType,
        quantity,
        previousAvailable: existing.quantityAvailable,
        newAvailable: updated.quantityAvailable,
        reason,
      } as Prisma.InputJsonValue,
    });

    revalidateStockPaths();
    return { ok: true, message: "Stock updated and availability recalculated." };
  } catch {
    return { ok: false, message: "Could not apply stock change." };
  }
}

export async function applyAvailabilityOverride(
  _prev: ListingFormState,
  formData: FormData
): Promise<ListingFormState> {
  const employee = await requireStockEditor();
  const equipmentId = String(formData.get("equipmentId") ?? "").trim();
  const overrideStatus = String(formData.get("overrideStatus") ?? "").trim();
  const overrideReason = String(formData.get("overrideReason") ?? "").trim();

  if (!equipmentId || !overrideStatus || !overrideReason) {
    return { ok: false, message: "Status and reason are required for override." };
  }

  if (!AVAILABILITY_STATUSES.includes(overrideStatus as (typeof AVAILABILITY_STATUSES)[number])) {
    return { ok: false, message: "Invalid override status." };
  }

  const existing = await prisma.equipmentInventory.findUnique({
    where: { id: equipmentId },
  });
  if (!existing) {
    return { ok: false, message: "Equipment not found." };
  }

  await prisma.equipmentInventory.update({
    where: { id: equipmentId },
    data: {
      manualAvailabilityOverride: true,
      overrideStatus: overrideStatus as (typeof AVAILABILITY_STATUSES)[number],
      overrideReason,
      overrideById: employee.id,
      overrideAt: new Date(),
    },
  });

  await syncEquipmentAvailability(equipmentId);

  await writeAuditLog({
    actorId: employee.id,
    action: "EQUIPMENT_OVERRIDE_APPLIED",
    entityType: "EquipmentInventory",
    entityId: equipmentId,
    description: `Manual availability override applied for ${existing.itemId}`,
    metadata: { overrideStatus, overrideReason } as Prisma.InputJsonValue,
  });

  revalidateStockPaths();
  return { ok: true, message: "Manual override applied." };
}

export async function removeAvailabilityOverride(
  equipmentId: string
): Promise<ListingFormState> {
  const employee = await requireStockEditor();

  const existing = await prisma.equipmentInventory.findUnique({
    where: { id: equipmentId },
  });
  if (!existing) {
    return { ok: false, message: "Equipment not found." };
  }

  await prisma.equipmentInventory.update({
    where: { id: equipmentId },
    data: {
      manualAvailabilityOverride: false,
      overrideStatus: null,
      overrideReason: null,
      overrideById: null,
      overrideAt: null,
    },
  });

  await syncEquipmentAvailability(equipmentId);

  await writeAuditLog({
    actorId: employee.id,
    action: "EQUIPMENT_OVERRIDE_REMOVED",
    entityType: "EquipmentInventory",
    entityId: equipmentId,
    description: `Manual availability override removed for ${existing.itemId}`,
  });

  revalidateStockPaths();
  return { ok: true, message: "Override removed. Availability recalculated from stock." };
}
