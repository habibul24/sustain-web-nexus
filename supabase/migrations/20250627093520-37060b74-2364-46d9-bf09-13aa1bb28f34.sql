
-- Create a function to set emission factors based on source of energy
CREATE OR REPLACE FUNCTION public.set_emission_factors()
RETURNS TRIGGER AS $$
BEGIN
  -- Set emission factors for Diesel oil
  IF NEW.source_of_energy = 'Diesel oil' THEN
    NEW.carbon_dioxide_emitted_co2 = 2.614;
    NEW.gwp_co2e = 1;
    NEW.methane_emitted_ch4 = 0.0000239;
    NEW.gwp_methane = 27;
    NEW.nitrous_oxide_emitted_n2o = 0.0000074;
    NEW.gwp_nitrous_oxide = 273;
    NEW.source_of_emission = 'https://www.epd.gov.hk/epd/sites/default/files/epd/gn_pdf/GN2014P097-2014c-e.pdf';
    NEW.emissions_kg_co2 = 7.8499965;
    NEW.emission_factor = 2.6166655;
  END IF;
  
  -- Placeholder for other energy sources (to be added later)
  -- IF NEW.source_of_energy = 'Kerosene' THEN
  --   -- Values to be provided later
  -- END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set emission factors on insert and update
CREATE TRIGGER set_stationary_combustion_emission_factors
  BEFORE INSERT OR UPDATE ON public.stationary_combustion
  FOR EACH ROW
  EXECUTE FUNCTION public.set_emission_factors();
