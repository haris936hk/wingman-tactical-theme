import {Image} from '@shopify/hydrogen';

/**
 * Collection Hero Banner - Wingman Tactical Brand
 * Full-width banner with collection image, overlay, animated SVG border
 * @param {{
 *   collection: {
 *     title: string;
 *     description?: string;
 *     image?: {url: string; altText: string | null; width: number; height: number};
 *   };
 *   productCount?: number;
 * }}
 */
export function CollectionHero({collection, productCount}) {
  const {title, description, image} = collection;

  return (
    <div className="relative w-full h-[400px] md:h-[500px] mb-12 overflow-hidden rounded-lg">
      {/* Background Image */}
      {image ? (
        <div className="absolute inset-0">
          <Image
            data={image}
            alt={image.altText || title}
            className="w-full h-full object-cover"
            sizes="100vw"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        </div>
      ) : (
        // Fallback solid background if no image
        <div className="absolute inset-0 bg-[#000000]" />
      )}

      {/* SVG Animated Border */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="collection-border-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
          rx="8"
          fill="none"
          stroke="url(#collection-border-gradient)"
          strokeWidth="2"
          strokeDasharray="10 5"
          className="motion-safe:animate-[border-spin_4s_linear_infinite]"
        />
      </svg>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
        <div className="max-w-4xl">
          {/* Product Count Badge */}
          {productCount !== undefined && (
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full
              bg-[#FF0000]/20 border border-[#FF0000]/40 backdrop-blur-sm
              shadow-[0_0_15px_rgba(255,0,0,0.4)]">
              <svg className="w-4 h-4 text-[#FF0000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="text-sm font-bold text-white uppercase tracking-wide">
                {productCount} {productCount === 1 ? 'Product' : 'Products'}
              </span>
            </div>
          )}

          {/* Collection Title */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase text-white mb-4
              motion-safe:animate-[fadeSlideUp_0.6s_ease-out]"
            style={{
              fontFamily: 'var(--font-family-shock)',
              textShadow: '0 0 20px rgba(255, 0, 0, 0.8), 0 0 40px rgba(255, 0, 0, 0.4)',
            }}
          >
            {title}
          </h1>

          {/* Collection Description */}
          {description && (
            <p className="text-base md:text-lg text-gray-200 leading-relaxed max-w-2xl
              motion-safe:animate-[fadeSlideUp_0.6s_ease-out_0.1s] motion-safe:[animation-fill-mode:both]">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Glow Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF0000] to-transparent opacity-50" />
    </div>
  );
}
