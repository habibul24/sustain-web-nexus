
-- Update the function to include all emission factors
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
  
  -- Set emission factors for Kerosene
  IF NEW.source_of_energy = 'Kerosene' THEN
    NEW.carbon_dioxide_emitted_co2 = 2.429;
    NEW.gwp_co2e = 1;
    NEW.methane_emitted_ch4 = 0.0000241;
    NEW.gwp_methane = 27;
    NEW.nitrous_oxide_emitted_n2o = 0.0000076;
    NEW.gwp_nitrous_oxide = 273;
    NEW.source_of_emission = 'https://www.epd.gov.hk/epd/sites/default/files/epd/gn_pdf/GN2014P097-2014c-e.pdf';
    NEW.emissions_kg_co2 = 486.3451;
    NEW.emission_factor = 2.4317255;
  END IF;
  
  -- Set emission factors for Liquefied Petroleum Gas
  IF NEW.source_of_energy = 'Liquefied Petroleum Gas' THEN
    NEW.carbon_dioxide_emitted_co2 = 3.017;
    NEW.gwp_co2e = 1;
    NEW.methane_emitted_ch4 = 0.000002;
    NEW.gwp_methane = 27;
    NEW.nitrous_oxide_emitted_n2o = 0;
    NEW.gwp_nitrous_oxide = 273;
    NEW.source_of_emission = 'https://www.epd.gov.hk/epd/sites/default/files/epd/gn_pdf/GN2014P097-2014c-e.pdf';
    NEW.emissions_kg_co2 = 9.051162;
    NEW.emission_factor = 3.017054;
  END IF;
  
  -- Set emission factors for Charcoal
  IF NEW.source_of_energy = 'Charcoal' THEN
    NEW.carbon_dioxide_emitted_co2 = 2.97;
    NEW.gwp_co2e = 1;
    NEW.methane_emitted_ch4 = 0.005529;
    NEW.gwp_methane = 27;
    NEW.nitrous_oxide_emitted_n2o = 0.0000276;
    NEW.gwp_nitrous_oxide = 273;
    NEW.source_of_emission = 'https://www.epd.gov.hk/epd/sites/default/files/epd/gn_pdf/GN2014P097-2014c-e.pdf';
    NEW.emissions_kg_co2 = 625.36356;
    NEW.emission_factor = 3.1268178;
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
    NEW.emissions_kg_co2 = 0;
    NEW.emission_factor = 0.549;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
