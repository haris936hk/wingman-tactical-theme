import {useState, useEffect} from 'react';
import {redirect, useLoaderData, useNavigate, useSearchParams, Link, useRouteError, isRouteErrorResponse} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {FILTER_DEFAULTS} from '~/lib/constants';
import {ProductItem} from '~/components/ProductItem';
import {CollectionHero} from '~/components/collections/CollectionHero';
import {CollectionBreadcrumbs} from '~/components/collections/CollectionBreadcrumbs';
import {CollectionFilterBar} from '~/components/collections/CollectionFilterBar';
import {CollectionEmpty} from '~/components/collections/CollectionEmpty';
import {FilterSidebar} from '~/components/FilterSidebar';
import {MobileFilterDrawer} from '~/components/MobileFilterDrawer';
import {ActiveFilters} from '~/components/ActiveFilters';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  const collection = data?.collection;
  return [
    {title: `${collection?.title ?? 'Collection'} | Wingman Tactical`},
    {
      name: 'description',
      content:
        collection?.description ||
        `Shop the ${collection?.title} collection at Wingman Tactical. Premium tactical gear and equipment.`,
    },
    {
      name: 'keywords',
      content: `${collection?.title}, tactical gear, military equipment, Wingman Tactical`,
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
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
      cache: storefront.CacheLong(),
      // Add other queries here, so that they are loaded in parallel
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {
    collection,
  };
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

export default function Collection() {
  /** @type {LoaderReturnData} */
  const {collection} = useLoaderData();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // State management
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [sortValue, setSortValue] = useState('featured');
  const [currentView, setCurrentView] = useState('4');

  // Parse filters from URL params
  useEffect(() => {
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const types = searchParams.getAll('type');
    const vendors = searchParams.getAll('vendor');
    const available = searchParams.get('available') === 'true';
    const sort = searchParams.get('sort') || 'featured';
    const view = searchParams.get('view') || '4';

    setFilters({
      price: priceMin && priceMax ? [Number(priceMin), Number(priceMax)] : [FILTER_DEFAULTS.PRICE_MIN, FILTER_DEFAULTS.PRICE_MAX],
      type: types,
      vendor: vendors,
      available,
    });
    setSortValue(sort);
    setCurrentView(view);
  }, [searchParams]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    const newFilters = {...filters, [filterType]: value};
    setFilters(newFilters);
    updateURL(newFilters, sortValue, currentView);
  };

  // Handle sort change
  const handleSortChange = (newSort) => {
    setSortValue(newSort);
    updateURL(filters, newSort, currentView);
  };

  // Handle view change
  const handleViewChange = (newView) => {
    setCurrentView(newView);
    updateURL(filters, sortValue, newView);
  };

  // Handle remove single filter
  const handleRemoveFilter = (filterId) => {
    const newFilters = {...filters};
    const [filterType, filterValue] = filterId.split(':');

    if (filterType === 'price') {
      newFilters.price = [FILTER_DEFAULTS.PRICE_MIN, FILTER_DEFAULTS.PRICE_MAX];
    } else if (filterType === 'available') {
      newFilters.available = false;
    } else if (Array.isArray(newFilters[filterType])) {
      newFilters[filterType] = newFilters[filterType].filter((v) => v !== filterValue);
    }

    setFilters(newFilters);
    updateURL(newFilters, sortValue, currentView);
  };

  // Handle clear all filters
  const handleClearAll = () => {
    const emptyFilters = {
      price: [FILTER_DEFAULTS.PRICE_MIN, FILTER_DEFAULTS.PRICE_MAX],
      type: [],
      vendor: [],
      available: false,
    };
    setFilters(emptyFilters);
    updateURL(emptyFilters, 'featured', currentView);
    setSortValue('featured');
  };

  // Update URL with filter params
  const updateURL = (newFilters, newSort, newView) => {
    const params = new URLSearchParams();

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

    if (newSort !== 'featured') {
      params.set('sort', newSort);
    }

    if (newView !== '4') {
      params.set('view', newView);
    }

    navigate(`?${params.toString()}`, {replace: true, preventScrollReset: true});
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

  const productCount = collection.products.nodes.length;
  const hasProducts = productCount > 0;

  // Determine grid columns based on view
  const gridClasses = {
    '2': 'grid-cols-1 sm:grid-cols-2 gap-8',
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
    '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
  };

  return (
    <div className="bg-[#000000] min-h-screen pt-[104px] pb-16">
      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-6 mb-6">
        <CollectionBreadcrumbs
          items={[
            {name: 'Home', url: '/'},
            {name: 'Collections', url: '/collections'},
            {name: collection.title, url: `/collections/${collection.handle}`},
          ]}
        />
      </div>

      {/* Hero Section */}
      <div className="max-w-[1400px] mx-auto px-6">
        <CollectionHero collection={collection} productCount={productCount} />
      </div>

      {/* Filter Bar */}
      <CollectionFilterBar
        resultCount={productCount}
        currentSort={sortValue}
        onSortChange={handleSortChange}
        currentView={currentView}
        onViewChange={handleViewChange}
        onFilterToggle={() => setIsFilterDrawerOpen(true)}
        showFilterButton={true}
      />

      {/* Active Filters */}
      {activeFilterChips.length > 0 && (
        <div className="max-w-[1400px] mx-auto px-6 mb-6">
          <ActiveFilters
            filters={activeFilterChips}
            onRemove={handleRemoveFilter}
            onClearAll={handleClearAll}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 mt-6">
        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              availableFilters={availableFilters}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {hasProducts ? (
              <PaginatedResourceSection
                connection={collection.products}
                resourcesClassName={`grid ${gridClasses[currentView]} mb-12`}
              >
                {({node: product, index}) => (
                  <ProductItem
                    key={product.id}
                    product={product}
                    loading={index < 8 ? 'eager' : undefined}
                    fetchpriority={index < 4 ? 'high' : undefined}
                    index={index}
                  />
                )}
              </PaginatedResourceSection>
            ) : (
              <CollectionEmpty type="no-products" />
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
          updateURL(newFilters, sortValue, currentView);
        }}
        onClearAll={handleClearAll}
        availableFilters={availableFilters}
      />

      {/* Analytics */}
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url(transform: {maxWidth: 600})
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        id
        url(transform: {maxWidth: 1600, maxHeight: 600})
        altText
        width
        height
      }
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
`;

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{fontFamily: 'var(--font-family-shock)'}}>{error.status}</h1>
          <p className="text-lg text-gray-400 mb-6">
            {error.status === 404 ? 'Collection Not Found' : error.statusText || 'Collection Error'}
          </p>
          {error.data && <p className="text-sm text-gray-500 mb-8">{error.data}</p>}
          <Link
            to="/collections/all"
            className="inline-block bg-[#FF0000] text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Collection Error</h1>
        <p className="text-lg text-gray-400 mb-8">
          {error instanceof Error ? error.message : 'An unexpected error occurred loading this collection'}
        </p>
        <Link
          to="/collections/all"
          className="inline-block bg-[#FF0000] text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors"
        >
          View All Products
        </Link>
      </div>
    </div>
  );
}

/** @typedef {import('./+types/collections.$handle').Route} Route */
/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
