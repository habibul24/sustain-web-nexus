
-- Create table for Scope 1.a) Stationary Combustion data
CREATE TABLE public.stationary_combustion (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  source_of_energy TEXT NOT NULL CHECK (source_of_energy IN ('Diesel oil', 'Kerosene', 'Liquefied Petroleum Gas', 'Charcoal', 'Towngas')),
  quantity_used NUMERIC(15,4) NOT NULL CHECK (quantity_used >= 0),
  last_year_emission_figures NUMERIC(15,4) CHECK (last_year_emission_figures >= 0),
  unit_of_measurement TEXT NOT NULL CHECK (unit_of_measurement IN ('Kg', 'Litres', 'Units')),
  carbon_dioxide_emitted_co2 NUMERIC(15,6) DEFAULT 0,
  gwp_co2e NUMERIC(15,6) DEFAULT 0,
  methane_emitted_ch4 NUMERIC(15,6) DEFAULT 0,
  gwp_methane NUMERIC(15,6) DEFAULT 0,
  nitrous_oxide_emitted_n2o NUMERIC(15,6) DEFAULT 0,
  gwp_nitrous_oxide NUMERIC(15,6) DEFAULT 0,
  source_of_emission TEXT,
  emissions_kg_co2 NUMERIC(15,6) DEFAULT 0,
  emission_factor NUMERIC(15,6), -- Emission factor used for calculations
  assessment_period_start DATE,
  assessment_period_end DATE,
  notes TEXT,
  data_source TEXT DEFAULT 'manual',
  is_applicable BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.stationary_combustion ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view their own data
CREATE POLICY "Users can view their own stationary combustion data" 
  ON public.stationary_combustion 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to insert their own data
CREATE POLICY "Users can create their own stationary combustion data" 
  ON public.stationary_combustion 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to update their own data
CREATE POLICY "Users can update their own stationary combustion data" 
  ON public.stationary_combustion 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to delete their own data
CREATE POLICY "Users can delete their own stationary combustion data" 
  ON public.stationary_combustion 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add trigger to update the updated_at column
CREATE TRIGGER update_stationary_combustion_updated_at
  BEFORE UPDATE ON public.stationary_combustion
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for better query performance
CREATE INDEX idx_stationary_combustion_user_id ON public.stationary_combustion(user_id);
CREATE INDEX idx_stationary_combustion_source ON public.stationary_combustion(source_of_energy);
