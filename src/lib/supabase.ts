
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://acqbozvocqdbdbifxckm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjcWJvenZvY3FkYmRiaWZ4Y2ttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2Nzk5ODQsImV4cCI6MjA2NjI1NTk4NH0.YCAq2gk6yhjevF-eGiYx8S_0SgieXAc583_NpSZReBM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          company_name: string | null
          business_registration_number: string | null
          job_title: string | null
          role_id: string | null
          avatar_url: string | null
          phone: string | null
          service_needed: string | null
          preferred_contact: string | null
          industry: string | null
          company_size: string | null
          subscription_status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          company_name?: string | null
          business_registration_number?: string | null
          job_title?: string | null
          role_id?: string | null
          avatar_url?: string | null
          phone?: string | null
          service_needed?: string | null
          preferred_contact?: string | null
          industry?: string | null
          company_size?: string | null
          subscription_status?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company_name?: string | null
          business_registration_number?: string | null
          job_title?: string | null
          role_id?: string | null
          avatar_url?: string | null
          phone?: string | null
          service_needed?: string | null
          preferred_contact?: string | null
          industry?: string | null
          company_size?: string | null
          subscription_status?: string
        }
      }
      esg_assessments: {
        Row: {
          id: string
          user_id: string
          framework_id: string | null
          company_name: string | null
          assessment_period_start: string | null
          assessment_period_end: string | null
          status: string
          overall_score: number | null
          environmental_score: number | null
          social_score: number | null
          governance_score: number | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string | null
          featured_image_url: string | null
          category_id: string | null
          author_id: string | null
          published: boolean
          published_at: string | null
          view_count: number
          like_count: number
          tags: string[]
          created_at: string
          updated_at: string
        }
      }
    }
  }
}
