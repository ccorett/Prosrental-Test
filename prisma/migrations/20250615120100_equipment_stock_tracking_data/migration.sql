-- CreateEnum
CREATE TYPE "StockMovementType" AS ENUM ('ADDED_STOCK', 'REMOVED_STOCK', 'RESERVED', 'RELEASED_RESERVATION', 'CHECKED_OUT', 'RETURNED', 'DAMAGED', 'ADJUSTED');

-- Migrate legacy OUT_OF_SERVICE availability rows to OUT_OF_STOCK
UPDATE "equipment_inventory"
SET "availability_status" = 'OUT_OF_STOCK'
WHERE "availability_status" = 'OUT_OF_SERVICE';

-- Stock tracking columns
ALTER TABLE "equipment_inventory" ADD COLUMN IF NOT EXISTS "quantity_reserved" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "equipment_inventory" ADD COLUMN IF NOT EXISTS "reorder_level" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "equipment_inventory" ADD COLUMN IF NOT EXISTS "low_stock_threshold" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "equipment_inventory" ADD COLUMN IF NOT EXISTS "manual_availability_override" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "equipment_inventory" ADD COLUMN IF NOT EXISTS "override_status" "AvailabilityStatus";
ALTER TABLE "equipment_inventory" ADD COLUMN IF NOT EXISTS "override_reason" TEXT;
ALTER TABLE "equipment_inventory" ADD COLUMN IF NOT EXISTS "override_by_id" TEXT;
ALTER TABLE "equipment_inventory" ADD COLUMN IF NOT EXISTS "override_at" TIMESTAMP(3);

-- Backfill stock defaults
UPDATE "equipment_inventory"
SET
  "quantity_reserved" = COALESCE("quantity_reserved", 0),
  "reorder_level" = COALESCE(NULLIF("reorder_level", 0), 1),
  "low_stock_threshold" = COALESCE(NULLIF("low_stock_threshold", 0), GREATEST(COALESCE("reorder_level", 1), 1)),
  "quantity_available" = COALESCE("quantity_available", "quantity_total", 0);

-- Recalculate availability from stock (without override)
UPDATE "equipment_inventory"
SET "availability_status" = CASE
  WHEN "manual_availability_override" = true AND "override_status" IS NOT NULL THEN "override_status"
  WHEN "coming_soon" = true THEN 'COMING_SOON'::"AvailabilityStatus"
  WHEN "quantity_available" <= 0 THEN 'OUT_OF_STOCK'::"AvailabilityStatus"
  WHEN "quantity_available" <= "low_stock_threshold" OR "quantity_available" <= "reorder_level" THEN 'RESERVED'::"AvailabilityStatus"
  ELSE 'AVAILABLE'::"AvailabilityStatus"
END;

-- CreateTable
CREATE TABLE "equipment_stock_movements" (
    "id" TEXT NOT NULL,
    "equipment_id" TEXT NOT NULL,
    "movement_type" "StockMovementType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "previous_quantity_available" INTEGER NOT NULL,
    "new_quantity_available" INTEGER NOT NULL,
    "reason" TEXT,
    "reference_type" TEXT,
    "reference_id" TEXT,
    "changed_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "equipment_stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "equipment_stock_movements_equipment_id_idx" ON "equipment_stock_movements"("equipment_id");
CREATE INDEX "equipment_stock_movements_changed_by_id_idx" ON "equipment_stock_movements"("changed_by_id");
CREATE INDEX "equipment_stock_movements_created_at_idx" ON "equipment_stock_movements"("created_at");
CREATE INDEX "equipment_inventory_override_by_id_idx" ON "equipment_inventory"("override_by_id");

-- AddForeignKey
ALTER TABLE "equipment_inventory" ADD CONSTRAINT "equipment_inventory_override_by_id_fkey" FOREIGN KEY ("override_by_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "equipment_stock_movements" ADD CONSTRAINT "equipment_stock_movements_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "equipment_inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "equipment_stock_movements" ADD CONSTRAINT "equipment_stock_movements_changed_by_id_fkey" FOREIGN KEY ("changed_by_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterEnum audit
ALTER TYPE "AuditActionType" ADD VALUE IF NOT EXISTS 'EQUIPMENT_STOCK_CHANGED';
ALTER TYPE "AuditActionType" ADD VALUE IF NOT EXISTS 'EQUIPMENT_OVERRIDE_APPLIED';
ALTER TYPE "AuditActionType" ADD VALUE IF NOT EXISTS 'EQUIPMENT_OVERRIDE_REMOVED';
