
-- Create table for funding opportunities
CREATE TABLE public.funding_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  organizing_body TEXT,
  status TEXT NOT NULL DEFAULT 'Open',
  deadline DATE,
  amount BIGINT, -- Store amount in cents/smallest currency unit
  amount_currency TEXT DEFAULT 'HKD',
  eligibility TEXT,
  expected_use TEXT,
  link TEXT,
  other_criteria TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.funding_opportunities ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (no authentication required)
CREATE POLICY "Public read access to funding opportunities" 
ON public.funding_opportunities
FOR SELECT 
TO public
USING (true);

-- Insert the funding data
INSERT INTO public.funding_opportunities (
  name, category, organizing_body, status, deadline, amount, eligibility, expected_use, link, other_criteria
) VALUES 
(
  'Cleaner Production Partnership Programme',
  'Green and sustainable environment',
  'Environmental Protection Department, HKPC',
  'Open',
  NULL,
  4500000, -- HK$45,000 in cents
  'General Hong Kong registered companies',
  'To decarbonize emission intensive production processes',
  'https://www.cleanerproduction.hk/en/program?id=4',
  NULL
),
(
  'Recycling Fund - Enterprise Support Programme (ESP)',
  'Green and sustainable environment', 
  'Environmental Protection Department, HKPC',
  'Open',
  NULL,
  1500000000, -- HK$15,000,000 in cents
  'General Hong Kong registered companies with close connection to the recycling industry including property management companies (PMC) and Owners'' Corporations (OC) registered under the Building Management Ordinance',
  'Recycling commercialisation',
  'https://www.recyclingfund.hk/en/application_en/esp/application_esp/',
  'Funding is on matching basis'
),
(
  'Sustainable Agricultural Development Fund',
  'Agriculture',
  'Agriculture, Fisheries, and Conservation Department',
  'Open',
  NULL,
  1500000000, -- HK$15,000,000 in cents
  'General Hong Kong registered companies with a close connection with Hong Kong or local registered agricultural co-operatives, non-profit-making agricultural organisations, non-governmental organisations',
  'practical, application-oriented projects, schemes or research work that will help farmers enhance their productivity and output',
  'https://www.afcd.gov.hk/english/agriculture/sadf/sadf.html',
  NULL
),
(
  'New Energy Transport Fund',
  'Green Transport',
  NULL,
  'N/A',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
),
(
  'New Industrialisation Funding Scheme',
  'Smart machines',
  NULL,
  'N/A',
  NULL,
  1500000000, -- HK$15,000,000 in cents
  NULL,
  NULL,
  NULL,
  NULL
),
(
  'Farm Improvement Scheme',
  'Agriculture',
  'Agriculture, Fisheries, and Conservation Department',
  'Open',
  NULL,
  10000000, -- HK$100,000 in cents
  'An applicant must be a resident or a registered company/organisation of Hong Kong and operate a crop farm engaged in commercial production of not less than 1 dau chung (d.c.) or a licensed livestock farm in Hong Kong.',
  'acquisition of farming equipment and materials for helping farmers improve their farming efficiency and productivity.',
  'https://www.afcd.gov.hk/english/agriculture/sadf/sadf_fis.html',
  'reimbursement basis and will cover up to 90% of the cost of each piece of eligible equipment and materials purchased. The total maximum grant that an eligible farmer along with his/her spouse may receive is capped at $50,000 for one production unit'
),
(
  'Technology Voucher Programme (TVP)',
  'Technology',
  'Innovation and Technology Commission, HKSAR',
  'Open',
  NULL,
  60000000, -- HK$600,000 in cents
  'General Hong Kong registered companies',
  'Implementing technological services and solutions',
  'https://www.itf.gov.hk/l-eng/TVP.asp',
  NULL
),
(
  'Alibaba Jumpstarter for one earth pitch',
  'Sustainability',
  'Alibaba Entrepreneurs Fund',
  'Closed',
  '2024-12-12',
  3900000000, -- HK$39,000,000 in cents
  'Startup that have raised less than US$20 million in funding or at least at least US$10 million in valuation',
  'Product development and growth',
  'https://jumpstarter.hk/en/about',
  'annually'
),
(
  'Enterprise Support Scheme (ESS)',
  'Research and Development',
  'Innovation and Technology Commission, HKSAR',
  'Open',
  NULL,
  1000000000, -- HK$10,000,000 in cents
  'General Hong Kong registered companies',
  'In-house research and development (R&D)',
  'https://www.itf.gov.hk/l-eng/ESS.asp',
  NULL
),
(
  'Cyberport Incubation Programme',
  'Technology',
  'Cyberport',
  'Open',
  '2025-01-02',
  50000000, -- HK$500,000 in cents
  'early-stage Hong Kong companies seeking growth in areas related to digital tech, registered less than 7 years',
  'Product development and growth',
  'https://www.cyberport.hk/en/about_cyberport/cyberport_entrepreneurs/cyberport_incubation_programme',
  'One full time staff'
);

-- Add trigger for updated_at
CREATE TRIGGER update_funding_opportunities_updated_at
  BEFORE UPDATE ON public.funding_opportunities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
