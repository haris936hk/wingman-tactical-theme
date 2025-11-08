import {Image} from '@shopify/hydrogen';

/**
 * ProductImageGallery Component - Image display with animated border and zoom
 * Features animated SVG border frame with red/white gradient
 * Zoom on hover functionality
 */
export function ProductImageGallery({image, productTitle}) {
  if (!image) {
    return (
      <div className="relative w-full">
        {/* Animated SVG Border Frame */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{zIndex: 10}}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
            stroke="url(#borderGradient)"
            strokeWidth="3"
            strokeDasharray="50 150"
            style={{
              animation: 'border-spin 4s linear infinite',
            }}
          />
        </svg>

        {/* Placeholder for missing image */}
        <div className="aspect-square bg-gray-800 rounded-lg flex items-center justify-center border-2 border-gray-700">
          <svg
            className="w-24 h-24 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full group">
      {/* Animated SVG Border Frame */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{zIndex: 10}}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
          stroke="url(#borderGradient)"
          strokeWidth="3"
          strokeDasharray="50 150"
          style={{
            animation: 'border-spin 4s linear infinite',
          }}
        />
      </svg>

      {/* Image Container with Zoom Effect */}
      <div className="rounded-lg overflow-hidden shadow-2xl border-2 border-gray-800 bg-gray-900">
        <div className="aspect-square overflow-hidden">
          <Image
            data={image}
            alt={image.altText || productTitle || 'Product Image'}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            sizes="(min-width: 768px) 50vw, 100vw"
            loading="eager"
          />
        </div>
      </div>

      {/* Red Glow Shadow Effect on Hover */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          boxShadow: '0 0 40px rgba(255, 0, 0, 0.4)',
          zIndex: 5,
        }}
      />
    </div>
  );
}
