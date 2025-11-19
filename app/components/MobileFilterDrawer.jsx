import {useEffect, useRef, useState} from 'react';
import {PriceRangeSlider} from '~/components/PriceRangeSlider';

/**
 * MobileFilterDrawer Component - Bottom sheet filter drawer for mobile
 * Slides up from bottom with backdrop overlay
 */
export function MobileFilterDrawer({
  isOpen,
  onClose,
  filters = {},
  onFilterChange,
  onApplyFilters,
  onClearAll,
  availableFilters = {},
}) {
  const drawerRef = useRef(null);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden';
      // Focus trap
      drawerRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLocalChange = (filterType, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleCheckboxChange = (filterType, value) => {
    const currentValues = localFilters[filterType] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    handleLocalChange(filterType, newValues);
  };

  const handleApply = () => {
    onApplyFilters?.(localFilters);
    onClose?.();
  };

  const handleClear = () => {
    setLocalFilters({});
    onClearAll?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm motion-safe:animate-[fadeIn_200ms_ease-out]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-drawer-title"
        tabIndex={-1}
        className="absolute bottom-0 left-0 right-0 bg-black rounded-t-2xl
          h-[85vh] flex flex-col
          motion-safe:animate-[slideUp_300ms_ease-out]
          border-t-2 border-[#FF0000]"
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-600 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2
            id="filter-drawer-title"
            className="text-xl font-bold uppercase text-white flex items-center gap-2"
          >
            <svg
              className="w-5 h-5 text-[#FF0000]"
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
            Filters
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full
              bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close filters"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Price Range */}
          <div>
            <h3 className="text-sm font-bold uppercase text-white mb-4 tracking-wide">
              Price Range
            </h3>
            <PriceRangeSlider
              min={0}
              max={500}
              value={localFilters.price || [0, 500]}
              onChange={(value) => handleLocalChange('price', value)}
            />
          </div>

          {/* Product Type */}
          {availableFilters.types?.length > 0 && (
            <div className="border-t border-white/10 pt-6">
              <h3 className="text-sm font-bold uppercase text-white mb-4 tracking-wide">
                Product Type
              </h3>
              <div className="space-y-4">
                {availableFilters.types.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-3 cursor-pointer group min-h-[44px]"
                  >
                    <input
                      type="checkbox"
                      checked={(localFilters.type || []).includes(type)}
                      onChange={() => handleCheckboxChange('type', type)}
                      className="w-6 h-6 rounded border-2 border-white/30
                        bg-transparent checked:bg-[#FF0000] checked:border-[#FF0000]
                        focus:outline-none focus:ring-2 focus:ring-[#FF0000]
                        transition-colors cursor-pointer"
                      aria-label={`Filter by ${type}`}
                    />
                    <span className="text-base text-gray-300 group-hover:text-white transition-colors">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Color */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-sm font-bold uppercase text-white mb-4 tracking-wide">
              Color
            </h3>
            <div className="space-y-4">
              {['Black', 'Olive Green', 'Navy Blue', 'Desert Tan', 'Pink', 'Brown'].map((color) => (
                <label
                  key={color}
                  className="flex items-center gap-3 cursor-pointer group min-h-[44px]"
                >
                  <input
                    type="checkbox"
                    checked={(localFilters.color || []).includes(color)}
                    onChange={() => handleCheckboxChange('color', color)}
                    className="w-6 h-6 rounded border-2 border-white/30
                      bg-transparent checked:bg-[#FF0000] checked:border-[#FF0000]
                      focus:outline-none focus:ring-2 focus:ring-[#FF0000]
                      transition-colors cursor-pointer"
                    aria-label={`Filter by ${color}`}
                  />
                  <span className="text-base text-gray-300 group-hover:text-white transition-colors">
                    {color}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-sm font-bold uppercase text-white mb-4 tracking-wide">
              Size
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {['3XS', '2XS', 'XS', 'S', 'M', 'R', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'].map((size) => (
                <label
                  key={size}
                  className="flex items-center justify-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={(localFilters.size || []).includes(size)}
                    onChange={() => handleCheckboxChange('size', size)}
                    className="sr-only peer"
                    aria-label={`Filter by size ${size}`}
                  />
                  <span className="w-full text-center px-2 py-3 text-xs font-bold uppercase
                    border-2 border-white/30 rounded
                    text-gray-300 bg-transparent
                    peer-checked:bg-[#FF0000] peer-checked:border-[#FF0000] peer-checked:text-white
                    active:scale-95
                    transition-all cursor-pointer min-h-[44px] flex items-center justify-center">
                    {size}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-sm font-bold uppercase text-white mb-4 tracking-wide">
              Availability
            </h3>
            <label className="flex items-center gap-3 cursor-pointer group min-h-[44px]">
              <input
                type="checkbox"
                checked={localFilters.available || false}
                onChange={() => handleLocalChange('available', !localFilters.available)}
                className="w-6 h-6 rounded border-2 border-white/30
                  bg-transparent checked:bg-[#FF0000] checked:border-[#FF0000]
                  focus:outline-none focus:ring-2 focus:ring-[#FF0000]
                  transition-colors cursor-pointer"
                aria-label="Show only in-stock products"
              />
              <span className="text-base text-gray-300 group-hover:text-white transition-colors">
                In Stock Only
              </span>
            </label>
          </div>
        </div>

        {/* Sticky Footer with Actions */}
        <div className="border-t border-[#FF0000] bg-black p-4 flex gap-3">
          <button
            type="button"
            onClick={handleClear}
            className="flex-1 px-6 py-4 bg-white/10 hover:bg-white/20
              text-white font-bold uppercase rounded-lg
              transition-colors min-h-[56px]"
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-[#FF0000] via-gray-600 to-[#FF0000]
              bg-[length:200%_100%]
              motion-safe:animate-[gradient_3s_linear_infinite]
              text-white font-bold uppercase rounded-lg
              shadow-[0_0_20px_rgba(255,0,0,0.6)]
              hover:shadow-[0_0_30px_rgba(255,0,0,0.8)]
              transition-all border border-white/20 min-h-[56px]"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

// Add slideUp keyframe to tailwind.css if not present
const slideUpStyle = `
@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
`;
