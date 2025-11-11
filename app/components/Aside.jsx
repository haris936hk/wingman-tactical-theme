import {createContext, useContext, useEffect, useRef, useState} from 'react';

/**
 * A side bar component with Overlay - Enhanced with mobile support and animations
 * @example
 * ```jsx
 * <Aside type="search" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 * @param {{
 *   children?: React.ReactNode;
 *   type: AsideType;
 *   heading: React.ReactNode;
 * }}
 */
export function Aside({children, heading, type}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;
  const asideRef = useRef(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Focus trap
  useEffect(() => {
    if (expanded && asideRef.current) {
      const focusableElements = asideRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTabKey = (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      document.addEventListener('keydown', handleTabKey);
      firstElement?.focus();

      return () => document.removeEventListener('keydown', handleTabKey);
    }
  }, [expanded]);

  // Escape key handler
  useEffect(() => {
    const abortController = new AbortController();

    if (expanded) {
      document.addEventListener(
        'keydown',
        function handler(event) {
          if (event.key === 'Escape') {
            close();
          }
        },
        {signal: abortController.signal},
      );
    }
    return () => abortController.abort();
  }, [close, expanded]);

  // Prevent body scroll when aside is open
  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [expanded]);

  // Swipe to close on mobile (for bottom drawer)
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isDownSwipe = distance < -50; // Swipe down threshold

    // Only close on downward swipe for mobile (when drawer is at bottom)
    if (isDownSwipe && window.innerWidth < 768) {
      close();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div
      aria-modal="true"
      className={`bg-black/80 backdrop-blur-sm fixed inset-0
        motion-safe:transition-opacity motion-reduced:transition-none
        duration-300 ease-out z-[100]
        ${expanded ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible'}`}
      role="dialog"
      aria-label={typeof heading === 'string' ? heading : 'Aside panel'}
    >
      {/* Overlay click area */}
      <button
        className="bg-transparent border-0 text-transparent h-full left-0 absolute top-0
          md:w-[calc(100%-var(--aside-width))] w-full"
        onClick={close}
        aria-label="Close aside"
        tabIndex={expanded ? 0 : -1}
      />

      {/* Aside Panel - Desktop: slide from right, Mobile: slide from bottom */}
      <aside
        ref={asideRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`
          bg-black/95 backdrop-blur-md border-2 border-[#FF0000]/30
          shadow-[0_0_50px_rgba(255,0,0,0.5)]
          fixed
          motion-safe:transition-transform motion-reduced:transition-none
          duration-300 ease-out

          /* Desktop: Slide from right */
          md:h-screen md:w-[min(var(--aside-width),100vw)]
          md:-right-[var(--aside-width)] md:top-0
          ${expanded ? 'md:-translate-x-[var(--aside-width)]' : 'md:translate-x-0'}

          /* Mobile: Slide from bottom */
          max-md:w-full max-md:max-h-[85vh] max-md:rounded-t-2xl
          max-md:bottom-0 max-md:left-0
          ${expanded ? 'max-md:translate-y-0' : 'max-md:translate-y-full'}
        `}
      >
        {/* Header */}
        <header
          className="flex items-center border-b border-[#FF0000]/30
            h-16 justify-between px-6 text-white bg-black/50"
        >
          <h3
            className="m-0 text-lg font-bold uppercase tracking-wide"
            style={{
              fontFamily: 'var(--font-family-shock)',
              textShadow: '0 0 10px rgba(255, 0, 0, 0.6)',
            }}
          >
            {heading}
          </h3>
          <button
            className="border-0 bg-transparent text-white/80 font-bold
              text-3xl leading-none transition-all duration-200
              hover:text-[#FF0000] hover:scale-110
              focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2
              focus:ring-offset-black rounded
              w-8 h-8 flex items-center justify-center"
            onClick={close}
            aria-label="Close aside"
          >
            &times;
          </button>
        </header>

        {/* Swipe indicator for mobile */}
        <div className="md:hidden flex justify-center py-2 border-b border-white/10">
          <div className="w-12 h-1 rounded-full bg-white/30" />
        </div>

        {/* Main content */}
        <main className="overflow-y-auto max-h-[calc(100vh-4rem)] md:max-h-[calc(100vh-4rem)] max-md:max-h-[calc(85vh-5rem)]">
          {children}
        </main>
      </aside>
    </div>
  );
}

const AsideContext = createContext(null);

Aside.Provider = function AsideProvider({children}) {
  const [type, setType] = useState('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}

/** @typedef {'search' | 'cart' | 'mobile' | 'closed'} AsideType */
/**
 * @typedef {{
 *   type: AsideType;
 *   open: (mode: AsideType) => void;
 *   close: () => void;
 * }} AsideContextValue
 */

/** @typedef {import('react').ReactNode} ReactNode */
