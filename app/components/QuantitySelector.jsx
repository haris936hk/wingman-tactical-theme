import {useState} from 'react';

/**
 * QuantitySelector Component - +/- stepper for product quantity
 * Styled to match Wingman Tactical design system
 */
export function QuantitySelector({
  initialQuantity = 1,
  min = 1,
  max = 99,
  onChange,
}) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleDecrease = () => {
    const newQuantity = Math.max(min, quantity - 1);
    setQuantity(newQuantity);
    onChange?.(newQuantity);
  };

  const handleIncrease = () => {
    const newQuantity = Math.min(max, quantity + 1);
    setQuantity(newQuantity);
    onChange?.(newQuantity);
  };

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= min && value <= max) {
      setQuantity(value);
      onChange?.(value);
    }
  };

  return (
    <div className="flex items-center gap-0">
      {/* Decrease Button */}
      <button
        type="button"
        onClick={handleDecrease}
        disabled={quantity <= min}
        className="w-12 h-12 flex items-center justify-center border-2 border-white/30
          text-white font-bold text-xl rounded-l-lg
          hover:border-[#FF0000] hover:bg-[#FF0000]/10
          disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/30 disabled:hover:bg-transparent
          transition-all duration-300"
        aria-label="Decrease quantity"
      >
        −
      </button>

      {/* Quantity Display */}
      <input
        type="number"
        value={quantity}
        onChange={handleChange}
        min={min}
        max={max}
        className="w-16 h-12 text-center border-y-2 border-white/30
          bg-transparent text-white font-bold text-lg
          focus:outline-none focus:border-[#FF0000]
          [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        aria-label="Quantity"
      />

      {/* Increase Button */}
      <button
        type="button"
        onClick={handleIncrease}
        disabled={quantity >= max}
        className="w-12 h-12 flex items-center justify-center border-2 border-white/30
          text-white font-bold text-xl rounded-r-lg
          hover:border-[#FF0000] hover:bg-[#FF0000]/10
          disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/30 disabled:hover:bg-transparent
          transition-all duration-300"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
