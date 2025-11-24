/**
 * Wishlist utilities for Shopify Hydrogen
 * Supports both logged-in customers (metafields) and guests (localStorage)
 */

const WISHLIST_STORAGE_KEY = 'wingman_wishlist';

/**
 * Get wishlist from localStorage (for guest users)
 */
export function getLocalWishlist() {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading wishlist from localStorage:', error);
    return [];
  }
}

/**
 * Save wishlist to localStorage (for guest users)
 */
export function saveLocalWishlist(productIds) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(productIds));
  } catch (error) {
    console.error('Error saving wishlist to localStorage:', error);
  }
}

/**
 * Add product to local wishlist
 */
export function addToLocalWishlist(productId) {
  const wishlist = getLocalWishlist();
  if (!wishlist.includes(productId)) {
    wishlist.push(productId);
    saveLocalWishlist(wishlist);
  }
  return wishlist;
}

/**
 * Remove product from local wishlist
 */
export function removeFromLocalWishlist(productId) {
  const wishlist = getLocalWishlist();
  const updated = wishlist.filter((id) => id !== productId);
  saveLocalWishlist(updated);
  return updated;
}

/**
 * Parse wishlist from customer metafield value
 */
export function parseWishlistMetafield(metafieldValue) {
  if (!metafieldValue) return [];
  try {
    const parsed = JSON.parse(metafieldValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error parsing wishlist metafield:', error);
    return [];
  }
}

/**
 * Check if product is in wishlist
 */
export function isInWishlist(productId, wishlist) {
  return Array.isArray(wishlist) && wishlist.includes(productId);
}

/**
 * Merge two wishlist arrays (server and local)
 * Returns a unique list of product IDs
 */
export function mergeWishlists(serverWishlist = [], localWishlist = []) {
  const merged = new Set([...(serverWishlist || []), ...(localWishlist || [])]);
  return Array.from(merged);
}
