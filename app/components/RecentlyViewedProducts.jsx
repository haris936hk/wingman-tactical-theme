import {useState, useEffect} from 'react';
import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {getRecentlyViewedExcluding} from '~/lib/recently-viewed';

/**
 * RecentlyViewedProducts Component
 * Displays products the user has recently viewed (stored in localStorage)
 * @param {{
 *   currentProductId?: string;
 *   limit?: number;
 *   className?: string;
 * }}
 */
export function RecentlyViewedProducts({
  currentProductId,
  limit = 8,
  className = '',
}) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Load recently viewed products from localStorage
    const recentProducts = currentProductId
      ? getRecentlyViewedExcluding(currentProductId, limit)
      : [];

    setProducts(recentProducts);
  }, [currentProductId, limit]);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className={`py-12 lg:py-16 bg-black border-t border-[#FF0000] ${className}`}>
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Section Header */}
        <h2
          className="text-2xl lg:text-3xl font-bold uppercase text-white mb-8"
          style={{
            fontFamily: 'var(--font-family-shock)',
            textShadow: '0 0 10px rgba(255, 0, 0, 0.6)',
          }}
        >
          Recently Viewed
        </h2>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product, index) => (
            <RecentlyViewedProductCard
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Product Card for Recently Viewed
 */
function RecentlyViewedProductCard({product, index}) {
  return (
    <Link
      to={`/products/${product.handle}`}
      className="group bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden
        will-change-transform motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-out
        hover:scale-[1.03] hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(255,0,0,0.6)]
        opacity-0 translate-y-4 motion-safe:animate-[fadeSlideUp_300ms_ease-out_forwards]"
      style={{animationDelay: `${index * 50}ms`}}
    >
      {/* Product Image */}
      <div className="relative bg-gray-100 aspect-[4/3] overflow-hidden">
        {product.featuredImage && (
          <Image
            data={product.featuredImage}
            alt={product.featuredImage.altText || product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          />
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 text-center">
        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 h-10 flex items-center justify-center">
          {product.title}
        </h3>

        {product.price && (
          <div className="text-lg font-bold text-gray-900">
            <Money data={product.price} />
          </div>
        )}
      </div>
    </Link>
  );
}
