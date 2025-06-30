
-- Add new columns to scope2a_electricity table
ALTER TABLE public.scope2a_electricity 
ADD COLUMN receives_bills_directly text,
ADD COLUMN organization_area numeric,
ADD COLUMN total_building_area numeric,
ADD COLUMN total_building_electricity numeric;
