
-- Add new columns to user_profiles table for office locations and subsidiaries
ALTER TABLE public.user_profiles 
ADD COLUMN has_multiple_locations boolean DEFAULT false,
ADD COLUMN office_locations jsonb DEFAULT '[]'::jsonb,
ADD COLUMN has_subsidiaries boolean DEFAULT false,
ADD COLUMN number_of_subsidiaries integer,
ADD COLUMN gathering_data_via_app boolean DEFAULT false;

-- Create a table to store office locations details
CREATE TABLE public.office_locations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  address text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for office_locations
ALTER TABLE public.office_locations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for office_locations
CREATE POLICY "Users can manage their own office locations" 
ON public.office_locations
FOR ALL 
USING (auth.uid() = user_id);

-- Add trigger to update updated_at column
CREATE TRIGGER update_office_locations_updated_at
  BEFORE UPDATE ON public.office_locations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update scope2a_electricity table to include office location
ALTER TABLE public.scope2a_electricity 
ADD COLUMN office_location_id uuid REFERENCES public.office_locations(id) ON DELETE CASCADE;
