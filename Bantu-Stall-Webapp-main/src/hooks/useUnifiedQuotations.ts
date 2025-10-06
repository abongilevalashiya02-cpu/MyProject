import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface UnifiedQuotation {
  id: string;
  type: 'legacy' | 'modern'; // To distinguish between quotations and quotation_requests
  quotation_number?: string;
  reference?: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  company_name?: string;
  status: string;
  total_amount: number;
  currency?: string;
  created_at: string;
  updated_at: string;
  sent_at?: string;
  viewed_at?: string;
  accepted_at?: string;
  submitted_at?: string;
  quoted_at?: string;
  budget_range?: string;
  event_objectives?: string[];
  selected_services?: string[];
  attendee_count?: number;
  preferred_dates?: string;
  // Legacy quotation specific fields
  client_name?: string;
  due_date?: string;
  subtotal?: number;
  tax_amount?: number;
  line_items?: any[];
}

export const useUnifiedQuotations = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['unified-quotations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // Fetch from both tables in parallel
      const [legacyQuotationsResponse, modernQuotationsResponse] = await Promise.allSettled([
        supabase
          .from('quotations')
          .select(`
            *,
            client:clients(name, email, phone, company_name),
            line_items:quotation_line_items(*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        
        supabase
          .from('quotation_requests')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
      ]);

      const legacyQuotations = legacyQuotationsResponse.status === 'fulfilled' 
        ? legacyQuotationsResponse.value.data || [] 
        : [];
      
      const modernQuotations = modernQuotationsResponse.status === 'fulfilled' 
        ? modernQuotationsResponse.value.data || [] 
        : [];

      // Transform legacy quotations to unified format
      const unifiedLegacyQuotations: UnifiedQuotation[] = legacyQuotations.map(quote => ({
        id: quote.id,
        type: 'legacy' as const,
        quotation_number: quote.quotation_number,
        contact_name: quote.client?.name || 'Unknown Client',
        contact_email: quote.client?.email || '',
        contact_phone: quote.client?.phone,
        company_name: quote.client?.company_name,
        client_name: quote.client?.name,
        status: quote.status,
        total_amount: Number(quote.total_amount || 0),
        subtotal: Number(quote.subtotal || 0),
        tax_amount: Number(quote.tax_amount || 0),
        created_at: quote.created_at,
        updated_at: quote.updated_at,
        sent_at: quote.sent_at,
        viewed_at: quote.viewed_at,
        accepted_at: quote.accepted_at,
        due_date: quote.due_date,
        line_items: quote.line_items,
        currency: 'USD' // Default for legacy quotations
      }));

      // Transform modern quotations to unified format
      const unifiedModernQuotations: UnifiedQuotation[] = modernQuotations.map(quote => ({
        id: quote.id,
        type: 'modern' as const,
        reference: quote.quote_reference,
        contact_name: quote.contact_name,
        contact_email: quote.contact_email,
        contact_phone: quote.contact_phone,
        company_name: quote.company_name,
        status: quote.status,
        total_amount: Number(quote.total_amount || 0),
        currency: quote.currency || 'ZAR',
        created_at: quote.created_at,
        updated_at: quote.updated_at,
        submitted_at: quote.submitted_at,
        quoted_at: quote.quoted_at,
        budget_range: quote.budget_range,
        event_objectives: quote.event_objectives,
        selected_services: quote.selected_services,
        attendee_count: quote.attendee_count,
        preferred_dates: quote.preferred_dates
      }));

      // Combine and sort by creation date (most recent first)
      const allQuotations = [...unifiedLegacyQuotations, ...unifiedModernQuotations]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      return allQuotations;
    },
    enabled: !!user?.id,
  });
};

export const useUnifiedQuotationStats = () => {
  const { data: quotations = [], isLoading } = useUnifiedQuotations();

  const stats = {
    totalQuotations: quotations.length,
    legacyQuotations: quotations.filter(q => q.type === 'legacy').length,
    modernQuotations: quotations.filter(q => q.type === 'modern').length,
    activeBookings: quotations.filter(q => 
      q.status === 'approved' || 
      q.status === 'confirmed' || 
      q.status === 'accepted' ||
      q.status === 'sent'
    ).length,
    pendingQuotations: quotations.filter(q => 
      q.status === 'pending' || 
      q.status === 'draft' || 
      q.status === 'submitted'
    ).length,
    totalRevenue: quotations
      .filter(q => q.status === 'approved' || q.status === 'confirmed' || q.status === 'accepted')
      .reduce((sum, q) => {
        if (q.total_amount > 0) return sum + q.total_amount;
        // For quotations with budget_range, extract the higher value
        if (q.budget_range) {
          const match = q.budget_range.match(/[\d,]+(?:\.\d{2})?/g);
          if (match && match.length > 0) {
            const values = match.map(v => parseFloat(v.replace(/,/g, '')));
            return sum + Math.max(...values);
          }
        }
        return sum;
      }, 0),
    recentActivity: quotations.slice(0, 10).map(q => ({
      id: q.id,
      type: 'quotation' as const,
      title: q.type === 'legacy' 
        ? `Enterprise Quote ${q.quotation_number}` 
        : `Fast Quote #${q.id.slice(-6)}`,
      description: q.type === 'legacy'
        ? `Client: ${q.client_name || q.contact_name}`
        : `Service request for ${q.contact_name}`,
      created_at: q.created_at,
      status: q.status,
      amount: q.total_amount,
      metadata: { 
        quotationType: q.type,
        service: q.contact_name || 'Service',
        company: q.company_name
      }
    }))
  };

  return { stats, isLoading };
};