
-- Create employees table for storing employee profile data
CREATE TABLE IF NOT EXISTS public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  serial_number INTEGER,
  name TEXT NOT NULL,
  position TEXT,
  is_executive BOOLEAN DEFAULT false,
  age INTEGER,
  sex TEXT,
  employee_number TEXT,
  work_mode TEXT,
  country_of_assignment TEXT,
  factory_of_assignment TEXT,
  date_of_employment DATE,
  date_of_exit DATE,
  category_department TEXT,
  level_designation TEXT,
  salary NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own employees" 
  ON public.employees 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own employees" 
  ON public.employees 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own employees" 
  ON public.employees 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own employees" 
  ON public.employees 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_employees_updated_at 
  BEFORE UPDATE ON public.employees 
  FOR EACH ROW 
  EXECUTE PROCEDURE public.update_updated_at_column();
