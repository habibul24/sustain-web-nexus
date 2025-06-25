
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { UserProfile, SignUpData, AuthState } from '@/types/auth'
import { fetchUserProfile } from '@/services/profileService'
import { signInUser, signUpUser, signOutUser } from '@/services/authService'

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
          await handleFetchProfile(session.user.id);
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
          await handleFetchProfile(session.user.id);
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

  const handleFetchProfile = async (userId: string) => {
    // Prevent duplicate fetches
    if (profileFetching) {
      console.log('Profile fetch already in progress, skipping...');
      return;
    }
    
    setProfileFetching(true);
    
    try {
      const profileData = await fetchUserProfile(userId);
      setProfile(profileData);
    } finally {
      console.log('=== fetchProfile END - Setting loading to false ===');
      setProfileFetching(false);
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    return await signInUser(email, password);
  }

  const signUp = async (signUpData: SignUpData) => {
    return await signUpUser(signUpData);
  }

  const signOut = async () => {
    try {
      // Clear local state first
      setUser(null)
      setProfile(null)
      
      const result = await signOutUser();
      
      if (result.error) {
        console.error('Error signing out:', result.error)
        // Only restore state if it's a real error, not session missing
        if (result.error.message !== 'Auth session missing!') {
          const { data: { session } } = await supabase.auth.getSession()
          setUser(session?.user ?? null)
          if (session?.user) {
            await handleFetchProfile(session.user.id)
          }
        }
        return result
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
