export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event_name: string
          event_properties: Json | null
          id: string
          ip_address: unknown | null
          page_url: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_name: string
          event_properties?: Json | null
          id?: string
          ip_address?: unknown | null
          page_url?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_name?: string
          event_properties?: Json | null
          id?: string
          ip_address?: unknown | null
          page_url?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_comments: {
        Row: {
          approved: boolean | null
          content: string
          created_at: string
          id: string
          parent_id: string | null
          post_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          approved?: boolean | null
          content: string
          created_at?: string
          id?: string
          parent_id?: string | null
          post_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          approved?: boolean | null
          content?: string
          created_at?: string
          id?: string
          parent_id?: string | null
          post_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category_id: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          featured_image_url: string | null
          id: string
          like_count: number | null
          published: boolean | null
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          substack_id: string | null
          substack_url: string | null
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          like_count?: number | null
          published?: boolean | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          substack_id?: string | null
          substack_url?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          category_id?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          like_count?: number | null
          published?: boolean | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          substack_id?: string | null
          substack_url?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      data_exports: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          expires_at: string | null
          export_type: string
          file_name: string
          file_size: number | null
          file_url: string | null
          id: string
          parameters: Json | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          expires_at?: string | null
          export_type: string
          file_name: string
          file_size?: number | null
          file_url?: string | null
          id?: string
          parameters?: Json | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          expires_at?: string | null
          export_type?: string
          file_name?: string
          file_size?: number | null
          file_url?: string | null
          id?: string
          parameters?: Json | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          clicked_at: string | null
          created_at: string
          error_message: string | null
          from_email: string
          id: string
          opened_at: string | null
          resend_message_id: string | null
          sent_at: string
          status: string
          subject: string
          template_id: string | null
          to_email: string
          trigger_id: string | null
          user_id: string | null
        }
        Insert: {
          clicked_at?: string | null
          created_at?: string
          error_message?: string | null
          from_email: string
          id?: string
          opened_at?: string | null
          resend_message_id?: string | null
          sent_at?: string
          status?: string
          subject: string
          template_id?: string | null
          to_email: string
          trigger_id?: string | null
          user_id?: string | null
        }
        Update: {
          clicked_at?: string | null
          created_at?: string
          error_message?: string | null
          from_email?: string
          id?: string
          opened_at?: string | null
          resend_message_id?: string | null
          sent_at?: string
          status?: string
          subject?: string
          template_id?: string | null
          to_email?: string
          trigger_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_logs_trigger_id_fkey"
            columns: ["trigger_id"]
            isOneToOne: false
            referencedRelation: "email_triggers"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          created_at: string
          html_content: string
          id: string
          is_active: boolean | null
          name: string
          subject: string
          template_type: string
          text_content: string | null
          updated_at: string
          variables: Json | null
        }
        Insert: {
          created_at?: string
          html_content: string
          id?: string
          is_active?: boolean | null
          name: string
          subject: string
          template_type: string
          text_content?: string | null
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          created_at?: string
          html_content?: string
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string
          template_type?: string
          text_content?: string | null
          updated_at?: string
          variables?: Json | null
        }
        Relationships: []
      }
      email_triggers: {
        Row: {
          conditions: Json | null
          created_at: string
          delay_minutes: number | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          template_id: string | null
          trigger_event: string
          updated_at: string
        }
        Insert: {
          conditions?: Json | null
          created_at?: string
          delay_minutes?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          template_id?: string | null
          trigger_event: string
          updated_at?: string
        }
        Update: {
          conditions?: Json | null
          created_at?: string
          delay_minutes?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          template_id?: string | null
          trigger_event?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_triggers_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          age: number | null
          category_department: string | null
          country_of_assignment: string | null
          created_at: string
          date_of_employment: string | null
          date_of_exit: string | null
          employee_number: string | null
          factory_of_assignment: string | null
          id: string
          is_executive: boolean | null
          level_designation: string | null
          name: string
          position: string | null
          salary: number | null
          serial_number: number | null
          sex: string | null
          updated_at: string
          user_id: string
          work_mode: string | null
        }
        Insert: {
          age?: number | null
          category_department?: string | null
          country_of_assignment?: string | null
          created_at?: string
          date_of_employment?: string | null
          date_of_exit?: string | null
          employee_number?: string | null
          factory_of_assignment?: string | null
          id?: string
          is_executive?: boolean | null
          level_designation?: string | null
          name: string
          position?: string | null
          salary?: number | null
          serial_number?: number | null
          sex?: string | null
          updated_at?: string
          user_id: string
          work_mode?: string | null
        }
        Update: {
          age?: number | null
          category_department?: string | null
          country_of_assignment?: string | null
          created_at?: string
          date_of_employment?: string | null
          date_of_exit?: string | null
          employee_number?: string | null
          factory_of_assignment?: string | null
          id?: string
          is_executive?: boolean | null
          level_designation?: string | null
          name?: string
          position?: string | null
          salary?: number | null
          serial_number?: number | null
          sex?: string | null
          updated_at?: string
          user_id?: string
          work_mode?: string | null
        }
        Relationships: []
      }
      esg_assessments: {
        Row: {
          assessment_period_end: string | null
          assessment_period_start: string | null
          company_name: string | null
          completed_at: string | null
          created_at: string
          environmental_score: number | null
          framework_id: string | null
          governance_score: number | null
          id: string
          overall_score: number | null
          social_score: number | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assessment_period_end?: string | null
          assessment_period_start?: string | null
          company_name?: string | null
          completed_at?: string | null
          created_at?: string
          environmental_score?: number | null
          framework_id?: string | null
          governance_score?: number | null
          id?: string
          overall_score?: number | null
          social_score?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assessment_period_end?: string | null
          assessment_period_start?: string | null
          company_name?: string | null
          completed_at?: string | null
          created_at?: string
          environmental_score?: number | null
          framework_id?: string | null
          governance_score?: number | null
          id?: string
          overall_score?: number | null
          social_score?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "esg_assessments_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "esg_frameworks"
            referencedColumns: ["id"]
          },
        ]
      }
      esg_categories: {
        Row: {
          code: string
          created_at: string
          description: string | null
          framework_id: string | null
          id: string
          name: string
          weight: number | null
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          framework_id?: string | null
          id?: string
          name: string
          weight?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          framework_id?: string | null
          id?: string
          name?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "esg_categories_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "esg_frameworks"
            referencedColumns: ["id"]
          },
        ]
      }
      esg_frameworks: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
          version: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
          version?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
      esg_questions: {
        Row: {
          category_id: string | null
          created_at: string
          data_source: string | null
          help_text: string | null
          id: string
          is_required: boolean | null
          options: Json | null
          order_index: number | null
          question_text: string
          question_type: string
          updated_at: string
          weight: number | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          data_source?: string | null
          help_text?: string | null
          id?: string
          is_required?: boolean | null
          options?: Json | null
          order_index?: number | null
          question_text: string
          question_type?: string
          updated_at?: string
          weight?: number | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          data_source?: string | null
          help_text?: string | null
          id?: string
          is_required?: boolean | null
          options?: Json | null
          order_index?: number | null
          question_text?: string
          question_type?: string
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "esg_questions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "esg_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      esg_responses: {
        Row: {
          assessment_id: string | null
          created_at: string
          data_source: string | null
          id: string
          notes: string | null
          numeric_value: number | null
          question_id: string | null
          response_value: string | null
          score: number | null
          updated_at: string
        }
        Insert: {
          assessment_id?: string | null
          created_at?: string
          data_source?: string | null
          id?: string
          notes?: string | null
          numeric_value?: number | null
          question_id?: string | null
          response_value?: string | null
          score?: number | null
          updated_at?: string
        }
        Update: {
          assessment_id?: string | null
          created_at?: string
          data_source?: string | null
          id?: string
          notes?: string | null
          numeric_value?: number | null
          question_id?: string | null
          response_value?: string | null
          score?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "esg_responses_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "esg_assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esg_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "esg_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      esg_scores: {
        Row: {
          assessment_id: string | null
          category_id: string | null
          created_at: string
          id: string
          industry_benchmark: number | null
          percentile_rank: number | null
          raw_score: number | null
          recommendations: string | null
          weighted_score: number | null
        }
        Insert: {
          assessment_id?: string | null
          category_id?: string | null
          created_at?: string
          id?: string
          industry_benchmark?: number | null
          percentile_rank?: number | null
          raw_score?: number | null
          recommendations?: string | null
          weighted_score?: number | null
        }
        Update: {
          assessment_id?: string | null
          category_id?: string | null
          created_at?: string
          id?: string
          industry_benchmark?: number | null
          percentile_rank?: number | null
          raw_score?: number | null
          recommendations?: string | null
          weighted_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "esg_scores_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "esg_assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esg_scores_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "esg_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_data: {
        Row: {
          account_code: string | null
          account_name: string | null
          amount: number | null
          connection_id: string | null
          created_at: string
          currency_code: string | null
          data_type: string
          id: string
          last_updated: string | null
          period_end: string | null
          period_start: string | null
          user_id: string | null
          xero_account_id: string | null
        }
        Insert: {
          account_code?: string | null
          account_name?: string | null
          amount?: number | null
          connection_id?: string | null
          created_at?: string
          currency_code?: string | null
          data_type: string
          id?: string
          last_updated?: string | null
          period_end?: string | null
          period_start?: string | null
          user_id?: string | null
          xero_account_id?: string | null
        }
        Update: {
          account_code?: string | null
          account_name?: string | null
          amount?: number | null
          connection_id?: string | null
          created_at?: string
          currency_code?: string | null
          data_type?: string
          id?: string
          last_updated?: string | null
          period_end?: string | null
          period_start?: string | null
          user_id?: string | null
          xero_account_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_data_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "xero_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      funding_opportunities: {
        Row: {
          amount: number | null
          amount_currency: string | null
          category: string
          created_at: string
          deadline: string | null
          eligibility: string | null
          expected_use: string | null
          id: string
          link: string | null
          name: string
          organizing_body: string | null
          other_criteria: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number | null
          amount_currency?: string | null
          category: string
          created_at?: string
          deadline?: string | null
          eligibility?: string | null
          expected_use?: string | null
          id?: string
          link?: string | null
          name: string
          organizing_body?: string | null
          other_criteria?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number | null
          amount_currency?: string | null
          category?: string
          created_at?: string
          deadline?: string | null
          eligibility?: string | null
          expected_use?: string | null
          id?: string
          link?: string | null
          name?: string
          organizing_body?: string | null
          other_criteria?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      governance_responses: {
        Row: {
          company_name: string | null
          countries: string | null
          created_at: string
          description: string | null
          employees: number | null
          id: string
          industries: string[] | null
          investment_accounting: string | null
          investment_shares: string | null
          legal_structure: string | null
          logo_url: string | null
          multiple_locations: string | null
          reporting_boundary: string | null
          reporting_period: string | null
          revenue: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name?: string | null
          countries?: string | null
          created_at?: string
          description?: string | null
          employees?: number | null
          id?: string
          industries?: string[] | null
          investment_accounting?: string | null
          investment_shares?: string | null
          legal_structure?: string | null
          logo_url?: string | null
          multiple_locations?: string | null
          reporting_boundary?: string | null
          reporting_period?: string | null
          revenue?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string | null
          countries?: string | null
          created_at?: string
          description?: string | null
          employees?: number | null
          id?: string
          industries?: string[] | null
          investment_accounting?: string | null
          investment_shares?: string | null
          legal_structure?: string | null
          logo_url?: string | null
          multiple_locations?: string | null
          reporting_boundary?: string | null
          reporting_period?: string | null
          revenue?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount_due: number
          amount_paid: number | null
          created_at: string
          currency: string | null
          due_date: string | null
          id: string
          invoice_number: string
          paid_at: string | null
          pdf_url: string | null
          status: string
          stripe_invoice_id: string | null
          subscription_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount_due: number
          amount_paid?: number | null
          created_at?: string
          currency?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          paid_at?: string | null
          pdf_url?: string | null
          status?: string
          stripe_invoice_id?: string | null
          subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount_due?: number
          amount_paid?: number | null
          created_at?: string
          currency?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          paid_at?: string | null
          pdf_url?: string | null
          status?: string
          stripe_invoice_id?: string | null
          subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_companies: {
        Row: {
          contact_email: string | null
          created_at: string
          id: string
          industry: string
          introduction: string | null
          location: string
          name: string
          phone_contact: string | null
          sustainability_service: string
          updated_at: string
          website_link: string | null
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          id?: string
          industry: string
          introduction?: string | null
          location: string
          name: string
          phone_contact?: string | null
          sustainability_service: string
          updated_at?: string
          website_link?: string | null
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          id?: string
          industry?: string
          introduction?: string | null
          location?: string
          name?: string
          phone_contact?: string | null
          sustainability_service?: string
          updated_at?: string
          website_link?: string | null
        }
        Relationships: []
      }
      metrics_targets_responses: {
        Row: {
          base_emissions: string | null
          base_year: number | null
          baseline_date: string | null
          captive_power_gen: string | null
          comparison_to_previous: string | null
          created_at: string
          emission_change: string | null
          emission_comment: string | null
          emission_scope1: string | null
          emission_scope2_loc: string | null
          emission_scope2_mkt: string | null
          emission_target: string | null
          end_date: string | null
          goal_desc: string | null
          goal_level: string[] | null
          goal_motivation: string[] | null
          goal_motivation_other: string | null
          goal_other: string | null
          goal_progress: string | null
          id: string
          initiative_active: string | null
          intensity_base_figure: string | null
          intensity_base_year: number | null
          intensity_explanation: string | null
          intensity_metric: string | null
          intensity_other: string | null
          intensity_reduction_percent: string | null
          intensity_science_based: string | null
          intensity_target_desc: string | null
          intensity_target_year: number | null
          intensity_year_set: number | null
          metric_used_for_target_set: string | null
          no_target_explanation: string | null
          no_target_reason: string | null
          org_ghg: string | null
          percent_achieved: string | null
          primary_reason: string | null
          reduction_initiatives: string | null
          reduction_percent: string | null
          reporting_discrepancy: string | null
          reporting_emissions: string | null
          science_based: string | null
          standard: string[] | null
          start_date: string | null
          target_desc: string | null
          target_emissions: string | null
          target_explanation: string | null
          target_year: number | null
          updated_at: string
          user_id: string
          waste_initiative: string | null
          waste_initiative_desc: string | null
          waste_metric: string | null
          waste_metric_used: string | null
          waste_target: string[] | null
          waste_target_other: string | null
          water_consumption: string | null
          water_consumption_comparison: string | null
          water_consumption_explain: string | null
          water_discharges: string | null
          water_discharges_comparison: string | null
          water_discharges_explain: string | null
          water_goal: string[] | null
          water_goal_baseline_date: string | null
          water_goal_desc: string | null
          water_goal_end_date: string | null
          water_goal_level: string[] | null
          water_goal_level_other: string | null
          water_goal_motivation: string[] | null
          water_goal_motivation_other: string | null
          water_goal_other: string | null
          water_goal_progress: string | null
          water_goal_start_date: string | null
          water_withdrawals: string | null
          water_withdrawals_comparison: string | null
          water_withdrawals_explain: string | null
          year_set: number | null
        }
        Insert: {
          base_emissions?: string | null
          base_year?: number | null
          baseline_date?: string | null
          captive_power_gen?: string | null
          comparison_to_previous?: string | null
          created_at?: string
          emission_change?: string | null
          emission_comment?: string | null
          emission_scope1?: string | null
          emission_scope2_loc?: string | null
          emission_scope2_mkt?: string | null
          emission_target?: string | null
          end_date?: string | null
          goal_desc?: string | null
          goal_level?: string[] | null
          goal_motivation?: string[] | null
          goal_motivation_other?: string | null
          goal_other?: string | null
          goal_progress?: string | null
          id?: string
          initiative_active?: string | null
          intensity_base_figure?: string | null
          intensity_base_year?: number | null
          intensity_explanation?: string | null
          intensity_metric?: string | null
          intensity_other?: string | null
          intensity_reduction_percent?: string | null
          intensity_science_based?: string | null
          intensity_target_desc?: string | null
          intensity_target_year?: number | null
          intensity_year_set?: number | null
          metric_used_for_target_set?: string | null
          no_target_explanation?: string | null
          no_target_reason?: string | null
          org_ghg?: string | null
          percent_achieved?: string | null
          primary_reason?: string | null
          reduction_initiatives?: string | null
          reduction_percent?: string | null
          reporting_discrepancy?: string | null
          reporting_emissions?: string | null
          science_based?: string | null
          standard?: string[] | null
          start_date?: string | null
          target_desc?: string | null
          target_emissions?: string | null
          target_explanation?: string | null
          target_year?: number | null
          updated_at?: string
          user_id: string
          waste_initiative?: string | null
          waste_initiative_desc?: string | null
          waste_metric?: string | null
          waste_metric_used?: string | null
          waste_target?: string[] | null
          waste_target_other?: string | null
          water_consumption?: string | null
          water_consumption_comparison?: string | null
          water_consumption_explain?: string | null
          water_discharges?: string | null
          water_discharges_comparison?: string | null
          water_discharges_explain?: string | null
          water_goal?: string[] | null
          water_goal_baseline_date?: string | null
          water_goal_desc?: string | null
          water_goal_end_date?: string | null
          water_goal_level?: string[] | null
          water_goal_level_other?: string | null
          water_goal_motivation?: string[] | null
          water_goal_motivation_other?: string | null
          water_goal_other?: string | null
          water_goal_progress?: string | null
          water_goal_start_date?: string | null
          water_withdrawals?: string | null
          water_withdrawals_comparison?: string | null
          water_withdrawals_explain?: string | null
          year_set?: number | null
        }
        Update: {
          base_emissions?: string | null
          base_year?: number | null
          baseline_date?: string | null
          captive_power_gen?: string | null
          comparison_to_previous?: string | null
          created_at?: string
          emission_change?: string | null
          emission_comment?: string | null
          emission_scope1?: string | null
          emission_scope2_loc?: string | null
          emission_scope2_mkt?: string | null
          emission_target?: string | null
          end_date?: string | null
          goal_desc?: string | null
          goal_level?: string[] | null
          goal_motivation?: string[] | null
          goal_motivation_other?: string | null
          goal_other?: string | null
          goal_progress?: string | null
          id?: string
          initiative_active?: string | null
          intensity_base_figure?: string | null
          intensity_base_year?: number | null
          intensity_explanation?: string | null
          intensity_metric?: string | null
          intensity_other?: string | null
          intensity_reduction_percent?: string | null
          intensity_science_based?: string | null
          intensity_target_desc?: string | null
          intensity_target_year?: number | null
          intensity_year_set?: number | null
          metric_used_for_target_set?: string | null
          no_target_explanation?: string | null
          no_target_reason?: string | null
          org_ghg?: string | null
          percent_achieved?: string | null
          primary_reason?: string | null
          reduction_initiatives?: string | null
          reduction_percent?: string | null
          reporting_discrepancy?: string | null
          reporting_emissions?: string | null
          science_based?: string | null
          standard?: string[] | null
          start_date?: string | null
          target_desc?: string | null
          target_emissions?: string | null
          target_explanation?: string | null
          target_year?: number | null
          updated_at?: string
          user_id?: string
          waste_initiative?: string | null
          waste_initiative_desc?: string | null
          waste_metric?: string | null
          waste_metric_used?: string | null
          waste_target?: string[] | null
          waste_target_other?: string | null
          water_consumption?: string | null
          water_consumption_comparison?: string | null
          water_consumption_explain?: string | null
          water_discharges?: string | null
          water_discharges_comparison?: string | null
          water_discharges_explain?: string | null
          water_goal?: string[] | null
          water_goal_baseline_date?: string | null
          water_goal_desc?: string | null
          water_goal_end_date?: string | null
          water_goal_level?: string[] | null
          water_goal_level_other?: string | null
          water_goal_motivation?: string[] | null
          water_goal_motivation_other?: string | null
          water_goal_other?: string | null
          water_goal_progress?: string | null
          water_goal_start_date?: string | null
          water_withdrawals?: string | null
          water_withdrawals_comparison?: string | null
          water_withdrawals_explain?: string | null
          year_set?: number | null
        }
        Relationships: []
      }
      mobile_combustion: {
        Row: {
          assessment_period_end: string | null
          assessment_period_start: string | null
          carbon_dioxide_emitted_co2: number | null
          created_at: string
          data_source: string | null
          emission_factor: number | null
          emissions_kg_co2: number | null
          fuel_per_vehicle: number | null
          gwp_co2e: number | null
          gwp_methane: number | null
          gwp_nitrous_oxide: number | null
          id: string
          is_applicable: boolean | null
          last_year_emission_figures: number | null
          methane_emitted_ch4: number | null
          nitrous_oxide_emitted_n2o: number | null
          notes: string | null
          source_of_emission: string | null
          unit_of_measurement: string
          updated_at: string
          user_id: string
          vehicle_fuel_type: string
          vehicle_no: string | null
        }
        Insert: {
          assessment_period_end?: string | null
          assessment_period_start?: string | null
          carbon_dioxide_emitted_co2?: number | null
          created_at?: string
          data_source?: string | null
          emission_factor?: number | null
          emissions_kg_co2?: number | null
          fuel_per_vehicle?: number | null
          gwp_co2e?: number | null
          gwp_methane?: number | null
          gwp_nitrous_oxide?: number | null
          id?: string
          is_applicable?: boolean | null
          last_year_emission_figures?: number | null
          methane_emitted_ch4?: number | null
          nitrous_oxide_emitted_n2o?: number | null
          notes?: string | null
          source_of_emission?: string | null
          unit_of_measurement: string
          updated_at?: string
          user_id: string
          vehicle_fuel_type: string
          vehicle_no?: string | null
        }
        Update: {
          assessment_period_end?: string | null
          assessment_period_start?: string | null
          carbon_dioxide_emitted_co2?: number | null
          created_at?: string
          data_source?: string | null
          emission_factor?: number | null
          emissions_kg_co2?: number | null
          fuel_per_vehicle?: number | null
          gwp_co2e?: number | null
          gwp_methane?: number | null
          gwp_nitrous_oxide?: number | null
          id?: string
          is_applicable?: boolean | null
          last_year_emission_figures?: number | null
          methane_emitted_ch4?: number | null
          nitrous_oxide_emitted_n2o?: number | null
          notes?: string | null
          source_of_emission?: string | null
          unit_of_measurement?: string
          updated_at?: string
          user_id?: string
          vehicle_fuel_type?: string
          vehicle_no?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_text: string | null
          action_url: string | null
          created_at: string
          expires_at: string | null
          id: string
          message: string
          metadata: Json | null
          read: boolean | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          action_text?: string | null
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          read?: boolean | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          action_text?: string | null
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      office_locations: {
        Row: {
          address: string
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      paper: {
        Row: {
          carbon_dioxide_emitted_co2: number | null
          closing_quantity: number | null
          created_at: string
          emission_factor_from_vendor: number | null
          emissions_kg_co2: number | null
          engages_waste_company: boolean | null
          gwp_co2e: number | null
          gwp_methane: number | null
          gwp_nitrous_oxide: number | null
          has_vendor_scope_data: boolean | null
          id: string
          incinerates: boolean | null
          measures_sorted_waste: boolean | null
          methane_emitted_ch4: number | null
          nitrous_oxide_emitted_n2o: number | null
          opening_quantity: number | null
          quantity: number | null
          recycles: boolean | null
          sorts_paper_waste: boolean | null
          source_of_emission: string | null
          total_purchased: number | null
          total_recycled: number | null
          unit_of_measurement: string | null
          updated_at: string
          user_id: string
          uses_landfill: boolean | null
          uses_paper: boolean | null
          waste_type: string | null
        }
        Insert: {
          carbon_dioxide_emitted_co2?: number | null
          closing_quantity?: number | null
          created_at?: string
          emission_factor_from_vendor?: number | null
          emissions_kg_co2?: number | null
          engages_waste_company?: boolean | null
          gwp_co2e?: number | null
          gwp_methane?: number | null
          gwp_nitrous_oxide?: number | null
          has_vendor_scope_data?: boolean | null
          id?: string
          incinerates?: boolean | null
          measures_sorted_waste?: boolean | null
          methane_emitted_ch4?: number | null
          nitrous_oxide_emitted_n2o?: number | null
          opening_quantity?: number | null
          quantity?: number | null
          recycles?: boolean | null
          sorts_paper_waste?: boolean | null
          source_of_emission?: string | null
          total_purchased?: number | null
          total_recycled?: number | null
          unit_of_measurement?: string | null
          updated_at?: string
          user_id: string
          uses_landfill?: boolean | null
          uses_paper?: boolean | null
          waste_type?: string | null
        }
        Update: {
          carbon_dioxide_emitted_co2?: number | null
          closing_quantity?: number | null
          created_at?: string
          emission_factor_from_vendor?: number | null
          emissions_kg_co2?: number | null
          engages_waste_company?: boolean | null
          gwp_co2e?: number | null
          gwp_methane?: number | null
          gwp_nitrous_oxide?: number | null
          has_vendor_scope_data?: boolean | null
          id?: string
          incinerates?: boolean | null
          measures_sorted_waste?: boolean | null
          methane_emitted_ch4?: number | null
          nitrous_oxide_emitted_n2o?: number | null
          opening_quantity?: number | null
          quantity?: number | null
          recycles?: boolean | null
          sorts_paper_waste?: boolean | null
          source_of_emission?: string | null
          total_purchased?: number | null
          total_recycled?: number | null
          unit_of_measurement?: string | null
          updated_at?: string
          user_id?: string
          uses_landfill?: boolean | null
          uses_paper?: boolean | null
          waste_type?: string | null
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          brand: string | null
          created_at: string
          exp_month: number | null
          exp_year: number | null
          id: string
          is_default: boolean | null
          last_four: string | null
          paypal_payment_method_id: string | null
          provider: string
          stripe_payment_method_id: string | null
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          brand?: string | null
          created_at?: string
          exp_month?: number | null
          exp_year?: number | null
          id?: string
          is_default?: boolean | null
          last_four?: string | null
          paypal_payment_method_id?: string | null
          provider: string
          stripe_payment_method_id?: string | null
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          brand?: string | null
          created_at?: string
          exp_month?: number | null
          exp_year?: number | null
          id?: string
          is_default?: boolean | null
          last_four?: string | null
          paypal_payment_method_id?: string | null
          provider?: string
          stripe_payment_method_id?: string | null
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          description: string | null
          id: string
          invoice_id: string | null
          metadata: Json | null
          payment_method: string
          paypal_payment_id: string | null
          status: string
          stripe_charge_id: string | null
          stripe_payment_intent_id: string | null
          subscription_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          invoice_id?: string | null
          metadata?: Json | null
          payment_method: string
          paypal_payment_id?: string | null
          status: string
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          invoice_id?: string | null
          metadata?: Json | null
          payment_method?: string
          paypal_payment_id?: string | null
          status?: string
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      process_emissions: {
        Row: {
          assessment_period_end: string | null
          assessment_period_start: string | null
          carbon_dioxide_emitted_co2: number | null
          created_at: string
          data_source: string | null
          emission_factor: number | null
          emissions_kg_co2: number | null
          gwp_co2e: number | null
          gwp_methane: number | null
          gwp_nitrous_oxide: number | null
          id: string
          is_applicable: boolean | null
          last_year_emission_figures: number | null
          methane_emitted_ch4: number | null
          nitrous_oxide_emitted_n2o: number | null
          notes: string | null
          quantity_used: number | null
          source_of_emission: string | null
          source_of_energy: string
          unit_of_measurement: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assessment_period_end?: string | null
          assessment_period_start?: string | null
          carbon_dioxide_emitted_co2?: number | null
          created_at?: string
          data_source?: string | null
          emission_factor?: number | null
          emissions_kg_co2?: number | null
          gwp_co2e?: number | null
          gwp_methane?: number | null
          gwp_nitrous_oxide?: number | null
          id?: string
          is_applicable?: boolean | null
          last_year_emission_figures?: number | null
          methane_emitted_ch4?: number | null
          nitrous_oxide_emitted_n2o?: number | null
          notes?: string | null
          quantity_used?: number | null
          source_of_emission?: string | null
          source_of_energy: string
          unit_of_measurement: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assessment_period_end?: string | null
          assessment_period_start?: string | null
          carbon_dioxide_emitted_co2?: number | null
          created_at?: string
          data_source?: string | null
          emission_factor?: number | null
          emissions_kg_co2?: number | null
          gwp_co2e?: number | null
          gwp_methane?: number | null
          gwp_nitrous_oxide?: number | null
          id?: string
          is_applicable?: boolean | null
          last_year_emission_figures?: number | null
          methane_emitted_ch4?: number | null
          nitrous_oxide_emitted_n2o?: number | null
          notes?: string | null
          quantity_used?: number | null
          source_of_emission?: string | null
          source_of_energy?: string
          unit_of_measurement?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      refrigerant_emissions: {
        Row: {
          assessment_period_end: string | null
          assessment_period_start: string | null
          carbon_dioxide_emitted_co2: number | null
          created_at: string
          data_source: string | null
          emission_factor: number | null
          emissions_kg_co2: number | null
          gwp_co2e: number | null
          gwp_methane: number | null
          gwp_nitrous_oxide: number | null
          id: string
          is_applicable: boolean | null
          last_year_emission_figures: number | null
          methane_emitted_ch4: number | null
          nitrous_oxide_emitted_n2o: number | null
          notes: string | null
          quantity_used: number | null
          refrigerant_type: string
          source_of_emission: string | null
          unit_of_measurement: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assessment_period_end?: string | null
          assessment_period_start?: string | null
          carbon_dioxide_emitted_co2?: number | null
          created_at?: string
          data_source?: string | null
          emission_factor?: number | null
          emissions_kg_co2?: number | null
          gwp_co2e?: number | null
          gwp_methane?: number | null
          gwp_nitrous_oxide?: number | null
          id?: string
          is_applicable?: boolean | null
          last_year_emission_figures?: number | null
          methane_emitted_ch4?: number | null
          nitrous_oxide_emitted_n2o?: number | null
          notes?: string | null
          quantity_used?: number | null
          refrigerant_type: string
          source_of_emission?: string | null
          unit_of_measurement: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assessment_period_end?: string | null
          assessment_period_start?: string | null
          carbon_dioxide_emitted_co2?: number | null
          created_at?: string
          data_source?: string | null
          emission_factor?: number | null
          emissions_kg_co2?: number | null
          gwp_co2e?: number | null
          gwp_methane?: number | null
          gwp_nitrous_oxide?: number | null
          id?: string
          is_applicable?: boolean | null
          last_year_emission_figures?: number | null
          methane_emitted_ch4?: number | null
          nitrous_oxide_emitted_n2o?: number | null
          notes?: string | null
          quantity_used?: number | null
          refrigerant_type?: string
          source_of_emission?: string | null
          unit_of_measurement?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      risk_assessment_responses: {
        Row: {
          created_at: string
          financial_impact: string | null
          has_process: string | null
          id: string
          last_assessment: string | null
          likelihood: string | null
          long_term: string | null
          magnitude: string | null
          medium_term: string | null
          process_desc: string | null
          review_frequency: string | null
          risk_impact: string | null
          risk_materialize: string | null
          risk_type: string[] | null
          risk1: string | null
          short_term: string | null
          time_horizon: string | null
          updated_at: string
          user_id: string
          value_chain: string | null
        }
        Insert: {
          created_at?: string
          financial_impact?: string | null
          has_process?: string | null
          id?: string
          last_assessment?: string | null
          likelihood?: string | null
          long_term?: string | null
          magnitude?: string | null
          medium_term?: string | null
          process_desc?: string | null
          review_frequency?: string | null
          risk_impact?: string | null
          risk_materialize?: string | null
          risk_type?: string[] | null
          risk1?: string | null
          short_term?: string | null
          time_horizon?: string | null
          updated_at?: string
          user_id: string
          value_chain?: string | null
        }
        Update: {
          created_at?: string
          financial_impact?: string | null
          has_process?: string | null
          id?: string
          last_assessment?: string | null
          likelihood?: string | null
          long_term?: string | null
          magnitude?: string | null
          medium_term?: string | null
          process_desc?: string | null
          review_frequency?: string | null
          risk_impact?: string | null
          risk_materialize?: string | null
          risk_type?: string[] | null
          risk1?: string | null
          short_term?: string | null
          time_horizon?: string | null
          updated_at?: string
          user_id?: string
          value_chain?: string | null
        }
        Relationships: []
      }
      scope2a_electricity: {
        Row: {
          assessment_period_end: string | null
          assessment_period_start: string | null
          carbon_dioxide_emitted_co2: number | null
          created_at: string
          data_source: string | null
          emission_factor: number | null
          emission_factor_prior_year: number | null
          emissions_kg_co2: number | null
          gwp_co2e: number | null
          gwp_methane: number | null
          gwp_nitrous_oxide: number | null
          id: string
          invoice_file_url: string | null
          invoice_quantity_prior_year: number | null
          is_applicable: boolean | null
          last_year_emission_figures: number | null
          methane_emitted_ch4: number | null
          month: string | null
          nitrous_oxide_emitted_n2o: number | null
          notes: string | null
          office_location_id: string | null
          organization_area: number | null
          provide_prior_year: boolean | null
          quantity_used: number | null
          quantity_used_prior_year: number | null
          receives_bills_directly: string | null
          source_of_emission: string | null
          source_of_emission_prior_year: string | null
          source_of_energy: string
          total_building_area: number | null
          total_building_electricity: number | null
          unit_of_measurement: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assessment_period_end?: string | null
          assessment_period_start?: string | null
          carbon_dioxide_emitted_co2?: number | null
          created_at?: string
          data_source?: string | null
          emission_factor?: number | null
          emission_factor_prior_year?: number | null
          emissions_kg_co2?: number | null
          gwp_co2e?: number | null
          gwp_methane?: number | null
          gwp_nitrous_oxide?: number | null
          id?: string
          invoice_file_url?: string | null
          invoice_quantity_prior_year?: number | null
          is_applicable?: boolean | null
          last_year_emission_figures?: number | null
          methane_emitted_ch4?: number | null
          month?: string | null
          nitrous_oxide_emitted_n2o?: number | null
          notes?: string | null
          office_location_id?: string | null
          organization_area?: number | null
          provide_prior_year?: boolean | null
          quantity_used?: number | null
          quantity_used_prior_year?: number | null
          receives_bills_directly?: string | null
          source_of_emission?: string | null
          source_of_emission_prior_year?: string | null
          source_of_energy: string
          total_building_area?: number | null
          total_building_electricity?: number | null
          unit_of_measurement: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assessment_period_end?: string | null
          assessment_period_start?: string | null
          carbon_dioxide_emitted_co2?: number | null
          created_at?: string
          data_source?: string | null
          emission_factor?: number | null
          emission_factor_prior_year?: number | null
          emissions_kg_co2?: number | null
          gwp_co2e?: number | null
          gwp_methane?: number | null
          gwp_nitrous_oxide?: number | null
          id?: string
          invoice_file_url?: string | null
          invoice_quantity_prior_year?: number | null
          is_applicable?: boolean | null
          last_year_emission_figures?: number | null
          methane_emitted_ch4?: number | null
          month?: string | null
          nitrous_oxide_emitted_n2o?: number | null
          notes?: string | null
          office_location_id?: string | null
          organization_area?: number | null
          provide_prior_year?: boolean | null
          quantity_used?: number | null
          quantity_used_prior_year?: number | null
          receives_bills_directly?: string | null
          source_of_emission?: string | null
          source_of_emission_prior_year?: string | null
          source_of_energy?: string
          total_building_area?: number | null
          total_building_electricity?: number | null
          unit_of_measurement?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scope2a_electricity_office_location_id_fkey"
            columns: ["office_location_id"]
            isOneToOne: false
            referencedRelation: "office_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      stationary_combustion: {
        Row: {
          assessment_period_end: string | null
          assessment_period_start: string | null
          carbon_dioxide_emitted_co2: number | null
          created_at: string
          data_source: string | null
          emission_factor: number | null
          emissions_kg_co2: number | null
          gwp_co2e: number | null
          gwp_methane: number | null
          gwp_nitrous_oxide: number | null
          id: string
          is_applicable: boolean | null
          last_year_emission_figures: number | null
          methane_emitted_ch4: number | null
          nitrous_oxide_emitted_n2o: number | null
          notes: string | null
          quantity_used: number
          source_of_emission: string | null
          source_of_energy: string
          unit_of_measurement: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assessment_period_end?: string | null
          assessment_period_start?: string | null
          carbon_dioxide_emitted_co2?: number | null
          created_at?: string
          data_source?: string | null
          emission_factor?: number | null
          emissions_kg_co2?: number | null
          gwp_co2e?: number | null
          gwp_methane?: number | null
          gwp_nitrous_oxide?: number | null
          id?: string
          is_applicable?: boolean | null
          last_year_emission_figures?: number | null
          methane_emitted_ch4?: number | null
          nitrous_oxide_emitted_n2o?: number | null
          notes?: string | null
          quantity_used: number
          source_of_emission?: string | null
          source_of_energy: string
          unit_of_measurement: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assessment_period_end?: string | null
          assessment_period_start?: string | null
          carbon_dioxide_emitted_co2?: number | null
          created_at?: string
          data_source?: string | null
          emission_factor?: number | null
          emissions_kg_co2?: number | null
          gwp_co2e?: number | null
          gwp_methane?: number | null
          gwp_nitrous_oxide?: number | null
          id?: string
          is_applicable?: boolean | null
          last_year_emission_figures?: number | null
          methane_emitted_ch4?: number | null
          nitrous_oxide_emitted_n2o?: number | null
          notes?: string | null
          quantity_used?: number
          source_of_emission?: string | null
          source_of_energy?: string
          unit_of_measurement?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      strategy_responses: {
        Row: {
          activities: string[] | null
          additional_info: string | null
          board_training: string | null
          carbon_targets: string | null
          comments: string | null
          committee: string | null
          committee_name: string | null
          communication: string | null
          competency: string | null
          created_at: string
          id: string
          incentive_position: string | null
          incentive_type: string | null
          incentives: string | null
          integration: string | null
          local_incentives: string | null
          management_position: string[] | null
          monitor_targets: string | null
          other_incentive: string | null
          other_position: string | null
          policies: string | null
          project_control: string | null
          reassessment: string | null
          responsible_member: string | null
          training: string | null
          training_details: string | null
          updated_at: string
          use_incentives: string | null
          user_id: string
        }
        Insert: {
          activities?: string[] | null
          additional_info?: string | null
          board_training?: string | null
          carbon_targets?: string | null
          comments?: string | null
          committee?: string | null
          committee_name?: string | null
          communication?: string | null
          competency?: string | null
          created_at?: string
          id?: string
          incentive_position?: string | null
          incentive_type?: string | null
          incentives?: string | null
          integration?: string | null
          local_incentives?: string | null
          management_position?: string[] | null
          monitor_targets?: string | null
          other_incentive?: string | null
          other_position?: string | null
          policies?: string | null
          project_control?: string | null
          reassessment?: string | null
          responsible_member?: string | null
          training?: string | null
          training_details?: string | null
          updated_at?: string
          use_incentives?: string | null
          user_id: string
        }
        Update: {
          activities?: string[] | null
          additional_info?: string | null
          board_training?: string | null
          carbon_targets?: string | null
          comments?: string | null
          committee?: string | null
          committee_name?: string | null
          communication?: string | null
          competency?: string | null
          created_at?: string
          id?: string
          incentive_position?: string | null
          incentive_type?: string | null
          incentives?: string | null
          integration?: string | null
          local_incentives?: string | null
          management_position?: string[] | null
          monitor_targets?: string | null
          other_incentive?: string | null
          other_position?: string | null
          policies?: string | null
          project_control?: string | null
          reassessment?: string | null
          responsible_member?: string | null
          training?: string | null
          training_details?: string | null
          updated_at?: string
          use_incentives?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          currency: string | null
          description: string | null
          features: Json | null
          id: string
          interval_count: number | null
          interval_type: string
          is_active: boolean | null
          name: string
          paypal_plan_id: string | null
          price: number
          stripe_price_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          interval_count?: number | null
          interval_type: string
          is_active?: boolean | null
          name: string
          paypal_plan_id?: string | null
          price: number
          stripe_price_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          interval_count?: number | null
          interval_type?: string
          is_active?: boolean | null
          name?: string
          paypal_plan_id?: string | null
          price?: number
          stripe_price_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          cancelled_at: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          paypal_subscription_id: string | null
          plan_id: string | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          cancelled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          paypal_subscription_id?: string | null
          plan_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          cancelled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          paypal_subscription_id?: string | null
          plan_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          created_at: string
          data_type: string | null
          description: string | null
          id: string
          is_public: boolean | null
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          data_type?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          data_type?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          applicable_framework: string | null
          avatar_url: string | null
          business_registration_number: string | null
          company_name: string | null
          company_size: string | null
          created_at: string
          email: string
          first_year_reporting: boolean | null
          full_name: string | null
          gathering_data_via_app: boolean | null
          has_multiple_locations: boolean | null
          has_subsidiaries: boolean | null
          id: string
          industry: string | null
          job_title: string | null
          linking_subsidiaries: boolean | null
          number_of_locations: string | null
          number_of_subsidiaries: number | null
          office_locations: Json | null
          onboarding_completed: boolean | null
          operations_description: string | null
          phone: string | null
          preferred_contact: string | null
          role_id: string | null
          service_needed: string | null
          software_used: string | null
          subscription_status: string | null
          updated_at: string
        }
        Insert: {
          applicable_framework?: string | null
          avatar_url?: string | null
          business_registration_number?: string | null
          company_name?: string | null
          company_size?: string | null
          created_at?: string
          email: string
          first_year_reporting?: boolean | null
          full_name?: string | null
          gathering_data_via_app?: boolean | null
          has_multiple_locations?: boolean | null
          has_subsidiaries?: boolean | null
          id: string
          industry?: string | null
          job_title?: string | null
          linking_subsidiaries?: boolean | null
          number_of_locations?: string | null
          number_of_subsidiaries?: number | null
          office_locations?: Json | null
          onboarding_completed?: boolean | null
          operations_description?: string | null
          phone?: string | null
          preferred_contact?: string | null
          role_id?: string | null
          service_needed?: string | null
          software_used?: string | null
          subscription_status?: string | null
          updated_at?: string
        }
        Update: {
          applicable_framework?: string | null
          avatar_url?: string | null
          business_registration_number?: string | null
          company_name?: string | null
          company_size?: string | null
          created_at?: string
          email?: string
          first_year_reporting?: boolean | null
          full_name?: string | null
          gathering_data_via_app?: boolean | null
          has_multiple_locations?: boolean | null
          has_subsidiaries?: boolean | null
          id?: string
          industry?: string | null
          job_title?: string | null
          linking_subsidiaries?: boolean | null
          number_of_locations?: string | null
          number_of_subsidiaries?: number | null
          office_locations?: Json | null
          onboarding_completed?: boolean | null
          operations_description?: string | null
          phone?: string | null
          preferred_contact?: string | null
          role_id?: string | null
          service_needed?: string | null
          software_used?: string | null
          subscription_status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          permissions: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          permissions?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          permissions?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          ip_address: unknown | null
          session_token: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          ip_address?: unknown | null
          session_token?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          ip_address?: unknown | null
          session_token?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      waste: {
        Row: {
          contributes_significantly: boolean | null
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          contributes_significantly?: boolean | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          contributes_significantly?: boolean | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      xero_companies: {
        Row: {
          connection_id: string | null
          country_code: string | null
          created_at: string
          currency_code: string | null
          financial_year_end_day: number | null
          financial_year_end_month: number | null
          id: string
          legal_name: string | null
          name: string | null
          tax_number: string | null
          updated_at: string
          xero_organisation_id: string
        }
        Insert: {
          connection_id?: string | null
          country_code?: string | null
          created_at?: string
          currency_code?: string | null
          financial_year_end_day?: number | null
          financial_year_end_month?: number | null
          id?: string
          legal_name?: string | null
          name?: string | null
          tax_number?: string | null
          updated_at?: string
          xero_organisation_id: string
        }
        Update: {
          connection_id?: string | null
          country_code?: string | null
          created_at?: string
          currency_code?: string | null
          financial_year_end_day?: number | null
          financial_year_end_month?: number | null
          id?: string
          legal_name?: string | null
          name?: string | null
          tax_number?: string | null
          updated_at?: string
          xero_organisation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "xero_companies_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "xero_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      xero_connections: {
        Row: {
          access_token: string | null
          connection_status: string | null
          created_at: string
          expires_at: string | null
          id: string
          last_sync_at: string | null
          refresh_token: string | null
          scopes: string[] | null
          tenant_id: string
          tenant_name: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          access_token?: string | null
          connection_status?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          last_sync_at?: string | null
          refresh_token?: string | null
          scopes?: string[] | null
          tenant_id: string
          tenant_name?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          access_token?: string | null
          connection_status?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          last_sync_at?: string | null
          refresh_token?: string | null
          scopes?: string[] | null
          tenant_id?: string
          tenant_name?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      xero_sync_logs: {
        Row: {
          connection_id: string | null
          created_at: string
          error_message: string | null
          id: string
          records_processed: number | null
          status: string
          sync_completed_at: string | null
          sync_started_at: string | null
          sync_type: string
        }
        Insert: {
          connection_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          records_processed?: number | null
          status: string
          sync_completed_at?: string | null
          sync_started_at?: string | null
          sync_type: string
        }
        Update: {
          connection_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          records_processed?: number | null
          status?: string
          sync_completed_at?: string | null
          sync_started_at?: string | null
          sync_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "xero_sync_logs_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "xero_connections"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_esg_score: {
        Args: { assessment_id: string }
        Returns: Json
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
