import React from 'react';
import { Helmet } from 'react-helmet-async';

interface StructuredDataManagerProps {
  type: 'Organization' | 'WebPage' | 'Article' | 'Product' | 'Service' | 'Event' | 'FAQ';
  data: Record<string, any>;
  url: string;
  title: string;
  description: string;
  image: string;
}

export const StructuredDataManager: React.FC<StructuredDataManagerProps> = ({
  type,
  data,
  url,
  title,
  description,
  image
}) => {
  const generateOrganizationSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}#organization`,
    "name": "Bantu Stall",
    "url": url,
    "logo": image,
    "description": "Pan-African experiential learning marketplace connecting culture, business, and community across Africa",
    "foundingDate": "2024",
    "founder": {
      "@type": "Person",
      "name": "Bantu Stall Founders"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+1-XXX-XXX-XXXX",
        "contactType": "customer service",
        "email": "info@bantustall.com",
        "availableLanguage": ["English", "French", "Arabic", "Swahili"]
      }
    ],
    "sameAs": [
      "https://facebook.com/bantustall",
      "https://twitter.com/bantustall", 
      "https://linkedin.com/company/bantustall",
      "https://instagram.com/bantustall"
    ],
    "areaServed": [
      {
        "@type": "Place",
        "name": "Africa",
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "0.0236",
          "longitude": "37.9062"
        }
      }
    ],
    "serviceType": [
      "Cultural Experience Booking",
      "Business Networking Platform",
      "African Trade Marketplace", 
      "Educational Content Hub",
      "Event Management Services"
    ],
    "knowsAbout": [
      "African Culture",
      "Pan-African Business",
      "Cultural Tourism",
      "African Heritage",
      "Cross-border Trade",
      "Cultural Education"
    ],
    ...data
  });

  const generateWebPageSchema = () => ({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    "url": url,
    "name": title,
    "description": description,
    "image": image,
    "publisher": {
      "@id": `${url}#organization`
    },
    "inLanguage": "en-US",
    "isPartOf": {
      "@type": "WebSite",
      "@id": `${new URL(url).origin}#website`
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": generateBreadcrumbs(url)
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${new URL(url).origin}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    ...data
  });

  const generateArticleSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    "headline": title,
    "description": description,
    "image": image,
    "url": url,
    "datePublished": data.datePublished || new Date().toISOString(),
    "dateModified": data.dateModified || new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "@id": `${new URL(url).origin}#organization`
    },
    "publisher": {
      "@type": "Organization",
      "@id": `${new URL(url).origin}#organization`
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "articleSection": data.section || "African Business & Culture",
    "keywords": data.keywords || ["African business", "cultural experiences", "Pan-African", "trade"],
    "wordCount": data.wordCount,
    "articleBody": data.content,
    ...data
  });

  const generateProductSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    "name": title,
    "description": description,
    "image": image,
    "url": url,
    "brand": {
      "@type": "Organization",
      "@id": `${new URL(url).origin}#organization`
    },
    "category": data.category || "Cultural Experience",
    "offers": {
      "@type": "Offer",
      "price": data.price,
      "priceCurrency": data.currency || "USD",
      "availability": data.availability || "https://schema.org/InStock",
      "validFrom": data.validFrom,
      "validThrough": data.validThrough,
      "seller": {
        "@id": `${new URL(url).origin}#organization`
      }
    },
    "aggregateRating": data.rating ? {
      "@type": "AggregateRating",
      "ratingValue": data.rating.value,
      "ratingCount": data.rating.count,
      "bestRating": data.rating.best || 5,
      "worstRating": data.rating.worst || 1
    } : undefined,
    ...data
  });

  const generateServiceSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    "name": title,
    "description": description,
    "image": image,
    "url": url,
    "provider": {
      "@type": "Organization",
      "@id": `${new URL(url).origin}#organization`
    },
    "serviceType": data.serviceType || "Cultural Experience Service",
    "areaServed": {
      "@type": "Place",
      "name": "Africa"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "African Cultural Services",
      "itemListElement": data.offerings || []
    },
    ...data
  });

  const generateEventSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": `${url}#event`,
    "name": title,
    "description": description,
    "image": image,
    "url": url,
    "startDate": data.startDate,
    "endDate": data.endDate,
    "location": data.location ? {
      "@type": "Place",
      "name": data.location.name,
      "address": data.location.address
    } : undefined,
    "organizer": {
      "@type": "Organization",
      "@id": `${new URL(url).origin}#organization`
    },
    "offers": data.offers ? {
      "@type": "Offer",
      "price": data.offers.price,
      "priceCurrency": data.offers.currency || "USD",
      "availability": "https://schema.org/InStock",
      "url": data.offers.url || url
    } : undefined,
    ...data
  });

  const generateFAQSchema = () => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    "mainEntity": data.questions?.map((item: any, index: number) => ({
      "@type": "Question",
      "@id": `${url}#question-${index}`,
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    })) || []
  });

  const generateBreadcrumbs = (currentUrl: string) => {
    const url = new URL(currentUrl);
    const pathSegments = url.pathname.split('/').filter(segment => segment);
    
    const breadcrumbs = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": url.origin
      }
    ];

    let currentPath = url.origin;
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      breadcrumbs.push({
        "@type": "ListItem",
        "position": index + 2,
        "name": segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        "item": currentPath
      });
    });

    return breadcrumbs;
  };

  const getSchemaData = () => {
    switch (type) {
      case 'Organization':
        return generateOrganizationSchema();
      case 'WebPage':
        return generateWebPageSchema();
      case 'Article':
        return generateArticleSchema();
      case 'Product':
        return generateProductSchema();
      case 'Service':
        return generateServiceSchema();
      case 'Event':
        return generateEventSchema();
      case 'FAQ':
        return generateFAQSchema();
      default:
        return generateWebPageSchema();
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(getSchemaData())}
      </script>
    </Helmet>
  );
};