import {ProductCarousel} from '~/components/ProductCarousel';

/**
 * NoResults Component - Empty state for search with no results
 * Shows helpful message, search tips, and popular products fallback
 */
export function NoResults({searchTerm, popularProducts = []}) {
  return (
    <div className="py-12 text-center">
      {/* Icon with Red Glow */}
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-900 mb-6">
        <svg
          className="w-12 h-12 text-[#FF0000]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{
            filter: 'drop-shadow(0 0 10px rgba(255, 0, 0, 0.6))',
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Main Message */}
      <h2
        className="text-2xl lg:text-3xl font-bold uppercase text-white mb-3"
        style={{
          fontFamily: 'var(--font-family-shock)',
          textShadow: '0 0 10px rgba(255, 0, 0, 0.6)',
        }}
      >
        No Results Found
      </h2>

      <p className="text-lg text-gray-300 mb-8">
        We couldn't find any products matching{' '}
        <span className="text-[#FF0000] font-bold">"{searchTerm}"</span>
      </p>

      {/* Search Tips */}
      <div className="max-w-4xl mx-auto mb-12">
        <h3 className="text-sm font-bold uppercase text-white mb-6 text-center">
          Search Tips:
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4 text-sm text-gray-300">
          <li>
            <span className="text-[#FF0000]">•</span> Check your spelling and try again
          </li>
          <li>
            <span className="text-[#FF0000]">•</span> Try using more general keywords
          </li>
          <li>
            <span className="text-[#FF0000]">•</span> Try different or fewer keywords
          </li>
          <li>
            <span className="text-[#FF0000]">•</span> Browse our collections instead
          </li>
        </ul>
      </div>

      {/* Popular Products Fallback */}
      {popularProducts.length > 0 && (
        <div className="border-t border-[#FF0000] pt-12 mt-8">
          <h3
            className="text-2xl lg:text-3xl font-bold uppercase text-white mb-8"
            style={{
              fontFamily: 'var(--font-family-shock)',
              textShadow: '0 0 10px rgba(255, 0, 0, 0.6)',
            }}
          >
            Popular Products
          </h3>
          <ProductCarousel products={popularProducts} showSaleBadge={true} />
        </div>
      )}

      {/* Contact Support CTA */}
      <div className="mt-12">
        <p className="text-gray-300 mb-4">Still can't find what you're looking for?</p>
        <a
          href="/pages/contact"
          className="inline-block px-8 py-4 font-bold uppercase tracking-wide text-white
            rounded-lg bg-gradient-to-r from-[#FF0000] via-gray-600 to-[#FF0000]
            bg-[length:200%_100%]
            motion-safe:animate-[gradient_3s_linear_infinite]
            shadow-[0_0_20px_rgba(255,0,0,0.6)]
            hover:shadow-[0_0_30px_rgba(255,0,0,0.8)]
            motion-safe:hover:-translate-y-1
            transition-all duration-300
            border border-white/20"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
}
