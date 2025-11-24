import {useState} from 'react';
import {PriceRangeSlider} from '~/components/PriceRangeSlider';

/**
 * FilterSidebar Component - Desktop filter panel with sticky positioning
 * Contains all filter controls: price, type, vendor, availability
 */
export function FilterSidebar({
  filters = {},
  onFilterChange,
  availableFilters = {},
}) {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    type: true,
    color: true,
    size: true,
    availability: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePriceChange = (range) => {
    onFilterChange?.('price', range);
  };

  const handleCheckboxChange = (filterType, value) => {
    const currentValues = filters[filterType] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    onFilterChange?.(filterType, newValues);
  };

  const handleAvailabilityToggle = () => {
    onFilterChange?.('available', !filters.available);
  };

  return (
    <aside
      className="w-full lg:w-64 flex-shrink-0"
      aria-label="Product filters"
    >
      <div className="sticky top-32 bg-black/50 backdrop-blur-sm border border-[#FF0000]/30 rounded-lg p-6 shadow-[0_0_30px_rgba(255,0,0,0.2)]">
        <h2 className="text-xl font-bold uppercase text-white mb-6 flex items-center gap-2" style={{fontFamily: 'var(--font-family-shock)'}}>
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

        <div className="space-y-6">
          {/* Price Range Filter */}
          <FilterSection
            title="Price Range"
            isExpanded={expandedSections.price}
            onToggle={() => toggleSection('price')}
          >
            <PriceRangeSlider
              min={0}
              max={500}
              value={filters.price || [0, 500]}
              onChange={handlePriceChange}
            />
          </FilterSection>

          {/* Product Type Filter */}
          {availableFilters.types?.length > 0 && (
            <FilterSection
              title="Product Type"
              isExpanded={expandedSections.type}
              onToggle={() => toggleSection('type')}
            >
              <div className="space-y-3">
                {availableFilters.types.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={(filters.type || []).includes(type)}
                      onChange={() => handleCheckboxChange('type', type)}
                      className="w-5 h-5 rounded border-2 border-white/30
                        bg-transparent checked:bg-[#FF0000] checked:border-[#FF0000]
                        focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2 focus:ring-offset-black
                        transition-colors cursor-pointer"
                      aria-label={`Filter by ${type}`}
                    />
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </FilterSection>
          )}

          {/* Color Filter */}
          <FilterSection
            title="Color"
            isExpanded={expandedSections.color}
            onToggle={() => toggleSection('color')}
          >
            <div className="space-y-3">
              {['Black', 'Olive Green', 'Navy Blue', 'Desert Tan', 'Pink', 'Brown'].map((color) => (
                <label
                  key={color}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={(filters.color || []).includes(color)}
                    onChange={() => handleCheckboxChange('color', color)}
                    className="w-5 h-5 rounded border-2 border-white/30
                      bg-transparent checked:bg-[#FF0000] checked:border-[#FF0000]
                      focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2 focus:ring-offset-black
                      transition-colors cursor-pointer"
                    aria-label={`Filter by ${color}`}
                  />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    {color}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Size Filter */}
          <FilterSection
            title="Size"
            isExpanded={expandedSections.size}
            onToggle={() => toggleSection('size')}
          >
            <div className="grid grid-cols-3 gap-2">
              {['3XS', '2XS', 'XS', 'S', 'M', 'R', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'].map((size) => (
                <label
                  key={size}
                  className="flex items-center justify-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={(filters.size || []).includes(size)}
                    onChange={() => handleCheckboxChange('size', size)}
                    className="sr-only peer"
                    aria-label={`Filter by size ${size}`}
                  />
                  <span className="w-full text-center px-2 py-2 text-xs font-bold uppercase
                    border-2 border-white/30 rounded
                    text-gray-300 bg-transparent
                    peer-checked:bg-[#FF0000] peer-checked:border-[#FF0000] peer-checked:text-white
                    hover:border-[#FF0000] hover:text-white
                    transition-all cursor-pointer">
                    {size}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Availability Filter */}
          <FilterSection
            title="Availability"
            isExpanded={expandedSections.availability}
            onToggle={() => toggleSection('availability')}
          >
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.available || false}
                onChange={handleAvailabilityToggle}
                className="w-5 h-5 rounded border-2 border-white/30
                  bg-transparent checked:bg-[#FF0000] checked:border-[#FF0000]
                  focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2 focus:ring-offset-black
                  transition-colors cursor-pointer"
                aria-label="Show only in-stock products"
              />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                In Stock Only
              </span>
            </label>
          </FilterSection>
        </div>
      </div>
    </aside>
  );
}

/**
 * FilterSection - Collapsible filter section with expand/collapse
 */
function FilterSection({title, isExpanded, onToggle, children}) {
  return (
    <div className="border-b border-white/10 pb-4">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left mb-4 group"
        aria-expanded={isExpanded}
      >
        <span className="text-sm font-bold uppercase text-white tracking-wide">
          {title}
        </span>
        <svg
          className={`w-5 h-5 text-white transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
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
      </button>

      {isExpanded && (
        <div className="motion-safe:animate-[fadeSlideUp_200ms_ease-out]">
          {children}
        </div>
      )}
    </div>
  );
}
