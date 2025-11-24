import { useState, useEffect, useRef } from 'react';
import { useFetcher, Link } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import { trackSearch, trackPredictiveSearchClick } from '~/lib/analytics';

/**
 * PredictiveSearch Component - Autocomplete search with live results
 * Provides instant product, collection, and page suggestions
 * @param {{
 *   onClose?: () => void;
 *   className?: string;
 * }}
 */
export function PredictiveSearch({ onClose, className = '' }) {
  const fetcher = useFetcher();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const debounceTimer = useRef(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (query.length >= 1) {
      debounceTimer.current = setTimeout(() => {
        fetcher.load(`/api/predictive-search?q=${encodeURIComponent(query)}`);
      }, 150);
    } else {
      // Clear results immediately if query is too short
      if (fetcher.data) {
        fetcher.submit(null, { method: 'get', action: '/api/predictive-search' }); // Reset fetcher
      }
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  const results = fetcher.data || { products: [], collections: [], pages: [] };

  // Track search analytics when results are received
  useEffect(() => {
    if (fetcher.data && query.length >= 1) {
      const totalResults =
        results.products.length +
        results.collections.length +
        results.pages.length;
      trackSearch(query, totalResults);
    }
  }, [fetcher.data]);
  const allResults = [
    ...results.products.map((p) => ({ type: 'product', data: p })),
    ...results.collections.map((c) => ({ type: 'collection', data: c })),
    ...results.pages.map((p) => ({ type: 'page', data: p })),
  ];

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < allResults.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const result = allResults[selectedIndex];
      if (result) {
        const url = getResultUrl(result);
        if (url) {
          window.location.href = url;
        }
      }
    } else if (e.key === 'Escape') {
      onClose?.();
    }
  };

  const getResultUrl = (result) => {
    switch (result.type) {
      case 'product':
        return `/products/${result.data.handle}`;
      case 'collection':
        return `/collections/${result.data.handle}`;
      case 'page':
        return `/pages/${result.data.handle}`;
      default:
        return null;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search products, collections..."
          className="w-full px-4 py-3 pl-12 bg-black border-2 border-white/30 rounded-lg
            text-white placeholder-gray-400
            focus:outline-none focus:border-[#FF0000] transition-colors"
          aria-label="Search"
          aria-autocomplete="list"
          aria-controls="predictive-search-results"
          aria-expanded={query.length >= 1}
        />
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        {/* Loading Spinner */}
        {fetcher.state === 'loading' && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <svg
              className="animate-spin h-5 w-5 text-[#FF0000]"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Results Dropdown */}
      {query.length >= 1 && (
        <div
          id="predictive-search-results"
          ref={resultsRef}
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 bg-[#000000] border-2 border-[#FF0000]/30
            rounded-lg shadow-[0_0_30px_rgba(255,0,0,0.4)] max-h-[500px] overflow-y-auto z-50"
        >
          {allResults.length === 0 && fetcher.state !== 'loading' ? (
            <div className="p-6 text-center text-gray-400">
              No results found for "{query}"
            </div>
          ) : (
            <>
              {/* Products */}
              {results.products?.length > 0 && (
                <div className="border-b border-white/10">
                  <div className="px-4 py-2 text-xs font-bold uppercase text-gray-400">
                    Products
                  </div>
                  {results.products.map((product, index) => {
                    const globalIndex = index;
                    return (
                      <PredictiveSearchProduct
                        key={product.id}
                        product={product}
                        isSelected={selectedIndex === globalIndex}
                        onClick={() => {
                          trackPredictiveSearchClick(query, 'product', product.id);
                          onClose?.();
                        }}
                      />
                    );
                  })}
                </div>
              )}

              {/* Collections */}
              {results.collections?.length > 0 && (
                <div className="border-b border-white/10">
                  <div className="px-4 py-2 text-xs font-bold uppercase text-gray-400">
                    Collections
                  </div>
                  {results.collections.map((collection, index) => {
                    const globalIndex = results.products.length + index;
                    return (
                      <PredictiveSearchCollection
                        key={collection.id}
                        collection={collection}
                        isSelected={selectedIndex === globalIndex}
                        onClick={() => {
                          trackPredictiveSearchClick(query, 'collection', collection.id);
                          onClose?.();
                        }}
                      />
                    );
                  })}
                </div>
              )}

              {/* Pages */}
              {results.pages?.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-bold uppercase text-gray-400">
                    Pages
                  </div>
                  {results.pages.map((page, index) => {
                    const globalIndex =
                      results.products.length + results.collections.length + index;
                    return (
                      <PredictiveSearchPage
                        key={page.id}
                        page={page}
                        isSelected={selectedIndex === globalIndex}
                        onClick={() => {
                          trackPredictiveSearchClick(query, 'page', page.id);
                          onClose?.();
                        }}
                      />
                    );
                  })}
                </div>
              )}

              {/* View All Results Link */}
              <Link
                to={`/search?q=${encodeURIComponent(query)}`}
                onClick={onClose}
                className="block px-4 py-3 text-center text-[#FF0000] hover:bg-white/5
                  font-bold uppercase text-sm border-t border-white/10"
              >
                View All Results for "{query}"
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Product Result Item
 */
function PredictiveSearchProduct({ product, isSelected, onClick }) {
  const image = product.featuredImage;
  const price = product.variants?.nodes?.[0]?.price;

  return (
    <Link
      to={`/products/${product.handle}`}
      onClick={onClick}
      className={`flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors
        ${isSelected ? 'bg-white/10' : ''}`}
      role="option"
      aria-selected={isSelected}
    >
      {/* Product Image */}
      {image && (
        <div className="w-12 h-12 flex-shrink-0 bg-white/5 rounded overflow-hidden">
          <Image
            data={image}
            alt={product.title}
            className="w-full h-full object-cover"
            sizes="48px"
          />
        </div>
      )}

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="text-white font-medium truncate">{product.title}</div>
        {price && (
          <div className="text-sm text-gray-400">
            <Money data={price} />
          </div>
        )}
      </div>

      {/* Arrow Icon */}
      <svg
        className="w-5 h-5 text-gray-400 flex-shrink-0"
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
}

/**
 * Collection Result Item
 */
function PredictiveSearchCollection({ collection, isSelected, onClick }) {
  const image = collection.image;

  return (
    <Link
      to={`/collections/${collection.handle}`}
      onClick={onClick}
      className={`flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors
        ${isSelected ? 'bg-white/10' : ''}`}
      role="option"
      aria-selected={isSelected}
    >
      {/* Collection Image */}
      {image && (
        <div className="w-12 h-12 flex-shrink-0 bg-white/5 rounded overflow-hidden">
          <Image
            data={image}
            alt={collection.title}
            className="w-full h-full object-cover"
            sizes="48px"
          />
        </div>
      )}

      {/* Collection Info */}
      <div className="flex-1 min-w-0">
        <div className="text-white font-medium truncate">{collection.title}</div>
        <div className="text-sm text-gray-400">Collection</div>
      </div>

      {/* Arrow Icon */}
      <svg
        className="w-5 h-5 text-gray-400 flex-shrink-0"
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
}

/**
 * Page Result Item
 */
function PredictiveSearchPage({ page, isSelected, onClick }) {
  return (
    <Link
      to={`/pages/${page.handle}`}
      onClick={onClick}
      className={`flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors
        ${isSelected ? 'bg-white/10' : ''}`}
      role="option"
      aria-selected={isSelected}
    >
      {/* Page Icon */}
      <div className="w-12 h-12 flex-shrink-0 bg-white/5 rounded flex items-center justify-center">
        <svg
          className="w-6 h-6 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>

      {/* Page Info */}
      <div className="flex-1 min-w-0">
        <div className="text-white font-medium truncate">{page.title}</div>
        <div className="text-sm text-gray-400">Page</div>
      </div>

      {/* Arrow Icon */}
      <svg
        className="w-5 h-5 text-gray-400 flex-shrink-0"
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
}
