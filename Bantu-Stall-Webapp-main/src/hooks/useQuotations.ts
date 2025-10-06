import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  vat_id?: string;
  company_name?: string;
  created_at: string;
  updated_at: string;
}

export interface QuotationLineItem {
  id: string;
  quotation_id: string;
  item_name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  line_total: number;
  sort_order: number;
}

export interface Quotation {
  id: string;
  quotation_number: string;
  client_id: string;
  user_id: string;
  template_id?: string;
  issue_date: string;
  due_date: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired' | 'paid';
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  client_notes?: string;
  terms_conditions?: string;
  created_at: string;
  updated_at: string;
  sent_at?: string;
  viewed_at?: string;
  accepted_at?: string;
  client?: Client;
  line_items?: QuotationLineItem[];
}

export interface QuotationTemplate {
  id: string;
  name: string;
  description?: string;
  default_notes?: string;
  default_terms?: string;
  is_active: boolean;
}

export const useQuotations = () => {
  return useQuery({
    queryKey: ['quotations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotations')
        .select(`
          *,
          client:clients(*),
          line_items:quotation_line_items(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Quotation[];
    },
  });
};

export const useQuotation = (id: string) => {
  return useQuery({
    queryKey: ['quotation', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotations')
        .select(`
          *,
          client:clients(*),
          line_items:quotation_line_items(*),
          activities:quotation_activities(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Quotation;
    },
    enabled: !!id,
  });
};

export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Client[];
    },
  });
};

export const useQuotationTemplates = () => {
  return useQuery({
    queryKey: ['quotation-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotation_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data as QuotationTemplate[];
    },
  });
};

export const useCreateQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quotationData: Partial<Quotation>) => {
      // Generate quotation number
      const { data: quotationNumber, error: numberError } = await supabase
        .rpc('generate_quotation_number');

      if (numberError) throw numberError;

      // Create quotation
      const { data: quotation, error: quotationError } = await supabase
        .from('quotations')
        .insert({
          client_id: quotationData.client_id,
          template_id: quotationData.template_id,
          issue_date: quotationData.issue_date || new Date().toISOString().split('T')[0],
          due_date: quotationData.due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          client_notes: quotationData.client_notes,
          terms_conditions: quotationData.terms_conditions,
          status: quotationData.status,
          subtotal: quotationData.subtotal || 0,
          tax_amount: quotationData.tax_amount || 0,
          total_amount: quotationData.total_amount || 0,
          quotation_number: quotationNumber,
        })
        .select()
        .single();

      if (quotationError) throw quotationError;
      return quotation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      toast.success('Quotation created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create quotation: ${error.message}`);
    },
  });
};

export const useUpdateQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Quotation> & { id: string }) => {
      const { data, error } = await supabase
        .from('quotations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: ['quotation', data.id] });
      toast.success('Quotation updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update quotation: ${error.message}`);
    },
  });
};

export const useSendQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Update quotation status to 'sent' and set sent_at timestamp
      const { data, error } = await supabase
        .from('quotations')
        .update({ 
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: ['quotation', data.id] });
      toast.success('Quotation sent successfully');
    },
    onError: (error) => {
      toast.error(`Failed to send quotation: ${error.message}`);
    },
  });
};

export const useDeleteQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('quotations')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      toast.success('Quotation deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete quotation: ${error.message}`);
    },
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientData: Partial<Client>) => {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: clientData.name || '',
          email: clientData.email || '',
          phone: clientData.phone,
          address: clientData.address,
          city: clientData.city,
          country: clientData.country,
          vat_id: clientData.vat_id,
          company_name: clientData.company_name,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create client: ${error.message}`);
    },
  });
};

export const useUpdateLineItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ quotationId, lineItems }: { 
      quotationId: string; 
      lineItems: Partial<QuotationLineItem>[] 
    }) => {
      // Delete existing line items
      await supabase
        .from('quotation_line_items')
        .delete()
        .eq('quotation_id', quotationId);

      // Insert new line items
      if (lineItems.length > 0) {
        const { data, error } = await supabase
          .from('quotation_line_items')
          .insert(lineItems.map(item => ({
            quotation_id: quotationId,
            item_name: item.item_name || 'Untitled Item',
            description: item.description,
            quantity: item.quantity || 1,
            unit_price: item.unit_price || 0,
            tax_rate: item.tax_rate || 0,
            sort_order: item.sort_order || 0,
            line_total: (item.quantity || 1) * (item.unit_price || 0) * (1 + (item.tax_rate || 0) / 100)
          })))
          .select();

        if (error) throw error;
        return data;
      }
      return [];
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quotation', variables.quotationId] });
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    },
    onError: (error) => {
      toast.error(`Failed to update line items: ${error.message}`);
    },
  });
};