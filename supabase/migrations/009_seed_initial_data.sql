
-- Seed initial data
INSERT INTO public.esg_frameworks (name, description, version, is_active) VALUES 
('GRI Standards', 'Global Reporting Initiative Standards', '2021', true),
('SASB Standards', 'Sustainability Accounting Standards Board', '2023', true),
('TCFD Framework', 'Task Force on Climate-related Financial Disclosures', '2022', true);

-- Insert ESG categories for GRI framework
INSERT INTO public.esg_categories (framework_id, name, code, description, weight) 
SELECT 
  ef.id,
  category.name,
  category.code,
  category.description,
  category.weight
FROM public.esg_frameworks ef,
(VALUES 
  ('Environmental', 'E', 'Environmental impact and sustainability practices', 33.33),
  ('Social', 'S', 'Social responsibility and stakeholder relations', 33.33),
  ('Governance', 'G', 'Corporate governance and ethical practices', 33.34)
) AS category(name, code, description, weight)
WHERE ef.name = 'GRI Standards';

-- Insert subscription plans
INSERT INTO public.subscription_plans (name, description, price, currency, interval_type, features) VALUES 
('Basic', 'Essential ESG tools for small businesses', 29.00, 'USD', 'month', '["Basic ESG Assessment", "PDF Reports", "Email Support"]'),
('Professional', 'Advanced features for growing companies', 99.00, 'USD', 'month', '["Advanced ESG Assessment", "Custom Reports", "Xero Integration", "Priority Support", "API Access"]'),
('Enterprise', 'Full-featured solution for large organizations', 299.00, 'USD', 'month', '["Complete ESG Suite", "Custom Frameworks", "White-label Reports", "Dedicated Support", "Advanced Analytics", "Multi-user Access"]');

-- Insert email templates
INSERT INTO public.email_templates (name, subject, html_content, text_content, template_type, variables) VALUES 
(
  'welcome_email',
  'Welcome to SustainTech - Your ESG Journey Starts Here',
  '<h1>Welcome {{user_name}}!</h1><p>Thank you for joining SustainTech. We''re excited to help you on your sustainability journey.</p>',
  'Welcome {{user_name}}! Thank you for joining SustainTech. We''re excited to help you on your sustainability journey.',
  'welcome',
  '["user_name", "company_name"]'
),
(
  'assessment_complete',
  'Your ESG Assessment is Complete',
  '<h1>Assessment Complete!</h1><p>Hi {{user_name}}, your ESG assessment has been completed with an overall score of {{overall_score}}.</p>',
  'Hi {{user_name}}, your ESG assessment has been completed with an overall score of {{overall_score}}.',
  'assessment_complete',
  '["user_name", "overall_score", "report_url"]'
);

-- Insert email triggers
INSERT INTO public.email_triggers (name, description, trigger_event, template_id, delay_minutes, is_active)
SELECT 
  'welcome_new_user',
  'Send welcome email to new users',
  'user_signup',
  et.id,
  5,
  true
FROM public.email_templates et WHERE et.name = 'welcome_email';

-- Insert system settings
INSERT INTO public.system_settings (key, value, description, data_type, is_public) VALUES 
('site_name', 'SustainTech', 'Name of the application', 'string', true),
('support_email', 'support@sustaintech.com', 'Support contact email', 'string', true),
('max_assessments_per_user', '10', 'Maximum assessments per user', 'number', false),
('enable_xero_integration', 'true', 'Enable Xero integration features', 'boolean', false),
('maintenance_mode', 'false', 'Enable maintenance mode', 'boolean', true);
