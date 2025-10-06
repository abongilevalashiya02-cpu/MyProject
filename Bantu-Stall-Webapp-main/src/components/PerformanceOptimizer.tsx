import { useEffect } from 'react';

/**
 * Performance optimizer component that implements lazy loading and other optimizations
 */
export const PerformanceOptimizer = () => {
  useEffect(() => {
    // Implement lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));

    // Preload critical resources
    const criticalResources = [
      '/lovable-uploads/1e30f5a7-9164-442b-944d-5cf12df96a0b.png'
    ];

    criticalResources.forEach((resource) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = resource;
      document.head.appendChild(link);
    });

    // Cleanup
    return () => {
      images.forEach((img) => imageObserver.unobserve(img));
    };
  }, []);

  return null;
};

/**
 * Optimized image component with lazy loading and WebP support
 */
interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height
}) => {
  return (
    <picture>
      {/* WebP version for supported browsers */}
      <source srcSet={`${src.replace(/\.(jpg|jpeg|png)$/i, '.webp')}`} type="image/webp" />
      {/* Fallback image */}
      <img
        data-src={src}
        alt={alt}
        className={`${className} transition-opacity duration-300`}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
};