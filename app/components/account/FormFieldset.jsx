/**
 * FormFieldset Component - Wingman Tactical branded fieldset
 * Features:
 * - Red accent border
 * - Glassmorphism background
 * - Optional legend with Shock Surgent font
 * - Grouped form controls
 */
export function FormFieldset({
  legend,
  children,
  className = '',
}) {
  return (
    <fieldset
      className={`border-2 border-[#FF0000]/30 rounded-lg px-4 sm:px-6 py-4 sm:py-6
        bg-black/30 backdrop-blur-sm
        hover:border-[#FF0000]/50 transition-colors duration-300
        ${className}`}
    >
      {legend && (
        <legend
          className="px-2 sm:px-3 font-bold uppercase text-white tracking-wide text-xs sm:text-sm"
          style={{
            fontFamily: 'var(--font-family-shock)',
            textShadow: '0 0 10px rgba(255, 0, 0, 0.4)',
          }}
        >
          {legend}
        </legend>
      )}
      <div className="space-y-4 sm:space-y-6">
        {children}
      </div>
    </fieldset>
  );
}
