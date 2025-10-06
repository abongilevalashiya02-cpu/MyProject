export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      add_on_services: {
        Row: {
          id: string
          quotation_id: string | null
          service_name: string
        }
        Insert: {
          id?: string
          quotation_id?: string | null
          service_name: string
        }
        Update: {
          id?: string
          quotation_id?: string | null
          service_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "add_on_services_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      api_rate_limits: {
        Row: {
          created_at: string | null
          endpoint: string
          id: string
          identifier: string
          request_count: number | null
          window_start: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: string
          identifier: string
          request_count?: number | null
          window_start?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: string
          identifier?: string
          request_count?: number | null
          window_start?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: string | null
          resource: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blocked_ips: {
        Row: {
          blocked_until: string | null
          created_at: string | null
          id: string
          ip_address: string
          reason: string
        }
        Insert: {
          blocked_until?: string | null
          created_at?: string | null
          id?: string
          ip_address: string
          reason: string
        }
        Update: {
          blocked_until?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string
          reason?: string
        }
        Relationships: []
      }
      budget_requests: {
        Row: {
          budget_details: Json
          created_at: string
          id: string
          recipient_email: string | null
          status: string
          user_email: string
        }
        Insert: {
          budget_details: Json
          created_at?: string
          id?: string
          recipient_email?: string | null
          status?: string
          user_email: string
        }
        Update: {
          budget_details?: Json
          created_at?: string
          id?: string
          recipient_email?: string | null
          status?: string
          user_email?: string
        }
        Relationships: []
      }
      business_profiles: {
        Row: {
          company_name: string
          company_size: string
          created_at: string
          id: string
          job_title: string
          linkedin_profile_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name: string
          company_size: string
          created_at?: string
          id?: string
          job_title: string
          linkedin_profile_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string
          company_size?: string
          created_at?: string
          id?: string
          job_title?: string
          linkedin_profile_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string | null
          city: string | null
          company_name: string | null
          country: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
          updated_at: string | null
          user_id: string | null
          vat_id: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
          vat_id?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
          vat_id?: string | null
        }
        Relationships: []
      }
      contact_inquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string
          subject?: string
        }
        Relationships: []
      }
      customer_feedback: {
        Row: {
          comments: string | null
          created_at: string | null
          customer_id: string | null
          id: string
          quotation_id: string | null
          rating: number | null
        }
        Insert: {
          comments?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          quotation_id?: string | null
          rating?: number | null
        }
        Update: {
          comments?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          quotation_id?: string | null
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_feedback_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotation_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      form_rate_limits: {
        Row: {
          blocked_until: string | null
          created_at: string | null
          form_type: string
          id: string
          identifier: string
          submission_count: number | null
          window_start: string | null
        }
        Insert: {
          blocked_until?: string | null
          created_at?: string | null
          form_type: string
          id?: string
          identifier: string
          submission_count?: number | null
          window_start?: string | null
        }
        Update: {
          blocked_until?: string | null
          created_at?: string | null
          form_type?: string
          id?: string
          identifier?: string
          submission_count?: number | null
          window_start?: string | null
        }
        Relationships: []
      }
      form_security_logs: {
        Row: {
          created_at: string | null
          details: Json | null
          event_type: string
          form_type: string
          id: string
          identifier: string
          ip_address: string | null
          severity: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          event_type: string
          form_type: string
          id?: string
          identifier: string
          ip_address?: string | null
          severity?: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          event_type?: string
          form_type?: string
          id?: string
          identifier?: string
          ip_address?: string | null
          severity?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      form_suspicious_patterns: {
        Row: {
          auto_blocked: boolean | null
          created_at: string | null
          detection_count: number | null
          first_detected: string | null
          id: string
          identifier: string
          last_detected: string | null
          pattern_type: string
        }
        Insert: {
          auto_blocked?: boolean | null
          created_at?: string | null
          detection_count?: number | null
          first_detected?: string | null
          id?: string
          identifier: string
          last_detected?: string | null
          pattern_type: string
        }
        Update: {
          auto_blocked?: boolean | null
          created_at?: string | null
          detection_count?: number | null
          first_detected?: string | null
          id?: string
          identifier?: string
          last_detected?: string | null
          pattern_type?: string
        }
        Relationships: []
      }
      golden_tickets: {
        Row: {
          budget: string
          country: string
          created_at: string
          destination: string
          duration: string
          email: string
          experience_type: string
          goal_1: string
          goal_2: string
          group_size: string
          id: string
          local_facilitators: string
          name: string
          organization: string | null
          status: string
          submission_date: string
        }
        Insert: {
          budget: string
          country: string
          created_at?: string
          destination: string
          duration: string
          email: string
          experience_type: string
          goal_1: string
          goal_2: string
          group_size: string
          id?: string
          local_facilitators: string
          name: string
          organization?: string | null
          status?: string
          submission_date?: string
        }
        Update: {
          budget?: string
          country?: string
          created_at?: string
          destination?: string
          duration?: string
          email?: string
          experience_type?: string
          goal_1?: string
          goal_2?: string
          group_size?: string
          id?: string
          local_facilitators?: string
          name?: string
          organization?: string | null
          status?: string
          submission_date?: string
        }
        Relationships: []
      }
      horo_applications: {
        Row: {
          budget_range: string | null
          company_name: string
          created_at: string
          experience_details: string | null
          full_name: string
          id: string
          job_title: string
          locations: string | null
          objectives: string[]
          phone_number: string | null
          source: string | null
          status: string
          team_size: string
          updated_at: string
          user_id: string
          work_email: string
        }
        Insert: {
          budget_range?: string | null
          company_name: string
          created_at?: string
          experience_details?: string | null
          full_name: string
          id?: string
          job_title: string
          locations?: string | null
          objectives?: string[]
          phone_number?: string | null
          source?: string | null
          status?: string
          team_size: string
          updated_at?: string
          user_id: string
          work_email: string
        }
        Update: {
          budget_range?: string | null
          company_name?: string
          created_at?: string
          experience_details?: string | null
          full_name?: string
          id?: string
          job_title?: string
          locations?: string | null
          objectives?: string[]
          phone_number?: string | null
          source?: string | null
          status?: string
          team_size?: string
          updated_at?: string
          user_id?: string
          work_email?: string
        }
        Relationships: []
      }
      intake_submissions: {
        Row: {
          company: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          message: string | null
          role: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          message?: string | null
          role?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string | null
          role?: string | null
        }
        Relationships: []
      }
      module_progress: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          module_id: string
          started_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          module_id: string
          started_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          module_id?: string
          started_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      module_responses: {
        Row: {
          created_at: string | null
          id: string
          is_correct: boolean | null
          module_id: string
          question_id: string
          response: string
          section_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          module_id: string
          question_id: string
          response: string
          section_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          module_id?: string
          question_id?: string
          response?: string
          section_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          created_at: string
          email: string
          id: string
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          status?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      property_listings: {
        Row: {
          accessibility: string[] | null
          activities: string
          amenities: string[]
          area: string
          booking_flexibility: string | null
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at: string
          csr_alignment: boolean
          description: string
          eco_friendly: boolean
          id: string
          indoor_focus: boolean
          languages_spoken: string[] | null
          location: string
          luxury: boolean
          marketing_source: string | null
          max_capacity: number
          media_urls: string[] | null
          meeting_rooms: number
          min_capacity: number
          outdoor_focus: boolean
          preferred_guest_types: string[] | null
          price_range_usd: string
          price_range_zar: string
          property_name: string
          property_type: string
          proximity_to_landmark: string
          special_requests: string | null
          status: string
          total_rooms: number
          unique_selling_points: string | null
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          accessibility?: string[] | null
          activities: string
          amenities?: string[]
          area: string
          booking_flexibility?: string | null
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at?: string
          csr_alignment?: boolean
          description: string
          eco_friendly?: boolean
          id?: string
          indoor_focus?: boolean
          languages_spoken?: string[] | null
          location: string
          luxury?: boolean
          marketing_source?: string | null
          max_capacity: number
          media_urls?: string[] | null
          meeting_rooms: number
          min_capacity: number
          outdoor_focus?: boolean
          preferred_guest_types?: string[] | null
          price_range_usd: string
          price_range_zar: string
          property_name: string
          property_type: string
          proximity_to_landmark: string
          special_requests?: string | null
          status?: string
          total_rooms: number
          unique_selling_points?: string | null
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          accessibility?: string[] | null
          activities?: string
          amenities?: string[]
          area?: string
          booking_flexibility?: string | null
          contact_email?: string
          contact_name?: string
          contact_phone?: string
          created_at?: string
          csr_alignment?: boolean
          description?: string
          eco_friendly?: boolean
          id?: string
          indoor_focus?: boolean
          languages_spoken?: string[] | null
          location?: string
          luxury?: boolean
          marketing_source?: string | null
          max_capacity?: number
          media_urls?: string[] | null
          meeting_rooms?: number
          min_capacity?: number
          outdoor_focus?: boolean
          preferred_guest_types?: string[] | null
          price_range_usd?: string
          price_range_zar?: string
          property_name?: string
          property_type?: string
          proximity_to_landmark?: string
          special_requests?: string | null
          status?: string
          total_rooms?: number
          unique_selling_points?: string | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      quotation_activities: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string
          id: string
          metadata: Json | null
          quotation_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description: string
          id?: string
          metadata?: Json | null
          quotation_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string
          id?: string
          metadata?: Json | null
          quotation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotation_activities_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      quotation_approvals: {
        Row: {
          action: string
          approver_id: string | null
          comments: string | null
          created_at: string | null
          id: string
          quotation_id: string | null
          step_id: string
        }
        Insert: {
          action: string
          approver_id?: string | null
          comments?: string | null
          created_at?: string | null
          id?: string
          quotation_id?: string | null
          step_id: string
        }
        Update: {
          action?: string
          approver_id?: string | null
          comments?: string | null
          created_at?: string | null
          id?: string
          quotation_id?: string | null
          step_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotation_approvals_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotation_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      quotation_line_items: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          item_name: string
          line_total: number
          quantity: number
          quotation_id: string | null
          sort_order: number | null
          tax_rate: number | null
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          item_name: string
          line_total: number
          quantity?: number
          quotation_id?: string | null
          sort_order?: number | null
          tax_rate?: number | null
          unit_price: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          item_name?: string
          line_total?: number
          quantity?: number
          quotation_id?: string | null
          sort_order?: number | null
          tax_rate?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "quotation_line_items_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      quotation_request_line_items: {
        Row: {
          created_at: string
          description: string | null
          id: string
          item_name: string
          item_type: string
          quantity: number
          quotation_request_id: string | null
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          item_name: string
          item_type: string
          quantity?: number
          quotation_request_id?: string | null
          total_price?: number
          unit_price?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          item_name?: string
          item_type?: string
          quantity?: number
          quotation_request_id?: string | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "quotation_request_line_items_quotation_request_id_fkey"
            columns: ["quotation_request_id"]
            isOneToOne: false
            referencedRelation: "quotation_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      quotation_requests: {
        Row: {
          accommodation_type: string | null
          additional_goals: string | null
          attendee_count: number | null
          budget_range: string | null
          catering_requirements: string | null
          company_name: string | null
          contact_email: string
          contact_name: string
          contact_phone: string | null
          created_at: string
          currency: string | null
          current_step: number | null
          desired_outcomes: string[]
          event_duration: number | null
          event_objectives: string[]
          executive_rooms: number | null
          id: string
          location_preference: string | null
          preferred_dates: string | null
          presidential_rooms: number | null
          quote_reference: string | null
          quote_valid_until: string | null
          quoted_at: string | null
          requires_accommodation: boolean | null
          selected_services: string[] | null
          selected_venue_id: string | null
          special_requirements: string | null
          standard_rooms: number | null
          status: string | null
          submitted_at: string | null
          subtotal: number | null
          total_amount: number | null
          transportation_needs: string | null
          updated_at: string
          user_id: string
          vat_amount: number | null
          venue_preferences: string | null
          venue_type: string | null
        }
        Insert: {
          accommodation_type?: string | null
          additional_goals?: string | null
          attendee_count?: number | null
          budget_range?: string | null
          catering_requirements?: string | null
          company_name?: string | null
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          created_at?: string
          currency?: string | null
          current_step?: number | null
          desired_outcomes?: string[]
          event_duration?: number | null
          event_objectives?: string[]
          executive_rooms?: number | null
          id?: string
          location_preference?: string | null
          preferred_dates?: string | null
          presidential_rooms?: number | null
          quote_reference?: string | null
          quote_valid_until?: string | null
          quoted_at?: string | null
          requires_accommodation?: boolean | null
          selected_services?: string[] | null
          selected_venue_id?: string | null
          special_requirements?: string | null
          standard_rooms?: number | null
          status?: string | null
          submitted_at?: string | null
          subtotal?: number | null
          total_amount?: number | null
          transportation_needs?: string | null
          updated_at?: string
          user_id: string
          vat_amount?: number | null
          venue_preferences?: string | null
          venue_type?: string | null
        }
        Update: {
          accommodation_type?: string | null
          additional_goals?: string | null
          attendee_count?: number | null
          budget_range?: string | null
          catering_requirements?: string | null
          company_name?: string | null
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          created_at?: string
          currency?: string | null
          current_step?: number | null
          desired_outcomes?: string[]
          event_duration?: number | null
          event_objectives?: string[]
          executive_rooms?: number | null
          id?: string
          location_preference?: string | null
          preferred_dates?: string | null
          presidential_rooms?: number | null
          quote_reference?: string | null
          quote_valid_until?: string | null
          quoted_at?: string | null
          requires_accommodation?: boolean | null
          selected_services?: string[] | null
          selected_venue_id?: string | null
          special_requirements?: string | null
          standard_rooms?: number | null
          status?: string | null
          submitted_at?: string | null
          subtotal?: number | null
          total_amount?: number | null
          transportation_needs?: string | null
          updated_at?: string
          user_id?: string
          vat_amount?: number | null
          venue_preferences?: string | null
          venue_type?: string | null
        }
        Relationships: []
      }
      quotation_service_items: {
        Row: {
          attendee_count: number | null
          created_at: string | null
          duration_days: number | null
          duration_hours: number | null
          id: string
          notes: string | null
          quantity: number | null
          quotation_id: string | null
          service_catalog_id: string | null
          service_name: string
          subtotal: number
          unit_price: number
        }
        Insert: {
          attendee_count?: number | null
          created_at?: string | null
          duration_days?: number | null
          duration_hours?: number | null
          id?: string
          notes?: string | null
          quantity?: number | null
          quotation_id?: string | null
          service_catalog_id?: string | null
          service_name: string
          subtotal: number
          unit_price: number
        }
        Update: {
          attendee_count?: number | null
          created_at?: string | null
          duration_days?: number | null
          duration_hours?: number | null
          id?: string
          notes?: string | null
          quantity?: number | null
          quotation_id?: string | null
          service_catalog_id?: string | null
          service_name?: string
          subtotal?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "quotation_service_items_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotation_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotation_service_items_service_catalog_id_fkey"
            columns: ["service_catalog_id"]
            isOneToOne: false
            referencedRelation: "service_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      quotation_service_providers: {
        Row: {
          assigned_at: string | null
          id: string
          notes: string | null
          quotation_service_item_id: string | null
          service_provider_id: string | null
          status: string | null
        }
        Insert: {
          assigned_at?: string | null
          id?: string
          notes?: string | null
          quotation_service_item_id?: string | null
          service_provider_id?: string | null
          status?: string | null
        }
        Update: {
          assigned_at?: string | null
          id?: string
          notes?: string | null
          quotation_service_item_id?: string | null
          service_provider_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotation_service_providers_quotation_service_item_id_fkey"
            columns: ["quotation_service_item_id"]
            isOneToOne: false
            referencedRelation: "quotation_service_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotation_service_providers_service_provider_id_fkey"
            columns: ["service_provider_id"]
            isOneToOne: false
            referencedRelation: "service_provider_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      quotation_templates: {
        Row: {
          created_at: string | null
          default_notes: string | null
          default_terms: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          default_notes?: string | null
          default_terms?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          default_notes?: string | null
          default_terms?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      quotation_versions: {
        Row: {
          change_summary: string[] | null
          created_at: string | null
          created_by: string | null
          data: Json
          description: string | null
          id: string
          is_current: boolean | null
          quotation_id: string | null
          title: string
          version_number: number
        }
        Insert: {
          change_summary?: string[] | null
          created_at?: string | null
          created_by?: string | null
          data: Json
          description?: string | null
          id?: string
          is_current?: boolean | null
          quotation_id?: string | null
          title: string
          version_number: number
        }
        Update: {
          change_summary?: string[] | null
          created_at?: string | null
          created_by?: string | null
          data?: Json
          description?: string | null
          id?: string
          is_current?: boolean | null
          quotation_id?: string | null
          title?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "quotation_versions_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotation_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      quotations: {
        Row: {
          accepted_at: string | null
          client_id: string | null
          client_notes: string | null
          created_at: string | null
          due_date: string
          id: string
          issue_date: string
          quotation_number: string
          sent_at: string | null
          status: string
          subtotal: number | null
          tax_amount: number | null
          template_id: string | null
          terms_conditions: string | null
          total_amount: number | null
          updated_at: string | null
          user_id: string | null
          viewed_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          client_id?: string | null
          client_notes?: string | null
          created_at?: string | null
          due_date: string
          id?: string
          issue_date?: string
          quotation_number: string
          sent_at?: string | null
          status?: string
          subtotal?: number | null
          tax_amount?: number | null
          template_id?: string | null
          terms_conditions?: string | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
          viewed_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          client_id?: string | null
          client_notes?: string | null
          created_at?: string | null
          due_date?: string
          id?: string
          issue_date?: string
          quotation_number?: string
          sent_at?: string | null
          status?: string
          subtotal?: number | null
          tax_amount?: number | null
          template_id?: string | null
          terms_conditions?: string | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotations_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "quotation_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      retreats: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          status: string
          trip_dates: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: string
          trip_dates?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: string
          trip_dates?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      security_events: {
        Row: {
          created_at: string | null
          details: Json | null
          endpoint: string | null
          event_type: string
          id: string
          ip_address: string | null
          severity: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          endpoint?: string | null
          event_type: string
          id?: string
          ip_address?: string | null
          severity: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          endpoint?: string | null
          event_type?: string
          id?: string
          ip_address?: string | null
          severity?: string
          user_id?: string | null
        }
        Relationships: []
      }
      service_catalog: {
        Row: {
          avg_price: number
          created_at: string | null
          currency: string | null
          description: string | null
          icon_name: string | null
          id: string
          max_price: number
          min_price: number
          popular: boolean | null
          pricing_model: Database["public"]["Enums"]["service_pricing_model"]
          service_category: string
          service_name: string
          tags: string[] | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          avg_price: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          max_price: number
          min_price: number
          popular?: boolean | null
          pricing_model: Database["public"]["Enums"]["service_pricing_model"]
          service_category: string
          service_name: string
          tags?: string[] | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          avg_price?: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          max_price?: number
          min_price?: number
          popular?: boolean | null
          pricing_model?: Database["public"]["Enums"]["service_pricing_model"]
          service_category?: string
          service_name?: string
          tags?: string[] | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      service_provider_applications: {
        Row: {
          areas_of_expertise: string[] | null
          availability: string | null
          base_price: number | null
          business_registration: string | null
          certifications: string | null
          created_at: string
          currency: string | null
          email: string
          first_name: string
          gov_id_document: string | null
          id: string
          languages: string[] | null
          last_name: string
          location: string
          phone: string
          portfolio_images: string[] | null
          price_per_person: number | null
          professional_bio: string | null
          profile_photo: string | null
          provider_type: string
          services_offered: string | null
          status: string
          submitted_at: string | null
          terms_accepted: boolean
          updated_at: string
          user_id: string | null
          years_experience: string | null
        }
        Insert: {
          areas_of_expertise?: string[] | null
          availability?: string | null
          base_price?: number | null
          business_registration?: string | null
          certifications?: string | null
          created_at?: string
          currency?: string | null
          email: string
          first_name: string
          gov_id_document?: string | null
          id?: string
          languages?: string[] | null
          last_name: string
          location: string
          phone: string
          portfolio_images?: string[] | null
          price_per_person?: number | null
          professional_bio?: string | null
          profile_photo?: string | null
          provider_type: string
          services_offered?: string | null
          status?: string
          submitted_at?: string | null
          terms_accepted?: boolean
          updated_at?: string
          user_id?: string | null
          years_experience?: string | null
        }
        Update: {
          areas_of_expertise?: string[] | null
          availability?: string | null
          base_price?: number | null
          business_registration?: string | null
          certifications?: string | null
          created_at?: string
          currency?: string | null
          email?: string
          first_name?: string
          gov_id_document?: string | null
          id?: string
          languages?: string[] | null
          last_name?: string
          location?: string
          phone?: string
          portfolio_images?: string[] | null
          price_per_person?: number | null
          professional_bio?: string | null
          profile_photo?: string | null
          provider_type?: string
          services_offered?: string | null
          status?: string
          submitted_at?: string | null
          terms_accepted?: boolean
          updated_at?: string
          user_id?: string | null
          years_experience?: string | null
        }
        Relationships: []
      }
      signup_attempts: {
        Row: {
          created_at: string | null
          email: string
          id: number
          ip_address: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: never
          ip_address: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: never
          ip_address?: string
        }
        Relationships: []
      }
      smoke_thunder_bookings: {
        Row: {
          accessibility_needs: string | null
          additional_comments: string | null
          cape_town_addon: boolean | null
          created_at: string
          date_of_birth: string | null
          dietary_restrictions: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relation: string | null
          first_name: string
          has_insurance: boolean | null
          how_heard_about: string | null
          id: string
          insurance_provider: string | null
          last_name: string
          nationality: string | null
          package_type: string
          partner_date_of_birth: string | null
          partner_email: string | null
          partner_first_name: string | null
          partner_last_name: string | null
          partner_nationality: string | null
          partner_passport_expiry: string | null
          partner_passport_number: string | null
          partner_phone: string | null
          passport_expiry: string | null
          passport_number: string | null
          phone: string | null
          room_preferences: string | null
          special_requests: string | null
          status: string
          submission_date: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          accessibility_needs?: string | null
          additional_comments?: string | null
          cape_town_addon?: boolean | null
          created_at?: string
          date_of_birth?: string | null
          dietary_restrictions?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relation?: string | null
          first_name: string
          has_insurance?: boolean | null
          how_heard_about?: string | null
          id?: string
          insurance_provider?: string | null
          last_name: string
          nationality?: string | null
          package_type: string
          partner_date_of_birth?: string | null
          partner_email?: string | null
          partner_first_name?: string | null
          partner_last_name?: string | null
          partner_nationality?: string | null
          partner_passport_expiry?: string | null
          partner_passport_number?: string | null
          partner_phone?: string | null
          passport_expiry?: string | null
          passport_number?: string | null
          phone?: string | null
          room_preferences?: string | null
          special_requests?: string | null
          status?: string
          submission_date?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          accessibility_needs?: string | null
          additional_comments?: string | null
          cape_town_addon?: boolean | null
          created_at?: string
          date_of_birth?: string | null
          dietary_restrictions?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relation?: string | null
          first_name?: string
          has_insurance?: boolean | null
          how_heard_about?: string | null
          id?: string
          insurance_provider?: string | null
          last_name?: string
          nationality?: string | null
          package_type?: string
          partner_date_of_birth?: string | null
          partner_email?: string | null
          partner_first_name?: string | null
          partner_last_name?: string | null
          partner_nationality?: string | null
          partner_passport_expiry?: string | null
          partner_passport_number?: string | null
          partner_phone?: string | null
          passport_expiry?: string | null
          passport_number?: string | null
          phone?: string | null
          room_preferences?: string | null
          special_requests?: string | null
          status?: string
          submission_date?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      speaker_applications: {
        Row: {
          additional_info: string | null
          biography: string
          created_at: string
          email: string
          experience_details: string | null
          full_name: string
          heard_from: string
          id: string
          intended_impact: string
          phone: string
          policy_agreement: boolean
          social_media: string | null
          speaking_experience: string
          status: string
          tedx_alignment: string
          topic: string
          topic_importance: string
          unique_perspective: string
          video_link: string | null
        }
        Insert: {
          additional_info?: string | null
          biography: string
          created_at?: string
          email: string
          experience_details?: string | null
          full_name: string
          heard_from: string
          id?: string
          intended_impact: string
          phone: string
          policy_agreement?: boolean
          social_media?: string | null
          speaking_experience: string
          status?: string
          tedx_alignment: string
          topic: string
          topic_importance: string
          unique_perspective: string
          video_link?: string | null
        }
        Update: {
          additional_info?: string | null
          biography?: string
          created_at?: string
          email?: string
          experience_details?: string | null
          full_name?: string
          heard_from?: string
          id?: string
          intended_impact?: string
          phone?: string
          policy_agreement?: boolean
          social_media?: string | null
          speaking_experience?: string
          status?: string
          tedx_alignment?: string
          topic?: string
          topic_importance?: string
          unique_perspective?: string
          video_link?: string | null
        }
        Relationships: []
      }
      sponsor_inquiries: {
        Row: {
          company: string
          created_at: string
          email: string
          id: string
          interest: string
          message: string | null
          name: string
          phone: string
          status: string
        }
        Insert: {
          company: string
          created_at?: string
          email: string
          id?: string
          interest: string
          message?: string | null
          name: string
          phone: string
          status?: string
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          id?: string
          interest?: string
          message?: string | null
          name?: string
          phone?: string
          status?: string
        }
        Relationships: []
      }
      test_table: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      traveler_profiles: {
        Row: {
          budget: string | null
          created_at: string
          email: string | null
          favorite_destinations: string[] | null
          home_location: string | null
          id: string
          interests: string[] | null
          name: string | null
          phone: string | null
          travel_style: string | null
          trip_duration: string | null
          updated_at: string
        }
        Insert: {
          budget?: string | null
          created_at?: string
          email?: string | null
          favorite_destinations?: string[] | null
          home_location?: string | null
          id: string
          interests?: string[] | null
          name?: string | null
          phone?: string | null
          travel_style?: string | null
          trip_duration?: string | null
          updated_at?: string
        }
        Update: {
          budget?: string | null
          created_at?: string
          email?: string | null
          favorite_destinations?: string[] | null
          home_location?: string | null
          id?: string
          interests?: string[] | null
          name?: string | null
          phone?: string | null
          travel_style?: string | null
          trip_duration?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_entries: {
        Row: {
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_notification_settings: {
        Row: {
          approval_alerts: boolean | null
          created_at: string | null
          email_notifications: boolean | null
          id: string
          payment_notifications: boolean | null
          push_notifications: boolean | null
          quotation_updates: boolean | null
          system_alerts: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          approval_alerts?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          payment_notifications?: boolean | null
          push_notifications?: boolean | null
          quotation_updates?: boolean | null
          system_alerts?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          approval_alerts?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          payment_notifications?: boolean | null
          push_notifications?: boolean | null
          quotation_updates?: boolean | null
          system_alerts?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          expires_at: string | null
          id: string
          message: string
          priority: string | null
          read: boolean | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          expires_at?: string | null
          id?: string
          message: string
          priority?: string | null
          read?: boolean | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          expires_at?: string | null
          id?: string
          message?: string
          priority?: string | null
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_security_flags: {
        Row: {
          created_at: string | null
          details: Json | null
          flag_type: string
          id: string
          resolved: boolean | null
          resolved_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          flag_type: string
          id?: string
          resolved?: boolean | null
          resolved_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          flag_type?: string
          id?: string
          resolved?: boolean | null
          resolved_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_types: {
        Row: {
          created_at: string
          id: string
          type_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          type_name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          type_name?: string
          user_id?: string
        }
        Relationships: []
      }
      vendor_listings: {
        Row: {
          business_type: string | null
          contact_email: string
          contact_phone: string | null
          created_at: string
          description: string | null
          id: string
          status: string
          updated_at: string
          vendor_name: string
        }
        Insert: {
          business_type?: string | null
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          updated_at?: string
          vendor_name: string
        }
        Update: {
          business_type?: string | null
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          updated_at?: string
          vendor_name?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          company: string | null
          country: string
          created_at: string
          email: string
          id: string
          level: string | null
          name: string
          role: string | null
        }
        Insert: {
          company?: string | null
          country: string
          created_at?: string
          email: string
          id?: string
          level?: string | null
          name: string
          role?: string | null
        }
        Update: {
          company?: string | null
          country?: string
          created_at?: string
          email?: string
          id?: string
          level?: string | null
          name?: string
          role?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_quotation_totals: {
        Args: { quotation_uuid: string }
        Returns: undefined
      }
      check_form_rate_limit: {
        Args: {
          _block_minutes?: number
          _form_type: string
          _identifier: string
          _max_submissions?: number
          _window_minutes?: number
        }
        Returns: Json
      }
      check_rate_limit: {
        Args: {
          _endpoint: string
          _identifier: string
          _max_requests?: number
          _window_minutes?: number
        }
        Returns: boolean
      }
      check_signup_rate_limit: {
        Args: { _email: string; _ip_address: string }
        Returns: boolean
      }
      detect_suspicious_form_patterns: {
        Args: { _form_data: Json; _form_type: string; _identifier: string }
        Returns: Json
      }
      generate_quotation_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_property_contact_info_admin: {
        Args: { property_id: string }
        Returns: {
          contact_email: string
          contact_name: string
          contact_phone: string
          id: string
        }[]
      }
      get_property_listings_public: {
        Args: Record<PropertyKey, never>
        Returns: {
          accessibility: string[]
          activities: string
          amenities: string[]
          area: string
          booking_flexibility: string
          created_at: string
          csr_alignment: boolean
          description: string
          eco_friendly: boolean
          id: string
          indoor_focus: boolean
          languages_spoken: string[]
          location: string
          luxury: boolean
          max_capacity: number
          media_urls: string[]
          meeting_rooms: number
          min_capacity: number
          outdoor_focus: boolean
          price_range_usd: string
          price_range_zar: string
          property_name: string
          property_type: string
          proximity_to_landmark: string
          status: string
          total_rooms: number
          unique_selling_points: string
          updated_at: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_ip_blocked: {
        Args: { _ip_address: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "host" | "experience_creator"
      service_pricing_model:
        | "hourly"
        | "daily"
        | "per_person"
        | "per_event"
        | "per_word"
        | "per_page"
        | "fixed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "host", "experience_creator"],
      service_pricing_model: [
        "hourly",
        "daily",
        "per_person",
        "per_event",
        "per_word",
        "per_page",
        "fixed",
      ],
    },
  },
} as const
