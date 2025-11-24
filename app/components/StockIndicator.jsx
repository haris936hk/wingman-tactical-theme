/**
 * StockIndicator Component - Display product stock availability
 * Shows stock status with visual indicators and messaging
 * @param {{
 *   available: boolean;
 *   quantityAvailable?: number;
 *   showQuantity?: boolean;
 *   lowStockThreshold?: number;
 *   size?: 'sm' | 'md' | 'lg';
 * }}
 */
export function StockIndicator({
  available = false,
  quantityAvailable,
  showQuantity = true,
  lowStockThreshold = 10,
  size = 'md',
}) {
  // Determine stock status
  const isOutOfStock = !available;
  const isLowStock =
    available &&
    quantityAvailable !== undefined &&
    quantityAvailable > 0 &&
    quantityAvailable <= lowStockThreshold;
  const isInStock = available && !isLowStock;

  // Size-based styling
  const sizeClasses = {
    sm: {
      container: 'text-xs px-2 py-1',
      icon: 'w-3 h-3',
    },
    md: {
      container: 'text-sm px-3 py-1.5',
      icon: 'w-4 h-4',
    },
    lg: {
      container: 'text-base px-4 py-2',
      icon: 'w-5 h-5',
    },
  };

  const styles = sizeClasses[size];

  // Out of Stock
  if (isOutOfStock) {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-lg border-2 border-gray-600 bg-gray-800/50 text-gray-300 font-bold uppercase ${styles.container}`}
        role="status"
        aria-label="Out of stock"
      >
        <svg
          className={`${styles.icon}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <span>Out of Stock</span>
      </div>
    );
  }

  // Low Stock
  if (isLowStock) {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-lg border-2 border-orange-500 bg-orange-500/10 text-orange-400 font-bold uppercase ${styles.container}`}
        role="status"
        aria-label={`Low stock: ${quantityAvailable} remaining`}
      >
        <svg
          className={`${styles.icon}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>
          {showQuantity && quantityAvailable
            ? `Only ${quantityAvailable} Left`
            : 'Low Stock'}
        </span>
      </div>
    );
  }

  // In Stock
  if (isInStock) {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-lg border-2 border-[#FF0000]/30 bg-[#FF0000]/10 text-white font-bold uppercase ${styles.container}`}
        role="status"
        aria-label="In stock"
      >
        <svg
          className={`${styles.icon} text-[#FF0000]`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span>In Stock</span>
      </div>
    );
  }

  return null;
}

/**
 * StockBadge Component - Compact stock indicator for product cards
 * Minimal version for product listings and grids
 * @param {{
 *   available: boolean;
 *   quantityAvailable?: number;
 *   lowStockThreshold?: number;
 * }}
 */
export function StockBadge({
  available = false,
  quantityAvailable,
  lowStockThreshold = 10,
}) {
  const isOutOfStock = !available;
  const isLowStock =
    available &&
    quantityAvailable !== undefined &&
    quantityAvailable > 0 &&
    quantityAvailable <= lowStockThreshold;

  if (isOutOfStock) {
    return (
      <span
        className="absolute top-2 right-2 px-2 py-1 text-xs font-bold uppercase
          bg-gray-800 border border-gray-600 text-gray-300 rounded
          shadow-lg z-10"
        role="status"
        aria-label="Out of stock"
      >
        Sold Out
      </span>
    );
  }

  if (isLowStock) {
    return (
      <span
        className="absolute top-2 right-2 px-2 py-1 text-xs font-bold uppercase
          bg-orange-500/90 text-white rounded shadow-lg z-10"
        role="status"
        aria-label={`Low stock: ${quantityAvailable} remaining`}
      >
        {quantityAvailable} Left
      </span>
    );
  }

  // Don't show anything for normal in-stock items
  return null;
}

/**
 * StockMessage Component - Detailed stock messaging for product pages
 * Provides contextual messages about stock availability
 * @param {{
 *   available: boolean;
 *   quantityAvailable?: number;
 *   lowStockThreshold?: number;
 * }}
 */
export function StockMessage({
  available = false,
  quantityAvailable,
  lowStockThreshold = 10,
}) {
  const isOutOfStock = !available;
  const isLowStock =
    available &&
    quantityAvailable !== undefined &&
    quantityAvailable > 0 &&
    quantityAvailable <= lowStockThreshold;

  if (isOutOfStock) {
    return (
      <div
        className="p-4 bg-gray-800/50 border-2 border-gray-600 rounded-lg"
        role="alert"
      >
        <p className="text-gray-200 text-sm">
          This item is currently out of stock. Check back soon or contact us
          for availability updates.
        </p>
      </div>
    );
  }

  if (isLowStock) {
    return (
      <div
        className="p-4 bg-orange-500/10 border-2 border-orange-500/30 rounded-lg"
        role="alert"
      >
        <p className="text-orange-200 text-sm font-medium">
          <strong className="text-orange-400">Hurry!</strong> Only{' '}
          {quantityAvailable} {quantityAvailable === 1 ? 'item' : 'items'} left
          in stock. Order soon to secure yours.
        </p>
      </div>
    );
  }

  // Positive in-stock message
  return (
    <div
      className="p-4 bg-[#FF0000]/10 border-2 border-[#FF0000]/30 rounded-lg"
      role="status"
    >
      <p className="text-gray-200 text-sm">
        <span className="text-white font-bold">In Stock</span> and ready to
        ship. Order now for fast delivery.
      </p>
    </div>
  );
}
