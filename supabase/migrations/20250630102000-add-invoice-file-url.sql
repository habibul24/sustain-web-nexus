
-- Add invoice_file_url column to scope2a_electricity table
ALTER TABLE scope2a_electricity 
ADD COLUMN IF NOT EXISTS invoice_file_url TEXT;
