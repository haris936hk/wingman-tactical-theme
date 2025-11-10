import {useState, useEffect} from 'react';
import {useLoaderData, useNavigate, useSearchParams} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductItem} from '~/components/ProductItem';
import {CollectionBreadcrumbs} from '~/components/collections/CollectionBreadcrumbs';
import {CollectionFilterBar} from '~/components/collections/CollectionFilterBar';
import {CollectionEmpty} from '~/components/collections/CollectionEmpty';
import {FilterSidebar} from '~/components/FilterSidebar';
import {MobileFilterDrawer} from '~/components/MobileFilterDrawer';
import {ActiveFilters} from '~/components/ActiveFilters';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [
    {title: 'All Products | Wingman Tactical'},
    {
      name: 'description',
      content:
        'Browse our complete collection of premium tactical gear and equipment. Quality products for professionals and enthusiasts.',
    },
    {
      name: 'keywords',
      content: 'all products, tactical gear, military equipment, complete catalog, Wingman Tactical',
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
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);
  return {products};
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

export default function AllProducts() {
  /** @type {LoaderReturnData} */
  const {products} = useLoaderData();
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
      price: priceMin && priceMax ? [Number(priceMin), Number(priceMax)] : [0, 500],
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
      newFilters.price = [0, 500];
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
      price: [0, 500],
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

  const productCount = products?.nodes?.length || 0;
  const hasProducts = productCount > 0;

  // Determine grid columns based on view
  const gridClasses = {
    '2': 'grid-cols-1 sm:grid-cols-2 gap-8',
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
    '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
  };

  return (
    <div className="bg-[#000000] min-h-screen pt-[180px] pb-16">
      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-6 mb-6">
        <CollectionBreadcrumbs
          items={[
            {name: 'Home', url: '/'},
            {name: 'All Products', url: '/collections/all'},
          ]}
        />
      </div>

      {/* Hero Section */}
      <div className="max-w-[1400px] mx-auto px-6 mb-12">
        <div
          className="relative overflow-hidden rounded-lg
            bg-gradient-to-br from-black via-gray-900 to-black
            border-2 border-[#FF0000]/30
            shadow-[0_0_30px_rgba(255,0,0,0.3)]
            p-12 md:p-16
            motion-safe:animate-[fadeSlideUp_0.5s_ease-out]"
        >
          {/* SVG Animated Border */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="all-products-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF0000" />
                <stop offset="50%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#FF0000" />
              </linearGradient>
            </defs>
            <rect
              x="2"
              y="2"
              width="calc(100% - 4px)"
              height="calc(100% - 4px)"
              rx="6"
              fill="none"
              stroke="url(#all-products-gradient)"
              strokeWidth="2"
              strokeDasharray="8 4"
              className="motion-safe:animate-[border-spin_4s_linear_infinite]"
            />
          </svg>

          {/* Content */}
          <div className="relative z-10 text-center">
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold uppercase text-white mb-6"
              style={{
                fontFamily: 'var(--font-family-shock)',
                textShadow: '0 0 20px rgba(255, 0, 0, 0.8), 0 0 40px rgba(255, 0, 0, 0.4)',
              }}
            >
              All Products
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Browse our complete collection of premium tactical gear and equipment.
              From flight suits to aviation accessories, find everything you need here.
            </p>
          </div>

          {/* Bottom Red Accent Line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1
              bg-gradient-to-r from-transparent via-[#FF0000] to-transparent"
          />
        </div>
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
      <div className="max-w-[1400px] mx-auto px-6">
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
                connection={products}
                resourcesClassName={`grid ${gridClasses[currentView]} mb-12`}
              >
                {({node: product, index}) => (
                  <ProductItem
                    key={product.id}
                    product={product}
                    loading={index < 8 ? 'eager' : undefined}
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
    </div>
  );
}

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/product
const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
`;

/** @typedef {import('./+types/collections.all').Route} Route */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
