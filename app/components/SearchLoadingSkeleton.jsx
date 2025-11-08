/**
 * SearchLoadingSkeleton Component - Loading placeholder for search results
 * Matches ProductItem card layout with pulse animation
 */
export function SearchLoadingSkeleton({count = 8}) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      role="status"
      aria-label="Loading search results"
    >
      {Array.from({length: count}).map((_, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden animate-pulse"
        >
          {/* Image Skeleton */}
          <div className="bg-gray-200 aspect-[4/3] relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[gradient_2s_linear_infinite]" />
          </div>

          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            {/* Title Skeleton */}
            <div className="h-10 flex flex-col justify-center gap-2">
              <div className="h-3 bg-gray-300 rounded w-3/4" />
              <div className="h-3 bg-gray-300 rounded w-1/2" />
            </div>

            {/* Description Skeleton */}
            <div className="space-y-2">
              <div className="h-2 bg-gray-200 rounded w-full" />
              <div className="h-2 bg-gray-200 rounded w-5/6" />
              <div className="h-2 bg-gray-200 rounded w-4/6" />
            </div>

            {/* Price Skeleton */}
            <div className="h-6 bg-gray-300 rounded w-1/3 mb-4 mt-2" />

            {/* Button Skeleton */}
            <div className="h-12 bg-[#FF0000]/20 rounded" />
          </div>
        </div>
      ))}

      {/* Screen Reader Text */}
      <span className="sr-only">Loading products...</span>
    </div>
  );
}
