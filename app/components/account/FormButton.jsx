/**
 * FormButton Component - Wingman Tactical branded button
 * Features:
 * - Animated red gradient background
 * - Red glow shadow effect
 * - Hover lift animation
 * - Loading state with spinner
 * - Disabled state
 * - Multiple variants (primary, secondary, danger)
 */
export function FormButton({
  children,
  type = 'submit',
  variant = 'primary',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  fullWidth = true,
}) {
  const baseClasses = `
    relative px-8 py-4 font-bold uppercase tracking-wide text-white
    rounded-lg transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : 'inline-block'}
  `;

  const variantClasses = {
    primary: `
      overflow-hidden backdrop-blur-md
      bg-gradient-to-r from-[#FF0000] via-gray-600 to-[#FF0000]
      bg-[length:200%_100%]
      motion-safe:animate-[gradient_3s_linear_infinite]
      shadow-[0_0_20px_rgba(255,0,0,0.6)]
      hover:shadow-[0_0_30px_rgba(255,0,0,0.8)]
      motion-safe:hover:-translate-y-1
      border border-white/20
    `,
    secondary: `
      bg-transparent border-2 border-[#FF0000]
      hover:bg-[#FF0000]/10
      hover:shadow-[0_0_20px_rgba(255,0,0,0.4)]
      motion-safe:hover:-translate-y-1
    `,
    danger: `
      bg-[#FF0000]
      hover:bg-[#CC0000]
      shadow-[0_0_15px_rgba(255,0,0,0.5)]
      hover:shadow-[0_0_25px_rgba(255,0,0,0.7)]
      motion-safe:hover:-translate-y-1
      border border-white/20
    `,
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      aria-busy={loading}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
