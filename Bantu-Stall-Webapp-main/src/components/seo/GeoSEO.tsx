import React from 'react';
import { Helmet } from 'react-helmet-async';

interface GeoSEOProps {
  region: string;
  placename?: string;
  position?: string;
  localBusiness?: {
    name: string;
    type: string;
    address: {
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
      addressCountry: string;
    };
    telephone?: string;
    email?: string;
    url?: string;
    openingHours?: string[];
    priceRange?: string;
    paymentAccepted?: string[];
    languages?: string[];
  };
}

export const GeoSEO: React.FC<GeoSEOProps> = ({ 
  region, 
  placename, 
  position, 
  localBusiness 
}) => {
  return (
    <Helmet>
      {/* Geographic targeting */}
      <meta name="geo.region" content={region} />
      {placename && <meta name="geo.placename" content={placename} />}
      {position && <meta name="geo.position" content={position} />}
      <meta name="ICBM" content={position || "0,0"} />

      {/* Local Business Structured Data */}
      {localBusiness && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": localBusiness.url ? `${localBusiness.url}#organization` : undefined,
            "name": localBusiness.name,
            "description": "Pan-African experiential learning marketplace connecting culture, business, and community",
            "url": localBusiness.url,
            "telephone": localBusiness.telephone,
            "email": localBusiness.email,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": localBusiness.address.streetAddress,
              "addressLocality": localBusiness.address.addressLocality,
              "addressRegion": localBusiness.address.addressRegion,
              "postalCode": localBusiness.address.postalCode,
              "addressCountry": localBusiness.address.addressCountry
            },
            "openingHours": localBusiness.openingHours,
            "priceRange": localBusiness.priceRange,
            "paymentAccepted": localBusiness.paymentAccepted,
            "knowsLanguage": localBusiness.languages,
            "areaServed": [
              {
                "@type": "Country",
                "name": "Nigeria"
              },
              {
                "@type": "Country", 
                "name": "Ghana"
              },
              {
                "@type": "Country",
                "name": "Kenya"
              },
              {
                "@type": "Country",
                "name": "South Africa"
              },
              {
                "@type": "Country",
                "name": "Morocco"
              },
              {
                "@type": "Country",
                "name": "Egypt"
              }
            ],
            "serviceType": [
              "Cultural Experiences",
              "Business Networking",
              "Trade Platform",
              "Learning Marketplace",
              "Event Management"
            ]
          })}
        </script>
      )}

      {/* Geographic Content Optimization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "African Business & Cultural Hub",
          "description": "Connecting Pan-African experiences, trade, and community across the continent",
          "spatialCoverage": [
            {
              "@type": "Place",
              "name": "Africa",
              "geo": {
                "@type": "GeoShape",
                "box": "-35.0 -20.0 37.0 55.0"
              }
            }
          ],
          "audience": {
            "@type": "Audience",
            "geographicArea": [
              {
                "@type": "Country",
                "name": "Nigeria"
              },
              {
                "@type": "Country",
                "name": "Ghana" 
              },
              {
                "@type": "Country",
                "name": "Kenya"
              },
              {
                "@type": "Country",
                "name": "South Africa"
              }
            ]
          }
        })}
      </script>

      {/* Multilingual Support Hints */}
      <link rel="alternate" hrefLang="en" href={typeof window !== 'undefined' ? window.location.href : ''} />
      <link rel="alternate" hrefLang="fr" href={typeof window !== 'undefined' ? `${window.location.href}?lang=fr` : ''} />
      <link rel="alternate" hrefLang="ar" href={typeof window !== 'undefined' ? `${window.location.href}?lang=ar` : ''} />
      <link rel="alternate" hrefLang="sw" href={typeof window !== 'undefined' ? `${window.location.href}?lang=sw` : ''} />
      <link rel="alternate" hrefLang="x-default" href={typeof window !== 'undefined' ? window.location.href : ''} />
    </Helmet>
  );
};