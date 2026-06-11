-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'OUT_OF_SERVICE', 'COMING_SOON');

-- CreateTable
CREATE TABLE "equipment_inventory" (
    "id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "equipment_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "daily_rate" DECIMAL(10,2) NOT NULL,
    "weekly_rate" DECIMAL(10,2) NOT NULL,
    "monthly_rate" DECIMAL(10,2) NOT NULL,
    "quantity_available" INTEGER NOT NULL,
    "quantity_total" INTEGER NOT NULL,
    "availability_status" "AvailabilityStatus" NOT NULL DEFAULT 'AVAILABLE',
    "image_url" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "coming_soon" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipment_inventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "equipment_inventory_item_id_key" ON "equipment_inventory"("item_id");

-- CreateIndex
CREATE INDEX "equipment_inventory_category_idx" ON "equipment_inventory"("category");

-- CreateIndex
CREATE INDEX "equipment_inventory_featured_idx" ON "equipment_inventory"("featured");

-- CreateIndex
CREATE INDEX "equipment_inventory_availability_status_idx" ON "equipment_inventory"("availability_status");
