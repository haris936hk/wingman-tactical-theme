import {Await} from 'react-router';
import {Suspense} from 'react';
import {ProductCarousel} from '~/components/ProductCarousel';

/**
 * ProductRecommendations Component
 * Displays AI-powered product recommendations using Shopify's recommendation API
 * Uses the ProductCarousel component for consistent styling
 */
export function ProductRecommendations({recommendations}) {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#FF0000] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 mt-4">Loading recommendations...</p>
        </div>
      }
    >
      <Await
        errorElement={null}
        resolve={recommendations}
      >
        {(response) => {
          const products = response?.productRecommendations || [];

          if (products.length === 0) {
            return null;
          }

          return (
            <section className="border-t border-[#FF0000] pt-12 mt-12">
              <div className="max-w-[1400px] mx-auto px-6">
                {/* Section Heading */}
                <h2
                  className="text-3xl lg:text-4xl font-bold uppercase text-white mb-12 text-center"
                  style={{
                    fontFamily: 'var(--font-family-shock)',
                    textShadow: '0 0 10px rgba(255, 0, 0, 0.6)',
                  }}
                >
                  You May Also Like
                </h2>

                {/* Product Carousel */}
                <ProductCarousel
                  products={products}
                  showSaleBadge={true}
                />
              </div>
            </section>
          );
        }}
      </Await>
    </Suspense>
  );
}

/**
 * GraphQL Fragment for Product Recommendations
 */
export const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
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
        url
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

  query ProductRecommendations($productId: ID!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId) {
      ...RecommendedProduct
    }
  }
`;
