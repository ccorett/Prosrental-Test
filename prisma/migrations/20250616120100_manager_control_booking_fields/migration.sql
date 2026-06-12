ALTER TABLE "booking_requests" ADD COLUMN IF NOT EXISTS "scheduled_at" TIMESTAMP(3);
ALTER TABLE "booking_requests" ADD COLUMN IF NOT EXISTS "approved_by_id" TEXT;
ALTER TABLE "booking_requests" ADD COLUMN IF NOT EXISTS "approved_at" TIMESTAMP(3);
ALTER TABLE "booking_requests" ADD COLUMN IF NOT EXISTS "manager_notes" TEXT;

CREATE INDEX IF NOT EXISTS "booking_requests_approved_by_id_idx" ON "booking_requests"("approved_by_id");

ALTER TABLE "booking_requests"
  ADD CONSTRAINT "booking_requests_approved_by_id_fkey"
  FOREIGN KEY ("approved_by_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
