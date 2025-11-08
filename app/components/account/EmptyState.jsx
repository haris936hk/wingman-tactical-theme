import {Link} from 'react-router';

/**
 * EmptyState Component - Wingman Tactical branded empty state
 * Features:
 * - Custom icon with red glow
 * - Heading and description
 * - Optional CTA button
 * - Centered layout
 */
export function EmptyState({
  icon,
  title,
  description,
  ctaText,
  ctaLink,
  className = '',
}) {
  return (
    <div className={`py-16 text-center ${className}`}>
      {/* Icon */}
      {icon && (
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-900 mb-6">
          <div
            className="text-[#FF0000]"
            style={{
              filter: 'drop-shadow(0 0 10px rgba(255, 0, 0, 0.6))',
            }}
          >
            {icon}
          </div>
        </div>
      )}

      {/* Title */}
      <h2
        className="text-2xl lg:text-3xl font-bold uppercase text-white mb-3"
        style={{
          fontFamily: 'var(--font-family-shock)',
          textShadow: '0 0 10px rgba(255, 0, 0, 0.6)',
        }}
      >
        {title}
      </h2>

      {/* Description */}
      <p className="text-lg text-gray-300 mb-8 max-w-md mx-auto">
        {description}
      </p>

      {/* CTA Button */}
      {ctaText && ctaLink && (
        <Link
          to={ctaLink}
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
          {ctaText}
        </Link>
      )}
    </div>
  );
}
