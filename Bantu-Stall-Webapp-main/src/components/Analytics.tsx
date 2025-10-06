import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Remove problematic gtag declarations
export {};

interface AnalyticsProps {
  googleAnalyticsId?: string;
  googleSearchConsoleId?: string;
}

export const Analytics: React.FC<AnalyticsProps> = ({
  googleAnalyticsId = 'GA_MEASUREMENT_ID', // Placeholder for actual ID
  googleSearchConsoleId = 'GSC_VERIFICATION_ID' // Placeholder for actual ID
}) => {
  const location = useLocation();

  useEffect(() => {
    // Initialize Google Analytics
    if (googleAnalyticsId && googleAnalyticsId !== 'GA_MEASUREMENT_ID') {
      // Load Google Analytics script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
      document.head.appendChild(script);

      // Initialize dataLayer
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).gtag = function() {
        (window as any).dataLayer.push(arguments);
      };
      
      (window as any).gtag('js', new Date());
      (window as any).gtag('config', googleAnalyticsId, {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: true
      });
    }

    // Add Search Console verification meta tag
    if (googleSearchConsoleId && googleSearchConsoleId !== 'GSC_VERIFICATION_ID') {
      const existingMeta = document.querySelector('meta[name="google-site-verification"]');
      if (!existingMeta) {
        const meta = document.createElement('meta');
        meta.name = 'google-site-verification';
        meta.content = googleSearchConsoleId;
        document.head.appendChild(meta);
      }
    }
  }, [googleAnalyticsId, googleSearchConsoleId]);

  // Track page views
  useEffect(() => {
    if ((window as any).gtag && googleAnalyticsId !== 'GA_MEASUREMENT_ID') {
      (window as any).gtag('config', googleAnalyticsId, {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname + location.search
      });
    }
  }, [location, googleAnalyticsId]);

  return null;
};

/**
 * Hook for tracking custom events
 */
export const useAnalytics = () => {
  const trackEvent = (
    action: string,
    category: string,
    label?: string,
    value?: number,
    customParameters?: Record<string, any>
  ) => {
    if ((window as any).gtag) {
      (window as any).gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
        ...customParameters
      });
    }
    
    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', { action, category, label, value, customParameters });
    }
  };

  const trackPageView = (pagePath: string, pageTitle?: string) => {
    if ((window as any).gtag) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: pagePath,
        page_title: pageTitle || document.title
      });
    }
  };

  const trackConversion = (conversionId: string, value?: number, currency?: string) => {
    if ((window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        send_to: conversionId,
        value: value,
        currency: currency || 'USD'
      });
    }
  };

  // Common tracking functions for Bantu Stall
  const trackQuotationRequest = (venueId?: string, serviceType?: string) => {
    trackEvent('quotation_request', 'engagement', `venue_${venueId}`, undefined, {
      service_type: serviceType,
      timestamp: new Date().toISOString()
    });
  };

  const trackExperienceView = (experienceId: string, region?: string) => {
    trackEvent('experience_view', 'content', experienceId, undefined, {
      region: region,
      timestamp: new Date().toISOString()
    });
  };

  const trackContactFormSubmission = (formType: string) => {
    trackEvent('form_submit', 'lead_generation', formType, undefined, {
      timestamp: new Date().toISOString()
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackConversion,
    trackQuotationRequest,
    trackExperienceView,
    trackContactFormSubmission
  };
};

/**
 * Component for UTM parameter tracking
 */
export const UTMTracker: React.FC = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
      utm_term: urlParams.get('utm_term'),
      utm_content: urlParams.get('utm_content')
    };

    // Store UTM parameters in sessionStorage for attribution
    const hasUTMParams = Object.values(utmParams).some(param => param !== null);
    
    if (hasUTMParams) {
      sessionStorage.setItem('bantu_stall_utm', JSON.stringify(utmParams));
      
      // Track UTM parameters as custom event
      if ((window as any).gtag) {
        (window as any).gtag('event', 'utm_tracking', {
          event_category: 'marketing',
          event_label: utmParams.utm_campaign || 'unknown',
          custom_parameters: utmParams
        });
      }
    }
  }, []);

  return null;
};

export default Analytics;