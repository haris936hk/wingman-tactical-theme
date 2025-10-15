import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';

/**
 * @param {{
 *   product:
 *     | CollectionItemFragment
 *     | ProductItemFragment
 *     | RecommendedProductFragment;
 *   loading?: 'eager' | 'lazy';
 *   showSaleBadge?: boolean;
 * }}
 */
export function ProductItem({product, loading, showSaleBadge = false}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;

  return (
    <div className="product-card bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 group">
      <Link
        key={product.id}
        prefetch="intent"
        to={variantUrl}
        className="block"
      >
        {/* Product Image Container */}
        <div className="relative bg-gray-100 rounded-t-lg overflow-hidden">
          {/* Sale Badge */}
          {showSaleBadge && (
            <div className="absolute top-2 left-2 z-10 bg-[#d32f2f] text-white text-xs font-bold uppercase px-2 py-1 rounded">
              SALE
            </div>
          )}

          {/* Wishlist Heart Icon */}
          <button
            className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Add to wishlist functionality
            }}
            aria-label="Add to wishlist"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Product Image */}
          {image && (
            <Image
              alt={image.altText || product.title}
              aspectRatio="4/3"
              data={image}
              loading={loading}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 text-center">
          {/* Product Title */}
          <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.title}
          </h3>

          {/* Product Description (if available) */}
          {product.description && (
            <p className="text-xs text-gray-500 mb-3 line-clamp-3">
              {product.description}
            </p>
          )}

          {/* Product Price */}
          <div className={`text-lg font-bold mb-4 ${showSaleBadge ? 'text-[#d32f2f]' : 'text-gray-900'}`}>
            <Money data={product.priceRange.minVariantPrice} />
          </div>

          {/* Add to Cart Button */}
          <button
            className="w-full bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold uppercase text-sm py-3 px-4 rounded transition-colors flex items-center justify-center gap-2"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Add to cart functionality
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Add to cart
          </button>
        </div>
      </Link>
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductFragment} RecommendedProductFragment */
