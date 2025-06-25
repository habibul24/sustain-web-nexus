
import { supabase } from '@/integrations/supabase/client'
import type { UserProfile } from '@/types/auth'

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  console.log('=== fetchProfile START ===', userId);
  
  try {
    console.log('Making Supabase query...');
    
    // Add a reasonable timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Query timeout after 5 seconds')), 5000)
    );
    
    const queryPromise = supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;
    
    console.log('Query completed. Data:', data, 'Error:', error);

    if (error) {
      console.error('Profile fetch error:', error);
      return null;
    } else if (data) {
      console.log('Setting profile data:', data.email);
      return data;
    } else {
      console.log('No profile data found');
      return null;
    }
  } catch (error) {
    console.error('Exception in fetchProfile:', error);
    return null;
  }
}
