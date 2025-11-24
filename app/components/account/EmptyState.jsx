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
        className="text-2xl lg:text-3xl font-bold uppercase text-[#FF0000] mb-3"
        style={{fontFamily: 'var(--font-family-shock)'}}
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
            rounded-lg bg-[#FF0000] hover:bg-[#CC0000]
            transition-all duration-300"
        >
          {ctaText}
        </Link>
      )}
    </div>
  );
}
