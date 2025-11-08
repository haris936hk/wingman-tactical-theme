/**
 * ActiveFilters Component - Display applied filters as removable chips
 * Shows active filters with remove buttons and clear all option
 */
export function ActiveFilters({filters = [], onRemove, onClearAll}) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 py-4" role="region" aria-label="Active filters">
      <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">
        Filters:
      </span>

      {/* Filter Chips */}
      {filters.map((filter) => (
        <div
          key={filter.id}
          className="inline-flex items-center gap-2 px-4 py-2 bg-transparent
            border-2 border-white/30 rounded-full text-white text-sm
            motion-safe:transition-all motion-safe:duration-200
            hover:border-[#FF0000] hover:bg-[#FF0000]/10
            group"
        >
          <span className="font-medium">{filter.label}</span>
          <button
            type="button"
            onClick={() => onRemove?.(filter.id)}
            className="flex items-center justify-center w-5 h-5 rounded-full
              bg-white/20 hover:bg-[#FF0000] transition-colors"
            aria-label={`Remove ${filter.label} filter`}
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}

      {/* Clear All Button */}
      {filters.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-sm font-bold uppercase text-[#FF0000]
            hover:text-white transition-colors underline"
        >
          Clear All
        </button>
      )}
    </div>
  );
}
