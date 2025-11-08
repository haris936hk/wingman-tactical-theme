/**
 * FormInput Component - Wingman Tactical branded form input
 * Features:
 * - Red border with glow effect on focus
 * - White text on dark background
 * - Error state with red highlighting
 * - Accessible labels and ARIA attributes
 * - Responsive sizing
 */
export function FormInput({
  label,
  name,
  type = 'text',
  placeholder,
  defaultValue,
  required = false,
  error,
  autoComplete,
  disabled = false,
  className = '',
}) {
  const inputId = `input-${name}`;

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-bold uppercase text-white mb-2 tracking-wide"
        >
          {label}
          {required && <span className="text-[#FF0000] ml-1">*</span>}
        </label>
      )}

      {/* Input */}
      <input
        id={inputId}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        disabled={disabled}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`w-full px-4 py-3 rounded-lg
          bg-black/50 backdrop-blur-sm
          border-2 ${error ? 'border-[#FF0000]' : 'border-white/30'}
          text-white placeholder:text-gray-500
          focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2 focus:ring-offset-black
          focus:border-[#FF0000] focus:shadow-[0_0_20px_rgba(255,0,0,0.4)]
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-300
          ${error ? 'shadow-[0_0_10px_rgba(255,0,0,0.3)]' : ''}`}
      />

      {/* Error Message */}
      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-2 text-sm text-[#FF0000] flex items-center gap-1"
          role="alert"
        >
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
