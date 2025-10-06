import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ApiOptions {
  timeout?: number;
  retries?: number;
}

// Lightweight API client - optimized for performance
export const useApiClient = () => {
  const [loading, setLoading] = useState(false);

  const callApi = async (endpoint: string, options: any = {}) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(endpoint, options);
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return { callApi, loading };
};

// Optimized quotation API operations
export const useQuotationApi = () => {
  const { callApi, loading } = useApiClient();

  const sendQuotation = async (quotationId: string, options = {}) => {
    const result = await callApi('quotation-notification', {
      body: { quotation_id: quotationId, ...options }
    });
    
    if (result.success) {
      toast.success('Quotation sent successfully');
    } else {
      toast.error('Failed to send quotation');
    }
    
    return result;
  };

  const approveQuotation = async (quotationId: string, approvalData: any) => {
    const result = await callApi('quotation-approval', {
      body: { quotation_id: quotationId, action: 'approve', ...approvalData }
    });
    
    if (result.success) {
      toast.success('Quotation approved');
    } else {
      toast.error('Failed to approve quotation');
    }
    
    return result;
  };

  const generatePdf = async (quotationId: string, includeWatermark = false) => {
    const result = await callApi('quotation-pdf', {
      body: { quotation_id: quotationId, include_watermark: includeWatermark }
    });
    
    if (result.success) {
      // Create download link
      const blob = new Blob([result.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quotation-${quotationId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('PDF downloaded');
    } else {
      toast.error('Failed to generate PDF');
    }
    
    return result;
  };

  return {
    sendQuotation,
    approveQuotation, 
    generatePdf,
    loading
  };
};