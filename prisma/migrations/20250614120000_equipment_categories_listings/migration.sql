-- CreateEnum
CREATE TYPE "ConditionStatus" AS ENUM ('NEW', 'GOOD', 'FAIR', 'NEEDS_REPAIR', 'OUT_OF_SERVICE');

-- AlterEnum
ALTER TYPE "EmployeeModule" ADD VALUE 'EQUIPMENT_LISTINGS';

-- AlterEnum
ALTER TYPE "AuditActionType" ADD VALUE 'EQUIPMENT_LISTING_CREATED';
ALTER TYPE "AuditActionType" ADD VALUE 'EQUIPMENT_LISTING_UPDATED';
ALTER TYPE "AuditActionType" ADD VALUE 'EQUIPMENT_LISTING_ARCHIVED';
ALTER TYPE "AuditActionType" ADD VALUE 'EQUIPMENT_LISTING_DELETED';

-- CreateTable
CREATE TABLE "equipment_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "image_url" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipment_categories_pkey" PRIMARY KEY ("id")
);

-- Seed default categories
INSERT INTO "equipment_categories" ("id", "name", "slug", "description", "display_order", "active", "created_at", "updated_at")
VALUES
  ('cat_cleaning', 'Cleaning Equipment', 'cleaning', 'Pressure washers, scrubbers, and site cleaning tools.', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat_construction', 'Construction Equipment', 'construction', 'Mixers, compactors, and heavy-duty site equipment.', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat_diy', 'DIY Tools', 'diy', 'Drills, saws, and homeowner-friendly rental tools.', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat_landscaping', 'Landscaping Equipment', 'landscaping', 'Mowers, trimmers, and outdoor maintenance gear.', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat_access', 'Access Equipment', 'access', 'Scaffolding, ladders, and elevated work platforms.', 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat_sanitation', 'Sanitation & Hygiene Equipment', 'sanitation', 'Portable sanitation and hygiene solutions.', 6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat_event', 'Event & Site Facilities', 'event', 'Fencing, lighting, and temporary site facilities.', 7, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Add new columns to equipment_inventory (nullable first for backfill)
ALTER TABLE "equipment_inventory" ADD COLUMN "category_id" TEXT;
ALTER TABLE "equipment_inventory" ADD COLUMN "slug" TEXT;
ALTER TABLE "equipment_inventory" ADD COLUMN "short_description" TEXT;
ALTER TABLE "equipment_inventory" ADD COLUMN "full_description" TEXT;
ALTER TABLE "equipment_inventory" ADD COLUMN "specifications" TEXT;
ALTER TABLE "equipment_inventory" ADD COLUMN "deposit_amount" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "equipment_inventory" ADD COLUMN "condition_status" "ConditionStatus" NOT NULL DEFAULT 'GOOD';
ALTER TABLE "equipment_inventory" ADD COLUMN "gallery_images" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "equipment_inventory" ADD COLUMN "public_visible" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "equipment_inventory" ADD COLUMN "sort_order" INTEGER NOT NULL DEFAULT 0;

-- Backfill category_id from legacy category label
UPDATE "equipment_inventory" SET "category_id" = 'cat_cleaning' WHERE "category" = 'Cleaning Equipment';
UPDATE "equipment_inventory" SET "category_id" = 'cat_construction' WHERE "category" = 'Construction Equipment';
UPDATE "equipment_inventory" SET "category_id" = 'cat_diy' WHERE "category" = 'DIY Tools';
UPDATE "equipment_inventory" SET "category_id" = 'cat_landscaping' WHERE "category" = 'Landscaping Equipment';
UPDATE "equipment_inventory" SET "category_id" = 'cat_access' WHERE "category" = 'Access Equipment';
UPDATE "equipment_inventory" SET "category_id" = 'cat_sanitation' WHERE "category" = 'Sanitation & Hygiene Equipment';
UPDATE "equipment_inventory" SET "category_id" = 'cat_event' WHERE "category" = 'Event & Site Facilities';

-- Fallback for any unmapped rows
UPDATE "equipment_inventory" SET "category_id" = 'cat_diy' WHERE "category_id" IS NULL;

-- Backfill slug and descriptions
UPDATE "equipment_inventory"
SET
  "slug" = LOWER(REPLACE("item_id", ' ', '-')),
  "full_description" = "description",
  "short_description" = LEFT("description", 200);

-- Ensure unique slugs when duplicates exist
UPDATE "equipment_inventory" e
SET "slug" = e."slug" || '-' || SUBSTRING(e."id", 1, 6)
WHERE e."id" IN (
  SELECT e2."id"
  FROM "equipment_inventory" e2
  INNER JOIN (
    SELECT "slug" FROM "equipment_inventory" GROUP BY "slug" HAVING COUNT(*) > 1
  ) dup ON dup."slug" = e2."slug"
);

-- Make category_id and slug required
ALTER TABLE "equipment_inventory" ALTER COLUMN "category_id" SET NOT NULL;
ALTER TABLE "equipment_inventory" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "equipment_categories_slug_key" ON "equipment_categories"("slug");
CREATE INDEX "equipment_categories_active_display_order_idx" ON "equipment_categories"("active", "display_order");

CREATE UNIQUE INDEX "equipment_inventory_slug_key" ON "equipment_inventory"("slug");
CREATE INDEX "equipment_inventory_category_id_idx" ON "equipment_inventory"("category_id");
CREATE INDEX "equipment_inventory_public_visible_idx" ON "equipment_inventory"("public_visible");
CREATE INDEX "equipment_inventory_sort_order_idx" ON "equipment_inventory"("sort_order");

-- AddForeignKey
ALTER TABLE "equipment_inventory" ADD CONSTRAINT "equipment_inventory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "equipment_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
