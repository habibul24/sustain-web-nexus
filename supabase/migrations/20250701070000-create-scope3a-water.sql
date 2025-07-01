-- Create scope3a_water table for water consumption data
CREATE TABLE public.scope3a_water (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  office_location_id UUID REFERENCES public.office_locations(id),
  month TEXT,
  quantity_used NUMERIC,
  unit_of_measurement TEXT DEFAULT 'm³',
  emission_factor NUMERIC DEFAULT 0.298,
  emissions_kg_co2 NUMERIC DEFAULT 0,
  source_of_emission TEXT DEFAULT 'https://www.epa.gov/climateleadership/ghg-emission-factors-hub',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scope3a_water ENABLE ROW LEVEL SECURITY;

-- Create policies for scope3a_water table
CREATE POLICY "Users can view their own water data" ON public.scope3a_water FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own water data" ON public.scope3a_water FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own water data" ON public.scope3a_water FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own water data" ON public.scope3a_water FOR DELETE USING (auth.uid() = user_id);

-- Create function to calculate water emissions
CREATE OR REPLACE FUNCTION public.calculate_water_emissions()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Calculate emissions: quantity * emission factor
  IF NEW.quantity_used IS NOT NULL AND NEW.emission_factor IS NOT NULL THEN
    NEW.emissions_kg_co2 = NEW.quantity_used * NEW.emission_factor;
  ELSE
    NEW.emissions_kg_co2 = 0;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for water emissions calculation
CREATE TRIGGER calculate_water_emissions_trigger
  BEFORE INSERT OR UPDATE ON public.scope3a_water
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_water_emissions();

-- Add updated_at trigger for scope3a_water table
CREATE TRIGGER update_scope3a_water_updated_at
  BEFORE UPDATE ON public.scope3a_water
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column(); 