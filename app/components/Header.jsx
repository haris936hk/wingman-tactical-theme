import {Suspense, useState, useEffect} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import {SearchForm} from '~/components/SearchForm';
import logoImage from '~/assets/logo.png';

// Navigation menu configuration
const NAVIGATION_MENU = [
  {id: 'flight-suits', title: 'FLIGHT SUITS', url: '/collections/flight-suits'},
  {id: 'flight-jackets', title: 'FLIGHT JACKETS', url: '/collections/flight-jackets'},
  {id: 'flight-bag', title: 'FLIGHT BAG', url: '/collections/flight-bag'},
  {id: 'aviation-gear', title: 'AVIATION GEAR', url: '/collections/aviation-gear'},
  {id: 'apparels', title: 'APPARELS', url: '/collections/apparels'},
  {id: 'custom-products', title: 'CUSTOM PRODUCTS', url: '/collections/custom-products'},
];

/**
 * @param {HeaderProps}
 */
export function Header({header, isLoggedIn, cart, publicStoreDomain}) {
  const {shop, menu} = header;
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
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
    };

    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* Main Header - Fixed Dark Bar */}
      <header className={`fixed top-0 left-0 right-0 z-50 bg-[#000000] text-white transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="flex items-center justify-between h-24">
            {/* Logo - Left */}
            <div className="flex-shrink-0">
              <NavLink
                prefetch="intent"
                to="/"
                end
                className="block"
              >
                <img
                  src={logoImage}
                  alt="Wingman Tactical"
                  className="h-16 w-auto"
                />
              </NavLink>
            </div>

            {/* Search Bar - Stretched Center */}
            <div className="hidden md:flex flex-1 mx-6">
              <SearchForm action="/search" className="w-full max-w-none">
                {({inputRef}) => (
                  <div className="relative w-full">
                    <div className="relative rounded-md p-[2px] bg-gradient-to-r from-[#FF0000] via-white to-[#FF0000] bg-[length:200%_100%] animate-[gradient_3s_linear_infinite]">
                      <input
                        ref={inputRef}
                        type="search"
                        name="q"
                        placeholder="Search for products"
                        className="w-full pl-5 pr-12 py-3 bg-[#000000] text-white placeholder-white rounded-md focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-[#FF0000] transition-colors"
                        aria-label="Search"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </SearchForm>
            </div>

            {/* User Actions - Right */}
            <div className="flex-shrink-0">
              <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar - Below Header */}
      <nav className={`fixed left-0 right-0 z-50 bg-[#000000] text-white border-t border-[#FF0000] transition-all duration-300 ease-in-out ${isVisible ? 'top-24' : 'top-0'}`}>
        <div className="max-w-[1600px] mx-auto px-8">
          <HeaderMenu
            menu={menu}
            viewport="desktop"
            primaryDomainUrl={header.shop.primaryDomain.url}
            publicStoreDomain={publicStoreDomain}
          />
        </div>
      </nav>
    </>
  );
}

/**
 * @param {{
 *   menu: HeaderProps['header']['menu'];
 *   primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
 *   viewport: Viewport;
 *   publicStoreDomain: HeaderProps['publicStoreDomain'];
 * }}
 */
export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}) {
  const {close} = useAside();

  if (viewport === 'mobile') {
    return (
      <nav className="flex flex-col space-y-4 p-6" role="navigation">
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          to="/"
          className="text-white hover:text-[#FF0000] transition-colors uppercase font-medium"
        >
          Home
        </NavLink>
        {NAVIGATION_MENU.map((item) => (
          <MobileMenuItem key={item.id} item={item} onClick={close} />
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex items-center justify-start gap-10 py-4" role="navigation">
      {NAVIGATION_MENU.map((item) => (
        <DesktopMenuItem key={item.id} item={item} />
      ))}
    </nav>
  );
}

/**
 * Desktop navigation menu item with gradient text and animated underline
 * @param {{item: {id: string, title: string, url: string}}}
 */
function DesktopMenuItem({item}) {
  return (
    <NavLink
      prefetch="intent"
      to={item.url}
      className={({isActive}) =>
        `relative text-sm font-medium uppercase tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-white bg-[length:200%_100%] bg-left transition-all duration-500 hover:bg-right hover:from-white hover:to-[#FF0000] ${
          isActive ? 'from-gray-300 to-gray-300' : ''
        } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#FF0000] after:transition-all after:duration-300 hover:after:w-full`
      }
    >
      {item.title}
    </NavLink>
  );
}

/**
 * Mobile navigation menu item
 * @param {{item: {id: string, title: string, url: string}, onClick: () => void}}
 */
function MobileMenuItem({item, onClick}) {
  return (
    <NavLink
      onClick={onClick}
      prefetch="intent"
      to={item.url}
      className="text-white hover:text-[#FF0000] transition-colors uppercase font-medium"
    >
      {item.title}
    </NavLink>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */
function HeaderCtas({isLoggedIn, cart}) {
  return (
    <div className="flex items-center gap-3">
      {/* Mobile Menu Toggle */}
      <HeaderMenuMobileToggle />

      {/* Login/Register */}
      <NavLink
        prefetch="intent"
        to="/account"
        className="hidden md:block relative text-sm font-medium uppercase tracking-wider whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-white to-white bg-[length:200%_100%] bg-left transition-all duration-500 hover:bg-right hover:from-white hover:to-[#FF0000] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#FF0000] after:transition-all after:duration-300 hover:after:w-full"
      >
        <Suspense fallback="LOGIN / REGISTER">
          <Await resolve={isLoggedIn} errorElement="LOGIN / REGISTER">
            {(isLoggedIn) => (isLoggedIn ? 'ACCOUNT' : 'LOGIN / REGISTER')}
          </Await>
        </Suspense>
      </NavLink>

      {/* Cart with Price */}
      <CartToggle cart={cart} />
    </div>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="md:hidden text-white hover:text-[#FF0000] transition-colors p-2"
      onClick={() => open('mobile')}
      aria-label="Open menu"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}

/**
 * @param {{count: number | null; cart: any}}
 */
function CartBadge({count, cart}) {
  const {open} = useAside();
  const {publish, shop, cart: analyticsCart, prevCart} = useAnalytics();

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
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <span className="text-sm font-medium whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-white to-white bg-[length:200%_100%] bg-left transition-all duration-500 group-hover:bg-right group-hover:from-white group-hover:to-[#FF0000]">{totalPrice}</span>
    </button>
  );
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({cart}) {
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


/** @typedef {'desktop' | 'mobile'} Viewport */
/**
 * @typedef {Object} HeaderProps
 * @property {HeaderQuery} header
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 */

/** @typedef {import('@shopify/hydrogen').CartViewPayload} CartViewPayload */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
