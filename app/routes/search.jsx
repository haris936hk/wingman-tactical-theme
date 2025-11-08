import {useState, useEffect} from 'react';
import {useLoaderData, useNavigate, useSearchParams} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {SearchResults} from '~/components/SearchResults';
import {FilterSidebar} from '~/components/FilterSidebar';
import {MobileFilterDrawer} from '~/components/MobileFilterDrawer';
import {ActiveFilters} from '~/components/ActiveFilters';
import {SearchHeader} from '~/components/SearchHeader';
import {NoResults} from '~/components/NoResults';
import {getEmptyPredictiveSearchResult} from '~/lib/search';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  const term = data?.term || '';
  return [{title: term ? `Search: ${term} | Wingman Tactical` : 'Search | Wingman Tactical'}];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({request, context}) {
  const url = new URL(request.url);
  const isPredictive = url.searchParams.has('predictive');
  const searchPromise = isPredictive
    ? predictiveSearch({request, context})
    : regularSearch({request, context});

  searchPromise.catch((error) => {
    console.error(error);
    return {term: '', result: null, error: error.message};
  });

  return await searchPromise;
}

/**
 * Renders the /search route - Wingman Tactical themed
 */
export default function SearchPage() {
  /** @type {LoaderReturnData} */
  const {type, term, result, error} = useLoaderData();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // State management
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [sortValue, setSortValue] = useState('relevance');
  const [recentSearches, setRecentSearches] = useState([]);

  // Don't render predictive search on this page
  if (type === 'predictive') return null;

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      setRecentSearches(recent);

      // Save current search to recent
      if (term && !recent.includes(term)) {
        const updated = [term, ...recent].slice(0, 5);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
        setRecentSearches(updated);
      }
    }
  }, [term]);

  // Parse filters from URL params
  useEffect(() => {
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const types = searchParams.getAll('type');
    const vendors = searchParams.getAll('vendor');
    const available = searchParams.get('available') === 'true';
    const sort = searchParams.get('sort') || 'relevance';

    setFilters({
      price: priceMin && priceMax ? [Number(priceMin), Number(priceMax)] : [0, 500],
      type: types,
      vendor: vendors,
      available,
    });
    setSortValue(sort);
  }, [searchParams]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    const newFilters = {...filters, [filterType]: value};
    setFilters(newFilters);
    updateURL(newFilters, sortValue);
  };

  // Handle sort change
  const handleSortChange = (newSort) => {
    setSortValue(newSort);
    updateURL(filters, newSort);
  };

  // Handle remove single filter
  const handleRemoveFilter = (filterId) => {
    const newFilters = {...filters};
    const [filterType, filterValue] = filterId.split(':');

    if (filterType === 'price') {
      newFilters.price = [0, 500];
    } else if (filterType === 'available') {
      newFilters.available = false;
    } else if (Array.isArray(newFilters[filterType])) {
      newFilters[filterType] = newFilters[filterType].filter((v) => v !== filterValue);
    }

    setFilters(newFilters);
    updateURL(newFilters, sortValue);
  };

  // Handle clear all filters
  const handleClearAll = () => {
    const emptyFilters = {
      price: [0, 500],
      type: [],
      vendor: [],
      available: false,
    };
    setFilters(emptyFilters);
    updateURL(emptyFilters, 'relevance');
    setSortValue('relevance');
  };

  // Update URL with filter params
  const updateURL = (newFilters, newSort) => {
    const params = new URLSearchParams();
    if (term) params.set('q', term);

    if (newFilters.price && (newFilters.price[0] !== 0 || newFilters.price[1] !== 500)) {
      params.set('priceMin', newFilters.price[0]);
      params.set('priceMax', newFilters.price[1]);
    }

    if (newFilters.type?.length) {
      newFilters.type.forEach((t) => params.append('type', t));
    }

    if (newFilters.vendor?.length) {
      newFilters.vendor.forEach((v) => params.append('vendor', v));
    }

    if (newFilters.available) {
      params.set('available', 'true');
    }

    if (newSort !== 'relevance') {
      params.set('sort', newSort);
    }

    navigate(`/search?${params.toString()}`, {replace: true, preventScrollReset: true});
  };

  // Build active filter chips
  const activeFilterChips = [];
  if (filters.price && (filters.price[0] !== 0 || filters.price[1] !== 500)) {
    activeFilterChips.push({
      id: 'price:range',
      label: `$${filters.price[0]} - $${filters.price[1]}`,
    });
  }
  if (filters.type?.length) {
    filters.type.forEach((type) => {
      activeFilterChips.push({
        id: `type:${type}`,
        label: type,
      });
    });
  }
  if (filters.vendor?.length) {
    filters.vendor.forEach((vendor) => {
      activeFilterChips.push({
        id: `vendor:${vendor}`,
        label: vendor,
      });
    });
  }
  if (filters.available) {
    activeFilterChips.push({
      id: 'available:true',
      label: 'In Stock Only',
    });
  }

  // Available filters (mock data - would come from API in production)
  const availableFilters = {
    types: ['Flight Suits', 'Flight Jackets', 'Flight Bag', 'Aviation Gear', 'Apparels'],
    vendors: ['Wingman Tactical', 'Alpha Industries', 'Propper'],
  };

  const resultCount = result?.total || 0;
  const hasResults = resultCount > 0;

  return (
    <div className="bg-[#000000] min-h-screen pt-[180px] pb-16">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Search Header */}
        <SearchHeader
          searchTerm={term}
          resultCount={resultCount}
          sortValue={sortValue}
          onSortChange={handleSortChange}
          onFilterToggle={() => setIsFilterDrawerOpen(true)}
          showFilterButton={true}
        />

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-500 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Active Filters */}
        {activeFilterChips.length > 0 && (
          <ActiveFilters
            filters={activeFilterChips}
            onRemove={handleRemoveFilter}
            onClearAll={handleClearAll}
          />
        )}

        {/* Main Content Grid */}
        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              availableFilters={availableFilters}
            />
          </div>

          {/* Results Content */}
          <div className="flex-1 min-w-0">
            {/* Loading State */}
            {!term && (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-[#FF0000]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{
                    filter: 'drop-shadow(0 0 10px rgba(255, 0, 0, 0.6))',
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h2
                  className="text-2xl font-bold uppercase text-white mb-3"
                  style={{
                    fontFamily: 'var(--font-family-shock)',
                    textShadow: '0 0 10px rgba(255, 0, 0, 0.6)',
                  }}
                >
                  Start Searching
                </h2>
                <p className="text-gray-300">
                  Enter a search term to find products
                </p>

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="mt-8 max-w-md mx-auto">
                    <h3 className="text-sm font-bold uppercase text-gray-400 mb-3">
                      Recent Searches
                    </h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {recentSearches.map((search) => (
                        <a
                          key={search}
                          href={`/search?q=${encodeURIComponent(search)}`}
                          className="px-4 py-2 bg-white/10 hover:bg-[#FF0000]/20
                            text-white rounded-full text-sm
                            hover:border-[#FF0000] border border-white/30
                            transition-all"
                        >
                          {search}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* No Results */}
            {term && !hasResults && (
              <NoResults searchTerm={term} popularProducts={[]} />
            )}

            {/* Search Results */}
            {term && hasResults && (
              <SearchResults result={result} term={term}>
                {({products, term}) => (
                  <SearchResults.Products products={products} term={term} />
                )}
              </SearchResults>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={(newFilters) => {
          setFilters(newFilters);
          updateURL(newFilters, sortValue);
        }}
        onClearAll={handleClearAll}
        availableFilters={availableFilters}
      />

      {/* Analytics */}
      <Analytics.SearchView data={{searchTerm: term, searchResults: result}} />
    </div>
  );
}

/**
 * Regular search query and fragments
 */
const SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment SearchProduct on Product {
    __typename
    handle
    id
    publishedAt
    title
    trackingParameters
    vendor
    description
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
      compareAtPrice {
        amount
        currencyCode
      }
      selectedOptions {
        name
        value
      }
      product {
        handle
        title
      }
    }
  }
`;

const SEARCH_PAGE_FRAGMENT = `#graphql
  fragment SearchPage on Page {
     __typename
     handle
    id
    title
    trackingParameters
  }
`;

const SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment SearchArticle on Article {
    __typename
    handle
    id
    title
    trackingParameters
  }
`;

const PAGE_INFO_FRAGMENT = `#graphql
  fragment PageInfoFragment on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/search
export const SEARCH_QUERY = `#graphql
  query RegularSearch(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $term: String!
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    articles: search(
      query: $term,
      types: [ARTICLE],
      first: $first,
    ) {
      nodes {
        ...on Article {
          ...SearchArticle
        }
      }
    }
    pages: search(
      query: $term,
      types: [PAGE],
      first: $first,
    ) {
      nodes {
        ...on Page {
          ...SearchPage
        }
      }
    }
    products: search(
      after: $endCursor,
      before: $startCursor,
      first: $first,
      last: $last,
      query: $term,
      sortKey: RELEVANCE,
      types: [PRODUCT],
      unavailableProducts: HIDE,
    ) {
      nodes {
        ...on Product {
          ...SearchProduct
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${SEARCH_PRODUCT_FRAGMENT}
  ${SEARCH_PAGE_FRAGMENT}
  ${SEARCH_ARTICLE_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

/**
 * Regular search fetcher
 */
async function regularSearch({request, context}) {
  const {storefront} = context;
  const url = new URL(request.url);
  const variables = getPaginationVariables(request, {pageBy: 12});
  const term = String(url.searchParams.get('q') || '');

  // Search articles, pages, and products for the `q` term
  const {errors, ...items} = await storefront.query(SEARCH_QUERY, {
    variables: {...variables, term},
  });

  if (!items) {
    throw new Error('No search data returned from Shopify API');
  }

  const total = Object.values(items).reduce(
    (acc, {nodes}) => acc + nodes.length,
    0,
  );

  const error = errors
    ? errors.map(({message}) => message).join(', ')
    : undefined;

  return {type: 'regular', term, error, result: {total, items}};
}

/**
 * Predictive search fragments
 */
const PREDICTIVE_SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment PredictiveArticle on Article {
    __typename
    id
    title
    handle
    blog {
      handle
    }
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
`;

const PREDICTIVE_SEARCH_COLLECTION_FRAGMENT = `#graphql
  fragment PredictiveCollection on Collection {
    __typename
    id
    title
    handle
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
`;

const PREDICTIVE_SEARCH_PAGE_FRAGMENT = `#graphql
  fragment PredictivePage on Page {
    __typename
    id
    title
    handle
    trackingParameters
  }
`;

const PREDICTIVE_SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment PredictiveProduct on Product {
    __typename
    id
    title
    handle
    trackingParameters
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
  }
`;

const PREDICTIVE_SEARCH_QUERY_FRAGMENT = `#graphql
  fragment PredictiveQuery on SearchQuerySuggestion {
    __typename
    text
    styledText
    trackingParameters
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/predictiveSearch
const PREDICTIVE_SEARCH_QUERY = `#graphql
  query PredictiveSearch(
    $country: CountryCode
    $language: LanguageCode
    $limit: Int!
    $limitScope: PredictiveSearchLimitScope!
    $term: String!
    $types: [PredictiveSearchType!]
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(
      limit: $limit,
      limitScope: $limitScope,
      query: $term,
      types: $types,
    ) {
      articles {
        ...PredictiveArticle
      }
      collections {
        ...PredictiveCollection
      }
      pages {
        ...PredictivePage
      }
      products {
        ...PredictiveProduct
      }
      queries {
        ...PredictiveQuery
      }
    }
  }
  ${PREDICTIVE_SEARCH_ARTICLE_FRAGMENT}
  ${PREDICTIVE_SEARCH_COLLECTION_FRAGMENT}
  ${PREDICTIVE_SEARCH_PAGE_FRAGMENT}
  ${PREDICTIVE_SEARCH_PRODUCT_FRAGMENT}
  ${PREDICTIVE_SEARCH_QUERY_FRAGMENT}
`;

/**
 * Predictive search fetcher
 */
async function predictiveSearch({request, context}) {
  const {storefront} = context;
  const url = new URL(request.url);
  const term = String(url.searchParams.get('q') || '').trim();
  const limit = Number(url.searchParams.get('limit') || 10);
  const type = 'predictive';

  if (!term) return {type, term, result: getEmptyPredictiveSearchResult()};

  const {predictiveSearch: items, errors} = await storefront.query(
    PREDICTIVE_SEARCH_QUERY,
    {
      variables: {
        limit,
        limitScope: 'EACH',
        term,
      },
    },
  );

  if (errors) {
    throw new Error(
      `Shopify API errors: ${errors.map(({message}) => message).join(', ')}`,
    );
  }

  if (!items) {
    throw new Error('No predictive search data returned from Shopify API');
  }

  const total = Object.values(items).reduce(
    (acc, item) => acc + item.length,
    0,
  );

  return {type, term, result: {items, total}};
}

/** @typedef {import('./+types/search').Route} Route */
/** @typedef {import('~/lib/search').RegularSearchReturn} RegularSearchReturn */
/** @typedef {import('~/lib/search').PredictiveSearchReturn} PredictiveSearchReturn */
/** @typedef {import('storefrontapi.generated').RegularSearchQuery} RegularSearchQuery */
/** @typedef {import('storefrontapi.generated').PredictiveSearchQuery} PredictiveSearchQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
