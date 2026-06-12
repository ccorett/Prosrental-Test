-- Assign drivers to fleet vehicles (additive)
ALTER TABLE "fleet_vehicles" ADD COLUMN IF NOT EXISTS "assigned_driver_id" TEXT;

CREATE INDEX IF NOT EXISTS "fleet_vehicles_assigned_driver_id_idx" ON "fleet_vehicles"("assigned_driver_id");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fleet_vehicles_assigned_driver_id_fkey'
  ) THEN
    ALTER TABLE "fleet_vehicles"
      ADD CONSTRAINT "fleet_vehicles_assigned_driver_id_fkey"
      FOREIGN KEY ("assigned_driver_id") REFERENCES "employees"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
