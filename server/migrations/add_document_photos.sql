-- Migration: Add document photo fields to driver_applications table
-- Date: 2025-01-27
-- Description: Adds license_photo and medical_card_photo columns to store document photos

-- Add license_photo column
ALTER TABLE driver_applications 
ADD COLUMN license_photo JSONB;

-- Add medical_card_photo column  
ALTER TABLE driver_applications 
ADD COLUMN medical_card_photo JSONB;

-- Add comments to document the new columns
COMMENT ON COLUMN driver_applications.license_photo IS 'JSON object containing license photo data, URL, and metadata';
COMMENT ON COLUMN driver_applications.medical_card_photo IS 'JSON object containing medical card photo data, URL, and metadata'; 