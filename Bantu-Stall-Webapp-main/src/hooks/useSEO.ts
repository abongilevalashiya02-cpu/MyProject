import { useEffect, useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SEOConfig } from '@/components/seo/SEOManager';

// Global gtag function declaration
declare global {
  function gtag(...args: any[]): void;
}

interface SEOHookOptions {
  trackPageView?: boolean;
  updateCanonical?: boolean;
  trackScrollDepth?: boolean;
  trackTimeOnPage?: boolean;
}

interface SEOMetrics {
  pageViewDuration: number;
  scrollDepth: number;
  interactions: number;
  exitIntent: boolean;
}

export const useSEO = (config?: Partial<SEOConfig>, options: SEOHookOptions = {}) => {
  const location = useLocation();
  const [metrics, setMetrics] = useState<SEOMetrics>({
    pageViewDuration: 0,
    scrollDepth: 0,
    interactions: 0,
    exitIntent: false
  });

  const {
    trackPageView = true,
    updateCanonical = true,
    trackScrollDepth = true,
    trackTimeOnPage = true
  } = options;

  // Track page view duration
  useEffect(() => {
    if (!trackTimeOnPage) return;

    const startTime = Date.now();
    
    return () => {
      const duration = Date.now() - startTime;
      setMetrics(prev => ({ ...prev, pageViewDuration: duration }));
      
      // Send analytics data
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', 'page_timing', {
          page_path: location.pathname,
          time_on_page: duration,
          custom_parameter: 'seo_tracking'
        });
      }
    };
  }, [location.pathname, trackTimeOnPage]);

  // Track scroll depth
  useEffect(() => {
    if (!trackScrollDepth) return;

    let maxScrollDepth = 0;
    let ticking = false;

    const trackScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        setMetrics(prev => ({ ...prev, scrollDepth: scrollPercent }));
        
        // Track milestone scroll depths
        if ([25, 50, 75, 90].includes(scrollPercent)) {
          if (typeof window !== 'undefined' && 'gtag' in window) {
            (window as any).gtag('event', 'scroll', {
              event_category: 'engagement',
              event_label: 'scroll_depth',
              value: scrollPercent,
              page_path: location.pathname
            });
          }
        }
      }
      
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(trackScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname, trackScrollDepth]);

  // Track user interactions
  useEffect(() => {
    let interactionCount = 0;

    const trackInteraction = (event: Event) => {
      interactionCount++;
      setMetrics(prev => ({ ...prev, interactions: interactionCount }));
      
      // Track significant interaction milestones
      if ([1, 5, 10, 20].includes(interactionCount)) {
        if (typeof window !== 'undefined' && 'gtag' in window) {
          (window as any).gtag('event', 'user_engagement', {
            event_category: 'engagement',
            event_label: 'interactions',
            value: interactionCount,
            page_path: location.pathname
          });
        }
      }
    };

    const events = ['click', 'keydown', 'touchstart', 'scroll'];
    events.forEach(event => {
      document.addEventListener(event, trackInteraction, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, trackInteraction);
      });
    };
  }, [location.pathname]);

  // Track exit intent
  useEffect(() => {
    const trackExitIntent = (event: MouseEvent) => {
      if (event.clientY <= 0) {
        setMetrics(prev => ({ ...prev, exitIntent: true }));
        
        if (typeof window !== 'undefined' && 'gtag' in window) {
          (window as any).gtag('event', 'exit_intent', {
            event_category: 'engagement',
            page_path: location.pathname,
            scroll_depth: metrics.scrollDepth,
            time_on_page: metrics.pageViewDuration
          });
        }
      }
    };

    document.addEventListener('mouseleave', trackExitIntent);
    return () => document.removeEventListener('mouseleave', trackExitIntent);
  }, [location.pathname, metrics.scrollDepth, metrics.pageViewDuration]);

  // Update canonical URL
  useEffect(() => {
    if (!updateCanonical) return;

    const canonicalUrl = config?.canonicalUrl || `${window.location.origin}${location.pathname}`;
    
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;
  }, [location.pathname, config?.canonicalUrl, updateCanonical]);

  // Track page views for analytics
  useEffect(() => {
    if (!trackPageView) return;

    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('config', 'GA_TRACKING_ID', {
        page_path: location.pathname,
        page_title: config?.title || document.title,
        custom_map: {
          custom_parameter_1: 'seo_optimized'
        }
      });
    }

    // Track Core Web Vitals
    if ('web-vital' in window) {
      // @ts-ignore
      window['web-vital'].getCLS(sendToAnalytics);
      // @ts-ignore
      window['web-vital'].getFID(sendToAnalytics);
      // @ts-ignore
      window['web-vital'].getFCP(sendToAnalytics);
      // @ts-ignore
      window['web-vital'].getLCP(sendToAnalytics);
      // @ts-ignore
      window['web-vital'].getTTFB(sendToAnalytics);
    }
  }, [location.pathname, config?.title, trackPageView]);

  const sendToAnalytics = useCallback((metric: any) => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
        custom_parameter: 'core_web_vitals'
      });
    }
  }, []);

  const updateSEOConfig = useCallback((newConfig: Partial<SEOConfig>) => {
    // This would update the SEO configuration dynamically
    // Implementation depends on your state management solution
    console.log('Updating SEO config:', newConfig);
  }, []);

  const generateSitemap = useCallback(() => {
    // Generate dynamic sitemap based on current routes and content
    const routes = [
      { url: '/', priority: 1.0, changefreq: 'daily' },
      { url: '/about', priority: 0.8, changefreq: 'weekly' },
      { url: '/experiences', priority: 0.9, changefreq: 'daily' },
      { url: '/venues', priority: 0.9, changefreq: 'daily' },
      { url: '/contact', priority: 0.6, changefreq: 'monthly' },
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes.map(route => `
    <url>
      <loc>${window.location.origin}${route.url}</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>${route.changefreq}</changefreq>
      <priority>${route.priority}</priority>
    </url>
  `).join('')}
</urlset>`;

    return sitemap;
  }, []);

  const prefetchCriticalResources = useCallback((resources: string[]) => {
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = resource;
      document.head.appendChild(link);
    });
  }, []);

  const optimizeImages = useCallback((images: NodeListOf<HTMLImageElement>) => {
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      },
      { rootMargin: '50px' }
    );

    images.forEach(img => imageObserver.observe(img));
    return () => images.forEach(img => imageObserver.unobserve(img));
  }, []);

  return {
    metrics,
    updateSEOConfig,
    generateSitemap,
    prefetchCriticalResources,
    optimizeImages,
    currentPath: location.pathname
  };
};