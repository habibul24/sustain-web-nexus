

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

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      console.log('Calling supabase.auth.getSession...');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Session result:', session?.user?.email || 'No user', 'Error:', error);
        
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
          console.log('No user found, setLoading(false) called');
        }
      } catch (error) {
        console.error('Error getting session:', error);
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email || 'No user');
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
          console.log('Auth state change - no user, setLoading(false) called');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    console.log('fetchProfile started with userId:', userId);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      console.log('Profile query result:', { data, error });

      if (error) {
        console.error('Error fetching profile:', error);
        // Set profile to null but don't block the app
        setProfile(null);
      } else if (data) {
        setProfile(data);
        console.log('Profile set successfully:', data.email);
      } else {
        console.log('No profile found for user');
        setProfile(null);
      }
    } catch (error) {
      console.error('Exception in fetchProfile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
      console.log('fetchProfile completed, setLoading(false) called');
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

