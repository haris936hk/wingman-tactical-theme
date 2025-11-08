import {useState, useEffect, useRef} from 'react';

/**
 * PriceRangeSlider Component - Dual-handle price range selector
 * Styled with Wingman Tactical brand (red accents, white text on black)
 */
export function PriceRangeSlider({
  min = 0,
  max = 500,
  value = [0, 500],
  onChange,
}) {
  const [minValue, setMinValue] = useState(value[0]);
  const [maxValue, setMaxValue] = useState(value[1]);
  const minInputRef = useRef(null);
  const maxInputRef = useRef(null);

  useEffect(() => {
    setMinValue(value[0]);
    setMaxValue(value[1]);
  }, [value]);

  const handleMinChange = (e) => {
    const newMin = Math.min(Number(e.target.value), maxValue - 1);
    setMinValue(newMin);
    onChange?.([newMin, maxValue]);
  };

  const handleMaxChange = (e) => {
    const newMax = Math.max(Number(e.target.value), minValue + 1);
    setMaxValue(newMax);
    onChange?.([minValue, newMax]);
  };

  const minPercent = ((minValue - min) / (max - min)) * 100;
  const maxPercent = ((maxValue - min) / (max - min)) * 100;

  return (
    <div className="space-y-4">
      {/* Range Slider Track */}
      <div className="relative h-2">
        {/* Background Track */}
        <div className="absolute w-full h-2 bg-gray-700 rounded-full" />

        {/* Active Track (Red Fill) */}
        <div
          className="absolute h-2 bg-[#FF0000] rounded-full transition-all duration-200"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        {/* Min Handle */}
        <input
          ref={minInputRef}
          type="range"
          min={min}
          max={max}
          value={minValue}
          onChange={handleMinChange}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-[#FF0000]
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,0,0,0.5)]
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-[#FF0000]
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:pointer-events-auto
            [&::-moz-range-thumb]:cursor-pointer
            [&::-moz-range-thumb]:shadow-[0_0_10px_rgba(255,0,0,0.5)]"
          aria-label="Minimum price"
        />

        {/* Max Handle */}
        <input
          ref={maxInputRef}
          type="range"
          min={min}
          max={max}
          value={maxValue}
          onChange={handleMaxChange}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-[#FF0000]
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,0,0,0.5)]
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-[#FF0000]
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:pointer-events-auto
            [&::-moz-range-thumb]:cursor-pointer
            [&::-moz-range-thumb]:shadow-[0_0_10px_rgba(255,0,0,0.5)]"
          aria-label="Maximum price"
        />
      </div>

      {/* Price Display and Input Fields */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label htmlFor="min-price" className="block text-xs text-gray-400 mb-1">
            Min
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white">$</span>
            <input
              id="min-price"
              type="number"
              min={min}
              max={maxValue - 1}
              value={minValue}
              onChange={handleMinChange}
              className="w-full pl-7 pr-3 py-2 bg-gray-900 text-white border border-white/30
                rounded focus:outline-none focus:border-[#FF0000] transition-colors"
            />
          </div>
        </div>

        <span className="text-white mt-6">—</span>

        <div className="flex-1">
          <label htmlFor="max-price" className="block text-xs text-gray-400 mb-1">
            Max
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white">$</span>
            <input
              id="max-price"
              type="number"
              min={minValue + 1}
              max={max}
              value={maxValue}
              onChange={handleMaxChange}
              className="w-full pl-7 pr-3 py-2 bg-gray-900 text-white border border-white/30
                rounded focus:outline-none focus:border-[#FF0000] transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
