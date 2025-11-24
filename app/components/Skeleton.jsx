/**
 * Skeleton Loading Components
 * Provides placeholder loading states for various content types
 * Uses CSS animation for smooth shimmer effect
 */

/**
 * Base Skeleton Component
 * @param {{
 *   width?: string;
 *   height?: string;
 *   className?: string;
 *   variant?: 'light' | 'dark';
 *   rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
 * }}
 */
export function Skeleton({
  width = '100%',
  height = '1rem',
  className = '',
  variant = 'light',
  rounded = 'md',
}) {
  const variantStyles = {
    light: 'bg-gray-200',
    dark: 'bg-white/10',
  };

  const roundedStyles = {
    none: '',
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <div
      className={`${variantStyles[variant]} ${roundedStyles[rounded]} animate-pulse ${className}`}
      style={{width, height}}
      aria-hidden="true"
    />
  );
}

/**
 * Skeleton Text Lines
 * Mimics multiple lines of text
 * @param {{
 *   lines?: number;
 *   variant?: 'light' | 'dark';
 *   lastLineWidth?: string;
 *   className?: string;
 * }}
 */
export function SkeletonText({
  lines = 3,
  variant = 'light',
  lastLineWidth = '60%',
  className = '',
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({length: lines}).map((_, index) => (
        <Skeleton
          key={index}
          variant={variant}
          width={index === lines - 1 ? lastLineWidth : '100%'}
          height="0.875rem"
        />
      ))}
    </div>
  );
}

/**
 * Skeleton Button
 * Mimics a button shape
 * @param {{
 *   variant?: 'light' | 'dark';
 *   size?: 'sm' | 'md' | 'lg';
 *   fullWidth?: boolean;
 * }}
 */
export function SkeletonButton({
  variant = 'light',
  size = 'md',
  fullWidth = false,
}) {
  const sizeStyles = {
    sm: {width: '80px', height: '32px'},
    md: {width: '120px', height: '40px'},
    lg: {width: '160px', height: '48px'},
  };

  const dimensions = sizeStyles[size];

  return (
    <Skeleton
      variant={variant}
      width={fullWidth ? '100%' : dimensions.width}
      height={dimensions.height}
      rounded="md"
    />
  );
}

/**
 * Skeleton Image
 * Mimics an image placeholder
 * @param {{
 *   aspectRatio?: string;
 *   variant?: 'light' | 'dark';
 *   rounded?: 'none' | 'sm' | 'md' | 'lg';
 *   className?: string;
 * }}
 */
export function SkeletonImage({
  aspectRatio = '1/1',
  variant = 'light',
  rounded = 'md',
  className = '',
}) {
  return (
    <div className={className} style={{aspectRatio}}>
      <Skeleton variant={variant} rounded={rounded} height="100%" />
    </div>
  );
}

/**
 * Skeleton Product Card
 * Mimics a product card layout
 * @param {{
 *   variant?: 'light' | 'dark';
 * }}
 */
export function SkeletonProductCard({variant = 'light'}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      {/* Product Image */}
      <SkeletonImage
        variant={variant}
        aspectRatio="4/3"
        rounded="md"
        className="mb-4"
      />

      {/* Product Title */}
      <Skeleton variant={variant} height="1.25rem" className="mb-2" />
      <Skeleton variant={variant} height="1.25rem" width="60%" className="mb-3" />

      {/* Price */}
      <Skeleton variant={variant} height="1.5rem" width="40%" className="mb-4" />

      {/* Add to Cart Button */}
      <SkeletonButton variant={variant} size="lg" fullWidth />
    </div>
  );
}

/**
 * Skeleton Product Grid
 * Mimics a grid of product cards
 * @param {{
 *   count?: number;
 *   columns?: 2 | 3 | 4;
 *   variant?: 'light' | 'dark';
 * }}
 */
export function SkeletonProductGrid({
  count = 8,
  columns = 4,
  variant = 'light',
}) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {Array.from({length: count}).map((_, index) => (
        <SkeletonProductCard key={index} variant={variant} />
      ))}
    </div>
  );
}

/**
 * Skeleton Article Card
 * Mimics a blog article card
 * @param {{
 *   variant?: 'light' | 'dark';
 * }}
 */
export function SkeletonArticleCard({variant = 'light'}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      {/* Featured Image */}
      <SkeletonImage
        variant={variant}
        aspectRatio="16/9"
        rounded="lg"
        className="mb-4"
      />

      {/* Title */}
      <Skeleton variant={variant} height="1.5rem" className="mb-2" />
      <Skeleton variant={variant} height="1.5rem" width="70%" className="mb-3" />

      {/* Excerpt */}
      <SkeletonText variant={variant} lines={3} className="mb-4" />

      {/* Metadata */}
      <div className="flex items-center gap-4">
        <Skeleton variant={variant} width="60px" height="0.75rem" />
        <Skeleton variant={variant} width="80px" height="0.75rem" />
      </div>
    </div>
  );
}

/**
 * Skeleton Profile Header
 * Mimics a user profile header
 * @param {{
 *   variant?: 'light' | 'dark';
 * }}
 */
export function SkeletonProfileHeader({variant = 'light'}) {
  return (
    <div className="flex items-center gap-4">
      {/* Avatar */}
      <Skeleton
        variant={variant}
        width="80px"
        height="80px"
        rounded="full"
      />

      {/* User Info */}
      <div className="flex-1">
        <Skeleton variant={variant} height="1.5rem" width="200px" className="mb-2" />
        <Skeleton variant={variant} height="1rem" width="150px" />
      </div>
    </div>
  );
}

/**
 * Skeleton Table Row
 * Mimics a table row
 * @param {{
 *   columns?: number;
 *   variant?: 'light' | 'dark';
 * }}
 */
export function SkeletonTableRow({columns = 4, variant = 'light'}) {
  return (
    <div className="grid gap-4" style={{gridTemplateColumns: `repeat(${columns}, 1fr)`}}>
      {Array.from({length: columns}).map((_, index) => (
        <Skeleton key={index} variant={variant} height="1rem" />
      ))}
    </div>
  );
}

/**
 * Skeleton Table
 * Mimics a full table
 * @param {{
 *   rows?: number;
 *   columns?: number;
 *   variant?: 'light' | 'dark';
 * }}
 */
export function SkeletonTable({rows = 5, columns = 4, variant = 'light'}) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="grid gap-4 pb-3 border-b" style={{gridTemplateColumns: `repeat(${columns}, 1fr)`}}>
        {Array.from({length: columns}).map((_, index) => (
          <Skeleton key={index} variant={variant} height="1.25rem" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({length: rows}).map((_, index) => (
        <SkeletonTableRow key={index} columns={columns} variant={variant} />
      ))}
    </div>
  );
}

/**
 * Skeleton Page (Full Page Loading)
 * Mimics a complete page layout
 * @param {{
 *   variant?: 'light' | 'dark';
 * }}
 */
export function SkeletonPage({variant = 'light'}) {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      {/* Page Title */}
      <Skeleton variant={variant} height="3rem" width="300px" className="mb-8" />

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <SkeletonImage variant={variant} aspectRatio="16/9" />
          <SkeletonText variant={variant} lines={8} />
          <SkeletonButton variant={variant} size="lg" />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <Skeleton variant={variant} height="1.5rem" className="mb-4" />
            <SkeletonText variant={variant} lines={4} />
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <Skeleton variant={variant} height="1.5rem" className="mb-4" />
            <SkeletonText variant={variant} lines={4} />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton Stats Grid
 * Mimics a stats/metrics dashboard
 * @param {{
 *   count?: number;
 *   variant?: 'light' | 'dark';
 * }}
 */
export function SkeletonStatsGrid({count = 4, variant = 'light'}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({length: count}).map((_, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
          <Skeleton variant={variant} height="0.875rem" width="100px" className="mb-2" />
          <Skeleton variant={variant} height="2rem" width="120px" className="mb-2" />
          <Skeleton variant={variant} height="0.75rem" width="80px" />
        </div>
      ))}
    </div>
  );
}

/**
 * Tactical Skeleton Components (Dark Theme)
 * Pre-configured skeletons for dark tactical theme
 */
export function TacticalSkeletonProductCard() {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-[#FF0000]/30 rounded-lg p-4">
      <SkeletonImage variant="dark" aspectRatio="4/3" className="mb-4" />
      <Skeleton variant="dark" height="1.25rem" className="mb-2" />
      <Skeleton variant="dark" height="1.25rem" width="60%" className="mb-3" />
      <Skeleton variant="dark" height="1.5rem" width="40%" className="mb-4" />
      <SkeletonButton variant="dark" size="lg" fullWidth />
    </div>
  );
}

export function TacticalSkeletonGrid({count = 8}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({length: count}).map((_, index) => (
        <TacticalSkeletonProductCard key={index} />
      ))}
    </div>
  );
}
