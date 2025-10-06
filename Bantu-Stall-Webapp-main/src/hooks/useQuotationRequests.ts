import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface QuotationRequest {
  id: string;
  user_id?: string;
  company_name?: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  event_objectives: string[];
  desired_outcomes: string[];
  additional_goals?: string;
  attendee_count?: number;
  event_duration?: number;
  preferred_dates?: string;
  budget_range?: string;
  special_requirements?: string;
  selected_venue_id?: string;
  venue_preferences?: string;
  location_preference?: string;
  selected_services: string[];
  catering_requirements?: string;
  transportation_needs?: string;
  accommodation_type?: string;
  subtotal: number;
  vat_amount: number;
  total_amount: number;
  currency: string;
  current_step: number;
  status: 'draft' | 'submitted' | 'reviewing' | 'quoted' | 'accepted' | 'declined';
  quote_reference?: string;
  quote_valid_until?: string;
  created_at: string;
  updated_at: string;
  submitted_at?: string;
  quoted_at?: string;
}

export const useQuotationRequests = () => {
  return useQuery({
    queryKey: ['quotation-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotation_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as QuotationRequest[];
    },
  });
};

export const useQuotationRequest = (id: string) => {
  return useQuery({
    queryKey: ['quotation-request', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotation_requests')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as QuotationRequest;
    },
    enabled: !!id,
  });
};

export const useCreateQuotationRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quotationRequest: Omit<QuotationRequest, 'id' | 'created_at' | 'updated_at'> & { user_id: string }) => {
      // Clean up the data before insertion
      const cleanedData = {
        ...quotationRequest,
        attendee_count: quotationRequest.attendee_count || null,
        event_duration: quotationRequest.event_duration || null,
        company_name: quotationRequest.company_name || null,
        contact_phone: quotationRequest.contact_phone || null,
        additional_goals: quotationRequest.additional_goals || null,
        special_requirements: quotationRequest.special_requirements || null,
        selected_venue_id: quotationRequest.selected_venue_id || null,
        venue_preferences: quotationRequest.venue_preferences || null,
        location_preference: quotationRequest.location_preference || null,
        catering_requirements: quotationRequest.catering_requirements || null,
        transportation_needs: quotationRequest.transportation_needs || null,
        accommodation_type: quotationRequest.accommodation_type || null,
        quote_reference: quotationRequest.quote_reference || null,
        quote_valid_until: quotationRequest.quote_valid_until || null,
        preferred_dates: quotationRequest.preferred_dates || null,
        budget_range: quotationRequest.budget_range || null,
      };

      console.log('Submitting quotation request:', cleanedData);

      const { data, error } = await supabase
        .from('quotation_requests')
        .insert([cleanedData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Quotation request created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotation-requests'] });
    },
  });
};

export const useUpdateQuotationRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<QuotationRequest> & { id: string }) => {
      const { data, error } = await supabase
        .from('quotation_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['quotation-requests'] });
      queryClient.invalidateQueries({ queryKey: ['quotation-request', data.id] });
    },
  });
};