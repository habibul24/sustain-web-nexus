
-- Create table for governance responses
CREATE TABLE public.governance_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT,
  description TEXT,
  legal_structure TEXT,
  reporting_period DATE,
  employees INTEGER,
  revenue DECIMAL(15,2),
  multiple_locations TEXT,
  countries TEXT,
  industries TEXT[], -- Array to store multiple industries
  investment_shares TEXT,
  investment_accounting TEXT,
  reporting_boundary TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.governance_responses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own governance responses" 
ON public.governance_responses
FOR ALL 
USING (auth.uid() = user_id);

-- Add trigger to update updated_at column
CREATE TRIGGER update_governance_responses_updated_at
  BEFORE UPDATE ON public.governance_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
