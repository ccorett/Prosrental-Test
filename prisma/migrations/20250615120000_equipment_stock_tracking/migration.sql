-- Add OUT_OF_STOCK enum value (must be committed before use — this migration is enum-only)
ALTER TYPE "AvailabilityStatus" ADD VALUE IF NOT EXISTS 'OUT_OF_STOCK';
