import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { QuotationRequest } from './useQuotationRequests';
import { useCreateClient, useCreateQuotation } from './useQuotations';

export interface ConvertToQuotationParams {
  quotationRequestId: string;
  quotationRequest: QuotationRequest;
}

export const useConvertRequestToQuotation = () => {
  const queryClient = useQueryClient();
  const createClient = useCreateClient();
  const createQuotation = useCreateQuotation();

  return useMutation({
    mutationFn: async ({ quotationRequestId, quotationRequest }: ConvertToQuotationParams) => {
      // First, create or find the client
      let clientId = '';

      // Check if client already exists
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .eq('email', quotationRequest.contact_email)
        .maybeSingle();

      if (existingClient) {
        clientId = existingClient.id;
      } else {
        // Create new client
        const clientData = {
          name: quotationRequest.contact_name,
          email: quotationRequest.contact_email,
          phone: quotationRequest.contact_phone,
          company_name: quotationRequest.company_name,
        };

        const newClient = await createClient.mutateAsync(clientData);
        clientId = newClient.id;
      }

      // Convert quotation request data to quotation format
      const quotationData = {
        client_id: clientId,
        issue_date: new Date().toISOString().split('T')[0],
        due_date: quotationRequest.quote_valid_until || 
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'draft' as const,
        subtotal: quotationRequest.subtotal,
        tax_amount: quotationRequest.vat_amount,
        total_amount: quotationRequest.total_amount,
        client_notes: buildClientNotes(quotationRequest),
        terms_conditions: 'Payment due within 30 days of invoice date.',
      };

      // Create the quotation
      const quotation = await createQuotation.mutateAsync(quotationData);

      // Create line items based on quotation request data
      const lineItems = generateLineItemsFromRequest(quotationRequest, quotation.id);
      
      if (lineItems.length > 0) {
        const { error: lineItemsError } = await supabase
          .from('quotation_line_items')
          .insert(lineItems);

        if (lineItemsError) throw lineItemsError;
      }

      // Update quotation request status to 'quoted'
      const { error: updateError } = await supabase
        .from('quotation_requests')
        .update({ 
          status: 'quoted',
          quoted_at: new Date().toISOString()
        })
        .eq('id', quotationRequestId);

      if (updateError) throw updateError;

      return { quotation, clientId };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: ['quotation-requests'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Quotation request converted to quotation successfully');
    },

    onError: (error) => {
      toast.error(`Failed to convert quotation request: ${error.message}`);
    },
  });
};

// Helper function to build client notes from quotation request
function buildClientNotes(request: QuotationRequest): string {
  const notes = [];
  
  if (request.event_objectives?.length) {
    notes.push(`Event Objectives: ${request.event_objectives.join(', ')}`);
  }
  
  if (request.desired_outcomes?.length) {
    notes.push(`Desired Outcomes: ${request.desired_outcomes.join(', ')}`);
  }
  
  if (request.additional_goals) {
    notes.push(`Additional Goals: ${request.additional_goals}`);
  }
  
  if (request.attendee_count) {
    notes.push(`Attendee Count: ${request.attendee_count}`);
  }
  
  if (request.event_duration) {
    notes.push(`Duration: ${request.event_duration} days`);
  }
  
  if (request.preferred_dates) {
    notes.push(`Preferred Dates: ${request.preferred_dates}`);
  }
  
  if (request.budget_range) {
    notes.push(`Budget Range: ${request.budget_range}`);
  }
  
  if (request.location_preference) {
    notes.push(`Location Preference: ${request.location_preference}`);
  }
  
  if (request.selected_services?.length) {
    notes.push(`Selected Services: ${request.selected_services.join(', ')}`);
  }
  
  if (request.catering_requirements) {
    notes.push(`Catering Requirements: ${request.catering_requirements}`);
  }
  
  if (request.transportation_needs) {
    notes.push(`Transportation: ${request.transportation_needs}`);
  }
  
  if (request.accommodation_type) {
    notes.push(`Accommodation: ${request.accommodation_type}`);
  }
  
  if (request.special_requirements) {
    notes.push(`Special Requirements: ${request.special_requirements}`);
  }
  
  return notes.join('\n\n');
}

// Helper function to generate line items from quotation request
function generateLineItemsFromRequest(request: QuotationRequest, quotationId: string) {
  const lineItems = [];
  
  // Base retreat package
  if (request.attendee_count && request.event_duration) {
    const basePrice = request.subtotal || 0;
    lineItems.push({
      quotation_id: quotationId,
      item_name: 'Corporate Retreat Package',
      description: `${request.event_duration} day retreat for ${request.attendee_count} attendees`,
      quantity: 1,
      unit_price: basePrice,
      tax_rate: 15,
      line_total: basePrice * 1.15,
      sort_order: 0
    });
  }
  
  // Add-on services as separate line items
  if (request.selected_services?.length) {
    request.selected_services.forEach((service, index) => {
      lineItems.push({
        quotation_id: quotationId,
        item_name: service,
        description: `Additional service: ${service}`,
        quantity: 1,
        unit_price: 0, // To be filled in manually
        tax_rate: 15,
        line_total: 0,
        sort_order: index + 1
      });
    });
  }
  
  return lineItems;
}

export const useBulkConvertRequests = () => {
  const queryClient = useQueryClient();
  const convertSingle = useConvertRequestToQuotation();

  return useMutation({
    mutationFn: async (requests: { id: string; data: QuotationRequest }[]) => {
      const results = [];
      
      for (const request of requests) {
        try {
          const result = await convertSingle.mutateAsync({
            quotationRequestId: request.id,
            quotationRequest: request.data
          });
          results.push({ success: true, id: request.id, result });
        } catch (error) {
          results.push({ success: false, id: request.id, error });
        }
      }
      
      return results;
    },

    onSuccess: (results) => {
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      if (successful > 0) {
        toast.success(`Successfully converted ${successful} quotation request(s)`);
      }
      
      if (failed > 0) {
        toast.error(`Failed to convert ${failed} quotation request(s)`);
      }
      
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: ['quotation-requests'] });
    },
  });
};