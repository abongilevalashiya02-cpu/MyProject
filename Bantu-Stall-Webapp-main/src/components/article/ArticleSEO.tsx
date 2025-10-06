
import React, { useEffect } from 'react';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  image: string;
  author: string;
  date: string;
  keywords?: string[];
  seoDescription?: string;
}

interface ArticleSEOProps {
  article: Article;
}

const ArticleSEO: React.FC<ArticleSEOProps> = ({ article }) => {
  useEffect(() => {
    // Update page title
    document.title = `${article.title} | Bantu Stall - Indaba`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', article.seoDescription || article.excerpt);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = article.seoDescription || article.excerpt;
      document.head.appendChild(meta);
    }

    // Add keywords meta tag
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', article.keywords?.join(', ') || '');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = article.keywords?.join(', ') || '';
      document.head.appendChild(meta);
    }

    // Open Graph tags for social sharing
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

    updateOrCreateOGTag('og:title', article.title);
    updateOrCreateOGTag('og:description', article.seoDescription || article.excerpt);
    updateOrCreateOGTag('og:image', article.image);
    updateOrCreateOGTag('og:type', 'article');
    updateOrCreateOGTag('og:url', window.location.href);
    updateOrCreateOGTag('og:site_name', 'Bantu Stall');

    // Twitter Card tags
    const updateOrCreateTwitterTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (tag) {
        tag.setAttribute('content', content);
      } else {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        tag.setAttribute('content', content);
        document.head.appendChild(tag);
      }
    };

    updateOrCreateTwitterTag('twitter:card', 'summary_large_image');
    updateOrCreateTwitterTag('twitter:title', article.title);
    updateOrCreateTwitterTag('twitter:description', article.seoDescription || article.excerpt);
    updateOrCreateTwitterTag('twitter:image', article.image);

    // Article-specific meta tags
    updateOrCreateOGTag('article:published_time', new Date(article.date).toISOString());
    updateOrCreateOGTag('article:author', article.author);
    updateOrCreateOGTag('article:section', article.category);
    if (article.keywords) {
      article.keywords.forEach(keyword => {
        const tag = document.createElement('meta');
        tag.setAttribute('property', 'article:tag');
        tag.setAttribute('content', keyword);
        document.head.appendChild(tag);
      });
    }

    // Structured data for AI and search engines
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.seoDescription || article.excerpt,
      "image": article.image,
      "author": {
        "@type": "Organization",
        "name": article.author
      },
      "publisher": {
        "@type": "Organization",
        "name": "Bantu Stall",
        "logo": {
          "@type": "ImageObject",
          "url": "https://bantustall.com/logo.png"
        }
      },
      "datePublished": new Date(article.date).toISOString(),
      "dateModified": new Date(article.date).toISOString(),
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href
      },
      "keywords": article.keywords?.join(', '),
      "articleSection": article.category,
      "wordCount": article.content.split(' ').length,
      "timeRequired": article.readTime,
      "about": [
        {
          "@type": "Event",
          "name": "G20 Summit 2025",
          "location": {
            "@type": "Place",
            "name": "South Africa"
          },
          "startDate": "2025",
          "description": "G20 Summit taking place in South Africa for the first time"
        },
        {
          "@type": "Thing",
          "name": "Media Strategy",
          "description": "Strategic communications and marketing approaches for leveraging major international events"
        },
        {
          "@type": "Place",
          "name": "South Africa",
          "description": "Host country for the 2025 G20 Summit"
        }
      ]
    };

    // Add structured data script
    let structuredDataScript = document.querySelector('#structured-data');
    if (structuredDataScript) {
      structuredDataScript.textContent = JSON.stringify(structuredData);
    } else {
      structuredDataScript = document.createElement('script');
      structuredDataScript.id = 'structured-data';
      structuredDataScript.setAttribute('type', 'application/ld+json');
      structuredDataScript.textContent = JSON.stringify(structuredData);
      document.head.appendChild(structuredDataScript);
    }

    // Cleanup function
    return () => {
      // Remove article-specific tags when component unmounts
      const tagsToRemove = document.querySelectorAll('meta[property="article:tag"]');
      tagsToRemove.forEach(tag => tag.remove());
    };
  }, [article]);

  return null;
};

export default ArticleSEO;
