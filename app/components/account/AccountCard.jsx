/**
 * AccountCard Component - Wingman Tactical branded card
 * Features:
 * - Glassmorphism background
 * - Red border with glow effect
 * - Hover animation
 * - Optional header and footer
 * - Responsive padding
 */
export function AccountCard({
  title,
  children,
  footer,
  hover = true,
  className = '',
}) {
  return (
    <div
      className={`rounded-lg overflow-hidden
        bg-black/50 backdrop-blur-sm
        border-2 border-[#FF0000]/30
        shadow-[0_0_20px_rgba(255,0,0,0.2)]
        ${hover ? 'hover:border-[#FF0000]/60 hover:shadow-[0_0_30px_rgba(255,0,0,0.3)] motion-safe:hover:-translate-y-1' : ''}
        transition-all duration-300
        ${className}`}
    >
      {/* Card Header */}
      {title && (
        <div className="px-6 py-4 border-b border-[#FF0000]/20 bg-black/30">
          <h3
            className="text-lg font-bold uppercase text-white tracking-wide"
            style={{
              fontFamily: 'var(--font-family-shock)',
              textShadow: '0 0 10px rgba(255, 0, 0, 0.4)',
            }}
          >
            {title}
          </h3>
        </div>
      )}

      {/* Card Body */}
      <div className="px-6 py-6">
        {children}
      </div>

      {/* Card Footer */}
      {footer && (
        <div className="px-6 py-4 border-t border-[#FF0000]/20 bg-black/30">
          {footer}
        </div>
      )}
    </div>
  );
}
