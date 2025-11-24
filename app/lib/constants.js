/**
 * Application-wide constants
 */

// Filter configuration
export const FILTER_DEFAULTS = {
  PRICE_MIN: 0,
  PRICE_MAX: 500,
};

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  PRODUCTS_PER_PAGE: 24,
  COLLECTION_PRODUCTS_PER_PAGE: 12,
};

// Available filter options
// Note: These are currently hardcoded. Consider querying dynamically from Shopify in the future.
export const AVAILABLE_FILTERS = {
  TYPES: ['Flight Suits', 'Flight Jackets', 'Flight Bag', 'Aviation Gear', 'Apparels'],
  VENDORS: ['Wingman Tactical', 'Alpha Industries', 'Propper'],
};
