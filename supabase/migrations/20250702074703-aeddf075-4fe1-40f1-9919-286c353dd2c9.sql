
-- Create function to set refrigerant emission factors
CREATE OR REPLACE FUNCTION public.set_refrigerant_emission_factors()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Set emission factors for each refrigerant type
  CASE NEW.refrigerant_type
    WHEN 'R-401A' THEN
      NEW.carbon_dioxide_emitted_co2 = 18;
      NEW.emission_factor = 18;
    WHEN 'R-401B' THEN
      NEW.carbon_dioxide_emitted_co2 = 15;
      NEW.emission_factor = 15;
    WHEN 'R-401C' THEN
      NEW.carbon_dioxide_emitted_co2 = 21;
      NEW.emission_factor = 21;
    WHEN 'R-402A' THEN
      NEW.carbon_dioxide_emitted_co2 = 1902;
      NEW.emission_factor = 1902;
    WHEN 'R-402B' THEN
      NEW.carbon_dioxide_emitted_co2 = 1205;
      NEW.emission_factor = 1205;
    WHEN 'R-403B' THEN
      NEW.carbon_dioxide_emitted_co2 = 3471;
      NEW.emission_factor = 3471;
    WHEN 'R-404A' THEN
      NEW.carbon_dioxide_emitted_co2 = 3943;
      NEW.emission_factor = 3943;
    WHEN 'R-406A' THEN
      NEW.carbon_dioxide_emitted_co2 = 0;
      NEW.emission_factor = 0;
    WHEN 'R-407A' THEN
      NEW.carbon_dioxide_emitted_co2 = 1923;
      NEW.emission_factor = 1923;
    WHEN 'R-407B' THEN
      NEW.carbon_dioxide_emitted_co2 = 2547;
      NEW.emission_factor = 2547;
    WHEN 'R-407C' THEN
      NEW.carbon_dioxide_emitted_co2 = 1624;
      NEW.emission_factor = 1624;
    WHEN 'R-407D' THEN
      NEW.carbon_dioxide_emitted_co2 = 1487;
      NEW.emission_factor = 1487;
    WHEN 'R-408A' THEN
      NEW.carbon_dioxide_emitted_co2 = 2430;
      NEW.emission_factor = 2430;
    WHEN 'R-409A' THEN
      NEW.carbon_dioxide_emitted_co2 = 0;
      NEW.emission_factor = 0;
    WHEN 'R-410A' THEN
      NEW.carbon_dioxide_emitted_co2 = 1924;
      NEW.emission_factor = 1924;
    WHEN 'R-410B' THEN
      NEW.carbon_dioxide_emitted_co2 = 2048;
      NEW.emission_factor = 2048;
    WHEN 'R-411A' THEN
      NEW.carbon_dioxide_emitted_co2 = 15;
      NEW.emission_factor = 15;
    WHEN 'R-411B' THEN
      NEW.carbon_dioxide_emitted_co2 = 4;
      NEW.emission_factor = 4;
    WHEN 'R-414A' THEN
      NEW.carbon_dioxide_emitted_co2 = 0;
      NEW.emission_factor = 0;
    WHEN 'R-414B' THEN
      NEW.carbon_dioxide_emitted_co2 = 0;
      NEW.emission_factor = 0;
    WHEN 'R-417A' THEN
      NEW.carbon_dioxide_emitted_co2 = 2127;
      NEW.emission_factor = 2127;
    WHEN 'R-422A' THEN
      NEW.carbon_dioxide_emitted_co2 = 2847;
      NEW.emission_factor = 2847;
    WHEN 'R-422D' THEN
      NEW.carbon_dioxide_emitted_co2 = 2473;
      NEW.emission_factor = 2473;
    WHEN 'R-424A' THEN
      NEW.carbon_dioxide_emitted_co2 = 3104;
      NEW.emission_factor = 3104;
    WHEN 'R-426A' THEN
      NEW.carbon_dioxide_emitted_co2 = 1371;
      NEW.emission_factor = 1371;
    WHEN 'R-428A' THEN
      NEW.carbon_dioxide_emitted_co2 = 3417;
      NEW.emission_factor = 3417;
    WHEN 'R-434A' THEN
      NEW.carbon_dioxide_emitted_co2 = 3075;
      NEW.emission_factor = 3075;
    WHEN 'R-507A' THEN
      NEW.carbon_dioxide_emitted_co2 = 3985;
      NEW.emission_factor = 3985;
    WHEN 'R-508A' THEN
      NEW.carbon_dioxide_emitted_co2 = 11607;
      NEW.emission_factor = 11607;
    WHEN 'R-508B' THEN
      NEW.carbon_dioxide_emitted_co2 = 11698;
      NEW.emission_factor = 11698;
    WHEN 'HFC-23' THEN
      NEW.carbon_dioxide_emitted_co2 = 12400;
      NEW.emission_factor = 12400;
    WHEN 'HFC-32' THEN
      NEW.carbon_dioxide_emitted_co2 = 677;
      NEW.emission_factor = 677;
    WHEN 'HFC-41' THEN
      NEW.carbon_dioxide_emitted_co2 = 116;
      NEW.emission_factor = 116;
    WHEN 'HFC-125' THEN
      NEW.carbon_dioxide_emitted_co2 = 3170;
      NEW.emission_factor = 3170;
    WHEN 'HFC-134' THEN
      NEW.carbon_dioxide_emitted_co2 = 1120;
      NEW.emission_factor = 1120;
    WHEN 'HFC-134a' THEN
      NEW.carbon_dioxide_emitted_co2 = 1300;
      NEW.emission_factor = 1300;
    WHEN 'HFC-143' THEN
      NEW.carbon_dioxide_emitted_co2 = 328;
      NEW.emission_factor = 328;
    WHEN 'HFC-143a' THEN
      NEW.carbon_dioxide_emitted_co2 = 4800;
      NEW.emission_factor = 4800;
    WHEN 'HFC-152' THEN
      NEW.carbon_dioxide_emitted_co2 = 16;
      NEW.emission_factor = 16;
    WHEN 'HFC-152a' THEN
      NEW.carbon_dioxide_emitted_co2 = 138;
      NEW.emission_factor = 138;
    WHEN 'HFC-161' THEN
      NEW.carbon_dioxide_emitted_co2 = 4;
      NEW.emission_factor = 4;
    WHEN 'HFC-227ea' THEN
      NEW.carbon_dioxide_emitted_co2 = 3350;
      NEW.emission_factor = 3350;
    WHEN 'HFC-236cb' THEN
      NEW.carbon_dioxide_emitted_co2 = 1210;
      NEW.emission_factor = 1210;
    WHEN 'HFC-236ea' THEN
      NEW.carbon_dioxide_emitted_co2 = 1330;
      NEW.emission_factor = 1330;
    WHEN 'HFC-236fa' THEN
      NEW.carbon_dioxide_emitted_co2 = 8060;
      NEW.emission_factor = 8060;
    WHEN 'HFC-245ca' THEN
      NEW.carbon_dioxide_emitted_co2 = 716;
      NEW.emission_factor = 716;
    WHEN 'HFC-245fa' THEN
      NEW.carbon_dioxide_emitted_co2 = 858;
      NEW.emission_factor = 858;
    WHEN 'HFC-365mfc' THEN
      NEW.carbon_dioxide_emitted_co2 = 804;
      NEW.emission_factor = 804;
    WHEN 'HFC-43-10mee' THEN
      NEW.carbon_dioxide_emitted_co2 = 1650;
      NEW.emission_factor = 1650;
    ELSE
      -- Default values for unknown refrigerant types
      NEW.carbon_dioxide_emitted_co2 = 0;
      NEW.emission_factor = 0;
  END CASE;

  RETURN NEW;
END;
$function$;

-- Create trigger for refrigerant emissions
CREATE TRIGGER trigger_set_refrigerant_emission_factors
  BEFORE INSERT OR UPDATE ON public.refrigerant_emissions
  FOR EACH ROW
  EXECUTE FUNCTION public.set_refrigerant_emission_factors();
