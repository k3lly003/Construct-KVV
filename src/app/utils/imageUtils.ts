/**
 * Utility functions for handling images in the application
 */

/**
 * Replaces example.com URLs with proper placeholder images
 * This is a temporary fix until all example.com URLs are replaced with proper image URLs
 */
export const replaceExampleUrls = (imageUrl: string): string => {
  if (!imageUrl) return imageUrl;
  
  // Replace example.com URLs with proper placeholder images
  if (imageUrl.includes('example.com')) {
    // Use Unsplash placeholder images instead
    const placeholders = [
      'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&q=80&w=400&h=300',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400&h=300',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400&h=300',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=400&h=300',
    ];
    
    // Use a hash of the URL to consistently map to the same placeholder
    const hash = imageUrl.split('').reduce((a, b) => {
      a = ((a << 5) - a + b.charCodeAt(0)) & 0xffffffff;
      return a;
    }, 0);
    
    return placeholders[Math.abs(hash) % placeholders.length];
  }
  
  return imageUrl;
};

/**
 * Gets a fallback image URL if the provided image URL is invalid
 */
export const getFallbackImage = (imageUrl?: string, fallbackType: 'product' | 'user' | 'general' = 'general'): string => {
  if (!imageUrl || imageUrl.includes('example.com')) {
    switch (fallbackType) {
      case 'product':
        return 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&q=80&w=400&h=300';
      case 'user':
        return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200';
      default:
        return 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400&h=300';
    }
  }
  
  return imageUrl;
};

/**
 * Validates if an image URL is from an allowed domain
 */
export const isValidImageUrl = (imageUrl: string): boolean => {
  if (!imageUrl) return false;
  
  const allowedDomains = [
    'res.cloudinary.com',
    'images.unsplash.com',
    'unsplash.com',
    'www.google.com',
    'images.pexels.com',
    'source.unsplash.com',
    'certificatesinn.com',
  ];
  
  try {
    const url = new URL(imageUrl);
    return allowedDomains.some(domain => url.hostname === domain || url.hostname.endsWith(`.${domain}`));
  } catch {
    return false;
  }
};
