
-- Add new columns to scope2a_electricity table for prior year data
ALTER TABLE public.scope2a_electricity 
ADD COLUMN provide_prior_year boolean DEFAULT false,
ADD COLUMN invoice_quantity_prior_year numeric,
ADD COLUMN emission_factor_prior_year numeric,
ADD COLUMN source_of_emission_prior_year text;

-- Update the trigger function to handle both current and prior year emission factors
DROP TRIGGER IF EXISTS set_scope2a_emission_factors_trigger ON public.scope2a_electricity;
DROP FUNCTION IF EXISTS public.set_scope2a_emission_factors();

CREATE OR REPLACE FUNCTION public.set_scope2a_emission_factors()
RETURNS TRIGGER AS $$
BEGIN
  -- Set emission factors for Hong Kong Electric (Current Year 2025)
  IF NEW.source_of_energy = 'Hong Kong Electric' THEN
    NEW.carbon_dioxide_emitted_co2 = 0.6;
    NEW.gwp_co2e = 1;
    NEW.methane_emitted_ch4 = 0;
    NEW.gwp_methane = 27;
    NEW.nitrous_oxide_emitted_n2o = 0;
    NEW.gwp_nitrous_oxide = 273;
    NEW.source_of_emission = 'https://www.hkelectric.com/documents/en/InvestorRelations/InvestorRelations_GLNCS/Documents/2025/ESR2024%20full%20version.pdf';
    NEW.emission_factor = 0.6;
    NEW.emission_factor_prior_year = 0.66;
    NEW.source_of_emission_prior_year = 'https://www.hkelectric.com/documents/en/CorporateSocialResponsibility/CorporateSocialResponsibility_CDD/Documents/SR2023E.pdf';
  END IF;
  
  -- Set emission factors for CLP Power Hong Kong Limited (Current Year 2025)
  IF NEW.source_of_energy = 'CLP Power Hong Kong Limited (CLP)' THEN
    NEW.carbon_dioxide_emitted_co2 = 0.38;
    NEW.gwp_co2e = 1;
    NEW.methane_emitted_ch4 = 0;
    NEW.gwp_methane = 27;
    NEW.nitrous_oxide_emitted_n2o = 0;
    NEW.gwp_nitrous_oxide = 273;
    NEW.source_of_emission = 'https://sustainability.clpgroup.com/en/2024/esg-data-hub';
    NEW.emission_factor = 0.38;
    NEW.emission_factor_prior_year = 0.39;
    NEW.source_of_emission_prior_year = 'https://www.clp.com.cn/wp-content/uploads/2024/03/CLP_Sustainability_Report_2023_en-1.pdf';
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
