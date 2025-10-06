import React, { useEffect } from 'react';
import { SEOConfig } from './SEOManager';

interface MetaManagerProps {
  config: SEOConfig;
}

export const MetaManager: React.FC<MetaManagerProps> = ({ config }) => {
  useEffect(() => {
    // Dynamic meta tag management for performance
    const updateMetaTag = (property: string, content: string, attribute: string = 'property') => {
      let existingTag = document.querySelector(`meta[${attribute}="${property}"]`);
      
      if (existingTag) {
        existingTag.setAttribute('content', content);
      } else {
        const newTag = document.createElement('meta');
        newTag.setAttribute(attribute, property);
        newTag.setAttribute('content', content);
        document.head.appendChild(newTag);
      }
    };

    // Performance timing
    updateMetaTag('performance:render-time', Date.now().toString(), 'name');
    
    // Content freshness indicators
    updateMetaTag('content:last-updated', new Date().toISOString(), 'name');
    
    // SEO quality indicators
    if (config.keywords && config.keywords.length > 0) {
      updateMetaTag('seo:keyword-density', calculateKeywordDensity(config.keywords, config.description), 'name');
    }
    
    // Content length indicator
    updateMetaTag('content:description-length', config.description.length.toString(), 'name');
    
    // Priority indicator for search engines
    if (config.priority) {
      updateMetaTag('seo:priority', config.priority.toString(), 'name');
    }

    // Schema.org hints
    updateMetaTag('schema:type', config.structuredData?.type || 'WebPage', 'name');

    return () => {
      // Cleanup performance markers
      const performanceTag = document.querySelector('meta[name="performance:render-time"]');
      if (performanceTag) {
        performanceTag.remove();
      }
    };
  }, [config]);

  const calculateKeywordDensity = (keywords: string[], content: string): string => {
    const totalWords = content.split(' ').length;
    const keywordOccurrences = keywords.reduce((count, keyword) => {
      const regex = new RegExp(keyword.toLowerCase(), 'gi');
      const matches = content.toLowerCase().match(regex);
      return count + (matches ? matches.length : 0);
    }, 0);
    
    return ((keywordOccurrences / totalWords) * 100).toFixed(2);
  };

  return null;
};