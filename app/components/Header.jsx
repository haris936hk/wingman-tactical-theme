import { Suspense, useState, useEffect, useCallback, useRef } from 'react';
import { Await, NavLink, useAsyncValue } from 'react-router';
import { useAnalytics, useOptimisticCart } from '@shopify/hydrogen';
import { useAside } from '~/components/Aside';
import { SearchForm } from '~/components/SearchForm';
import { PredictiveSearch } from '~/components/PredictiveSearch';
import logoImage from '~/assets/logo.png';

// Debounce utility for scroll performance
function useDebounce(callback, delay) {
  const timeoutRef = useRef(null);
  return useCallback(
    (...args) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay]
  );
}

// Navigation menu configuration
const NAVIGATION_MENU = [
  { id: 'flight-suits', title: 'FLIGHT SUITS', url: '/collections/flight-suits' },
  { id: 'flight-jackets', title: 'FLIGHT JACKETS', url: '/collections/flight-jackets' },
  { id: 'flight-bag', title: 'FLIGHT BAG', url: '/collections/flight-bag' },
  { id: 'aviation-gear', title: 'AVIATION GEAR', url: '/collections/aviation-gear' },
  { id: 'apparels', title: 'APPARELS', url: '/collections/apparels' },
];

/**
 * @param {HeaderProps}
 */
export function Header({ isLoggedIn, cart }) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Toggle search handler
  const toggleSearch = useCallback(() => {
    setIsSearchFocused(prev => !prev);
  }, []);

  // Memoized scroll handler
  const handleScroll = useCallback(() => {
    if (typeof window === 'undefined') return;

    const currentScrollY = window.scrollY;

    // Show header if scrolled to top
    if (currentScrollY < 10) {
      setIsVisible(true);
    }
    // Hide header when scrolling down, show when scrolling up
    else if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setIsVisible(false);
    } else if (currentScrollY < lastScrollY) {
      setIsVisible(true);
    }

    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  // Debounced scroll handler (100ms delay for smooth performance)
  const debouncedScroll = useDebounce(handleScroll, 100);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    window.addEventListener('scroll', debouncedScroll, { passive: true });
    return () => window.removeEventListener('scroll', debouncedScroll);
  }, [debouncedScroll]);

  // Search blur handler
  const handleSearchBlur = useCallback(() => {
    setIsSearchFocused(false);
  }, []);

  // Keyboard handler for search (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isSearchFocused) {
        setIsSearchFocused(false);
        // Blur the active element
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchFocused]);

  // Click outside handler for search
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSearchFocused &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchFocused]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-[#000000] text-white transition-all duration-300 ease-out motion-safe:transition-all ${isVisible
        ? 'motion-safe:translate-y-0 opacity-100'
        : 'motion-safe:-translate-y-full opacity-0'
        }`}
      role="banner"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20 relative">
          {/* Logo - Left */}
          <div className="flex-shrink-0 z-10">
            <NavLink
              prefetch="intent"
              to="/"
              end
              className="block"
              aria-label="Wingman Tactical Home"
            >
              <img
                src={logoImage}
                alt="Wingman Tactical"
                className="h-10 sm:h-11 md:h-12 w-auto motion-safe:transition-transform motion-safe:hover:scale-105 motion-safe:duration-300"
              />
            </NavLink>
          </div>

          {/* Desktop Navigation Links - Center (Hidden when search is focused) */}
          <nav
            className={`hidden lg:flex items-center justify-center gap-8 flex-1 mx-8 transition-all duration-300 ease-out ${isSearchFocused
              ? 'motion-safe:opacity-0 motion-safe:-translate-x-5 pointer-events-none'
              : 'motion-safe:opacity-100 motion-safe:translate-x-0'
              }`}
            role="navigation"
            aria-label="Main navigation"
            aria-hidden={isSearchFocused}
          >
            {NAVIGATION_MENU.map((item) => (
              <DesktopMenuItem key={item.id} item={item} />
            ))}
          </nav>

          {/* Search Component - Expands on focus */}
          <div
            ref={searchContainerRef}
            className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 transition-all duration-300 ease-out ${isSearchFocused
              ? 'lg:left-[180px] lg:right-[280px] z-20'
              : 'lg:static lg:w-auto lg:translate-y-0 lg:mr-3 pointer-events-none lg:pointer-events-auto'
              }`}
          >
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchFocused(true)}
              className="lg:hidden text-white hover:text-[#FF0000] transition-colors p-3 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Open search"
              aria-expanded={isSearchFocused}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Desktop Search - Button or Expanded */}
            <div className="hidden lg:block">
              {!isSearchFocused ? (
                // Search Icon Button (default state)
                <button
                  onClick={() => setIsSearchFocused(true)}
                  className="text-white hover:text-[#FF0000] transition-colors p-3 min-w-[44px] min-h-[44px] flex items-center justify-center motion-safe:hover:scale-110 motion-safe:duration-200"
                  aria-label="Open search"
                  aria-expanded={false}
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              ) : (
                // Expanded Search Form
                <div className="w-full relative">
                  <PredictiveSearch
                    className="w-full"
                    onClose={() => setIsSearchFocused(false)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* User Actions - Right */}
          <div className="flex-shrink-0 z-10">
            <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay - Full screen */}
      {isSearchFocused && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-search-title"
          className="lg:hidden fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex flex-col"
        >
          <div className="flex items-center justify-between p-4 border-b border-[#FF0000]">
            <h2 id="mobile-search-title" className="text-base sm:text-lg font-bold uppercase tracking-wide">Search Products</h2>
            <button
              onClick={() => setIsSearchFocused(false)}
              className="text-white hover:text-[#FF0000] transition-colors p-3 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close search"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4 sm:p-6">
            <PredictiveSearch
              className="w-full"
              onClose={() => setIsSearchFocused(false)}
            />
          </div>
        </div>
      )}
    </header>
  );
}

/**
 * Mobile menu component for Aside
 */
export function HeaderMenu() {
  const { close } = useAside();

  // Mobile menu only (desktop navigation is now in main header)
  return (
    <nav className="flex flex-col space-y-4 p-6" role="navigation" aria-label="Mobile navigation">
      <NavLink
        end
        onClick={close}
        prefetch="intent"
        to="/"
        className="text-white hover:text-[#FF0000] transition-colors uppercase font-medium text-lg py-2"
      >
        Home
      </NavLink>
      {NAVIGATION_MENU.map((item) => (
        <MobileMenuItem key={item.id} item={item} onClick={close} />
      ))}
    </nav>
  );
}

/**
 * Desktop navigation menu item with gradient text and animated underline
 * @param {{ item: { id: string, title: string, url: string } }}
                */
function DesktopMenuItem({ item }) {
  return (
    <NavLink
      prefetch="intent"
      to={item.url}
      className={({ isActive }) =>
        `relative text-sm font-medium uppercase tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-white bg-[length:200%_100%] bg-left transition-all duration-500 hover:bg-right hover:from-white hover:to-[#FF0000] ${isActive ? 'from-gray-300 to-gray-300' : ''
        } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#FF0000] after:transition-all after:duration-300 hover:after:w-full`
      }
    >
      {item.title}
    </NavLink>
  );
}

/**
 * Mobile navigation menu item
 * @param {{ item: { id: string, title: string, url: string }, onClick: () => void}}
                */
function MobileMenuItem({ item, onClick }) {
  return (
    <NavLink
      onClick={onClick}
      prefetch="intent"
      to={item.url}
      className={({ isActive }) =>
        `text-white hover:text-[#FF0000] transition-colors uppercase font-medium text-lg py-2 ${isActive ? 'text-[#FF0000]' : ''
        }`
      }
    >
      {item.title}
    </NavLink>
  );
}

/**
 * @param {Pick < HeaderProps, 'isLoggedIn' | 'cart' >}
                */
function HeaderCtas({ isLoggedIn, cart }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Mobile Menu Toggle */}
      <HeaderMenuMobileToggle />

      {/* Account/Profile Icon */}
      <Suspense fallback={
        <div className="text-white p-3 min-w-[44px] min-h-[44px] flex items-center justify-center">
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      }>
        <Await resolve={isLoggedIn} errorElement={
          <div className="text-white p-3 min-w-[44px] min-h-[44px] flex items-center justify-center">
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        }>
          {(isLoggedIn) => (
            <NavLink
              prefetch="intent"
              to="/account"
              className="text-white hover:text-[#FF0000] transition-colors p-3 min-w-[44px] min-h-[44px] flex items-center justify-center motion-safe:hover:scale-110 motion-safe:duration-200"
              aria-label={isLoggedIn ? 'Account' : 'Login or Register'}
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </NavLink>
          )}
        </Await>
      </Suspense>

      {/* Cart with Price */}
      <CartToggle cart={cart} />
    </div>
  );
}

function HeaderMenuMobileToggle() {
  const { open } = useAside();
  return (
    <button
      className="lg:hidden text-white hover:text-[#FF0000] transition-colors p-3 min-w-[44px] min-h-[44px] flex items-center justify-center"
      onClick={() => open('mobile')}
      aria-label="Open menu"
    >
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}

/**
 * @param {{ count: number | null; cart: any }}
                */
function CartBadge({ count, cart }) {
  const { open } = useAside();
  const { publish, shop, cart: analyticsCart, prevCart } = useAnalytics();

  // Calculate total price
  const totalPrice = cart?.cost?.totalAmount
    ? `$${parseFloat(cart.cost.totalAmount.amount).toFixed(2)}`
    : '$0.00';

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart: analyticsCart,
          prevCart,
          shop,
          url: window.location.href || '',
        });
      }}
      className="flex items-center gap-2 group"
      aria-label={`Cart with ${count || 0} items`}
    >
      <div className="relative text-white transition-colors group-hover:text-[#FF0000]">
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {count !== null && count > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#FF0000] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-[0_0_10px_rgba(255,0,0,0.6)]">
            {count}
          </span>
        )}
      </div>
      <span className="hidden sm:inline text-xs sm:text-sm font-medium whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-white to-white bg-[length:200%_100%] bg-left transition-all duration-500 group-hover:bg-right group-hover:from-white group-hover:to-[#FF0000]">{totalPrice}</span>
    </button>
  );
}

/**
 * @param {Pick < HeaderProps, 'cart' >}
                */
function CartToggle({ cart }) {
  return (
    <Suspense fallback={<CartBadge count={null} cart={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} cart={cart} />;
}


/**
 * @typedef {Object} HeaderProps
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<boolean>} isLoggedIn
 */

/** @typedef {import('@shopify/hydrogen').CartViewPayload} CartViewPayload */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
