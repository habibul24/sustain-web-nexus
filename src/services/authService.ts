
import { supabase } from '@/integrations/supabase/client'
import type { SignUpData } from '@/types/auth'

export const signInUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signUpUser = async (signUpData: SignUpData) => {
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

export const signOutUser = async () => {
  try {
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Error signing out:', error)
      return { error }
    }
    
    return { error: null }
  } catch (error) {
    console.error('Error during sign out:', error)
    return { error: error as Error }
  }
}
