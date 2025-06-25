
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
  // Onboarding fields
  software_used?: string
  operations_description?: string
  first_year_reporting?: boolean
  applicable_framework?: string
  number_of_locations?: string
  linking_subsidiaries?: boolean
  onboarding_completed?: boolean
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

export interface AuthState {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  profileFetching: boolean
}
