import React from 'react';
import { Helmet } from 'react-helmet-async';

interface PageSEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  image?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  type?: string;
  locale?: string;
  region?: string;
}

const PageSEO: React.FC<PageSEOProps> = ({
  title,
  description,
  keywords = [],
  canonicalUrl,
  image = "/lovable-uploads/1e30f5a7-9164-442b-944d-5cf12df96a0b.png",
  breadcrumbs = [],
  type = "website",
  locale = "en",
  region
}) => {
  const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const fullTitle = title.includes('Bantu Stall') ? title : `${title} | Bantu Stall`;
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Geo-targeting */}
      {region && <meta property="geo.region" content={region} />}
      {locale && <meta property="og:locale" content={locale} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Bantu Stall" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Bantu Stall" />
      
      {/* BreadcrumbList Structured Data */}
      {breadcrumbs.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((crumb, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": crumb.name,
              "item": crumb.url
            }))
          })}
        </script>
      )}
    </Helmet>
  );
};

export default PageSEO;