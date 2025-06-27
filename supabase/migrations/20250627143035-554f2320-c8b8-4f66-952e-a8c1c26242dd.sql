
-- Create table for Scope 1.b) Process Emissions data
CREATE TABLE public.process_emissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  source_of_energy TEXT NOT NULL,
  quantity_used NUMERIC(15,4) CHECK (quantity_used >= 0),
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

-- Add Row Level Security (RLS) for process_emissions
ALTER TABLE public.process_emissions ENABLE ROW LEVEL SECURITY;

-- Create policies for process_emissions
CREATE POLICY "Users can view their own process emissions data" 
  ON public.process_emissions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own process emissions data" 
  ON public.process_emissions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own process emissions data" 
  ON public.process_emissions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own process emissions data" 
  ON public.process_emissions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add trigger to update the updated_at column for process_emissions
CREATE TRIGGER update_process_emissions_updated_at
  BEFORE UPDATE ON public.process_emissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better query performance
CREATE INDEX idx_process_emissions_user_id ON public.process_emissions(user_id);
CREATE INDEX idx_process_emissions_source ON public.process_emissions(source_of_energy);

-- Create table for Scope 1.d) Refrigerant Emissions data
CREATE TABLE public.refrigerant_emissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  refrigerant_type TEXT NOT NULL,
  quantity_used NUMERIC(15,4) CHECK (quantity_used >= 0),
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

-- Add Row Level Security (RLS) for refrigerant_emissions
ALTER TABLE public.refrigerant_emissions ENABLE ROW LEVEL SECURITY;

-- Create policies for refrigerant_emissions
CREATE POLICY "Users can view their own refrigerant emissions data" 
  ON public.refrigerant_emissions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own refrigerant emissions data" 
  ON public.refrigerant_emissions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own refrigerant emissions data" 
  ON public.refrigerant_emissions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own refrigerant emissions data" 
  ON public.refrigerant_emissions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add trigger to update the updated_at column for refrigerant_emissions
CREATE TRIGGER update_refrigerant_emissions_updated_at
  BEFORE UPDATE ON public.refrigerant_emissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better query performance
CREATE INDEX idx_refrigerant_emissions_user_id ON public.refrigerant_emissions(user_id);
CREATE INDEX idx_refrigerant_emissions_type ON public.refrigerant_emissions(refrigerant_type);
