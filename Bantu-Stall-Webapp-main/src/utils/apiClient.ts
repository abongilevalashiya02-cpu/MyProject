// Enterprise API client that replaces all hardcoded URLs and API keys
import { supabase } from '@/integrations/supabase/client';
import { appConfig } from '@/config/environment';

// Centralized API client for all external calls
export class ApiClient {
  private static instance: ApiClient;
  
  private constructor() {}
  
  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  // Secure function invocation with automatic retries and error handling
  async invokeFunction<T = any>(
    functionName: string, 
    body: any = {}, 
    options: { retries?: number; timeout?: number } = {}
  ): Promise<{ data: T | null; error: string | null }> {
    const { retries = 3, timeout = appConfig.api.timeout } = options;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const { data, error } = await supabase.functions.invoke(functionName, {
          body,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        clearTimeout(timeoutId);

        if (error) {
          if (attempt === retries) {
            console.error(`API Error after ${retries} attempts:`, error);
            return { data: null, error: error.message };
          }
          
          // Exponential backoff for retries
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          continue;
        }

        return { data, error: null };

      } catch (err: any) {
        if (attempt === retries) {
          console.error(`Network Error after ${retries} attempts:`, err);
          return { 
            data: null, 
            error: err.name === 'AbortError' ? 'Request timeout' : err.message 
          };
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    return { data: null, error: 'Maximum retry attempts exceeded' };
  }

  // Specific quotation operations
  async sendQuotation(quotationData: any) {
    return this.invokeFunction('quotation-notification', {
      type: 'quote_request',
      quote_data: quotationData
    });
  }

  async approveQuotation(quotationId: string, approvalData: any) {
    return this.invokeFunction('quotation-approval', {
      quotation_id: quotationId,
      ...approvalData
    });
  }

  async generatePdf(quotationId: string, options: { watermark?: boolean } = {}) {
    return this.invokeFunction('quotation-pdf', {
      quotation_id: quotationId,
      include_watermark: options.watermark || false
    });
  }

  async syncToHubspot(contactData: any) {
    return this.invokeFunction('hubspot-sync', contactData);
  }

  async sendNotification(notificationData: any) {
    return this.invokeFunction('send-notification', notificationData);
  }
}

// Singleton instance
export const apiClient = ApiClient.getInstance();

// Convenience hooks
export const useEnterpriseApi = () => {
  return {
    sendQuotation: apiClient.sendQuotation.bind(apiClient),
    approveQuotation: apiClient.approveQuotation.bind(apiClient),
    generatePdf: apiClient.generatePdf.bind(apiClient),
    syncToHubspot: apiClient.syncToHubspot.bind(apiClient),
    sendNotification: apiClient.sendNotification.bind(apiClient)
  };
};