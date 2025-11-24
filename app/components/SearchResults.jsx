import {Link} from 'react-router';
import {Pagination} from '@shopify/hydrogen';
import {SearchResultsGrid} from '~/components/SearchResultsGrid';
import {urlWithTrackingParams} from '~/lib/search';

/**
 * @param {Omit<SearchResultsProps, 'error' | 'type'>}
 */
export function SearchResults({term, result, children}) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

/**
 * Articles Results (hidden - products only per plan)
 * @param {PartialSearchResult<'articles'>}
 */
function SearchResultsArticles({term, articles}) {
  // Products only per plan decision 3A
  return null;
}

/**
 * Pages Results (hidden - products only per plan)
 * @param {PartialSearchResult<'pages'>}
 */
function SearchResultsPages({term, pages}) {
  // Products only per plan decision 3A
  return null;
}

/**
 * Products Results - Uses SearchResultsGrid with pagination
 * @param {PartialSearchResult<'products'>}
 */
function SearchResultsProducts({term, products}) {
  if (!products?.nodes.length) {
    return null;
  }

  return (
    <Pagination connection={products}>
      {({nodes, isLoading, NextLink, PreviousLink, hasNextPage, hasPreviousPage}) => {
        // Transform nodes to match ProductItem expected format
        const productsForGrid = nodes.map((product) => ({
          ...product,
          priceRange: {
            minVariantPrice: product.selectedOrFirstAvailableVariant?.price,
          },
          compareAtPriceRange: product.selectedOrFirstAvailableVariant?.compareAtPrice
            ? {
                minVariantPrice: product.selectedOrFirstAvailableVariant.compareAtPrice,
              }
            : null,
          featuredImage: product.selectedOrFirstAvailableVariant?.image,
        }));

        return (
          <div className="space-y-8">
            {/* Previous Link */}
            {hasPreviousPage && (
              <div className="flex justify-center">
                <PreviousLink
                  className="px-8 py-4 font-bold uppercase tracking-wide text-white
                    rounded-lg bg-[#FF0000] hover:bg-[#CC0000]
                    transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                      Load Previous
                    </span>
                  )}
                </PreviousLink>
              </div>
            )}

            {/* Product Grid */}
            <SearchResultsGrid products={productsForGrid} loading={isLoading} />

            {/* Next Link - Load More */}
            {hasNextPage && (
              <div className="flex justify-center pt-4">
                <NextLink
                  className="px-8 py-4 font-bold uppercase tracking-wide text-white
                    rounded-lg bg-[#FF0000] hover:bg-[#CC0000]
                    transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Load More
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7 7"
                        />
                      </svg>
                    </span>
                  )}
                </NextLink>
              </div>
            )}
          </div>
        );
      }}
    </Pagination>
  );
}

function SearchResultsEmpty() {
  return null; // Handled by NoResults component
}

/** @typedef {RegularSearchReturn['result']['items']} SearchItems */
/**
 * @typedef {Pick<
 *   SearchItems,
 *   ItemType
 * > &
 *   Pick<RegularSearchReturn, 'term'>} PartialSearchResult
 * @template {keyof SearchItems} ItemType
 */
/**
 * @typedef {RegularSearchReturn & {
 *   children: (args: SearchItems & {term: string}) => React.ReactNode;
 * }} SearchResultsProps
 */

/** @typedef {import('~/lib/search').RegularSearchReturn} RegularSearchReturn */
