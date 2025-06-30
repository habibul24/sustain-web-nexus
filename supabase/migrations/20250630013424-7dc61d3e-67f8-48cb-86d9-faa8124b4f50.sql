
-- Create table for scope 2a electricity emissions data
CREATE TABLE public.scope2a_electricity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_of_energy TEXT NOT NULL,
  unit_of_measurement TEXT NOT NULL,
  quantity_used NUMERIC,
  last_year_emission_figures NUMERIC,
  carbon_dioxide_emitted_co2 NUMERIC DEFAULT 0,
  gwp_co2e NUMERIC DEFAULT 0,
  methane_emitted_ch4 NUMERIC DEFAULT 0,
  gwp_methane NUMERIC DEFAULT 0,
  nitrous_oxide_emitted_n2o NUMERIC DEFAULT 0,
  gwp_nitrous_oxide NUMERIC DEFAULT 0,
  source_of_emission TEXT,
  emissions_kg_co2 NUMERIC DEFAULT 0,
  emission_factor NUMERIC,
  assessment_period_start DATE,
  assessment_period_end DATE,
  is_applicable BOOLEAN DEFAULT true,
  data_source TEXT DEFAULT 'manual',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scope2a_electricity ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can manage their own scope2a electricity data" 
ON public.scope2a_electricity
FOR ALL 
USING (auth.uid() = user_id);

-- Create function to set emission factors for scope 2a electricity
CREATE OR REPLACE FUNCTION public.set_scope2a_emission_factors()
RETURNS TRIGGER AS $$
BEGIN
  -- Set emission factors for Hong Kong Electric
  IF NEW.source_of_energy = 'Hong Kong Electric' THEN
    NEW.carbon_dioxide_emitted_co2 = 0.66;
    NEW.gwp_co2e = 1;
    NEW.methane_emitted_ch4 = 0;
    NEW.gwp_methane = 27;
    NEW.nitrous_oxide_emitted_n2o = 0;
    NEW.gwp_nitrous_oxide = 273;
    NEW.source_of_emission = 'https://www.hkelectric.com/documents/en/CorporateSocialResponsibility/CorporateSocialResponsibility_CDD/Documents/SR2023E.pdf';
    NEW.emission_factor = 0.66;
  END IF;
  
  -- Set emission factors for CLP Power Hong Kong Limited
  IF NEW.source_of_energy = 'CLP Power Hong Kong Limited (CLP)' THEN
    NEW.carbon_dioxide_emitted_co2 = 0.39;
    NEW.gwp_co2e = 1;
    NEW.methane_emitted_ch4 = 0;
    NEW.gwp_methane = 27;
    NEW.nitrous_oxide_emitted_n2o = 0;
    NEW.gwp_nitrous_oxide = 273;
    NEW.source_of_emission = 'https://www.clp.com.cn/wp-content/uploads/2024/03/CLP_Sustainability_Report_2023_en-1.pdf';
    NEW.emission_factor = 0.39;
  END IF;
  
  -- Set emission factors for Towngas
  IF NEW.source_of_energy = 'Towngas' THEN
    NEW.carbon_dioxide_emitted_co2 = 0.549;
    NEW.gwp_co2e = 1;
    NEW.methane_emitted_ch4 = 0;
    NEW.gwp_methane = 27;
    NEW.nitrous_oxide_emitted_n2o = 0;
    NEW.gwp_nitrous_oxide = 273;
    NEW.source_of_emission = 'https://www.towngas.com/getmedia/a9199ca1-aad2-446d-a5ee-be0427eda686/Annual-Report-2023-E.pdf.aspx?ext=.pdf';
    NEW.emission_factor = 0.549;
  END IF;
  
  -- Calculate emissions if quantity is provided
  IF NEW.quantity_used IS NOT NULL AND NEW.emission_factor IS NOT NULL THEN
    NEW.emissions_kg_co2 = NEW.quantity_used * NEW.emission_factor;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic emission factor setting
CREATE TRIGGER set_scope2a_emission_factors_trigger
  BEFORE INSERT OR UPDATE ON public.scope2a_electricity
  FOR EACH ROW
  EXECUTE FUNCTION public.set_scope2a_emission_factors();

-- Add trigger for updated_at
CREATE TRIGGER update_scope2a_electricity_updated_at
  BEFORE UPDATE ON public.scope2a_electricity
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
