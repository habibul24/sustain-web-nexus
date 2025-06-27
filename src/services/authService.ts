
import { supabase } from '@/integrations/supabase/client'
import type { SignUpData } from '@/types/auth'
import { sendWelcomeEmail, logEmailSent } from './emailService'

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
      emailRedirectTo: `${window.location.origin}/`,
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
  
  // Send welcome email if signup was successful
  if (data.user && !error) {
    try {
      console.log('Sending welcome email to:', signUpData.email);
      await sendWelcomeEmail({
        email: signUpData.email,
        name: signUpData.fullName.split(' ')[0] || signUpData.fullName,
        siteUrl: window.location.origin,
      });

      // Log the email attempt
      await logEmailSent(data.user.id, signUpData.email, 'welcome');
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the signup if email fails
    }
  }
  
  return { data, error };
}

export const signOutUser = async () => {
  try {
    // Check if there's a current session before attempting to sign out
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      // No session exists, so we're already signed out
      console.log('No active session found, user is already signed out')
      return { error: null }
    }
    
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      // Handle specific auth session missing error
      if (error.message === 'Auth session missing!') {
        console.log('Session already expired, considering sign out successful')
        return { error: null }
      }
      console.error('Error signing out:', error)
      return { error }
    }
    
    return { error: null }
  } catch (error) {
    console.error('Error during sign out:', error)
    return { error: error as Error }
  }
}
