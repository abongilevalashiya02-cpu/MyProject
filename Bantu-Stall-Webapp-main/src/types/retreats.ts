
export interface Retreat {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  trip_dates?: string;
  status: 'planning' | 'quotation_review' | 'booked' | 'complete';
  created_at: string;
  updated_at: string;
}

export interface QuotationRequest {
  id: string;
  user_id: string;
  retreat_id?: string;
  venue_id: number;
  venue_name: string;
  retreat_goal: string;
  custom_goal?: string;
  attendee_count: string;
  booking_type: string;
  add_on_services: string[];
  preferred_dates: string;
  contact_name: string;
  contact_email: string;
  special_requests?: string;
  budget_range?: string;
  description?: string;
  status: string;
  service_type: 'venue' | 'shuttle' | 'photographer' | 'videographer' | 'facilitator' | 'catering' | 'coordinator' | 'av_equipment' | 'wellness';
  submitted_at: string;
  updated_at: string;
}

export interface CreateRetreatData {
  name: string;
  description?: string;
  trip_dates?: string;
}
