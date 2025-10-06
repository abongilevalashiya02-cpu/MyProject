import React from 'react';
import { Helmet } from 'react-helmet-async';

interface EnhancedSEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  image?: string;
  type?: string;
}

const EnhancedSEO: React.FC<EnhancedSEOProps> = ({
  title = "Bantu Stall - Pan-African Experiential Learning Marketplace",
  description = "Connect with authentic African experiences through curated learning, networking, trade opportunities, cultural events, and heritage resources. Your gateway to Pan-African community and business connections.",
  keywords = [
    "African business marketplace",
    "Pan-African experiences", 
    "trade platform for African SMEs",
    "African cultural learning",
    "African business networking",
    "African heritage resources",
    "Pan-African community",
    "African travel experiences",
    "cultural immersion Africa",
    "African business events"
  ],
  canonicalUrl,
  image = "/lovable-uploads/1e30f5a7-9164-442b-944d-5cf12df96a0b.png",
  type = "website"
}) => {
  const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Bantu Stall" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Bantu Stall" />
      
      {/* Performance and Rendering */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      
      {/* Structured Data - Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Bantu Stall",
          "description": "Pan-African experiential learning marketplace connecting culture, business, and community",
          "url": currentUrl,
          "logo": image,
          "sameAs": [
            "https://facebook.com/bantustall",
            "https://twitter.com/bantustall",
            "https://linkedin.com/company/bantustall"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "info@bantustall.com"
          }
        })}
      </script>
      
      {/* Structured Data - Website */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Bantu Stall",
          "url": currentUrl,
          "description": description,
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${currentUrl}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
    </Helmet>
  );
};

export default EnhancedSEO;