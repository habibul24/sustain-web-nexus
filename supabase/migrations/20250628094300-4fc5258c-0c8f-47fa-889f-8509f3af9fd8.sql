
-- Create table for marketplace companies
CREATE TABLE public.marketplace_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  sustainability_service TEXT NOT NULL,
  location TEXT NOT NULL,
  website_link TEXT,
  introduction TEXT,
  contact_email TEXT,
  phone_contact TEXT, -- Store as text to handle links and various formats
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.marketplace_companies ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (no authentication required)
CREATE POLICY "Public read access to marketplace companies" 
ON public.marketplace_companies
FOR SELECT 
TO public
USING (true);

-- Insert the marketplace company data
INSERT INTO public.marketplace_companies (
  name, industry, sustainability_service, location, website_link, introduction, contact_email, phone_contact
) VALUES 
(
  'Fullness Social Enterprises Society Limited',
  'Social Service',
  'Social Work/ Charity, Training',
  'Hong Kong',
  'FSES 豐盛社企學會',
  '豐盛社企學會有限公司成立於2011年，是香港首個以知識型義工結合而成的非牟利組織，旨在召集各界專業人士成為義工，以知識和經驗推動香港社會企業及社會創新的發展。',
  'info@fses.hk',
  '852 5398 4643'
),
(
  'REC Green Technologies Co. Ltd',
  'Power/Electricity, Infrastructure',
  'Energy Efficiency, Emissions Measurement/Reduction',
  'Hong Kong, China',
  'https://www.rec-gt.com/',
  'We provide a wide range of energy saving solutions, remote control and site safety monitoring solutions, as well as power management system for new and existing buildings.',
  'rgt@rec-eng.com',
  '852 2619 8817'
),
(
  'Liricco',
  'Power/Electricity',
  'Energy Efficiency, Energy Reduction',
  'Hong Kong, APAC, Canada',
  'Valta Pro | IoT Lighting',
  'Commercial & Industrial IoT Lighting; Energy Saving, Visual Health and Safety for New and Existing Buildings',
  'sales@valta.com',
  '852 2690 3691'
),
(
  'GF Technovation Company Limited',
  'Materials/ Products',
  'Waste Management',
  'Hong Kong',
  'https://www.gftechnovation.com.hk/en/',
  'GF Technovation has innovative waste bins that automatically collects waste data',
  'info@gftechnovation.com.hk',
  '852 2765 7654'
),
(
  'Socif Limited',
  'Leisure and Tourism, SaaS/AI, Infrastructure, Operations and Supply Chains, Data Collection & Analytics',
  'Circular Economy Practices',
  'Hong Kong',
  'https://www.socif.co/?lang=en',
  'We are a Smart mobility/ transportation IoT',
  'contact@socif.co',
  '852 9664 9906'
),
(
  'Antwave Technology Limited',
  'HVAC, Energy/ Energy Efficiency',
  'Energy Efficiency',
  'Hong Kong',
  'https://www.antwave-tech.com/',
  'We provide temperature & humidity sensor system to help you to reduce electricity cost of HVAC in daily operation and provide data using IoT',
  'enquiry@antwave-tech.com',
  '852 2151 1251'
),
(
  'Carnot Innovations Limited',
  'HVAC, Energy/ Energy Efficiency',
  'Energy Efficiency',
  'Hong Kong',
  'Carnot Innovations - Energy Saving Control with AI solutions',
  'Energy Saving Control with AI solutions. Data driven advanced analytics to improve energy & maintenance efficiency',
  'enquiry@carnot-innovations.com',
  NULL
),
(
  'Dun & Bradstreet (HK) Limited',
  'ESG Consulting/Risk advisory',
  'Ratings/Certification',
  'Hong Kong',
  'Dun & Bradstreet (HK) | A Leading Global Provider of Business Decisioning Data and Analytics',
  'Manage risk, increase supply chain resiliency, and drive business',
  'enquiry@dnb.com',
  '852 2516 1111'
),
(
  'Intensel',
  'ESG Consulting/Risk advisory',
  'Environmental Risk Management, Sustainability Consulting',
  'Hong Kong, Singapore',
  'https://www.intensel.net/',
  'Climate risk assessment and resilience by identifying and quantifying exposure to a changing climate. We provide granular analysis to the asset level in a portfolio and stress test RCP scenario analysis',
  'info@intensel.net',
  NULL
),
(
  'EarthDaily Analytics',
  'Data Collection & Analytics',
  'Climate Data',
  'Canada, USA, South Amricas, EU, APAC, CIS Region',
  'EarthDaily - The world''s most advanced Change Detection System',
  'We provide Earth observation data which provides vital information to Mitigate Risk.',
  'marketing@earthdaily.com',
  '1 778 658 0482'
),
(
  'EcoSage',
  'Data Collection & Analytics',
  'Waste Management',
  'Hong Kong',
  'Home | EcoSage | Empowering Sustainability',
  'We provide IT asset disposal and returns disposal',
  'contact@ecosage.com.hk',
  '852 3701 2155'
),
(
  'SustainableFitch',
  'Banking/Financing, Data Collection & Analytics',
  'Ratings/Certification',
  'USA, UK, Hong Kong, Singapore',
  'https://www.sustainablefitch.com/',
  'Sustainable Fitch provides insights, tools and data that have been designed and built entirely and exclusively to help bring clarity to the ESG financial community',
  NULL,
  'https://www.sustainablefitch.com/people/contact'
);

-- Add trigger for updated_at
CREATE TRIGGER update_marketplace_companies_updated_at
  BEFORE UPDATE ON public.marketplace_companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
