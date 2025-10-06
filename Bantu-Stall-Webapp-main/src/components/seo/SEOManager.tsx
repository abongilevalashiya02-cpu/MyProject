import React, { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { GeoSEO } from './GeoSEO';
import { StructuredDataManager } from './StructuredDataManager';
import { MetaManager } from './MetaManager';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  priority?: number;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  alternateLanguages?: Array<{ lang: string; url: string }>;
  geoTargeting?: {
    region: string;
    placename?: string;
    position?: string;
  };
  structuredData?: {
    type: 'Organization' | 'WebPage' | 'Article' | 'Product' | 'Service' | 'Event' | 'FAQ';
    data: Record<string, any>;
  };
  openGraph?: {
    type?: string;
    siteName?: string;
    locale?: string;
    article?: {
      author?: string;
      publishedTime?: string;
      modifiedTime?: string;
      section?: string;
      tags?: string[];
    };
  };
  twitter?: {
    site?: string;
    creator?: string;
    cardType?: 'summary' | 'summary_large_image' | 'app' | 'player';
  };
}

interface SEOManagerProps {
  config: SEOConfig;
  children?: React.ReactNode;
}

export const SEOManager: React.FC<SEOManagerProps> = ({ config, children }) => {
  const location = useLocation();
  
  const currentUrl = useMemo(() => {
    return config.canonicalUrl || `${window.location.origin}${location.pathname}`;
  }, [config.canonicalUrl, location.pathname]);

  const fullTitle = useMemo(() => {
    const brandName = 'Bantu Stall';
    return config.title.includes(brandName) ? config.title : `${config.title} | ${brandName}`;
  }, [config.title]);

  const optimizedImage = useMemo(() => {
    return config.image || "/lovable-uploads/1e30f5a7-9164-442b-944d-5cf12df96a0b.png";
  }, [config.image]);

  const robotsContent = useMemo(() => {
    const directives = [];
    if (config.noIndex) directives.push('noindex');
    else directives.push('index');
    
    if (config.noFollow) directives.push('nofollow');
    else directives.push('follow');
    
    return directives.join(', ');
  }, [config.noIndex, config.noFollow]);

  // Performance optimization: preload critical resources
  useEffect(() => {
    // Preload primary image
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = optimizedImage;
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [optimizedImage]);

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{fullTitle}</title>
        <meta name="title" content={fullTitle} />
        <meta name="description" content={config.description} />
        {config.keywords && config.keywords.length > 0 && (
          <meta name="keywords" content={config.keywords.join(', ')} />
        )}

        {/* Robots and Indexing */}
        <meta name="robots" content={robotsContent} />
        <meta name="googlebot" content={robotsContent} />
        <meta name="bingbot" content={robotsContent} />

        {/* Canonical URL */}
        <link rel="canonical" href={currentUrl} />

        {/* Alternate Languages */}
        {config.alternateLanguages?.map((alt) => (
          <link
            key={alt.lang}
            rel="alternate"
            hrefLang={alt.lang}
            href={alt.url}
          />
        ))}

        {/* Open Graph */}
        <meta property="og:type" content={config.openGraph?.type || 'website'} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={config.description} />
        <meta property="og:image" content={optimizedImage} />
        <meta property="og:image:alt" content={`${config.title} - Bantu Stall`} />
        <meta property="og:site_name" content={config.openGraph?.siteName || 'Bantu Stall'} />
        <meta property="og:locale" content={config.openGraph?.locale || 'en_US'} />

        {/* Open Graph Article */}
        {config.openGraph?.article && (
          <>
            {config.openGraph.article.author && (
              <meta property="article:author" content={config.openGraph.article.author} />
            )}
            {config.openGraph.article.publishedTime && (
              <meta property="article:published_time" content={config.openGraph.article.publishedTime} />
            )}
            {config.openGraph.article.modifiedTime && (
              <meta property="article:modified_time" content={config.openGraph.article.modifiedTime} />
            )}
            {config.openGraph.article.section && (
              <meta property="article:section" content={config.openGraph.article.section} />
            )}
            {config.openGraph.article.tags?.map((tag, index) => (
              <meta key={index} property="article:tag" content={tag} />
            ))}
          </>
        )}

        {/* Twitter Card */}
        <meta name="twitter:card" content={config.twitter?.cardType || 'summary_large_image'} />
        <meta name="twitter:url" content={currentUrl} />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={config.description} />
        <meta name="twitter:image" content={optimizedImage} />
        {config.twitter?.site && <meta name="twitter:site" content={config.twitter.site} />}
        {config.twitter?.creator && <meta name="twitter:creator" content={config.twitter.creator} />}

        {/* Additional SEO Meta Tags */}
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="author" content="Bantu Stall" />
        <meta name="copyright" content="© 2024 Bantu Stall. All rights reserved." />
        
        {/* Performance and Security */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </Helmet>

      {/* Geo-targeting SEO */}
      {config.geoTargeting && <GeoSEO {...config.geoTargeting} />}

      {/* Structured Data */}
      {config.structuredData && (
        <StructuredDataManager
          type={config.structuredData.type}
          data={config.structuredData.data}
          url={currentUrl}
          title={fullTitle}
          description={config.description}
          image={optimizedImage}
        />
      )}

      {/* Meta Manager for dynamic updates */}
      <MetaManager config={config} />

      {children}
    </>
  );
};

export type { SEOConfig };