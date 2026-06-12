import type { StockMovementType } from "@/lib/equipment/types";
import { calculateAvailabilityStatus } from "@/lib/equipment/availability";
import { prisma } from "@/lib/prisma";
import type { EquipmentInventory, Prisma, StockMovementType as PrismaMovementType } from "@prisma/client";

type MovementInput = {
  equipmentId: string;
  movementType: PrismaMovementType;
  quantity: number;
  reason?: string | null;
  referenceType?: string | null;
  referenceId?: string | null;
  changedById?: string | null;
  quantityTotalDelta?: number;
  quantityReservedDelta?: number;
};

export async function syncEquipmentAvailability(
  equipmentId: string,
  tx?: Prisma.TransactionClient
): Promise<EquipmentInventory> {
  const db = tx ?? prisma;
  const equipment = await db.equipmentInventory.findUniqueOrThrow({
    where: { id: equipmentId },
  });

  const availabilityStatus = calculateAvailabilityStatus({
    comingSoon: equipment.comingSoon,
    quantityAvailable: equipment.quantityAvailable,
    lowStockThreshold: equipment.lowStockThreshold,
    reorderLevel: equipment.reorderLevel,
    manualAvailabilityOverride: equipment.manualAvailabilityOverride,
    overrideStatus: equipment.overrideStatus,
  });

  return db.equipmentInventory.update({
    where: { id: equipmentId },
    data: { availabilityStatus },
  });
}

export async function applyStockMovement(input: MovementInput): Promise<EquipmentInventory> {
  return prisma.$transaction(async (tx) => {
    const equipment = await tx.equipmentInventory.findUniqueOrThrow({
      where: { id: input.equipmentId },
    });

    const previousAvailable = equipment.quantityAvailable;
    let quantityAvailable = previousAvailable;
    let quantityReserved = equipment.quantityReserved;
    let quantityTotal = equipment.quantityTotal;
    const qty = Math.abs(input.quantity);

    switch (input.movementType) {
      case "ADDED_STOCK":
        quantityAvailable += qty;
        quantityTotal += input.quantityTotalDelta ?? qty;
        break;
      case "REMOVED_STOCK":
        quantityAvailable = Math.max(0, quantityAvailable - qty);
        quantityTotal = Math.max(0, quantityTotal - (input.quantityTotalDelta ?? qty));
        break;
      case "RESERVED":
        quantityReserved += qty;
        quantityAvailable = Math.max(0, quantityAvailable - qty);
        break;
      case "RELEASED_RESERVATION":
        quantityReserved = Math.max(0, quantityReserved - qty);
        quantityAvailable += qty;
        break;
      case "CHECKED_OUT":
        if (quantityReserved >= qty) {
          quantityReserved -= qty;
        } else {
          quantityAvailable = Math.max(0, quantityAvailable - qty);
        }
        break;
      case "RETURNED":
        quantityAvailable += qty;
        break;
      case "DAMAGED":
        quantityAvailable = Math.max(0, quantityAvailable - qty);
        quantityTotal = Math.max(0, quantityTotal - qty);
        break;
      case "ADJUSTED":
        quantityAvailable = Math.max(0, input.quantity);
        break;
    }

    if (input.quantityReservedDelta !== undefined) {
      quantityReserved = Math.max(0, input.quantityReservedDelta);
    }

    quantityAvailable = Math.min(quantityAvailable, quantityTotal);

    await tx.equipmentInventory.update({
      where: { id: input.equipmentId },
      data: {
        quantityAvailable,
        quantityReserved,
        quantityTotal,
      },
    });

    await tx.equipmentStockMovement.create({
      data: {
        equipmentId: input.equipmentId,
        movementType: input.movementType,
        quantity: qty,
        previousQuantityAvailable: previousAvailable,
        newQuantityAvailable: quantityAvailable,
        reason: input.reason ?? null,
        referenceType: input.referenceType ?? null,
        referenceId: input.referenceId ?? null,
        changedById: input.changedById ?? null,
      },
    });

    return syncEquipmentAvailability(input.equipmentId, tx);
  });
}

export async function reserveEquipmentStock(params: {
  equipmentId: string;
  quantity: number;
  reason: string;
  changedById?: string | null;
  referenceType?: string;
  referenceId?: string;
}) {
  return applyStockMovement({
    equipmentId: params.equipmentId,
    movementType: "RESERVED",
    quantity: params.quantity,
    reason: params.reason,
    changedById: params.changedById,
    referenceType: params.referenceType,
    referenceId: params.referenceId,
  });
}

export async function releaseEquipmentReservation(params: {
  equipmentId: string;
  quantity: number;
  reason: string;
  changedById?: string | null;
  referenceType?: string;
  referenceId?: string;
}) {
  return applyStockMovement({
    equipmentId: params.equipmentId,
    movementType: "RELEASED_RESERVATION",
    quantity: params.quantity,
    reason: params.reason,
    changedById: params.changedById,
    referenceType: params.referenceType,
    referenceId: params.referenceId,
  });
}

export const MOVEMENT_TYPE_LABELS: Record<StockMovementType, string> = {
  ADDED_STOCK: "Added Stock",
  REMOVED_STOCK: "Removed Stock",
  RESERVED: "Reserved",
  RELEASED_RESERVATION: "Released Reservation",
  CHECKED_OUT: "Checked Out",
  RETURNED: "Returned",
  DAMAGED: "Damaged",
  ADJUSTED: "Adjusted",
};

