-- Row Level Security Setup for Driver Qualification Tool
-- Run this script in your Supabase SQL Editor

-- First, let's create the companies table if it doesn't exist
CREATE TABLE IF NOT EXISTS companies (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  domain TEXT UNIQUE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert a default company for testing
INSERT INTO companies (name, slug, domain) 
VALUES ('Default Company', 'default', 'default.local')
ON CONFLICT (slug) DO NOTHING;

-- Create company_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS company_users (
  id BIGSERIAL PRIMARY KEY,
  company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(company_id, email)
);

-- Insert a default admin user for testing
INSERT INTO company_users (company_id, email, role)
SELECT id, 'admin@default.local', 'admin'
FROM companies 
WHERE slug = 'default'
ON CONFLICT (company_id, email) DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE driver_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON driver_applications;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON companies;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON company_users;

-- Create policies for driver_applications table
-- Allow all operations for now (we'll restrict this later when auth is implemented)
CREATE POLICY "Enable all operations for driver_applications" ON driver_applications
  FOR ALL USING (true)
  WITH CHECK (true);

-- Create policies for companies table
CREATE POLICY "Enable all operations for companies" ON companies
  FOR ALL USING (true)
  WITH CHECK (true);

-- Create policies for company_users table
CREATE POLICY "Enable all operations for company_users" ON company_users
  FOR ALL USING (true)
  WITH CHECK (true);

-- Alternative: If you want to restrict by company_id, use this instead:
-- CREATE POLICY "Company isolation for driver_applications" ON driver_applications
--   FOR ALL USING (
--     company_id IN (
--       SELECT company_id FROM company_users 
--       WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
--     )
--   )
--   WITH CHECK (
--     company_id IN (
--       SELECT company_id FROM company_users 
--       WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
--     )
--   );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_driver_applications_company_id ON driver_applications(company_id);
CREATE INDEX IF NOT EXISTS idx_driver_applications_submitted_at ON driver_applications(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_driver_applications_status ON driver_applications(background_check_status);
CREATE INDEX IF NOT EXISTS idx_company_users_company_id ON company_users(company_id);
CREATE INDEX IF NOT EXISTS idx_company_users_email ON company_users(email);

-- Grant necessary permissions
GRANT ALL ON TABLE driver_applications TO anon;
GRANT ALL ON TABLE companies TO anon;
GRANT ALL ON TABLE company_users TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- For development/testing, you might also want to grant to authenticated users
GRANT ALL ON TABLE driver_applications TO authenticated;
GRANT ALL ON TABLE companies TO authenticated;
GRANT ALL ON TABLE company_users TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated; 