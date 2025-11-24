import { useLoaderData, useFetcher, Await } from 'react-router';
import { data as remixData } from 'react-router';
import { Suspense } from 'react';
import { Image, Money } from '@shopify/hydrogen';
import { CUSTOMER_WISHLIST_QUERY } from '~/graphql/customer-account/CustomerWishlistQuery';
import { parseWishlistMetafield } from '~/lib/wishlist';
import { LoadingSpinner } from '~/components/account/LoadingSpinner';

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({ context }) {
  const { customerAccount, storefront } = context;

  // Defer wishlist query chain for faster initial render
  const wishlistPromise = customerAccount.query(
    CUSTOMER_WISHLIST_QUERY,
    {
      variables: {
        language: customerAccount.i18n.language,
      },
    },
  ).then(async ({ data: customerData, errors }) => {
    if (errors?.length) {
      console.error('Error fetching wishlist:', errors);
      return { products: [], wishlistIds: [] };
    }

    const wishlistIds = parseWishlistMetafield(
      customerData?.customer?.metafield?.value,
    );

    // Fetch product details for wishlist items
    let products = [];
    if (wishlistIds.length > 0) {
      const productsQuery = `#graphql
        query WishlistProducts($ids: [ID!]!) {
          nodes(ids: $ids) {
            ... on Product {
              id
              handle
              title
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              featuredImage {
                url(transform: {maxWidth: 600})
                altText
                width
                height
              }
              variants(first: 1) {
                nodes {
                  id
                  availableForSale
                }
              }
            }
          }
        }
      `;

      const { nodes } = await storefront.query(productsQuery, {
        variables: { ids: wishlistIds },
        cache: storefront.CacheNone(), // User-specific data should not be cached
      });

      products = nodes.filter(Boolean);
    }

    return { products, wishlistIds };
  }).catch((error) => {
    console.error('Failed to load wishlist:', error);
    return { products: [], wishlistIds: [] };
  });

  return remixData(
    { wishlistData: wishlistPromise },
    {
      headers: {
        'Cache-Control': 'private, no-cache', // User-specific data should not be cached
      },
    },
  );
}

/**
 * @param {Route.ActionArgs}
 */
export async function action({ request, context }) {
  const { customerAccount } = context;
  const formData = await request.formData();
  const actionType = formData.get('action');
  const productId = formData.get('productId');

  // Get current wishlist
  const { data: customerData } = await customerAccount.query(
    CUSTOMER_WISHLIST_QUERY,
    {
      variables: { language: customerAccount.i18n.language },
    },
  );

  let wishlist = parseWishlistMetafield(
    customerData?.customer?.metafield?.value,
  );

  // Update wishlist based on action
  if (actionType === 'add' && !wishlist.includes(productId)) {
    wishlist.push(productId);
  } else if (actionType === 'remove') {
    wishlist = wishlist.filter((id) => id !== productId);
  }

  // Update customer metafield
  const UPDATE_MUTATION = `#graphql
    mutation customerWishlistUpdate($input: CustomerUpdateInput!) {
      customerUpdate(input: $input) {
        customer {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const { data, errors } = await customerAccount.mutate(UPDATE_MUTATION, {
    variables: {
      input: {
        metafields: [
          {
            namespace: 'custom',
            key: 'wishlist',
            value: JSON.stringify(wishlist),
          },
        ],
      },
    },
  });

  if (errors?.length || data?.customerUpdate?.userErrors?.length) {
    console.error(
      'Error updating wishlist:',
      errors || data.customerUpdate.userErrors,
    );
    return remixData({ success: false }, { status: 400 });
  }

  return remixData({ success: true });
}

export default function AccountWishlist() {
  const { wishlistData } = useLoaderData();

  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="text-center py-8">
            <h1
              className="text-3xl sm:text-4xl font-bold uppercase text-white mb-3"
              style={{
                textShadow: '0 0 15px rgba(255, 0, 0, 0.7)',
              }}
            >
              My Wishlist
            </h1>
          </div>
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner text="Loading wishlist..." />
          </div>
        </div>
      }
    >
      <Await
        resolve={wishlistData}
        errorElement={
          <div className="space-y-6">
            <div className="text-center py-8">
              <h1
                className="text-3xl sm:text-4xl font-bold uppercase text-white mb-3"
                style={{
                  fontFamily: 'var(--font-family-shock)',
                  textShadow: '0 0 15px rgba(255, 0, 0, 0.7)',
                }}
              >
                My Wishlist
              </h1>
            </div>
            <div className="flex items-center justify-center py-8 sm:py-12 px-4">
              <div className="w-full max-w-md sm:max-w-lg bg-red-900/20 border-2 border-red-500/30 rounded-lg p-6 sm:p-8 text-center">
                <svg className="w-16 h-16 sm:w-20 sm:h-20 text-[#FF0000] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 uppercase" style={{ fontFamily: 'var(--font-family-shock)' }}>
                  Failed to Load Wishlist
                </h2>
                <p className="text-sm sm:text-base text-gray-300 mb-6">
                  We couldn't load your wishlist. Please try refreshing the page.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold uppercase rounded-lg transition-colors shadow-[0_0_15px_rgba(255,0,0,0.6)] min-h-[44px]"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        }
      >
        {({ products }) => (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center py-8">
              <h1
                className="text-3xl sm:text-4xl font-bold uppercase text-white mb-3"
                style={{
                  fontFamily: 'var(--font-family-shock)',
                  textShadow: '0 0 15px rgba(255, 0, 0, 0.7)',
                }}
              >
                My Wishlist
              </h1>
              <p className="text-base text-gray-300">
                {products.length} {products.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>

            {/* Wishlist Items */}
            {products.length === 0 ? (
              <div className="bg-black/50 backdrop-blur-sm border-2 border-[#FF0000]/30 rounded-lg p-8 shadow-[0_0_20px_rgba(255,0,0,0.2)]">
                <div className="text-center py-12">
                  <svg
                    className="w-20 h-20 mx-auto text-gray-600 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <p className="text-gray-400 mb-6 text-lg">
                    Your wishlist is empty
                  </p>
                  <p className="text-gray-500 mb-8">
                    Start adding products to your wishlist
                  </p>
                  <a
                    href="/collections/all"
                    className="inline-block px-6 py-3 bg-[#FF0000] text-white font-bold uppercase rounded-lg hover:bg-[#CC0000] transition-colors shadow-[0_0_15px_rgba(255,0,0,0.6)]"
                  >
                    Shop Now
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <WishlistProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}
      </Await>
    </Suspense>
  );
}

function WishlistProductCard({ product }) {
  const fetcher = useFetcher();
  const variantUrl = `/products/${product.handle}`;
  const isRemoving =
    fetcher.state !== 'idle' &&
    fetcher.formData?.get('productId') === product.id;

  const handleRemove = () => {
    fetcher.submit(
      { action: 'remove', productId: product.id },
      { method: 'POST' },
    );
  };

  return (
    <div className="bg-black/50 border-2 border-white/20 rounded-lg overflow-hidden group hover:border-[#FF0000] transition-all shadow-md hover:shadow-[0_0_20px_rgba(255,0,0,0.3)]">
      {/* Product Image */}
      <a href={variantUrl} className="block relative">
        {product.featuredImage && (
          <Image
            data={product.featuredImage}
            aspectRatio="4/3"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="w-full transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        )}
      </a>

      {/* Product Info */}
      <div className="p-4">
        <a href={variantUrl}>
          <h3 className="text-white font-bold mb-2 line-clamp-2 hover:text-[#FF0000] transition-colors" style={{ fontFamily: 'var(--font-family-shock)' }}>
            {product.title}
          </h3>
        </a>

        <div className="text-[#FF0000] font-bold mb-4">
          <Money data={product.priceRange.minVariantPrice} />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <a
            href={variantUrl}
            className="flex-1 bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold uppercase text-sm py-2 px-4 rounded transition-colors text-center"
          >
            View Product
          </a>
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="px-3 bg-white/10 hover:bg-white/20 text-white rounded transition-colors disabled:opacity-50 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Remove from wishlist"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/** @typedef {import('./+types/account.wishlist').Route} Route */
