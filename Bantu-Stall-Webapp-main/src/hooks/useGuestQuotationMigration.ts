import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const GUEST_QUOTATION_DATA_KEY = 'guest_quotation_data';

/**
 * Hook to migrate guest quotation data to authenticated user account
 */
export const useGuestQuotationMigration = () => {
  const { user } = useAuth();

  useEffect(() => {
    const migrateGuestQuotation = async () => {
      if (!user) return;

      const guestData = localStorage.getItem(GUEST_QUOTATION_DATA_KEY);
      if (!guestData) return;

      try {
        const quotationData = JSON.parse(guestData);
        
        if (!quotationData.isGuest) return;

        // Submit the guest quotation as authenticated user
        const submissionData = {
          user_id: user.id,
          quotation_type: quotationData.quotationType,
          booking_type: quotationData.quotationType,
          retreat_goal: quotationData.retreat_goal,
          custom_goal: quotationData.custom_goal,
          description: quotationData.description,
          attendee_count: quotationData.attendee_count,
          group_composition: quotationData.group_composition,
          preferred_dates: quotationData.preferred_dates?.map((d: string) => d).join(', ') || '',
          alternative_dates: quotationData.alternative_dates,
          duration: quotationData.duration,
          flexibility: quotationData.flexibility,
          budget_range: quotationData.budget_range,
          payment_preference: quotationData.payment_preference,
          add_on_services: quotationData.add_on_services || [],
          catering_requirements: quotationData.catering_requirements,
          contact_name: quotationData.contact_name,
          contact_email: quotationData.contact_email,
          contact_phone: quotationData.contact_phone,
          company_name: quotationData.company_name,
          special_requests: quotationData.special_requests,
          accessibility_needs: quotationData.accessibility_needs,
          custom_requirements: quotationData.custom_requirements,
          priority_level: quotationData.priority_level || 'standard',
          status: 'pending',
          service_type: 'venue' as const,
          submitted_at: new Date().toISOString(),
          guest_converted: true
        };

        // Insert into quotations table
        const { data, error } = await supabase
          .from('quotations')
          .insert({
            user_id: submissionData.user_id,
            status: 'draft',
            quotation_number: `QTN-${Date.now()}`,
            issue_date: new Date().toISOString().split('T')[0],
            due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            subtotal: 0,
            tax_amount: 0,
            total_amount: 0,
            client_notes: submissionData.special_requests
          })
          .select('id')
          .single();

        if (error) {
          console.error('Error migrating guest quotation:', error);
          return;
        }

        // Clear guest data after successful migration
        localStorage.removeItem(GUEST_QUOTATION_DATA_KEY);
        
        toast.success('Your guest quotation has been migrated to your account!', {
          description: 'You can now view and manage it in your dashboard.',
          duration: 5000
        });

      } catch (error) {
        console.error('Error parsing or migrating guest quotation:', error);
        // Clear corrupted data
        localStorage.removeItem(GUEST_QUOTATION_DATA_KEY);
      }
    };

    migrateGuestQuotation();
  }, [user]);
};

export default useGuestQuotationMigration;