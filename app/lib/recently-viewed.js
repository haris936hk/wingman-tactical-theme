/**
 * Recently Viewed Products Utilities
 * Tracks and manages recently viewed products using localStorage
 */

const STORAGE_KEY = 'wingman_recently_viewed';
const MAX_ITEMS = 12;

/**
 * Add a product to recently viewed
 * @param {{
 *   id: string;
 *   handle: string;
 *   title: string;
 *   featuredImage?: {url: string, altText?: string};
 *   priceRange: {minVariantPrice: {amount: string, currencyCode: string}};
 * }} product
 */
export function addRecentlyViewed(product) {
  if (typeof window === 'undefined') return;

  try {
    const recent = getRecentlyViewed();

    // Remove product if it already exists (to move it to front)
    const filtered = recent.filter((item) => item.id !== product.id);

    // Add to beginning of array
    const updated = [
      {
        id: product.id,
        handle: product.handle,
        title: product.title,
        featuredImage: product.featuredImage,
        price: product.priceRange?.minVariantPrice,
        viewedAt: new Date().toISOString(),
      },
      ...filtered,
    ].slice(0, MAX_ITEMS); // Keep only MAX_ITEMS most recent

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save recently viewed product:', error);
  }
}

/**
 * Get all recently viewed products
 * @returns {Array}
 */
export function getRecentlyViewed() {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load recently viewed products:', error);
    return [];
  }
}

/**
 * Clear all recently viewed products
 */
export function clearRecentlyViewed() {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear recently viewed products:', error);
  }
}

/**
 * Remove a specific product from recently viewed
 * @param {string} productId
 */
export function removeRecentlyViewed(productId) {
  if (typeof window === 'undefined') return;

  try {
    const recent = getRecentlyViewed();
    const filtered = recent.filter((item) => item.id !== productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove recently viewed product:', error);
  }
}

/**
 * Get recently viewed excluding current product
 * @param {string} currentProductId
 * @param {number} limit
 * @returns {Array}
 */
export function getRecentlyViewedExcluding(currentProductId, limit = 8) {
  const recent = getRecentlyViewed();
  return recent.filter((item) => item.id !== currentProductId).slice(0, limit);
}
