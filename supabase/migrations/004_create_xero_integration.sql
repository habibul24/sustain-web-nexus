
-- Xero Integration Tables
CREATE TABLE public.xero_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL,
  tenant_name TEXT,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  scopes TEXT[],
  connection_status TEXT DEFAULT 'active', -- active, expired, revoked
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.xero_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID REFERENCES public.xero_connections(id) ON DELETE CASCADE,
  xero_organisation_id TEXT NOT NULL,
  name TEXT,
  legal_name TEXT,
  tax_number TEXT,
  country_code TEXT,
  currency_code TEXT,
  financial_year_end_day INTEGER,
  financial_year_end_month INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.xero_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID REFERENCES public.xero_connections(id) ON DELETE CASCADE,
  sync_type TEXT NOT NULL, -- accounts, transactions, contacts, etc.
  status TEXT NOT NULL, -- success, error, partial
  records_processed INTEGER DEFAULT 0,
  error_message TEXT,
  sync_started_at TIMESTAMPTZ,
  sync_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.financial_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  connection_id UUID REFERENCES public.xero_connections(id),
  data_type TEXT NOT NULL, -- revenue, expenses, assets, liabilities
  account_code TEXT,
  account_name TEXT,
  amount DECIMAL(15,2),
  currency_code TEXT DEFAULT 'USD',
  period_start DATE,
  period_end DATE,
  xero_account_id TEXT,
  last_updated TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.xero_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xero_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xero_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their Xero connections" ON public.xero_connections
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their company data" ON public.xero_companies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.xero_connections xc
      WHERE xc.id = connection_id AND xc.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their sync logs" ON public.xero_sync_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.xero_connections xc
      WHERE xc.id = connection_id AND xc.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their financial data" ON public.financial_data
  FOR ALL USING (auth.uid() = user_id);
