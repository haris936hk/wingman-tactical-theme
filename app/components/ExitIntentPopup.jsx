import {useState, useEffect, useRef} from 'react';
import {NewsletterSignup} from './NewsletterSignup';
import {trackExitIntentView, trackExitIntentAction} from '~/lib/analytics';

/**
 * ExitIntentPopup Component - Modal triggered by exit intent
 * Displays when user moves mouse towards browser top (likely to leave)
 * Uses localStorage to prevent showing too frequently
 * @param {{
 *   enabled?: boolean;
 *   delay?: number;
 *   cookieExpiryDays?: number;
 *   offer?: {
 *     title: string;
 *     description: string;
 *     code?: string;
 *   };
 * }}
 */
export function ExitIntentPopup({
  enabled = true,
  delay = 5000, // Show after 5 seconds on page
  cookieExpiryDays = 7, // Don't show again for 7 days after dismissal
  offer = {
    title: 'Wait! Don\'t Leave Empty Handed',
    description: 'Get 10% off your first order plus exclusive tactical gear updates.',
    code: 'TACTICAL10',
  },
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    // Check if popup was already dismissed
    const dismissedAt = localStorage.getItem('exitPopupDismissed');
    if (dismissedAt) {
      const dismissedDate = new Date(dismissedAt);
      const expiryDate = new Date(dismissedDate);
      expiryDate.setDate(expiryDate.getDate() + cookieExpiryDays);

      if (new Date() < expiryDate) {
        // Popup was dismissed recently, don't show
        return;
      }
    }

    // Wait for delay before making popup eligible
    const delayTimer = setTimeout(() => {
      setIsEligible(true);
    }, delay);

    return () => clearTimeout(delayTimer);
  }, [enabled, delay, cookieExpiryDays]);

  useEffect(() => {
    if (!isEligible || hasShown) return;

    const handleMouseLeave = (e) => {
      // Detect mouse leaving viewport from top (exit intent)
      if (e.clientY <= 0 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
        trackExitIntentView();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isEligible, hasShown]);

  // Focus trap and keyboard handling
  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
        return;
      }

      // Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Focus first element
    setTimeout(() => {
      const firstFocusable = modalRef.current?.querySelector('button');
      firstFocusable?.focus();
    }, 100);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    trackExitIntentAction('close');
    // Store dismissal in localStorage
    localStorage.setItem('exitPopupDismissed', new Date().toISOString());
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-popup-title"
      className="fixed inset-0 z-[150] flex items-center justify-center p-4"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md motion-safe:animate-[fadeIn_300ms_ease-out]" />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className="relative bg-gradient-to-br from-black via-[#1a0000] to-black
          rounded-lg border-2 border-[#FF0000] shadow-[0_0_50px_rgba(255,0,0,0.8)]
          w-full max-w-2xl max-h-[90vh] overflow-hidden
          motion-safe:animate-[fadeSlideUp_400ms_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 min-w-[44px] min-h-[44px]
            flex items-center justify-center
            text-white hover:text-[#FF0000] transition-colors
            bg-black/50 rounded-full hover:bg-black/70"
          aria-label="Close exit popup"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="p-8 lg:p-12 text-center">
          {/* Icon/Visual */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-[#FF0000]/20 border-2 border-[#FF0000]
              flex items-center justify-center animate-pulse">
              <svg
                className="w-10 h-10 text-[#FF0000]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2
            id="exit-popup-title"
            className="text-3xl lg:text-4xl font-bold uppercase text-[#FF0000] mb-4"
            style={{fontFamily: 'var(--font-family-shock)'}}
          >
            {offer.title}
          </h2>

          {/* Description */}
          <p className="text-lg text-gray-200 mb-8">
            {offer.description}
          </p>

          {/* Discount Code (if provided) */}
          {offer.code && (
            <div className="mb-8 inline-block">
              <div className="px-6 py-3 bg-[#FF0000] border-2 border-white rounded-lg">
                <p className="text-xs text-white uppercase mb-1">Use Code</p>
                <p className="text-2xl font-bold text-white tracking-wider">
                  {offer.code}
                </p>
              </div>
            </div>
          )}

          {/* Newsletter Signup */}
          <div className="max-w-xl mx-auto">
            <NewsletterSignup
              variant="compact"
              title="Get Your Discount"
              description="Enter your email to receive your discount code and exclusive offers."
            />
          </div>

          {/* No Thanks Link */}
          <button
            onClick={handleClose}
            className="mt-6 text-sm text-gray-400 hover:text-white transition-colors
              underline underline-offset-2 min-w-[44px] min-h-[44px]"
          >
            No thanks, I'll pay full price
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * useExitIntent Hook - Reusable exit intent detection
 * Returns whether exit intent has been detected
 * @param {{
 *   enabled?: boolean;
 *   delay?: number;
 * }}
 * @returns {boolean}
 */
export function useExitIntent({enabled = true, delay = 5000} = {}) {
  const [exitDetected, setExitDetected] = useState(false);
  const [isEligible, setIsEligible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const delayTimer = setTimeout(() => {
      setIsEligible(true);
    }, delay);

    return () => clearTimeout(delayTimer);
  }, [enabled, delay]);

  useEffect(() => {
    if (!isEligible || exitDetected) return;

    const handleMouseLeave = (e) => {
      if (e.clientY <= 0) {
        setExitDetected(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isEligible, exitDetected]);

  return exitDetected;
}
