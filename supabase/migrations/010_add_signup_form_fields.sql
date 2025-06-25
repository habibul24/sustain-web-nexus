
-- Add missing fields to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN business_registration_number TEXT,
ADD COLUMN job_title TEXT,
ADD COLUMN service_needed TEXT,
ADD COLUMN preferred_contact TEXT DEFAULT 'email';

-- Update the handle_new_user function to include new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id, 
    email, 
    full_name,
    company_name,
    business_registration_number,
    job_title,
    phone,
    service_needed,
    preferred_contact
  )
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'company_name',
    NEW.raw_user_meta_data->>'business_registration_number',
    NEW.raw_user_meta_data->>'job_title',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'service_needed',
    NEW.raw_user_meta_data->>'preferred_contact'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
