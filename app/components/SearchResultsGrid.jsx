import {ProductItem} from '~/components/ProductItem';

/**
 * SearchResultsGrid Component - Responsive product grid with stagger animations
 * Uses ProductItem component for consistent card design
 */
export function SearchResultsGrid({products = [], loading = false}) {
  if (loading) {
    return null; // Loading handled by SearchLoadingSkeleton
  }

  if (products.length === 0) {
    return null; // Empty state handled by NoResults
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      role="list"
      aria-label="Search results"
    >
      {products.map((product, index) => (
        <div key={product.id} role="listitem">
          <ProductItem
            product={product}
            loading="lazy"
            showSaleBadge={product.compareAtPriceRange?.minVariantPrice?.amount > product.priceRange?.minVariantPrice?.amount}
            index={index}
          />
        </div>
      ))}
    </div>
  );
}
