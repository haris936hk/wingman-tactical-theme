import {useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';

/**
 * SearchAutocomplete Component - Google-style predictive search dropdown
 * Shows products, recent searches, and popular searches with keyboard navigation
 */
export function SearchAutocomplete({
  searchTerm = '',
  predictions = {},
  recentSearches = [],
  isOpen = false,
  onClose,
  onSearchSelect,
}) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const allItems = [
    ...recentSearches.map((term) => ({type: 'recent', value: term})),
    ...(predictions.products || []).map((product) => ({type: 'product', value: product})),
  ];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < allItems.length - 1 ? prev + 1 : prev,
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && allItems[selectedIndex]) {
            const item = allItems[selectedIndex];
            if (item.type === 'product') {
              navigate(`/products/${item.value.handle}`);
              onClose?.();
            } else if (item.type === 'recent') {
              onSearchSelect?.(item.value);
            }
          }
          break;
        case 'Escape':
          onClose?.();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, allItems, onSearchSelect, onClose, navigate]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 bg-black border-2 border-[#FF0000]/50
        rounded-lg shadow-[0_0_30px_rgba(255,0,0,0.4)] max-h-[70vh] overflow-y-auto z-50
        motion-safe:animate-[fadeSlideUp_200ms_ease-out]"
      role="listbox"
      aria-label="Search suggestions"
    >
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="border-b border-white/10 p-4">
          <h3 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-wide">
            Recent Searches
          </h3>
          <div className="space-y-2">
            {recentSearches.map((term, index) => (
              <button
                key={`recent-${term}-${index}`}
                type="button"
                onClick={() => onSearchSelect?.(term)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded
                  text-left text-white hover:bg-white/10 transition-colors
                  ${selectedIndex === index ? 'bg-white/10' : ''}`}
                role="option"
                aria-selected={selectedIndex === index}
              >
                <svg
                  className="w-4 h-4 text-gray-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">{term}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product Predictions */}
      {predictions.products?.length > 0 && (
        <div className="p-4">
          <h3 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-wide">
            Products
          </h3>
          <div className="space-y-2">
            {predictions.products.map((product, index) => {
              const globalIndex = recentSearches.length + index;
              return (
                <Link
                  key={product.id}
                  to={`/products/${product.handle}`}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2 rounded
                    hover:bg-white/10 transition-colors group
                    ${selectedIndex === globalIndex ? 'bg-white/10' : ''}`}
                  role="option"
                  aria-selected={selectedIndex === globalIndex}
                >
                  {/* Product Image */}
                  {product.images?.nodes?.[0] && (
                    <div className="w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-gray-800">
                      <Image
                        data={product.images.nodes[0]}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        sizes="48px"
                      />
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium line-clamp-1">
                      {highlightMatch(product.title, searchTerm)}
                    </p>
                    <p className="text-xs text-gray-400">
                      <Money data={product.priceRange.minVariantPrice} />
                    </p>
                  </div>

                  {/* Arrow */}
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-[#FF0000] flex-shrink-0 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* View All Results Footer */}
      {searchTerm && (
        <Link
          to={`/search?q=${encodeURIComponent(searchTerm)}`}
          onClick={onClose}
          className="block w-full px-4 py-3 text-center text-sm font-bold uppercase
            text-[#FF0000] hover:bg-white/5 transition-colors border-t border-white/10"
        >
          View all results for "{searchTerm}"
        </Link>
      )}

      {/* Empty State */}
      {!recentSearches.length && !predictions.products?.length && (
        <div className="p-8 text-center">
          <p className="text-gray-400">Start typing to see suggestions</p>
        </div>
      )}
    </div>
  );
}

/**
 * Highlight matching text in search results
 */
function highlightMatch(text, search) {
  if (!search) return text;

  const regex = new RegExp(`(${search})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <span key={index} className="text-[#FF0000] font-bold">
        {part}
      </span>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}
