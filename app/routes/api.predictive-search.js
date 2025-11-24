/**
 * Predictive Search API Route
 * Handles autocomplete search queries using Shopify's predictive search
 */

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({ request, context }) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q');

  if (!query || query.length < 1) {
    return Response.json({
      products: [],
      collections: [],
      pages: [],
    });
  }

  const { storefront } = context;

  try {
    const data = await storefront.query(PREDICTIVE_SEARCH_QUERY, {
      variables: {
        query,
        limit: 3,
      },
      cache: storefront.CacheShort(),
    });

    const predictiveSearch = data?.predictiveSearch;

    return Response.json(
      {
        products: predictiveSearch?.products || [],
        collections: predictiveSearch?.collections || [],
        pages: predictiveSearch?.pages || [],
        queries: predictiveSearch?.queries || [],
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=1800',
        },
      },
    );
  } catch (error) {
    console.error('Predictive search error:', error);
    return Response.json(
      {
        products: [],
        collections: [],
        pages: [],
        error: 'Search failed',
      },
      { status: 500 },
    );
  }
}

const PREDICTIVE_SEARCH_QUERY = `#graphql
  query PredictiveSearch(
    $query: String!
    $limit: Int!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(
      query: $query
      limit: $limit
      limitScope: ALL
      types: [PRODUCT, COLLECTION, PAGE]
    ) {
      products {
        id
        title
        handle
        featuredImage {
          url(transform: {maxWidth: 600})
          altText
          width
          height
        }
        variants(first: 1) {
          nodes {
            id
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
          }
        }
      }
      collections {
        id
        title
        handle
        image {
          url
          altText
          width
          height
        }
      }
      pages {
        id
        title
        handle
      }
      queries {
        text
        styledText
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
