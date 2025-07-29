-- Manual Migration: Add document photo fields to driver_applications table
-- Run this in your Supabase SQL Editor
-- Date: 2025-01-27

-- Add license_photo column (stores metadata only, not image data)
ALTER TABLE driver_applications 
ADD COLUMN IF NOT EXISTS license_photo JSONB;

-- Add medical_card_photo column (stores metadata only, not image data)
ALTER TABLE driver_applications 
ADD COLUMN IF NOT EXISTS medical_card_photo JSONB;

-- Add comments to document the new columns
COMMENT ON COLUMN driver_applications.license_photo IS 'JSON object containing license photo metadata (url, path, timestamp, filename, etc.) - image data stored in driver-file-documents bucket';
COMMENT ON COLUMN driver_applications.medical_card_photo IS 'JSON object containing medical card photo metadata (url, path, timestamp, filename, etc.) - image data stored in driver-file-documents bucket';

-- Note: Existing signature columns already store metadata only (no data field)
-- This ensures efficient storage and proper separation of concerns

-- Verify the columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'driver_applications' 
AND column_name IN ('license_photo', 'medical_card_photo'); 