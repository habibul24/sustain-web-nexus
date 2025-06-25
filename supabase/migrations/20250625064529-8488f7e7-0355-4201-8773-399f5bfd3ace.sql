
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;

-- Create a security definer function to get user role safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT ur.name 
    FROM public.user_profiles up
    JOIN public.user_roles ur ON up.role_id = ur.id
    WHERE up.id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create new policies using the security definer function
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.user_profiles
  FOR ALL USING (
    auth.uid() = id OR public.get_current_user_role() = 'admin'
  );
