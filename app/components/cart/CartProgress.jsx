/**
 * Cart Progress - Free Shipping Indicator
 * Shows progress towards free shipping threshold with animated progress bar
 */

/**
 * @param {{
 *   currentAmount: number;
 *   freeShippingThreshold?: number;
 *   currencyCode?: string;
 * }}
 */
export function CartProgress({
  currentAmount,
  freeShippingThreshold = 100, // Default $100 threshold
  currencyCode = 'USD',
}) {
  const amountRemaining = Math.max(0, freeShippingThreshold - currentAmount);
  const progressPercentage = Math.min(
    100,
    (currentAmount / freeShippingThreshold) * 100,
  );
  const hasReachedThreshold = currentAmount >= freeShippingThreshold;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="bg-black/30 backdrop-blur-sm border border-[#FF0000]/20 rounded-lg p-4 mb-4">
      {/* Message */}
      <div className="mb-3">
        {hasReachedThreshold ? (
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-bold text-green-400 uppercase tracking-wide">
              You qualified for free shipping!
            </span>
          </div>
        ) : (
          <p className="text-sm text-white">
            You're{' '}
            <span className="font-bold text-[#FF0000]">
              {formatCurrency(amountRemaining)}
            </span>{' '}
            away from <span className="font-bold">FREE SHIPPING</span>!
          </p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative">
        {/* Background Track */}
        <div
          className="h-2 bg-black/50 rounded-full overflow-hidden border border-white/20"
          role="progressbar"
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Free shipping progress: ${Math.round(progressPercentage)}%`}
        >
          {/* Progress Fill */}
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out
              ${hasReachedThreshold ? 'bg-green-500' : 'bg-gradient-to-r from-[#FF0000] to-[#FF6B6B]'}
              shadow-[0_0_10px_rgba(255,0,0,0.5)]`}
            style={{width: `${progressPercentage}%`}}
          />
        </div>

        {/* Shipping Icon at End */}
        {!hasReachedThreshold && (
          <div
            className="absolute -top-1 transform -translate-x-1/2
              motion-safe:transition-all duration-500 ease-out"
            style={{left: `${Math.min(95, progressPercentage)}%`}}
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
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
          </div>
        )}

        {/* Success Checkmark */}
        {hasReachedThreshold && (
          <div className="absolute -top-1 right-0 transform translate-x-1/2">
            <svg
              className="w-6 h-6 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
