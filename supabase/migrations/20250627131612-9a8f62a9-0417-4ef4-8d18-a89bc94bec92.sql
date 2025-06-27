
-- Create table for Scope 1.c) Mobile Combustion data
CREATE TABLE public.mobile_combustion (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  vehicle_no TEXT,
  vehicle_fuel_type TEXT NOT NULL CHECK (vehicle_fuel_type IN (
    'Motorcycle - Unleaded petrol',
    'Passenger Car - Unleaded petrol',
    'Passenger Car - Diesel oil',
    'Private Van - Unleaded petrol',
    'Private Van - Diesel oil',
    'Private Van - Liquefied Petroleum Gas',
    'Public light bus - Unleaded petrol',
    'Public light bus - Diesel oil',
    'Public light bus - Liquefied Petroleum Gas',
    'Light Goods Vehicle - Unleaded petrol',
    'Light Goods Vehicle - Diesel oil',
    'Heavy goods vehicle - Diesel oil',
    'Medium goods vehicle - Diesel oil',
    'Ships - Gas Oil',
    'Aviation - Jet Kerosene',
    'Others - Unleaded petrol',
    'Others - Diesel oil',
    'Others - Liquefied Petroleum Gas',
    'Others - Kerosene'
  )),
  fuel_per_vehicle NUMERIC(15,4) CHECK (fuel_per_vehicle >= 0),
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
ALTER TABLE public.mobile_combustion ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view their own data
CREATE POLICY "Users can view their own mobile combustion data" 
  ON public.mobile_combustion 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to insert their own data
CREATE POLICY "Users can create their own mobile combustion data" 
  ON public.mobile_combustion 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to update their own data
CREATE POLICY "Users can update their own mobile combustion data" 
  ON public.mobile_combustion 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to delete their own data
CREATE POLICY "Users can delete their own mobile combustion data" 
  ON public.mobile_combustion 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add trigger to update the updated_at column
CREATE TRIGGER update_mobile_combustion_updated_at
  BEFORE UPDATE ON public.mobile_combustion
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for better query performance
CREATE INDEX idx_mobile_combustion_user_id ON public.mobile_combustion(user_id);
CREATE INDEX idx_mobile_combustion_vehicle_type ON public.mobile_combustion(vehicle_fuel_type);

-- Create function to set emission factors based on vehicle fuel type
CREATE OR REPLACE FUNCTION public.set_mobile_emission_factors()
RETURNS TRIGGER AS $$
BEGIN
  -- Set emission factors for Motorcycle - Unleaded petrol
  IF NEW.vehicle_fuel_type = 'Motorcycle - Unleaded petrol' THEN
    NEW.carbon_dioxide_emitted_co2 = 2.36;
    NEW.gwp_co2e = 1;
    NEW.methane_emitted_ch4 = 0.001422;
    NEW.gwp_methane = 27;
    NEW.nitrous_oxide_emitted_n2o = 0.000046;
    NEW.gwp_nitrous_oxide = 273;
    NEW.source_of_emission = 'https://www.epd.gov.hk/epd/sites/default/files/epd/gn_pdf/GN2014P097-2014c-e.pdf';
    NEW.emissions_kg_co2 = 0;
    NEW.emission_factor = 2.410952;
  END IF;
  
  -- Set emission factors for Passenger Car - Unleaded petrol
  IF NEW.vehicle_fuel_type = 'Passenger Car - Unleaded petrol' THEN
    NEW.carbon_dioxide_emitted_co2 = 2.36;
    NEW.gwp_co2e = 1;
    NEW.methane_emitted_ch4 = 0.000253;
    NEW.gwp_methane = 27;
    NEW.nitrous_oxide_emitted_n2o = 0.001105;
    NEW.gwp_nitrous_oxide = 273;
    NEW.source_of_emission = 'https://www.epd.gov.hk/epd/sites/default/files/epd/gn_pdf/GN2014P097-2014c-e.pdf';
    NEW.emissions_kg_co2 = 0;
    NEW.emission_factor = 2.668496;
  END IF;
  
  -- Set emission factors for Passenger Car - Diesel oil
  IF NEW.vehicle_fuel_type = 'Passenger Car - Diesel oil' THEN
    NEW.carbon_dioxide_emitted_co2 = 2.614;
    NEW.gwp_co2e = 1;
    NEW.methane_emitted_ch4 = 0.000072;
    NEW.gwp_methane = 27;
    NEW.nitrous_oxide_emitted_n2o = 0.00011;
    NEW.gwp_nitrous_oxide = 273;
    NEW.source_of_emission = 'https://www.epd.gov.hk/epd/sites/default/files/epd/gn_pdf/GN2014P097-2014c-e.pdf';
    NEW.emissions_kg_co2 = 0;
    NEW.emission_factor = 2.645974;
  END IF;
  
  -- Set emission factors for Private Van - Unleaded petrol
  IF NEW.vehicle_fuel_type = 'Private Van - Unleaded petrol' THEN
    NEW.carbon_dioxide_emitted_co2 = 2.36;
    NEW.gwp_co2e = 1;
    NEW.methane_emitted_ch4 = 0.000203;
    NEW.gwp_methane = 27;
    NEW.nitrous_oxide_emitted_n2o = 0.00114;
    NEW.gwp_nitrous_oxide = 273;
    NEW.source_of_emission = 'https://www.epd.gov.hk/epd/sites/default/files/epd/gn_pdf/GN2014P097-2014c-e.pdf';
    NEW.emissions_kg_co2 = 0;
    NEW.emission_factor = 2.676701;
  END IF;
  
  -- Set emission factors for Private Van - Diesel oil
  IF NEW.vehicle_fuel_type = 'Private Van - Diesel oil' THEN
    NEW.carbon_dioxide_emitted_co2 = 2.614;
    NEW.gwp_co2e = 1;
    NEW.methane_emitted_ch4 = 0.000072;
    NEW.gwp_methane = 27;
    NEW.nitrous_oxide_emitted_n2o = 0.000506;
    NEW.gwp_nitrous_oxide = 273;
    NEW.source_of_emission = 'https://www.epd.gov.hk/epd/sites/default/files/epd/gn_pdf/GN2014P097-2014c-e.pdf';
    NEW.emissions_kg_co2 = 0;
    NEW.emission_factor = 2.754082;
  END IF;
  
  -- Set emission factors for Private Van - Liquefied Petroleum Gas
  IF NEW.vehicle_fuel_type = 'Private Van - Liquefied Petroleum Gas' THEN
    NEW.carbon_dioxide_emitted_co2 = 1.679;
    NEW.gwp_co2e = 1;
    NEW.methane_emitted_ch4 = 0.000248;
    NEW.gwp_methane = 27;
    NEW.nitrous_oxide_emitted_n2o = 0;
    NEW.gwp_nitrous_oxide = 273;
    NEW.source_of_emission = 'https://www.epd.gov.hk/epd/sites/default/files/epd/gn_pdf/GN2014P097-2014c-e.pdf';
    NEW.emissions_kg_co2 = 0;
    NEW.emission_factor = 1.685696;
  END IF;
  
  -- Set emission factors for Public light bus - Unleaded petrol
  IF NEW.vehicle_fuel_type = 'Public light bus - Unleaded petrol' THEN
    NEW.carbon_dioxide_emitted_co2 = 2.614;
    NEW.gwp_co2e = 1;
    NEW.methane_emitted_ch4 = 0.000072;
    NEW.gwp_methane = 27;
    NEW.nitrous_oxide_emitted_n2o = 0.000506;
    NEW.gwp_nitrous_oxide = 273;
    NEW.source_of_emission = 'https://www.epd.gov.hk/epd/sites/default/files/epd/gn_pdf/GN2014P097-2014c-e.pdf';
    NEW.emissions_kg_co2 = 0;
    NEW.emission_factor = 2.754082;
  END IF;
  
  -- Set emission factors for Public light bus - Diesel oil
  IF NEW.vehicle_fuel_type = 'Public light bus - Diesel oil' THEN
    NEW.carbon_dioxide_emitted_co2 = 1.679;
    NEW.gwp_co2e = 1;
    NEW.methane_emitted_ch4 = 0.000248;
    NEW.gwp_methane = 27;
    NEW.nitrous_oxide_emitted_n2o = 0;
    NEW.gwp_nitrous_oxide = 273;
    NEW.source_of_emission = 'https://www.epd.gov.hk/epd/sites/default/files/epd/gn_pdf/GN2014P097-2014c-e.pdf';
    NEW.emissions_kg_co2 = 0;
    NEW.emission_factor = 1.685696;
  END IF;
  
  -- Set emission factors for Public light bus - Liquefied Petroleum Gas
  IF NEW.vehicle_fuel_type = 'Public light bus - Liquefied Petroleum Gas' THEN
    NEW.carbon_dioxide_emitted_co2 = 3.017;
    NEW.gwp_co2e = 1;
    NEW.methane_emitted_ch4 = 0.000248;
    NEW.gwp_methane = 27;
    NEW.nitrous_oxide_emitted_n2o = 0;
    NEW.gwp_nitrous_oxide = 273;
    NEW.source_of_emission = 'https://www.epd.gov.hk/epd/sites/default/files/epd/gn_pdf/GN2014P097-2014c-e.pdf';
    NEW.emissions_kg_co2 = 0;
    NEW.emission_factor = 3.023696;
  END IF;
  
  -- Set emission factors for Light Goods Vehicle - Unleaded petrol
  IF NEW.vehicle_fuel_type = 'Light Goods Vehicle - Unleaded petrol' THEN
    NEW.carbon_dioxide_emitted_co2 = 2.36;
    NEW.gwp_co2e = 1;
    NEW.methane_emitted_ch4 = 0.000203;
    NEW.gwp_methane = 27;
    NEW.nitrous_oxide_emitted_n2o = 0.001105;
    NEW.gwp_nitrous_oxide = 273;
    NEW.source_of_emission = 'https://www.epd.gov.hk/epd/sites/default/files/epd/gn_pdf/GN2014P097-2014c-e.pdf';
    NEW.emissions_kg_co2 = 0;
    NEW.emission_factor = 2.667146;
  END IF;
  
  -- Set emission factors for Light Goods Vehicle - Diesel oil
  IF NEW.vehicle_fuel_type = 'Light Goods Vehicle - Diesel oil' THEN
    NEW.carbon_dioxide_emitted_co2 = 2.614;
    NEW.gwp_co2e = 1;
    NEW.methane_emitted_ch4 = 0.000072;
    NEW.gwp_methane = 27;
    NEW.nitrous_oxide_emitted_n2o = 0.000506;
    NEW.gwp_nitrous_oxide = 273;
    NEW.source_of_emission = 'https://www.epd.gov.hk/epd/sites/default/files/epd/gn_pdf/GN2014P097-2014c-e.pdf';
    NEW.emissions_kg_co2 = 0;
    NEW.emission_factor = 2.754082;
  END IF;
  
  -- Set emission factors for Heavy goods vehicle - Diesel oil
  IF NEW.vehicle_fuel_type = 'Heavy goods vehicle - Diesel oil' THEN
    NEW.carbon_dioxide_emitted_co2 = 2.614;
    NEW.gwp_co2e = 1;
    NEW.methane_emitted_ch4 = 0.0000145;
    NEW.gwp_methane = 27;
    NEW.nitrous_oxide_emitted_n2o = 0.000072;
    NEW.gwp_nitrous_oxide = 273;
    NEW.source_of_emission = 'https://www.epd.gov.hk/epd/sites/default/files/epd/gn_pdf/GN2014P097-2014c-e.pdf';
    NEW.emissions_kg_co2 = 0;
    NEW.emission_factor = 2.6340475;
  END IF;
  
  -- Set emission factors for Medium goods vehicle - Diesel oil
  IF NEW.vehicle_fuel_type = 'Medium goods vehicle - Diesel oil' THEN
    NEW.carbon_dioxide_emitted_co2 = 2.614;
    NEW.gwp_co2e = 1;
    NEW.methane_emitted_ch4 = 0.0000145;
    NEW.gwp_methane = 27;
    NEW.nitrous_oxide_emitted_n2o = 0.000072;
    NEW.gwp_nitrous_oxide = 273;
    NEW.source_of_emission = 'https://www.epd.gov.hk/epd/sites/default/files/epd/gn_pdf/GN2014P097-2014c-e.pdf';
    NEW.emissions_kg_co2 = 0;
    NEW.emission_factor = 2.6340475;
  END IF;
  
  -- Set emission factors for Ships - Gas Oil
  IF NEW.vehicle_fuel_type = 'Ships - Gas Oil' THEN
    NEW.carbon_dioxide_emitted_co2 = 2.645;
    NEW.gwp_co2e = 1;
    NEW.methane_emitted_ch4 = 0.0000146;
    NEW.gwp_methane = 27;
    NEW.nitrous_oxide_emitted_n2o = 0.001095;
    NEW.gwp_nitrous_oxide = 273;
    NEW.source_of_emission = 'https://www.epd.gov.hk/epd/sites/default/files/epd/gn_pdf/GN2014P097-2014c-e.pdf';
    NEW.emissions_kg_co2 = 0;
    NEW.emission_factor = 2.9443292;
  END IF;
  
  -- Set emission factors for Aviation - Jet Kerosene
  IF NEW.vehicle_fuel_type = 'Aviation - Jet Kerosene' THEN
    NEW.carbon_dioxide_emitted_co2 = 2.429;
    NEW.gwp_co2e = 1;
    NEW.methane_emitted_ch4 = 0.000069;
    NEW.gwp_methane = 27;
    NEW.nitrous_oxide_emitted_n2o = 0;
    NEW.gwp_nitrous_oxide = 273;
    NEW.source_of_emission = 'https://www.epd.gov.hk/epd/sites/default/files/epd/gn_pdf/GN2014P097-2014c-e.pdf';
    NEW.emissions_kg_co2 = 0;
    NEW.emission_factor = 2.430863;
  END IF;
  
  -- Set emission factors for Others - Unleaded petrol
  IF NEW.vehicle_fuel_type = 'Others - Unleaded petrol' THEN
    NEW.carbon_dioxide_emitted_co2 = 2.614;
    NEW.gwp_co2e = 1;
    NEW.methane_emitted_ch4 = 0.0239;
    NEW.gwp_methane = 27;
    NEW.nitrous_oxide_emitted_n2o = 0.000007;
    NEW.gwp_nitrous_oxide = 273;
    NEW.source_of_emission = 'https://www.epd.gov.hk/epd/sites/default/files/epd/gn_pdf/GN2014P097-2014c-e.pdf';
    NEW.emissions_kg_co2 = 0;
    NEW.emission_factor = 3.261211;
  END IF;
  
  -- Set emission factors for Others - Diesel oil
  IF NEW.vehicle_fuel_type = 'Others - Diesel oil' THEN
    NEW.carbon_dioxide_emitted_co2 = 1.679;
    NEW.gwp_co2e = 1;
    NEW.methane_emitted_ch4 = 0.0000036;
    NEW.gwp_methane = 27;
    NEW.nitrous_oxide_emitted_n2o = 0;
    NEW.gwp_nitrous_oxide = 273;
    NEW.source_of_emission = 'https://www.epd.gov.hk/epd/sites/default/files/epd/gn_pdf/GN2014P097-2014c-e.pdf';
    NEW.emissions_kg_co2 = 0;
    NEW.emission_factor = 1.6790972;
  END IF;
  
  -- Set emission factors for Others - Liquefied Petroleum Gas
  IF NEW.vehicle_fuel_type = 'Others - Liquefied Petroleum Gas' THEN
    NEW.carbon_dioxide_emitted_co2 = 3.017;
    NEW.gwp_co2e = 1;
    NEW.methane_emitted_ch4 = 0.006;
    NEW.gwp_methane = 27;
    NEW.nitrous_oxide_emitted_n2o = 0;
    NEW.gwp_nitrous_oxide = 273;
    NEW.source_of_emission = 'https://www.epd.gov.hk/epd/sites/default/files/epd/gn_pdf/GN2014P097-2014c-e.pdf';
    NEW.emissions_kg_co2 = 0;
    NEW.emission_factor = 3.179;
  END IF;
  
  -- Set emission factors for Others - Kerosene
  IF NEW.vehicle_fuel_type = 'Others - Kerosene' THEN
    NEW.carbon_dioxide_emitted_co2 = 2.429;
    NEW.gwp_co2e = 1;
    NEW.methane_emitted_ch4 = 0.0000241;
    NEW.gwp_methane = 27;
    NEW.nitrous_oxide_emitted_n2o = 0.0000076;
    NEW.gwp_nitrous_oxide = 273;
    NEW.source_of_emission = 'https://www.epd.gov.hk/epd/sites/default/files/epd/gn_pdf/GN2014P097-2014c-e.pdf';
    NEW.emissions_kg_co2 = 0;
    NEW.emission_factor = 2.4317255;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set emission factors on insert and update
CREATE TRIGGER set_mobile_combustion_emission_factors
  BEFORE INSERT OR UPDATE ON public.mobile_combustion
  FOR EACH ROW
  EXECUTE FUNCTION public.set_mobile_emission_factors();
