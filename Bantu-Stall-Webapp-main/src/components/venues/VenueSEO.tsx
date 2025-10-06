
import React, { useEffect } from 'react';
import { VenueType } from '@/types/venues';

interface VenueSEOProps {
  venues: VenueType[];
}

const VenueSEO: React.FC<VenueSEOProps> = ({ venues }) => {
  useEffect(() => {
    // Update page title for SEO
    document.title = `Corporate Retreat Venues South Africa | Musika Marketplace | Bantu Stall`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    const description = `Discover ${venues.length}+ premium corporate retreat venues across South Africa. From luxury mountain lodges to eco-friendly bush camps, find the perfect setting for team building, strategy sessions, and business events.`;
    
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }

    // Add keywords meta tag
    const keywords = [
      'corporate retreat venues south africa',
      'team building venues johannesburg',
      'business retreat locations gauteng',
      'conference venues muldersdrift',
      'executive retreat centers',
      'company offsite venues',
      'corporate event spaces',
      'business meeting venues',
      'team building activities south africa',
      'corporate hospitality venues'
    ].join(', ');

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = keywords;
      document.head.appendChild(meta);
    }

    // Structured data for search engines and AI
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Corporate Retreat Venues in South Africa",
      "description": "Curated collection of premium corporate retreat venues for team building and business events",
      "numberOfItems": venues.length,
      "itemListElement": venues.map((venue, index) => ({
        "@type": "TouristAttraction",
        "position": index + 1,
        "name": venue.name,
        "description": venue.summary,
        "image": venue.coverImage,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": venue.location.area,
          "addressRegion": "Gauteng",
          "addressCountry": "South Africa"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": venue.location.coordinates?.lat || -25.7479,
          "longitude": venue.location.coordinates?.lng || 28.2293
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": venue.bantuRating,
          "bestRating": 5,
          "worstRating": 1
        },
        "amenityFeature": venue.activities.map(activity => ({
          "@type": "LocationFeatureSpecification",
          "name": activity,
          "value": true
        })),
        "maximumAttendeeCapacity": venue.capacity.max,
        "minimumAttendeeCapacity": venue.capacity.min,
        "isAccessibleForFree": false,
        "publicAccess": false,
        "tourBookingPage": window.location.href,
        "keywords": [
          venue.features.luxury ? "luxury" : null,
          venue.features.ecoFriendly ? "eco-friendly" : null,
          venue.csrAlignment ? "csr-aligned" : null,
          "corporate retreat",
          "team building",
          venue.location.area.toLowerCase()
        ].filter(Boolean).join(', ')
      }))
    };

    // Add structured data script
    let structuredDataScript = document.querySelector('#venues-structured-data');
    if (structuredDataScript) {
      structuredDataScript.textContent = JSON.stringify(structuredData);
    } else {
      structuredDataScript = document.createElement('script');
      structuredDataScript.id = 'venues-structured-data';
      structuredDataScript.setAttribute('type', 'application/ld+json');
      structuredDataScript.textContent = JSON.stringify(structuredData);
      document.head.appendChild(structuredDataScript);
    }

    // Add Open Graph tags for social sharing
    const updateOrCreateOGTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (tag) {
        tag.setAttribute('content', content);
      } else {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        tag.setAttribute('content', content);
        document.head.appendChild(tag);
      }
    };

    updateOrCreateOGTag('og:title', 'Corporate Retreat Venues South Africa | Musika Marketplace');
    updateOrCreateOGTag('og:description', description);
    updateOrCreateOGTag('og:type', 'website');
    updateOrCreateOGTag('og:url', window.location.href);
    updateOrCreateOGTag('og:site_name', 'Bantu Stall');
    updateOrCreateOGTag('og:locale', 'en_ZA');

    // Cleanup function
    return () => {
      const scriptToRemove = document.querySelector('#venues-structured-data');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [venues]);

  return null;
};

export default VenueSEO;
