/**
 * Product Comparison Utilities
 * Tracks and manages products selected for comparison using localStorage
 */

const STORAGE_KEY = 'wingman_product_compare';
const MAX_COMPARE_ITEMS = 4; // Maximum products to compare at once

/**
 * Get all products in comparison
 * @returns {Array}
 */
export function getCompareProducts() {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load comparison products:', error);
    return [];
  }
}

/**
 * Add a product to comparison
 * @param {{
 *   id: string;
 *   handle: string;
 *   title: string;
 *   featuredImage?: {url: string, altText?: string};
 *   price: {amount: string, currencyCode: string};
 *   compareAtPrice?: {amount: string, currencyCode: string};
 *   vendor?: string;
 *   availableForSale?: boolean;
 *   description?: string;
 *   options?: Array;
 *   variants?: Array;
 * }} product
 * @returns {boolean} - Returns true if added successfully, false if limit reached
 */
export function addToCompare(product) {
  if (typeof window === 'undefined') return false;

  try {
    const current = getCompareProducts();

    // Check if already in comparison
    if (current.some((item) => item.id === product.id)) {
      return true; // Already added
    }

    // Check if limit reached
    if (current.length >= MAX_COMPARE_ITEMS) {
      return false; // Limit reached
    }

    // Add to comparison
    const updated = [
      ...current,
      {
        id: product.id,
        handle: product.handle,
        title: product.title,
        featuredImage: product.featuredImage,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        vendor: product.vendor,
        availableForSale: product.availableForSale,
        description: product.description,
        options: product.options,
        variants: product.variants,
        addedAt: new Date().toISOString(),
      },
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Dispatch custom event for UI updates
    window.dispatchEvent(new CustomEvent('compareUpdated', {detail: updated}));

    return true;
  } catch (error) {
    console.error('Failed to add product to comparison:', error);
    return false;
  }
}

/**
 * Remove a product from comparison
 * @param {string} productId
 */
export function removeFromCompare(productId) {
  if (typeof window === 'undefined') return;

  try {
    const current = getCompareProducts();
    const updated = current.filter((item) => item.id !== productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Dispatch custom event for UI updates
    window.dispatchEvent(new CustomEvent('compareUpdated', {detail: updated}));
  } catch (error) {
    console.error('Failed to remove product from comparison:', error);
  }
}

/**
 * Clear all products from comparison
 */
export function clearCompare() {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);

    // Dispatch custom event for UI updates
    window.dispatchEvent(new CustomEvent('compareUpdated', {detail: []}));
  } catch (error) {
    console.error('Failed to clear comparison:', error);
  }
}

/**
 * Check if a product is in comparison
 * @param {string} productId
 * @returns {boolean}
 */
export function isInCompare(productId) {
  const current = getCompareProducts();
  return current.some((item) => item.id === productId);
}

/**
 * Get comparison count
 * @returns {number}
 */
export function getCompareCount() {
  return getCompareProducts().length;
}

/**
 * Get maximum allowed items for comparison
 * @returns {number}
 */
export function getMaxCompareItems() {
  return MAX_COMPARE_ITEMS;
}
