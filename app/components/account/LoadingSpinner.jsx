/**
 * LoadingSpinner Component - Wingman Tactical branded loading indicator
 * Features:
 * - Red animated spinner
 * - Optional loading message
 * - Different sizes (small, medium, large)
 * - Center alignment option
 */
export function LoadingSpinner({
  size = 'medium',
  message,
  center = true,
  className = '',
}) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  const spinner = (
    <svg
      className={`animate-spin ${sizeClasses[size]} text-[#FF0000]`}
      fill="none"
      viewBox="0 0 24 24"
      style={{
        filter: 'drop-shadow(0 0 4px rgba(255, 0, 0, 0.6))',
      }}
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
  );

  if (!message) {
    return center ? (
      <div className={`flex justify-center ${className}`}>{spinner}</div>
    ) : (
      <div className={className}>{spinner}</div>
    );
  }

  return (
    <div className={`flex ${center ? 'justify-center' : ''} items-center gap-3 ${className}`}>
      {spinner}
      <p className="text-gray-300 text-sm uppercase tracking-wide">{message}</p>
    </div>
  );
}

/**
 * LoadingSkeleton - Skeleton loader for account cards
 */
export function LoadingSkeleton({count = 1, className = ''}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({length: count}).map((_, i) => (
        <div
          key={i}
          className="rounded-lg overflow-hidden bg-black/30 border-2 border-white/10 p-6
            motion-safe:animate-pulse"
        >
          <div className="space-y-3">
            <div className="h-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded w-1/2" />
            <div className="h-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
}
