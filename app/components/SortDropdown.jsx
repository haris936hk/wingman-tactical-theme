/**
 * SortDropdown Component - Sort search results
 * Options: Relevance, Price (Low/High), Newest
 */
export function SortDropdown({value = 'relevance', onChange}) {
  const options = [
    {value: 'relevance', label: 'Relevance'},
    {value: 'price-asc', label: 'Price: Low to High'},
    {value: 'price-desc', label: 'Price: High to Low'},
    {value: 'newest', label: 'Newest'},
  ];

  return (
    <div className="relative">
      <label htmlFor="sort-select" className="sr-only">
        Sort products by
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="appearance-none bg-gray-900 text-white border-2 border-white/30
          rounded-lg px-4 pr-10 py-3 font-medium uppercase text-sm
          focus:outline-none focus:border-[#FF0000]
          hover:border-[#FF0000]/50
          transition-colors cursor-pointer"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Dropdown Arrow Icon */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
