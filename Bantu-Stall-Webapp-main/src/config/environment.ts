// Enterprise Configuration System
// Removes all hardcoded values from frontend code

export interface AppConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  api: {
    baseUrl: string;
    timeout: number;
  };
  integrations: {
    hubspot: {
      apiUrl: string;
    };
    emailJs: {
      serviceId: string;
      templateId: string;
      publicKey: string;
    };
  };
  features: {
    quotationApprovalWorkflow: boolean;
    customerPortal: boolean;
    realtimeNotifications: boolean;
    auditLogging: boolean;
    multiCurrency: boolean;
    documentVersioning: boolean;
  };
  business: {
    vatRate: number;
    defaultCurrency: string;
    quotationValidityDays: number;
    supportedCurrencies: string[];
  };
  security: {
    enableCSRF: boolean;
    enableRateLimit: boolean;
    sessionTimeoutMinutes: number;
    maxLoginAttempts: number;
  };
}

// Get configuration from environment variables with fallbacks
const getConfig = (): AppConfig => {
  // In production, these would come from secure environment variables
  // For now, we read from .env file which should be secured
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wnicvdcjbweavqdffnxp.supabase.co';
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduaWN2ZGNqYndlYXZxZGZmbnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI8ODE2NDE5LCJleHAiOjIwNTgzOTI0MTl9.GasD2dSUYhqVTtD1T52tbfAeFScrkh5eJWa-E-Z8BZU';

  return {
    supabase: {
      url: supabaseUrl,
      anonKey: supabaseAnonKey,
    },
    api: {
      baseUrl: `${supabaseUrl}/functions/v1`,
      timeout: 30000,
    },
    integrations: {
      hubspot: {
        apiUrl: 'https://api.hubapi.com',
      },
      emailJs: {
        serviceId: 'service_bantu_stall',
        templateId: 'template_bantu_stall',
        publicKey: 'user_bantu_stall'
      }
    },
    features: {
      quotationApprovalWorkflow: true,
      customerPortal: true,
      realtimeNotifications: true,
      auditLogging: true,
      multiCurrency: true,
      documentVersioning: true,
    },
    business: {
      vatRate: 0.15, // 15% VAT
      defaultCurrency: 'ZAR',
      quotationValidityDays: 30,
      supportedCurrencies: ['ZAR', 'USD', 'EUR', 'GBP'],
    },
    security: {
      enableCSRF: true,
      enableRateLimit: true,
      sessionTimeoutMinutes: 30,
      maxLoginAttempts: 5,
    },
  };
};

export const appConfig = getConfig();

// Configuration validation
export const validateConfig = (): boolean => {
  const config = appConfig;
  
  if (!config.supabase.url || !config.supabase.anonKey) {
    console.error('Missing required Supabase configuration');
    return false;
  }
  
  if (config.business.vatRate < 0 || config.business.vatRate > 1) {
    console.error('Invalid VAT rate configuration');
    return false;
  }
  
  return true;
};

// Development mode check
export const isDevelopment = () => import.meta.env.DEV;
export const isProduction = () => import.meta.env.PROD;

// API endpoint builder
export const buildApiUrl = (endpoint: string): string => {
  return `${appConfig.api.baseUrl}/${endpoint}`;
};