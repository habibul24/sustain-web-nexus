
-- Add emission_factor_prior_year column to stationary_combustion table
ALTER TABLE stationary_combustion
ADD COLUMN emission_factor_prior_year NUMERIC;

-- Create new function specifically for stationary combustion emission factors
CREATE OR REPLACE FUNCTION set_emission_factors_stationary_combustion()
RETURNS TRIGGER AS $$
BEGIN
  -- Set emission_factor for Towngas (current year)
  IF NEW.source_of_energy = 'Towngas' THEN
    NEW.emission_factor := 0.548;
    NEW.emission_factor_prior_year := 0.549;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS set_emission_factors_stationary_combustion_trigger ON stationary_combustion;

-- Create new trigger for stationary combustion
CREATE TRIGGER set_emission_factors_stationary_combustion_trigger
BEFORE INSERT OR UPDATE ON stationary_combustion
FOR EACH ROW
EXECUTE FUNCTION set_emission_factors_stationary_combustion();

-- Update existing records with new emission factors
UPDATE stationary_combustion
SET
  emission_factor = CASE WHEN source_of_energy = 'Towngas' THEN 0.548 ELSE emission_factor END,
  emission_factor_prior_year = CASE WHEN source_of_energy = 'Towngas' THEN 0.549 ELSE emission_factor_prior_year END;
