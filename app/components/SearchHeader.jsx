import {Link} from 'react-router';
import {SortDropdown} from '~/components/SortDropdown';

/**
 * SearchHeader Component - Results page header with count, controls, and breadcrumb
 */
export function SearchHeader({
  searchTerm,
  resultCount,
  sortValue,
  onSortChange,
  onFilterToggle,
  showFilterButton = true,
}) {
  return (
    <div className="space-y-4 mb-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-white">Search</span>
        {searchTerm && (
          <>
            <span>/</span>
            <span className="text-[#FF0000]">{searchTerm}</span>
          </>
        )}
      </nav>

      {/* Header with Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Result Count */}
        <div>
          <h1
            className="text-2xl lg:text-3xl font-bold uppercase text-white"
            style={{
              fontFamily: 'var(--font-family-shock)',
              textShadow: '0 0 10px rgba(255, 0, 0, 0.6)',
            }}
          >
            Search Results
          </h1>
          <p
            className="text-gray-300 mt-1"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {resultCount > 0 ? (
              <>
                Showing <span className="text-white font-bold">{resultCount}</span> result
                {resultCount !== 1 && 's'}
                {searchTerm && (
                  <>
                    {' for '}
                    <span className="text-[#FF0000] font-bold">"{searchTerm}"</span>
                  </>
                )}
              </>
            ) : (
              searchTerm && `No results for "${searchTerm}"`
            )}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle Button */}
          {showFilterButton && (
            <button
              type="button"
              onClick={onFilterToggle}
              className="md:hidden flex items-center gap-2 px-4 py-3
                bg-gray-900 text-white border-2 border-white/30
                rounded-lg font-medium uppercase text-sm
                hover:border-[#FF0000] transition-colors"
              aria-label="Open filters"
            >
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
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span>Filters</span>
            </button>
          )}

          {/* Sort Dropdown */}
          <SortDropdown value={sortValue} onChange={onSortChange} />
        </div>
      </div>
    </div>
  );
}
