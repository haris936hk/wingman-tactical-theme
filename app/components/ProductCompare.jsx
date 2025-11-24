import {useState, useEffect, useRef} from 'react';
import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {
  getCompareProducts,
  removeFromCompare,
  clearCompare,
  getMaxCompareItems,
} from '~/lib/product-compare';
import {trackCompareView} from '~/lib/analytics';

/**
 * Floating Comparison Bar
 * Shows at bottom of screen when products are added to comparison
 */
export function CompareBar() {
  const [products, setProducts] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Initial load
    setProducts(getCompareProducts());

    // Listen for comparison updates
    const handleUpdate = (event) => {
      setProducts(event.detail);
      if (event.detail.length === 0) {
        setIsExpanded(false);
      }
    };

    window.addEventListener('compareUpdated', handleUpdate);

    return () => {
      window.removeEventListener('compareUpdated', handleUpdate);
    };
  }, []);

  if (products.length === 0) {
    return null;
  }

  return (
    <>
      {/* Floating Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 bg-black border-t-2 border-[#FF0000] shadow-[0_-4px_30px_rgba(255,0,0,0.4)]"
        style={{
          transform: isExpanded ? 'translateY(0)' : 'translateY(calc(100% - 60px))',
          transition: 'transform 0.3s ease-out',
        }}
      >
        {/* Header Bar */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Collapse comparison' : 'Expand comparison'}
        >
          <div className="flex items-center gap-4">
            <span
              className="text-white font-bold uppercase text-lg"
              style={{
                fontFamily: 'var(--font-family-shock)',
                textShadow: '0 0 10px rgba(255, 0, 0, 0.6)',
              }}
            >
              Compare Products ({products.length}/{getMaxCompareItems()})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
                trackCompareView(products.map((p) => p.id));
              }}
              className="px-4 py-2 bg-[#FF0000] text-white font-bold uppercase rounded hover:bg-[#CC0000] transition-colors text-sm"
              disabled={products.length < 2}
            >
              Compare Now
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                clearCompare();
              }}
              className="px-4 py-2 border border-white/30 text-white font-medium rounded hover:bg-white/10 transition-colors text-sm"
            >
              Clear All
            </button>

            <svg
              className={`w-5 h-5 text-white transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>

        {/* Expanded Product List */}
        <div className="px-6 pb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white/5 rounded-lg p-3 border border-white/10 relative group"
            >
              <button
                onClick={() => removeFromCompare(product.id)}
                className="absolute top-1 right-1 w-6 h-6 bg-black/80 text-white rounded-full flex items-center justify-center hover:bg-[#FF0000] transition-colors z-10"
                aria-label={`Remove ${product.title} from comparison`}
              >
                ×
              </button>

              <Link to={`/products/${product.handle}`} className="block">
                <div className="aspect-square bg-white/5 rounded mb-2 overflow-hidden">
                  {product.featuredImage && (
                    <Image
                      data={product.featuredImage}
                      alt={product.featuredImage.altText || product.title}
                      className="w-full h-full object-cover"
                      sizes="(min-width: 640px) 25vw, 50vw"
                    />
                  )}
                </div>

                <h3 className="text-white text-sm font-semibold line-clamp-2 mb-1">
                  {product.title}
                </h3>

                {product.price && (
                  <div className="text-[#FF0000] font-bold text-sm">
                    <Money data={product.price} />
                  </div>
                )}
              </Link>
            </div>
          ))}

          {/* Empty Slots */}
          {Array.from({length: getMaxCompareItems() - products.length}).map(
            (_, index) => (
              <div
                key={`empty-${index}`}
                className="bg-white/5 rounded-lg p-3 border-2 border-dashed border-white/20 flex items-center justify-center aspect-square"
              >
                <span className="text-white/40 text-sm text-center">
                  Add product
                </span>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Comparison Modal */}
      {showModal && (
        <CompareModal
          products={products}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

/**
 * Comparison Modal
 * Full-screen modal showing detailed product comparison
 */
function CompareModal({products, onClose}) {
  const modalRef = useRef(null);

  useEffect(() => {
    // Focus trap
    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      modal.removeEventListener('keydown', handleTabKey);
    };
  }, []);

  // Extract all unique features from all products
  const features = extractFeatures(products);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
    >
      <div ref={modalRef} className="min-h-screen py-8 px-4">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2
              id="compare-modal-title"
              className="text-3xl font-bold uppercase text-[#FF0000]"
              style={{fontFamily: 'var(--font-family-shock)'}}
            >
              Compare Products
            </h2>

            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/10 hover:bg-[#FF0000] text-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Close comparison"
            >
              ×
            </button>
          </div>

          {/* Comparison Table */}
          <div className="bg-white/5 rounded-lg border border-[#FF0000]/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="sticky left-0 bg-black/80 backdrop-blur-sm px-4 py-3 text-left text-white font-semibold uppercase text-sm w-48">
                      Feature
                    </th>
                    {products.map((product) => (
                      <td
                        key={product.id}
                        className="px-4 py-3 text-center border-l border-white/10 min-w-[250px]"
                      >
                        <Link
                          to={`/products/${product.handle}`}
                          className="block group"
                        >
                          <div className="aspect-square bg-white/5 rounded mb-3 overflow-hidden mx-auto max-w-[200px]">
                            {product.featuredImage && (
                              <Image
                                data={product.featuredImage}
                                alt={
                                  product.featuredImage.altText || product.title
                                }
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                sizes="200px"
                              />
                            )}
                          </div>

                          <h3 className="text-white font-semibold mb-2 hover:text-[#FF0000] transition-colors">
                            {product.title}
                          </h3>
                        </Link>

                        <button
                          onClick={() => removeFromCompare(product.id)}
                          className="text-white/60 hover:text-[#FF0000] text-sm underline"
                        >
                          Remove
                        </button>
                      </td>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {/* Price Row */}
                  <tr className="border-b border-white/10">
                    <th className="sticky left-0 bg-black/80 backdrop-blur-sm px-4 py-4 text-left text-white font-semibold">
                      Price
                    </th>
                    {products.map((product) => (
                      <td
                        key={product.id}
                        className="px-4 py-4 text-center border-l border-white/10"
                      >
                        {product.price && (
                          <div className="text-[#FF0000] font-bold text-lg">
                            <Money data={product.price} />
                          </div>
                        )}
                        {product.compareAtPrice && (
                          <div className="text-white/40 text-sm line-through">
                            <Money data={product.compareAtPrice} />
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Vendor Row */}
                  <tr className="border-b border-white/10">
                    <th className="sticky left-0 bg-black/80 backdrop-blur-sm px-4 py-4 text-left text-white font-semibold">
                      Brand
                    </th>
                    {products.map((product) => (
                      <td
                        key={product.id}
                        className="px-4 py-4 text-center border-l border-white/10 text-white"
                      >
                        {product.vendor || 'Wingman Tactical'}
                      </td>
                    ))}
                  </tr>

                  {/* Availability Row */}
                  <tr className="border-b border-white/10">
                    <th className="sticky left-0 bg-black/80 backdrop-blur-sm px-4 py-4 text-left text-white font-semibold">
                      Availability
                    </th>
                    {products.map((product) => (
                      <td
                        key={product.id}
                        className="px-4 py-4 text-center border-l border-white/10"
                      >
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            product.availableForSale
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {product.availableForSale
                            ? 'In Stock'
                            : 'Out of Stock'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Description Row */}
                  <tr className="border-b border-white/10">
                    <th className="sticky left-0 bg-black/80 backdrop-blur-sm px-4 py-4 text-left text-white font-semibold align-top">
                      Description
                    </th>
                    {products.map((product) => (
                      <td
                        key={product.id}
                        className="px-4 py-4 border-l border-white/10 text-white/70 text-sm align-top"
                      >
                        <div className="line-clamp-4">
                          {product.description || 'No description available'}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Options/Variants Rows */}
                  {features.map((feature) => (
                    <tr key={feature} className="border-b border-white/10">
                      <th className="sticky left-0 bg-black/80 backdrop-blur-sm px-4 py-4 text-left text-white font-semibold">
                        {feature}
                      </th>
                      {products.map((product) => (
                        <td
                          key={product.id}
                          className="px-4 py-4 text-center border-l border-white/10 text-white/70 text-sm"
                        >
                          {getProductFeature(product, feature)}
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* Action Row */}
                  <tr>
                    <th className="sticky left-0 bg-black/80 backdrop-blur-sm px-4 py-4 text-left text-white font-semibold">
                      Actions
                    </th>
                    {products.map((product) => (
                      <td
                        key={product.id}
                        className="px-4 py-4 text-center border-l border-white/10"
                      >
                        <Link
                          to={`/products/${product.handle}`}
                          className="inline-block px-6 py-3 bg-[#FF0000] text-white font-bold uppercase rounded hover:bg-[#CC0000] transition-colors"
                        >
                          View Product
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="px-8 py-3 border-2 border-white/30 text-white font-bold uppercase rounded hover:bg-white/10 transition-colors"
            >
              Close Comparison
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Extract unique features/options from products
 */
function extractFeatures(products) {
  const featuresSet = new Set();

  products.forEach((product) => {
    if (product.options) {
      product.options.forEach((option) => {
        featuresSet.add(option.name);
      });
    }
  });

  return Array.from(featuresSet);
}

/**
 * Get specific feature value for a product
 */
function getProductFeature(product, featureName) {
  if (!product.options) return '—';

  const option = product.options.find((opt) => opt.name === featureName);
  if (!option || !option.optionValues) return '—';

  const values = option.optionValues.map((v) => v.name).join(', ');
  return values || '—';
}
