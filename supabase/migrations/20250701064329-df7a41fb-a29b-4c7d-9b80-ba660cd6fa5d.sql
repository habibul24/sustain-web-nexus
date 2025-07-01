
-- Create waste table for the main question
CREATE TABLE public.waste (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  contributes_significantly BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.waste ENABLE ROW LEVEL SECURITY;

-- Create policies for waste table
CREATE POLICY "Users can view their own waste data" ON public.waste FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own waste data" ON public.waste FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own waste data" ON public.waste FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own waste data" ON public.waste FOR DELETE USING (auth.uid() = user_id);

-- Create paper table for paper-related data
CREATE TABLE public.paper (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  uses_paper BOOLEAN,
  sorts_paper_waste BOOLEAN,
  opening_quantity NUMERIC,
  total_purchased NUMERIC,
  total_recycled NUMERIC,
  closing_quantity NUMERIC,
  measures_sorted_waste BOOLEAN,
  recycles BOOLEAN,
  incinerates BOOLEAN,
  uses_landfill BOOLEAN,
  engages_waste_company BOOLEAN,
  has_vendor_scope_data BOOLEAN,
  waste_type TEXT,
  quantity NUMERIC,
  unit_of_measurement TEXT DEFAULT 'kg',
  emission_factor_from_vendor NUMERIC,
  carbon_dioxide_emitted_co2 NUMERIC DEFAULT 0,
  gwp_co2e NUMERIC DEFAULT 1,
  methane_emitted_ch4 NUMERIC DEFAULT 0,
  gwp_methane NUMERIC DEFAULT 28,
  nitrous_oxide_emitted_n2o NUMERIC DEFAULT 0,
  gwp_nitrous_oxide NUMERIC DEFAULT 265,
  source_of_emission TEXT,
  emissions_kg_co2 NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.paper ENABLE ROW LEVEL SECURITY;

-- Create policies for paper table
CREATE POLICY "Users can view their own paper data" ON public.paper FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own paper data" ON public.paper FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own paper data" ON public.paper FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own paper data" ON public.paper FOR DELETE USING (auth.uid() = user_id);

-- Create function to set paper emission factors
CREATE OR REPLACE FUNCTION public.set_paper_emission_factors()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Set emission factors for landfill
  IF NEW.waste_type = 'landfill' THEN
    NEW.carbon_dioxide_emitted_co2 = 4.8;
    NEW.source_of_emission = 'https://www.hkex.com.hk/-/media/HKEX-Market/Listing/Rules-and-Guidance/Environmental-Social-and-Governance/Exchanges-guidance-materials-on-ESG/app2_envirokpis.pdf?la=en';
  END IF;
  
  -- Set emission factors for recycle
  IF NEW.waste_type = 'recycle' THEN
    NEW.carbon_dioxide_emitted_co2 = 0.01814882033;
    NEW.source_of_emission = 'https://www.epa.gov/climateleadership/ghg-emission-factors-hub';
  END IF;
  
  -- Set emission factors for combust
  IF NEW.waste_type = 'combust' THEN
    NEW.carbon_dioxide_emitted_co2 = 0.04537205082;
    NEW.source_of_emission = 'https://www.epa.gov/climateleadership/ghg-emission-factors-hub';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for paper emission factors
CREATE TRIGGER set_paper_emission_factors_trigger
  BEFORE INSERT OR UPDATE ON public.paper
  FOR EACH ROW
  EXECUTE FUNCTION public.set_paper_emission_factors();

-- Add updated_at trigger for waste table
CREATE TRIGGER update_waste_updated_at
  BEFORE UPDATE ON public.waste
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add updated_at trigger for paper table
CREATE TRIGGER update_paper_updated_at
  BEFORE UPDATE ON public.paper
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
