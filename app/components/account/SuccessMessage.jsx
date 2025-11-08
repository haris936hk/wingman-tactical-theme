/**
 * SuccessMessage Component - Toast notification for success states
 * Features:
 * - Success/Error/Info variants
 * - Auto-dismiss after delay
 * - Close button
 * - Slide-in animation
 * - Red accents for brand consistency
 */
import {useState, useEffect} from 'react';

export function SuccessMessage({
  message,
  variant = 'success',
  autoDismiss = true,
  dismissDelay = 5000,
  onDismiss,
  className = '',
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss && isVisible) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, dismissDelay);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissDelay, isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      setTimeout(onDismiss, 300); // Wait for slide-out animation
    }
  };

  if (!isVisible) return null;

  const variants = {
    success: {
      bgColor: 'bg-green-900/30',
      borderColor: 'border-green-500',
      textColor: 'text-green-400',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    error: {
      bgColor: 'bg-[#FF0000]/20',
      borderColor: 'border-[#FF0000]',
      textColor: 'text-[#FF0000]',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    info: {
      bgColor: 'bg-blue-900/30',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-400',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  };

  const currentVariant = variants[variant];

  return (
    <div
      className={`fixed top-24 right-6 z-50 max-w-md w-full
        motion-safe:animate-[slideUp_300ms_ease-out]
        ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div
        className={`rounded-lg border-2 backdrop-blur-md p-4
          ${currentVariant.bgColor} ${currentVariant.borderColor}
          shadow-[0_0_20px_rgba(255,0,0,0.2)]`}
      >
        <div className="flex items-start gap-3">
          <div className={currentVariant.textColor}>
            {currentVariant.icon}
          </div>

          <p className={`flex-1 text-sm ${currentVariant.textColor} font-medium`}>
            {message}
          </p>

          <button
            type="button"
            onClick={handleDismiss}
            className={`flex-shrink-0 ${currentVariant.textColor} hover:opacity-70 transition-opacity`}
            aria-label="Dismiss notification"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
