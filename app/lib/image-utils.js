/**
 * Shopify CDN Image Optimization Utilities
 * Provides helpers for generating optimized image URLs with Shopify CDN transformations
 */

/**
 * Generate optimized Shopify CDN image URL
 * @param {string} url - Original image URL
 * @param {Object} options - Optimization options
 * @param {number} [options.width] - Desired width
 * @param {number} [options.height] - Desired height
 * @param {'webp'|'jpg'|'png'} [options.format] - Image format
 * @param {string} [options.crop] - Crop mode (center, top, bottom, left, right)
 * @param {number} [options.quality] - Image quality (1-100)
 * @returns {string} Optimized image URL
 */
export function optimizeShopifyImage(url, options = {}) {
  if (!url) return '';

  // Skip if not a Shopify CDN URL
  if (!url.includes('cdn.shopify.com') && !url.includes('shopify.com/s/files')) {
    return url;
  }

  const {
    width,
    height,
    format = 'webp',
    crop = 'center',
    quality = 85,
  } = options;

  // Remove existing transformations
  let baseUrl = url.split('?')[0];

  // Build transformation parameters
  const params = new URLSearchParams();

  if (width) params.set('width', width);
  if (height) params.set('height', height);
  params.set('format', format);
  params.set('crop', crop);

  // Only add quality for JPEG/WebP
  if (format === 'webp' || format === 'jpg') {
    params.set('quality', quality);
  }

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Generate responsive image srcset for Shopify CDN images
 * @param {string} url - Original image URL
 * @param {Array<number>} widths - Array of widths for srcset
 * @param {Object} options - Additional optimization options
 * @returns {string} srcset string
 */
export function generateImageSrcSet(url, widths = [320, 640, 960, 1280, 1920], options = {}) {
  if (!url) return '';

  return widths
    .map((width) => {
      const optimizedUrl = optimizeShopifyImage(url, {
        ...options,
        width,
      });
      return `${optimizedUrl} ${width}w`;
    })
    .join(', ');
}

/**
 * Generate optimized image data object for Hydrogen Image component
 * @param {string} url - Original image URL
 * @param {Object} options - Optimization options
 * @returns {Object} Image data object compatible with Hydrogen Image component
 */
export function createOptimizedImageData(url, options = {}) {
  const {
    altText = '',
    width = 800,
    height = 600,
    format = 'webp',
  } = options;

  return {
    url: optimizeShopifyImage(url, {width, height, format}),
    altText,
    width,
    height,
  };
}

/**
 * Preload critical images for better LCP
 * @param {Array<string>} urls - Array of image URLs to preload
 * @param {Object} options - Optimization options
 */
export function preloadImages(urls, options = {}) {
  if (typeof document === 'undefined') return;

  urls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = optimizeShopifyImage(url, options);

    // Add type attribute for WebP
    if (options.format === 'webp') {
      link.type = 'image/webp';
    }

    document.head.appendChild(link);
  });
}

/**
 * Detect WebP support and return appropriate format
 * @returns {Promise<string>} Supported format ('webp' or 'jpg')
 */
export async function detectWebPSupport() {
  if (typeof document === 'undefined') return 'jpg';

  // Check if already cached
  const cached = sessionStorage.getItem('webp-support');
  if (cached) return cached;

  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      const supported = webP.height === 2 ? 'webp' : 'jpg';
      sessionStorage.setItem('webp-support', supported);
      resolve(supported);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

/**
 * Get optimized thumbnail URL for product grids
 * @param {string} url - Original image URL
 * @param {Object} options - Options
 * @returns {string} Optimized thumbnail URL
 */
export function getProductThumbnail(url, options = {}) {
  const {
    size = 400,
    format = 'webp',
  } = options;

  return optimizeShopifyImage(url, {
    width: size,
    height: size,
    format,
    crop: 'center',
    quality: 85,
  });
}

/**
 * Get optimized hero image URL
 * @param {string} url - Original image URL
 * @param {Object} options - Options
 * @returns {string} Optimized hero image URL
 */
export function getHeroImage(url, options = {}) {
  const {
    width = 1920,
    format = 'webp',
  } = options;

  return optimizeShopifyImage(url, {
    width,
    format,
    quality: 90, // Higher quality for hero images
  });
}

/**
 * Create placeholder blur data URL for progressive loading
 * @param {string} url - Original image URL
 * @returns {string} Tiny blur placeholder URL
 */
export function getBlurPlaceholder(url) {
  return optimizeShopifyImage(url, {
    width: 20,
    format: 'jpg',
    quality: 20,
  });
}
