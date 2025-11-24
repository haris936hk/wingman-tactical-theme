import {useState, useEffect} from 'react';
import {
  addToCompare,
  removeFromCompare,
  isInCompare,
  getMaxCompareItems,
  getCompareCount,
} from '~/lib/product-compare';
import {trackAddToCompare, trackRemoveFromCompare} from '~/lib/analytics';

/**
 * Add to Compare Button
 * @param {{
 *   product: {
 *     id: string;
 *     handle: string;
 *     title: string;
 *     featuredImage?: object;
 *     price?: object;
 *     compareAtPrice?: object;
 *     vendor?: string;
 *     availableForSale?: boolean;
 *     description?: string;
 *     options?: Array;
 *   };
 *   variant?: 'icon' | 'button';
 *   className?: string;
 * }}
 */
export function AddToCompareButton({
  product,
  variant = 'icon',
  className = '',
}) {
  const [inCompare, setInCompare] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState('');

  useEffect(() => {
    // Check initial state
    setInCompare(isInCompare(product.id));

    // Listen for comparison updates
    const handleUpdate = () => {
      setInCompare(isInCompare(product.id));
    };

    window.addEventListener('compareUpdated', handleUpdate);

    return () => {
      window.removeEventListener('compareUpdated', handleUpdate);
    };
  }, [product.id]);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (inCompare) {
      // Remove from comparison
      removeFromCompare(product.id);
      trackRemoveFromCompare(product.id);
      showMessage('Removed from comparison');
    } else {
      // Check if limit reached
      const currentCount = getCompareCount();
      if (currentCount >= getMaxCompareItems()) {
        showMessage(
          `Maximum ${getMaxCompareItems()} products can be compared at once`,
        );
        return;
      }

      // Add to comparison
      const success = addToCompare({
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
      });

      if (success) {
        trackAddToCompare(product.id, product.title);
        showMessage('Added to comparison');
      } else {
        showMessage('Failed to add to comparison');
      }
    }
  };

  const showMessage = (message) => {
    setTooltipMessage(message);
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };

  if (variant === 'icon') {
    return (
      <div className="relative">
        <button
          onClick={handleClick}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            inCompare
              ? 'bg-[#FF0000] text-white'
              : 'bg-white/90 text-gray-900 hover:bg-white'
          } ${className}`}
          aria-label={
            inCompare
              ? `Remove ${product.title} from comparison`
              : `Add ${product.title} to comparison`
          }
          title={inCompare ? 'Remove from comparison' : 'Add to comparison'}
        >
          {/* Scale Icon */}
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {inCompare ? (
              // Checkmark when in comparison
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            ) : (
              // Scale icon when not in comparison
              <>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                />
              </>
            )}
          </svg>
        </button>

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-black text-white text-sm rounded shadow-lg whitespace-nowrap z-50 animate-[fadeIn_200ms_ease-out]">
            {tooltipMessage}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45" />
          </div>
        )}
      </div>
    );
  }

  // Button variant
  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`px-6 py-3 rounded font-bold uppercase text-sm transition-all flex items-center gap-2 ${
          inCompare
            ? 'bg-[#FF0000] text-white hover:bg-[#CC0000]'
            : 'bg-white text-gray-900 hover:bg-gray-100 border border-gray-300'
        } ${className}`}
        aria-label={
          inCompare
            ? `Remove ${product.title} from comparison`
            : `Add ${product.title} to comparison`
        }
      >
        {/* Scale Icon */}
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {inCompare ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
            />
          )}
        </svg>

        <span>{inCompare ? 'In Comparison' : 'Add to Compare'}</span>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-black text-white text-sm rounded shadow-lg whitespace-nowrap z-50 animate-[fadeIn_200ms_ease-out]">
          {tooltipMessage}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45" />
        </div>
      )}
    </div>
  );
}
