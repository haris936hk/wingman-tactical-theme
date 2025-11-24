import {useLoaderData} from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImageGallery} from '~/components/ProductImageGallery';
import {ProductForm} from '~/components/ProductForm';
import {ProductTabs} from '~/components/ProductTabs';
import {ProductRecommendations} from '~/components/ProductRecommendations';
import {ReviewStars} from '~/components/ReviewStars';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [
    {title: `Hydrogen | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
      cache: storefront.CacheLong(), // Product data changes infrequently (1 hour cache)
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context, params}) {
  const {storefront} = context;
  const {handle} = params;

  // Chain promises without blocking - fetch product ID, then recommendations
  const recommendations = storefront
    .query(
      `#graphql
        query GetProductId($handle: String!) {
          product(handle: $handle) {
            id
          }
        }
      `,
      {
        variables: {handle},
        cache: storefront.CacheLong(), // Product ID is static (1 hour cache)
      },
    )
    .then((productIdQuery) => {
      const productId = productIdQuery?.product?.id;

      if (!productId) {
        return {productRecommendations: []};
      }

      // Query product recommendations using the actual product ID
      return storefront.query(PRODUCT_RECOMMENDATIONS_QUERY, {
        variables: {productId},
        cache: storefront.CacheLong(),
      });
    })
    .catch((error) => {
      console.error(error);
      return {productRecommendations: []};
    });

  return {recommendations};
}

export default function Product() {
  /** @type {LoaderReturnData} */
  const {product, recommendations} = useLoaderData();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml} = product;

  // Extract metafield content for tabs (if available)
  const materialsContent = product.metafields?.find(
    (m) => m?.key === 'materials' || m?.key === 'ingredients',
  )?.value;

  const shippingContent = product.metafields?.find(
    (m) => m?.key === 'shipping_info',
  )?.value;

  return (
    <>
      {/* Main Product Section */}
      <section className="bg-[#000000] pt-[104px] pb-12 lg:pb-16">
        <div className="max-w-[1400px] mx-auto px-6">
          {/* Product Grid Layout */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 motion-safe:animate-[fadeSlideUp_400ms_ease-out]">
            {/* Left Column: Product Image */}
            <div className="w-full">
              <ProductImageGallery
                images={product.images?.nodes || []}
                selectedVariantImage={selectedVariant?.image}
                productTitle={title}
              />
            </div>

            {/* Right Column: Product Details */}
            <div className="self-start lg:sticky lg:top-24">
              {/* Sticky Container with Glassmorphism Background */}
              <div className="bg-black/50 backdrop-blur-sm p-6 lg:p-8 rounded-lg border border-[#FF0000]/30 shadow-[0_0_30px_rgba(255,0,0,0.3)]">
                {/* Product Title */}
                <h1
                  className="text-3xl lg:text-4xl font-bold uppercase text-white mb-4"
                  style={{
                    fontFamily: 'var(--font-family-shock)',
                    textShadow: '0 0 10px rgba(255, 0, 0, 0.6)',
                  }}
                >
                  {title}
                </h1>

                {/* Review Stars */}
                <div className="mb-6">
                  <ReviewStars rating={5} reviewCount={0} showCount={true} />
                </div>

                {/* Price */}
                <div className="mb-6">
                  <ProductPrice
                    price={selectedVariant?.price}
                    compareAtPrice={selectedVariant?.compareAtPrice}
                    size="large"
                  />
                </div>

                {/* Product Form (Variants, Quantity, Add to Cart) */}
                <ProductForm
                  productOptions={productOptions}
                  selectedVariant={selectedVariant}
                />
              </div>
            </div>
          </div>

          {/* Product Information Tabs */}
          <div className="mt-12 lg:mt-16">
            <ProductTabs
              descriptionHtml={descriptionHtml}
              materialsContent={materialsContent}
              shippingContent={shippingContent}
              reviewsContent={null}
            />
          </div>
        </div>
      </section>

      {/* Product Recommendations Section */}
      {recommendations && (
        <section className="bg-[#000000] pb-12 lg:pb-16">
          <ProductRecommendations recommendations={recommendations} />
        </section>
      )}

      {/* Analytics */}
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    images(first: 5) {
      nodes {
        id
        url(transform: {maxWidth: 1200})
        altText
        width
        height
      }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    metafields(identifiers: [
      {namespace: "custom", key: "materials"},
      {namespace: "custom", key: "ingredients"},
      {namespace: "custom", key: "shipping_info"}
    ]) {
      key
      value
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const PRODUCT_RECOMMENDATIONS_QUERY = `#graphql
  query ProductRecommendations(
    $productId: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId) {
      id
      title
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 1) {
        nodes {
          id
          url(transform: {maxWidth: 400, maxHeight: 400})
          altText
          width
          height
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
    }
  }
`;

/** @typedef {import('./+types/products.$handle').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
