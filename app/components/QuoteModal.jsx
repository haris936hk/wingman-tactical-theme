import {useEffect} from 'react';

/**
 * Quote Modal Component - Shows contact options (Call & Email)
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {() => void} props.onClose - Function to close the modal
 */
export function QuoteModal({isOpen, onClose}) {
  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* Modal Content */}
      <div
        className="relative bg-[#000000] rounded-lg border-2 border-[#FF0000] shadow-[0_0_40px_rgba(255,0,0,0.6)] w-full max-w-[900px] p-6 md:p-10 motion-safe:animate-[fadeSlideUp_300ms_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-[#FF0000] transition-colors p-2"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <h2
          id="quote-modal-title"
          className="text-xl md:text-3xl font-bold uppercase text-center text-white mb-2 whitespace-nowrap"
          style={{
            fontFamily: 'var(--font-family-shock)',
            textShadow: '0 0 10px rgba(255, 0, 0, 0.6)'
          }}
        >
          GET A QUOTE
        </h2>
        <p className="text-center text-gray-300 mb-6 md:mb-8 text-sm">
          Choose your preferred contact method
        </p>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Call Option */}
          <a
            href="tel:+12026748681"
            className="flex flex-col items-center justify-center p-6 md:p-8 bg-gradient-to-br from-[#1a1a1a] to-[#000000] rounded-lg border-2 border-[#FF0000]/30 hover:border-[#FF0000] transition-all duration-300 motion-safe:hover:scale-105 motion-safe:hover:-translate-y-1 shadow-lg hover:shadow-[0_0_20px_rgba(255,0,0,0.6)] group min-h-[180px]"
          >
            <div className="mb-4 text-white group-hover:text-[#FF0000] transition-colors">
              <svg className="w-14 h-14 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="text-white font-bold uppercase text-base md:text-lg group-hover:text-[#FF0000] transition-colors mb-2">
              Call Us
            </span>
            <span className="text-gray-400 text-sm whitespace-nowrap">
              +1 202-674-8681
            </span>
          </a>

          {/* Email Option */}
          <a
            href="mailto:sales@wingmandepot.com"
            className="flex flex-col items-center justify-center p-6 md:p-8 bg-gradient-to-br from-[#1a1a1a] to-[#000000] rounded-lg border-2 border-[#FF0000]/30 hover:border-[#FF0000] transition-all duration-300 motion-safe:hover:scale-105 motion-safe:hover:-translate-y-1 shadow-lg hover:shadow-[0_0_20px_rgba(255,0,0,0.6)] group min-h-[180px]"
          >
            <div className="mb-4 text-white group-hover:text-[#FF0000] transition-colors">
              <svg className="w-14 h-14 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-white font-bold uppercase text-base md:text-lg group-hover:text-[#FF0000] transition-colors mb-2">
              Email Us
            </span>
            <span className="text-gray-400 text-sm break-words text-center px-2">
              sales@wingmandepot.com
            </span>
          </a>
        </div>

        {/* Additional Info */}
        <p className="text-center text-gray-400 text-sm mt-6 md:mt-8">
          Our team will get back to you within 24 hours
        </p>
      </div>
    </div>
  );
}
