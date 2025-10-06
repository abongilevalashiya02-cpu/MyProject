// Image optimization utilities for property listings

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'webp' | 'png';
}

/**
 * Optimizes an image file by resizing and compressing it
 */
export const optimizeImage = async (
  file: File, 
  options: ImageOptimizationOptions = {}
): Promise<File> => {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.85,
    format = 'jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress image
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to optimize image'));
            return;
          }
          
          const optimizedFile = new File(
            [blob], 
            `optimized_${file.name.replace(/\.[^/.]+$/, '')}.${format}`,
            { 
              type: `image/${format}`,
              lastModified: Date.now()
            }
          );
          
          resolve(optimizedFile);
        },
        `image/${format}`,
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Generates multiple optimized versions of an image for different use cases
 */
export const generateImageVariants = async (file: File) => {
  const variants = await Promise.all([
    // Thumbnail (for listings grid)
    optimizeImage(file, { 
      maxWidth: 400, 
      maxHeight: 300, 
      quality: 0.8,
      format: 'webp'
    }),
    // Medium (for property cards)
    optimizeImage(file, { 
      maxWidth: 800, 
      maxHeight: 600, 
      quality: 0.85,
      format: 'webp'
    }),
    // Large (for property details)
    optimizeImage(file, { 
      maxWidth: 1920, 
      maxHeight: 1080, 
      quality: 0.9,
      format: 'webp'
    }),
  ]);

  return {
    thumbnail: variants[0],
    medium: variants[1],
    large: variants[2],
    original: file
  };
};

/**
 * Validates image file before processing
 */
export const validateImageFile = (file: File): string | null => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return 'File type not supported. Please upload JPG, PNG, or WebP images.';
  }

  if (file.size > maxSize) {
    return 'File size too large. Maximum size is 10MB.';
  }

  return null;
};

/**
 * Creates a preview URL for an image file
 */
export const createImagePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Cleanup preview URLs to prevent memory leaks
 */
export const cleanupImagePreview = (url: string): void => {
  URL.revokeObjectURL(url);
};

/**
 * Batch optimize multiple images with progress callback
 */
export const batchOptimizeImages = async (
  files: File[],
  options: ImageOptimizationOptions = {},
  onProgress?: (completed: number, total: number) => void
): Promise<File[]> => {
  const optimizedImages: File[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    try {
      const optimized = await optimizeImage(file, options);
      optimizedImages.push(optimized);
    } catch (error) {
      console.error(`Failed to optimize ${file.name}:`, error);
      // Keep original file if optimization fails
      optimizedImages.push(file);
    }
    
    onProgress?.(i + 1, files.length);
  }
  
  return optimizedImages;
};

/**
 * Get image dimensions without loading the full image
 */
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Progressive image loading utility
 */
export class ProgressiveImageLoader {
  private loadedImages = new Set<string>();
  
  async loadImage(src: string, placeholderSrc?: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      // Show placeholder first if provided
      if (placeholderSrc && !this.loadedImages.has(placeholderSrc)) {
        const placeholder = new Image();
        placeholder.src = placeholderSrc;
        this.loadedImages.add(placeholderSrc);
      }
      
      img.onload = () => {
        this.loadedImages.add(src);
        resolve(img);
      };
      
      img.onerror = reject;
      img.src = src;
    });
  }
  
  isImageLoaded(src: string): boolean {
    return this.loadedImages.has(src);
  }
  
  preloadImages(srcs: string[]): Promise<HTMLImageElement[]> {
    return Promise.all(srcs.map(src => this.loadImage(src)));
  }
}
