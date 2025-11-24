import {Image, Money} from '@shopify/hydrogen';
import {Link} from 'react-router';

/**
 * Cart Upsells - Product Recommendations
 * Displays recommended/related products to increase AOV
 * @param {{
 *   products: UpsellProduct[];
 * }}
 */
export function CartUpsells({products}) {
  if (!products || products.length === 0) return null;

  return (
    <div className="border-t border-[#FF0000]/20 pt-6 pb-4">
      {/* Section Header */}
      <h3
        className="text-lg font-bold uppercase text-[#FF0000] mb-4 tracking-wide px-4"
        style={{fontFamily: 'var(--font-family-shock)'}}
      >
        You Might Also Like
      </h3>

      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-3 px-4">
        {products.slice(0, 3).map((product) => (
          <UpsellProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

/**
 * Upsell Product Card - Compact product card for recommendations
 * @param {{
 *   product: UpsellProduct;
 * }}
 */
function UpsellProductCard({product}) {
  const {handle, title, priceRange, featuredImage} = product;

  return (
    <Link
      to={`/products/${handle}`}
      className="group flex gap-3 p-3 rounded-lg
        bg-black/20 backdrop-blur-sm border border-white/10
        hover:border-[#FF0000]/40 hover:bg-black/30
        motion-safe:transition-all duration-300
        hover:shadow-[0_0_15px_rgba(255,0,0,0.2)]"
    >
      {/* Product Image */}
      {featuredImage && (
        <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden
          border border-white/20 group-hover:border-[#FF0000]/40
          motion-safe:transition-all duration-200">
          <Image
            data={featuredImage}
            alt={title}
            aspectRatio="1/1"
            width={64}
            height={64}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Product Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h4 className="text-sm font-bold text-white uppercase tracking-wide
          line-clamp-2 group-hover:text-[#FF0000]
          transition-colors duration-200">
          {title}
        </h4>
        <div className="mt-1">
          <Money
            data={priceRange.minVariantPrice}
            className="text-xs font-bold text-gray-300"
          />
        </div>
      </div>

      {/* Arrow Icon */}
      <div className="flex-shrink-0 flex items-center">
        <svg
          className="w-5 h-5 text-gray-400 group-hover:text-[#FF0000]
            motion-safe:transition-all duration-200
            group-hover:translate-x-1"
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
      </div>
    </Link>
  );
}

/**
 * @typedef {{
 *   id: string;
 *   handle: string;
 *   title: string;
 *   priceRange: {
 *     minVariantPrice: {
 *       amount: string;
 *       currencyCode: string;
 *     };
 *   };
 *   featuredImage?: {
 *     url: string;
 *     altText: string | null;
 *     width: number;
 *     height: number;
 *   };
 * }} UpsellProduct
 */
