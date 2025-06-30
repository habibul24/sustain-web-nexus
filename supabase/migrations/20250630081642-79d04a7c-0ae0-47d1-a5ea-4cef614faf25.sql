
-- Add the missing columns that the code is trying to use
ALTER TABLE public.scope2a_electricity 
ADD COLUMN IF NOT EXISTS receives_bills_directly text,
ADD COLUMN IF NOT EXISTS organization_area numeric,
ADD COLUMN IF NOT EXISTS total_building_area numeric,
ADD COLUMN IF NOT EXISTS total_building_electricity numeric;
