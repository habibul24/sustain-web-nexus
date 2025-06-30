
-- Add month column and rename service provider column
ALTER TABLE public.scope2a_electricity 
ADD COLUMN month TEXT;

-- Update the function to handle the new column name and remove Towngas
DROP TRIGGER IF EXISTS set_scope2a_emission_factors_trigger ON public.scope2a_electricity;
DROP FUNCTION IF EXISTS public.set_scope2a_emission_factors();

-- Create updated function with new column name and only two providers
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
  
  -- Calculate emissions if quantity is provided
  IF NEW.quantity_used IS NOT NULL AND NEW.emission_factor IS NOT NULL THEN
    NEW.emissions_kg_co2 = NEW.quantity_used * NEW.emission_factor;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger
CREATE TRIGGER set_scope2a_emission_factors_trigger
  BEFORE INSERT OR UPDATE ON public.scope2a_electricity
  FOR EACH ROW
  EXECUTE FUNCTION public.set_scope2a_emission_factors();
