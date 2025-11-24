import {Image} from '@shopify/hydrogen';
import {Link} from 'react-router';

/**
 * Enhanced Collection Card - Wingman Tactical Brand
 * Glassmorphism card with hover effects, animated border, product count
 * @param {{
 *   collection: {
 *     id: string;
 *     title: string;
 *     handle: string;
 *     image?: {url: string; altText: string | null; width: number; height: number};
 *   };
 *   index: number;
 *   productCount?: number;
 * }}
 */
export function EnhancedCollectionCard({collection, index, productCount}) {
  const {title, handle, image} = collection;

  return (
    <Link
      to={`/collections/${handle}`}
      prefetch="intent"
      className="group relative block rounded-lg overflow-hidden
        bg-black/50 backdrop-blur-sm
        border-2 border-[#FF0000]/30
        shadow-[0_0_20px_rgba(255,0,0,0.2)]
        motion-safe:transition-all duration-300 ease-out
        hover:border-[#FF0000]/60 hover:shadow-[0_0_30px_rgba(255,0,0,0.4)]
        motion-safe:hover:scale-[1.03] motion-safe:hover:-translate-y-2
        motion-safe:animate-[fadeSlideUp_0.5s_ease-out]
        motion-reduced:hover:border-[#FF0000]/60"
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'both',
      }}
    >
      {/* SVG Animated Border (appears on hover) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-0
          group-hover:opacity-100 transition-opacity duration-300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`card-gradient-${handle}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF0000" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FF0000" />
          </linearGradient>
        </defs>
        <rect
          x="2"
          y="2"
          width="calc(100% - 4px)"
          height="calc(100% - 4px)"
          rx="6"
          fill="none"
          stroke={`url(#card-gradient-${handle})`}
          strokeWidth="2"
          strokeDasharray="8 4"
          className="motion-safe:animate-[border-spin_4s_linear_infinite]"
        />
      </svg>

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-black">
        {image ? (
          <Image
            data={image}
            alt={image.altText || title}
            aspectRatio="1/1"
            className="w-full h-full object-cover
              motion-safe:transition-transform duration-500 ease-out
              group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            loading={index < 4 ? 'eager' : 'lazy'}
          />
        ) : (
          // Fallback for collections without images
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-black to-gray-900">
            <svg className="w-24 h-24 text-[#FF0000]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent
          group-hover:from-black/90 transition-all duration-300" />

        {/* Product Count Badge */}
        {productCount !== undefined && (
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full
            bg-[#FF0000]/90 border border-white/20
            shadow-[0_0_15px_rgba(255,0,0,0.6)]
            backdrop-blur-sm">
            <span className="text-xs font-bold text-white uppercase tracking-wide">
              {productCount}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="relative p-6">
        {/* Collection Title */}
        <h3
          className="text-xl font-bold uppercase text-[#FF0000] mb-3
            line-clamp-2 h-14
            transition-colors duration-300"
          style={{fontFamily: 'var(--font-family-shock)'}}
        >
          {title}
        </h3>

        {/* CTA Button */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gray-300 uppercase tracking-wide
            group-hover:text-white transition-colors duration-300">
            Shop Collection
          </span>
          <svg
            className="w-5 h-5 text-[#FF0000]
              motion-safe:transition-transform duration-300
              group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>

      {/* Bottom Red Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF0000] to-transparent
        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Link>
  );
}
