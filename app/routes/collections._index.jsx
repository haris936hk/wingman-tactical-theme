import {useLoaderData} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {EnhancedCollectionCard} from '~/components/collections/EnhancedCollectionCard';
import {CollectionEmpty} from '~/components/collections/CollectionEmpty';
import {CollectionBreadcrumbs} from '~/components/collections/CollectionBreadcrumbs';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [
    {title: 'Shop Collections | Wingman Tactical'},
    {
      name: 'description',
      content:
        'Browse our curated collections of tactical gear, equipment, and accessories. Find the perfect gear for your mission.',
    },
    {
      name: 'keywords',
      content: 'tactical collections, gear collections, tactical equipment, tactical accessories',
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
async function loadCriticalData({context, request}) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  const [{collections}] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY, {
      variables: paginationVariables,
      cache: context.storefront.CacheLong(),
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {collections};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context}) {
  return {};
}

export default function Collections() {
  /** @type {LoaderReturnData} */
  const {collections} = useLoaderData();

  const hasCollections = collections?.nodes?.length > 0;

  return (
    <div className="bg-[#000000] min-h-screen pt-[180px] pb-16">
      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-6">
        <CollectionBreadcrumbs
          items={[
            {name: 'Home', url: '/'},
            {name: 'Collections', url: '/collections'},
          ]}
        />
      </div>

      {/* Hero Section */}
      <div className="max-w-[1400px] mx-auto px-6 mb-12">
        <div
          className="text-center mb-8 motion-safe:animate-[fadeSlideUp_0.5s_ease-out]"
        >
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold uppercase text-white mb-6"
            style={{
              fontFamily: 'var(--font-family-shock)',
              textShadow:
                '0 0 20px rgba(255, 0, 0, 0.8), 0 0 40px rgba(255, 0, 0, 0.4)',
            }}
          >
            Shop Collections
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Explore our curated collections of tactical gear, equipment, and
            accessories designed for professionals and enthusiasts.
          </p>
        </div>

        {/* Trust Badges */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12
          motion-safe:animate-[fadeSlideUp_0.5s_ease-out_0.1s]
          motion-safe:[animation-fill-mode:both]"
        >
          <div className="flex items-center justify-center gap-3 text-gray-300">
            <svg
              className="w-6 h-6 text-[#FF0000]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
            <span className="text-sm font-bold uppercase tracking-wide">
              Free Shipping $100+
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 text-gray-300">
            <svg
              className="w-6 h-6 text-[#FF0000]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="text-sm font-bold uppercase tracking-wide">
              Quality Guarantee
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 text-gray-300">
            <svg
              className="w-6 h-6 text-[#FF0000]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
            <span className="text-sm font-bold uppercase tracking-wide">
              30-Day Returns
            </span>
          </div>
        </div>
      </div>

      {/* Collections Grid or Empty State */}
      <div className="max-w-[1400px] mx-auto px-6">
        {hasCollections ? (
          <PaginatedResourceSection
            connection={collections}
            resourcesClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
          >
            {({node: collection, index}) => (
              <EnhancedCollectionCard
                key={collection.id}
                collection={collection}
                index={index}
              />
            )}
          </PaginatedResourceSection>
        ) : (
          <CollectionEmpty type="no-collections" />
        )}
      </div>
    </div>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

/** @typedef {import('./+types/collections._index').Route} Route */
/** @typedef {import('storefrontapi.generated').CollectionFragment} CollectionFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
