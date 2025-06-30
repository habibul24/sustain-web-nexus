
-- Add missing columns to scope2a_electricity table
ALTER TABLE scope2a_electricity 
ADD COLUMN IF NOT EXISTS quantity_used_prior_year NUMERIC,
ADD COLUMN IF NOT EXISTS invoice_file_url TEXT;
