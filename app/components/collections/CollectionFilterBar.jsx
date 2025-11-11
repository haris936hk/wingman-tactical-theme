import {ViewToggle} from './ViewToggle';

/**
 * Collection Filter Bar - Wingman Tactical Brand
 * Top bar with result count, sort dropdown, view toggle, and mobile filter button
 * @param {{
 *   resultCount: number;
 *   currentSort: string;
 *   onSortChange: (sort: string) => void;
 *   currentView: '2' | '3' | '4';
 *   onViewChange: (view: '2' | '3' | '4') => void;
 *   onFilterToggle?: () => void;
 *   showFilterButton?: boolean;
 * }}
 */
export function CollectionFilterBar({
  resultCount,
  currentSort,
  onSortChange,
  currentView,
  onViewChange,
  onFilterToggle,
  showFilterButton = false,
}) {
  const sortOptions = [
    {value: 'featured', label: 'Featured'},
    {value: 'best-selling', label: 'Best Selling'},
    {value: 'title-asc', label: 'A-Z'},
    {value: 'title-desc', label: 'Z-A'},
    {value: 'price-asc', label: 'Price: Low to High'},
    {value: 'price-desc', label: 'Price: High to Low'},
    {value: 'created-desc', label: 'Newest'},
    {value: 'created-asc', label: 'Oldest'},
  ];

  return (
    <div
      className="sticky top-24 z-40 bg-black/95 backdrop-blur-md
        border-y-2 border-[#FF0000]/30
        shadow-[0_0_20px_rgba(255,0,0,0.2)]
        py-4
        motion-safe:animate-[fadeSlideUp_0.5s_ease-out_0.2s]
        motion-safe:[animation-fill-mode:both]"
    >
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Left: Result Count + Mobile Filter Button */}
        <div className="flex items-center gap-4">
          {/* Mobile Filter Button */}
          {showFilterButton && onFilterToggle && (
            <button
              onClick={onFilterToggle}
              className="md:hidden flex items-center gap-2 px-4 py-2 rounded-lg
                bg-[#FF0000]/20 border border-[#FF0000]/40
                text-white text-sm font-bold uppercase tracking-wide
                hover:bg-[#FF0000]/30 hover:border-[#FF0000]/60
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2
                focus:ring-offset-black"
              aria-label="Toggle filters"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filters</span>
            </button>
          )}

          {/* Result Count */}
          <div className="text-white">
            <span className="text-lg font-bold text-[#FF0000]">{resultCount}</span>
            <span className="text-sm text-gray-300 ml-2 uppercase tracking-wide">
              {resultCount === 1 ? 'Product' : 'Products'}
            </span>
          </div>
        </div>

        {/* Right: Sort + View Toggle */}
        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="collection-sort"
              className="text-sm text-gray-300 uppercase tracking-wide font-medium hidden sm:block"
            >
              Sort:
            </label>
            <select
              id="collection-sort"
              value={currentSort}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-4 py-2 rounded-lg text-sm font-medium
                bg-black/50 backdrop-blur-sm
                border border-white/30 text-white
                hover:border-[#FF0000]/60
                focus:outline-none focus:ring-2 focus:ring-[#FF0000]
                focus:border-[#FF0000]
                transition-all duration-200
                cursor-pointer"
              aria-label="Sort products"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-gray-900">
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <ViewToggle currentView={currentView} onViewChange={onViewChange} />
        </div>
        </div>
      </div>
    </div>
  );
}
