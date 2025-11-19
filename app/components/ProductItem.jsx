import {Link} from 'react-router';
import {Image, Money, CartForm} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {WishlistButton} from './WishlistButton';
import {useAside} from './Aside';

/**
 * @param {{
 *   product:
 *     | CollectionItemFragment
 *     | ProductItemFragment
 *     | RecommendedProductFragment;
 *   loading?: 'eager' | 'lazy';
 *   showSaleBadge?: boolean;
 *   index?: number;
 * }}
 */
export function ProductItem({product, loading, showSaleBadge = false, index = 0}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const {open} = useAside();
  const firstVariant = product.variants?.nodes?.[0];

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg shadow-sm group will-change-transform motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-out hover:scale-[1.03] hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(255,0,0,0.6)] opacity-0 translate-y-4 motion-safe:animate-[fadeSlideUp_300ms_ease-out_forwards]"
      style={{animationDelay: `${index * 50}ms`}}
    >
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
            <div className="absolute top-2 left-2 z-10 bg-[#FF0000] text-white text-xs font-bold uppercase px-2 py-1 rounded shadow-[0_0_10px_rgba(255,0,0,0.5)]">
              SALE
            </div>
          )}

          {/* Wishlist Heart Icon */}
          <WishlistButton
            productId={product.id}
            className="absolute top-2 right-2 z-10"
          />

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
          {/* Product Title - Fixed height for consistency */}
          <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 h-10 flex items-center justify-center">
            {product.title}
          </h3>

          {/* Product Description (if available) */}
          {product.description && (
            <p className="text-xs text-gray-500 mb-3 line-clamp-3">
              {product.description}
            </p>
          )}

          {/* Product Price */}
          <div className={`text-lg font-bold mb-4 ${showSaleBadge ? 'text-[#FF0000]' : 'text-gray-900'}`}>
            <Money data={product.priceRange.minVariantPrice} />
          </div>

          {/* Add to Cart Button */}
          {firstVariant?.id && (
            <CartForm
              route="/cart"
              inputs={{
                lines: [
                  {
                    merchandiseId: firstVariant.id,
                    quantity: 1,
                  },
                ],
              }}
              action={CartForm.ACTIONS.LinesAdd}
            >
              {(fetcher) => (
                <button
                  type="submit"
                  onClick={() => open('cart')}
                  disabled={!firstVariant.availableForSale || fetcher.state !== 'idle'}
                  className="w-full bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold uppercase text-sm py-3 px-4 rounded transition-all hover:shadow-[0_0_15px_rgba(255,0,0,0.6)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {fetcher.state !== 'idle' ? 'Adding...' : firstVariant.availableForSale ? 'Add to cart' : 'Sold out'}
                </button>
              )}
            </CartForm>
          )}
        </div>
      </Link>
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductFragment} RecommendedProductFragment */
