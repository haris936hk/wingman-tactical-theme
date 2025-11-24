/**
 * Empty State Components
 * Provides user-friendly empty states for various scenarios
 * Helps users understand why content is missing and what actions they can take
 */

/**
 * Base Empty State Component
 * @param {{
 *   icon?: React.ReactNode;
 *   title: string;
 *   description: string;
 *   action?: {label: string; onClick: () => void} | {label: string; href: string};
 *   secondaryAction?: {label: string; onClick: () => void} | {label: string; href: string};
 *   variant?: 'default' | 'tactical';
 *   className?: string;
 * }}
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  variant = 'default',
  className = '',
}) {
  const isTactical = variant === 'tactical';
  const textColor = isTactical ? 'text-white' : 'text-gray-900';
  const subtextColor = isTactical ? 'text-gray-300' : 'text-gray-600';
  const iconColor = isTactical ? 'text-[#FF0000]' : 'text-gray-400';

  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      {/* Icon */}
      {icon && (
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${isTactical ? 'bg-[#FF0000]/20' : 'bg-gray-100'} mb-4 ${iconColor}`}>
          {icon}
        </div>
      )}

      {/* Title */}
      <h3 className={`text-xl font-bold ${textColor} mb-2`} style={{fontFamily: 'var(--font-family-shock)'}}>{title}</h3>

      {/* Description */}
      <p className={`${subtextColor} max-w-md mx-auto mb-6`}>{description}</p>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {action && (
            <>
              {('onClick' in action) ? (
                <button
                  onClick={action.onClick}
                  className={`px-6 py-3 rounded-lg font-bold uppercase text-sm transition-all ${
                    isTactical
                      ? 'bg-[#FF0000] text-white hover:bg-[#CC0000] hover:shadow-[0_0_20px_rgba(255,0,0,0.6)]'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {action.label}
                </button>
              ) : (
                <a
                  href={action.href}
                  className={`px-6 py-3 rounded-lg font-bold uppercase text-sm transition-all ${
                    isTactical
                      ? 'bg-[#FF0000] text-white hover:bg-[#CC0000] hover:shadow-[0_0_20px_rgba(255,0,0,0.6)]'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {action.label}
                </a>
              )}
            </>
          )}

          {secondaryAction && (
            <>
              {('onClick' in secondaryAction) ? (
                <button
                  onClick={secondaryAction.onClick}
                  className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
                    isTactical
                      ? 'border-2 border-white/30 text-white hover:bg-white/10'
                      : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {secondaryAction.label}
                </button>
              ) : (
                <a
                  href={secondaryAction.href}
                  className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
                    isTactical
                      ? 'border-2 border-white/30 text-white hover:bg-white/10'
                      : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {secondaryAction.label}
                </a>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Empty Search Results
 */
export function EmptySearchResults({query, variant = 'default'}) {
  return (
    <EmptyState
      variant={variant}
      icon={
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      }
      title="No Results Found"
      description={
        query
          ? `We couldn't find any products matching "${query}". Try adjusting your search or browse our collections.`
          : "We couldn't find any products matching your search criteria."
      }
      action={{label: 'View All Products', href: '/collections/all'}}
      secondaryAction={{label: 'Clear Filters', onClick: () => window.location.reload()}}
    />
  );
}

/**
 * Empty Wishlist
 */
export function EmptyWishlist({variant = 'default'}) {
  return (
    <EmptyState
      variant={variant}
      icon={
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      }
      title="Your Wishlist is Empty"
      description="Save your favorite items to your wishlist so you can easily find them later."
      action={{label: 'Browse Products', href: '/collections/all'}}
    />
  );
}

/**
 * Empty Cart
 */
export function EmptyCart({variant = 'default'}) {
  return (
    <EmptyState
      variant={variant}
      icon={
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      }
      title="Your Cart is Empty"
      description="Looks like you haven't added anything to your cart yet. Start shopping to fill it up!"
      action={{label: 'Start Shopping', href: '/collections/all'}}
    />
  );
}

/**
 * Empty Orders
 */
export function EmptyOrders({variant = 'default'}) {
  return (
    <EmptyState
      variant={variant}
      icon={
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      }
      title="No Orders Yet"
      description="You haven't placed any orders yet. Start shopping to see your order history here."
      action={{label: 'Browse Products', href: '/collections/all'}}
    />
  );
}

/**
 * Empty Collection
 */
export function EmptyCollection({collectionName, variant = 'default'}) {
  return (
    <EmptyState
      variant={variant}
      icon={
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      }
      title={`No Products in ${collectionName || 'This Collection'}`}
      description="This collection is currently empty. Check back soon or explore our other collections."
      action={{label: 'View All Collections', href: '/collections'}}
    />
  );
}

/**
 * Empty Blog
 */
export function EmptyBlog({variant = 'default'}) {
  return (
    <EmptyState
      variant={variant}
      icon={
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
      }
      title="No Articles Yet"
      description="We haven't published any blog articles yet. Check back soon for tactical gear tips, guides, and news."
      action={{label: 'Go to Homepage', href: '/'}}
    />
  );
}

/**
 * No Filters Match
 */
export function NoFiltersMatch({variant = 'default', onClearFilters}) {
  return (
    <EmptyState
      variant={variant}
      icon={
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
      }
      title="No Products Match Your Filters"
      description="Try adjusting your filters or clearing them to see more products."
      action={{label: 'Clear All Filters', onClick: onClearFilters}}
      secondaryAction={{label: 'View All Products', href: '/collections/all'}}
    />
  );
}

/**
 * Error State
 */
export function ErrorState({
  title = 'Something Went Wrong',
  description = 'We encountered an error loading this content. Please try again.',
  onRetry,
  variant = 'default',
}) {
  return (
    <EmptyState
      variant={variant}
      icon={
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      }
      title={title}
      description={description}
      action={onRetry ? {label: 'Try Again', onClick: onRetry} : undefined}
      secondaryAction={{label: 'Go to Homepage', href: '/'}}
    />
  );
}

/**
 * 404 Not Found State
 */
export function NotFoundState({variant = 'default'}) {
  return (
    <EmptyState
      variant={variant}
      icon={
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      }
      title="Page Not Found"
      description="Sorry, we couldn't find the page you're looking for. It may have been moved or deleted."
      action={{label: 'Go to Homepage', href: '/'}}
      secondaryAction={{label: 'Browse Products', href: '/collections/all'}}
    />
  );
}

/**
 * Maintenance Mode
 */
export function MaintenanceState({variant = 'default'}) {
  return (
    <EmptyState
      variant={variant}
      icon={
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      }
      title="Undergoing Maintenance"
      description="We're currently performing scheduled maintenance to improve your experience. We'll be back soon!"
      action={{label: 'Reload Page', onClick: () => window.location.reload()}}
    />
  );
}

/**
 * Coming Soon State
 */
export function ComingSoonState({feature, variant = 'default'}) {
  return (
    <EmptyState
      variant={variant}
      icon={
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      }
      title={`${feature || 'This Feature'} Coming Soon`}
      description="We're working hard to bring you this feature. Stay tuned for updates!"
      action={{label: 'Go Back', onClick: () => window.history.back()}}
    />
  );
}
