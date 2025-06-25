
-- First, let's drop the existing problematic policies and recreate them properly
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;

-- Create simple, clear policies for user profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create a policy for admins to view all profiles (using the security definer function)
CREATE POLICY "Admins can view all profiles" ON public.user_profiles
  FOR ALL USING (
    auth.uid() = id OR public.get_current_user_role() = 'admin'
  );
