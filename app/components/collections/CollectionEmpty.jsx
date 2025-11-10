import {Link} from 'react-router';

/**
 * Collection Empty State - Wingman Tactical Brand
 * Empty state component for various scenarios
 * @param {{
 *   type: 'no-collections' | 'no-products' | 'no-results';
 *   onClearFilters?: () => void;
 * }}
 */
export function CollectionEmpty({type, onClearFilters}) {
  const content = {
    'no-collections': {
      icon: (
        <svg className="w-20 h-20 text-[#FF0000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      title: 'No Collections Available',
      description: 'We\'re currently updating our collections. Please check back soon!',
      cta: {text: 'Browse All Products', link: '/collections/all'},
    },
    'no-products': {
      icon: (
        <svg className="w-20 h-20 text-[#FF0000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      ),
      title: 'No Products in This Collection',
      description: 'This collection is currently empty. Explore our other collections or browse all products.',
      cta: {text: 'View All Collections', link: '/collections'},
    },
    'no-results': {
      icon: (
        <svg className="w-20 h-20 text-[#FF0000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: 'No Products Match Your Filters',
      description: 'Try adjusting or clearing your filters to see more products.',
      cta: null, // Will show "Clear Filters" button instead
    },
  };

  const {icon, title, description, cta} = content[type];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center
      motion-safe:animate-[fadeSlideUp_0.5s_ease-out]">
      {/* Icon with pulse animation */}
      <div className="mb-8 relative">
        <div className="w-32 h-32 rounded-full bg-black/50 backdrop-blur-sm
          border-2 border-[#FF0000]/30
          flex items-center justify-center
          shadow-[0_0_30px_rgba(255,0,0,0.3)]">
          {icon}
        </div>
        {/* Pulsing Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-[#FF0000]/20
          motion-safe:animate-ping" />
      </div>

      {/* Title */}
      <h2
        className="text-3xl lg:text-4xl font-bold uppercase text-white mb-4"
        style={{
          fontFamily: 'var(--font-family-shock)',
          textShadow: '0 0 15px rgba(255, 0, 0, 0.6)',
        }}
      >
        {title}
      </h2>

      {/* Description */}
      <p className="text-base text-gray-300 leading-relaxed max-w-md mb-8">
        {description}
      </p>

      {/* CTA Button or Clear Filters */}
      {type === 'no-results' && onClearFilters ? (
        <button
          onClick={onClearFilters}
          className="px-8 py-4 font-bold uppercase tracking-wide text-white
            rounded-lg overflow-hidden backdrop-blur-md
            bg-gradient-to-r from-[#FF0000] via-gray-600 to-[#FF0000]
            bg-[length:200%_100%]
            motion-safe:animate-[gradient_3s_linear_infinite]
            shadow-[0_0_20px_rgba(255,0,0,0.6)]
            hover:shadow-[0_0_30px_rgba(255,0,0,0.8)]
            motion-safe:hover:-translate-y-1
            transition-all duration-300
            border border-white/20
            focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2
            focus:ring-offset-black"
        >
          Clear All Filters
        </button>
      ) : cta ? (
        <Link
          to={cta.link}
          className="px-8 py-4 font-bold uppercase tracking-wide text-white
            rounded-lg overflow-hidden backdrop-blur-md
            bg-gradient-to-r from-[#FF0000] via-gray-600 to-[#FF0000]
            bg-[length:200%_100%]
            motion-safe:animate-[gradient_3s_linear_infinite]
            shadow-[0_0_20px_rgba(255,0,0,0.6)]
            hover:shadow-[0_0_30px_rgba(255,0,0,0.8)]
            motion-safe:hover:-translate-y-1
            transition-all duration-300
            border border-white/20
            focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2
            focus:ring-offset-black
            inline-block"
        >
          {cta.text}
        </Link>
      ) : null}
    </div>
  );
}
