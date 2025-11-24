import {Link} from 'react-router';

/**
 * Cart Empty State - Branded empty cart display
 * Shows when cart has no items with CTA to continue shopping
 */

export function CartEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {/* Icon */}
      <div className="mb-6 relative">
        <div
          className="w-24 h-24 rounded-full bg-black/50 backdrop-blur-sm
            border-2 border-[#FF0000]/30
            flex items-center justify-center
            shadow-[0_0_30px_rgba(255,0,0,0.3)]"
        >
          <svg
            className="w-12 h-12 text-[#FF0000]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        {/* Pulsing Ring Effect */}
        <div
          className="absolute inset-0 rounded-full border-2 border-[#FF0000]/20
            motion-safe:animate-ping"
        />
      </div>

      {/* Title */}
      <h2
        className="text-2xl lg:text-3xl font-bold uppercase text-[#FF0000] mb-3"
        style={{fontFamily: 'var(--font-family-shock)'}}
      >
        Your Cart is Empty
      </h2>

      {/* Description */}
      <p className="text-gray-300 text-sm leading-relaxed mb-8 w-full">
        Looks like you haven't added anything to your cart yet. Start shopping
        to load it up with awesome gear!
      </p>

      {/* CTA Button */}
      <Link
        to="/collections"
        className="inline-block px-8 py-4 font-bold uppercase tracking-wide text-white
          rounded-lg bg-[#FF0000] hover:bg-[#CC0000]
          transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2
          focus:ring-offset-black"
      >
        <span className="flex items-center gap-2">
          Start Shopping
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </span>
      </Link>

      {/* Quick Links */}
      <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm">
        <Link
          to="/"
          className="text-gray-400 hover:text-[#FF0000] transition-colors
            flex items-center gap-1"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Home
        </Link>

        <Link
          to="/collections"
          className="text-gray-400 hover:text-[#FF0000] transition-colors
            flex items-center gap-1"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          Collections
        </Link>

        <Link
          to="/search"
          className="text-gray-400 hover:text-[#FF0000] transition-colors
            flex items-center gap-1"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Search
        </Link>
      </div>
    </div>
  );
}
