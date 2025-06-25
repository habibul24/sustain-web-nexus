import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import type { User } from '@supabase/supabase-js'

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  company_name?: string
  business_registration_number?: string
  job_title?: string
  phone?: string
  service_needed?: string
  preferred_contact?: string
  role_id?: string
  avatar_url?: string
  subscription_status: string
}

export interface SignUpData {
  email: string
  password: string
  fullName: string
  companyName: string
  businessRegistrationNumber?: string
  jobTitle: string
  phoneNumber: string
  serviceNeeded?: string
  preferredContact: string
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileFetching, setProfileFetching] = useState(false)

  useEffect(() => {
    let mounted = true;
    
    // Get initial session
    const getSession = async () => {
      console.log('=== Getting initial session ===');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Initial session:', session?.user?.email || 'No user', 'Error:', error);
        
        if (!mounted) return;
        
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('User found, fetching profile...');
          await fetchProfile(session.user.id);
        } else {
          console.log('No user found, setting loading to false');
          setProfile(null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('=== Auth state changed ===', event, session?.user?.email || 'No user');
        
        if (!mounted) return;
        
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('User in auth change, fetching profile...');
          await fetchProfile(session.user.id);
        } else {
          console.log('No user in auth change, setting loading to false');
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    // Prevent duplicate fetches
    if (profileFetching) {
      console.log('Profile fetch already in progress, skipping...');
      return;
    }
    
    console.log('=== fetchProfile START ===', userId);
    setProfileFetching(true);
    
    try {
      console.log('Making Supabase query...');
      
      // Add a reasonable timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout after 15 seconds')), 15000)
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
        setProfile(null);
      } else if (data) {
        console.log('Setting profile data:', data.email);
        setProfile(data);
      } else {
        console.log('No profile data found');
        setProfile(null);
      }
    } catch (error) {
      console.error('Exception in fetchProfile:', error);
      setProfile(null);
    } finally {
      console.log('=== fetchProfile END - Setting loading to false ===');
      setProfileFetching(false);
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signUp = async (signUpData: SignUpData) => {
    const { data, error } = await supabase.auth.signUp({
      email: signUpData.email,
      password: signUpData.password,
      options: {
        data: {
          full_name: signUpData.fullName,
          company_name: signUpData.companyName,
          business_registration_number: signUpData.businessRegistrationNumber,
          job_title: signUpData.jobTitle,
          phone: signUpData.phoneNumber,
          service_needed: signUpData.serviceNeeded,
          preferred_contact: signUpData.preferredContact,
        },
      },
    });
    
    // The database trigger will automatically create the user profile
    // No need for manual insertion here
    return { data, error };
  }

  const signOut = async () => {
    try {
      // Clear local state first
      setUser(null)
      setProfile(null)
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Error signing out:', error)
        // Restore state if sign out failed
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        }
        return { error }
      }
      
      return { error: null }
    } catch (error) {
      console.error('Error during sign out:', error)
      return { error: error as Error }
    }
  }

  const isAdmin = profile?.role_id === 'admin'

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
  }
}
