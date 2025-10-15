import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import {SearchForm} from '~/components/SearchForm';

/**
 * @param {HeaderProps}
 */
export function Header({header, isLoggedIn, cart, publicStoreDomain}) {
  const {shop, menu} = header;
  return (
    <>
      {/* Main Header - Fixed Dark Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a] border-b border-gray-800">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Left */}
            <div className="flex-shrink-0">
              <NavLink
                prefetch="intent"
                to="/"
                end
                className="text-white font-bold text-xl uppercase tracking-wide hover:text-gray-300 transition-colors"
              >
                {shop.name}
              </NavLink>
            </div>

            {/* Search Bar - Center */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <SearchForm action="/search">
                {({inputRef}) => (
                  <div className="relative w-full">
                    <input
                      ref={inputRef}
                      type="search"
                      name="q"
                      placeholder="Search all products"
                      className="w-full px-4 py-2.5 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d32f2f] focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#d32f2f] transition-colors"
                      aria-label="Search"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                )}
              </SearchForm>
            </div>

            {/* User Actions - Right */}
            <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
          </div>
        </div>
      </header>

      {/* Navigation Bar - Below Header */}
      <nav className="fixed top-20 left-0 right-0 z-40 bg-[#1a1a1a] border-b border-gray-800">
        <div className="max-w-[1400px] mx-auto px-6">
          <HeaderMenu
            menu={menu}
            viewport="desktop"
            primaryDomainUrl={header.shop.primaryDomain.url}
            publicStoreDomain={publicStoreDomain}
          />
        </div>
      </nav>

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-[140px]" />
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

  // Wingman Tactical menu items
  const wingmanMenu = [
    {id: '1', title: 'FLIGHT SUITS', url: '/collections/flight-suits'},
    {id: '2', title: 'FLIGHT JACKETS', url: '/collections/flight-jackets'},
    {id: '3', title: 'FLIGHT BAGS', url: '/collections/flight-bags'},
    {id: '4', title: 'AVIATION SHOES', url: '/collections/aviation-shoes'},
    {id: '5', title: 'PATCHES', url: '/collections/patches'},
    {id: '6', title: 'CUSTOM PRODUCTS', url: '/collections/custom-products'},
  ];

  if (viewport === 'mobile') {
    return (
      <nav className="flex flex-col space-y-4 p-6" role="navigation">
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          to="/"
          className="text-white hover:text-[#d32f2f] transition-colors uppercase font-semibold"
        >
          Home
        </NavLink>
        {wingmanMenu.map((item) => (
          <NavLink
            key={item.id}
            onClick={close}
            prefetch="intent"
            to={item.url}
            className="text-white hover:text-[#d32f2f] transition-colors uppercase font-semibold"
          >
            {item.title}
          </NavLink>
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex items-center justify-center space-x-8 py-4" role="navigation">
      {wingmanMenu.map((item) => (
        <NavLink
          key={item.id}
          prefetch="intent"
          to={item.url}
          className={({isActive}) =>
            `text-white hover:text-[#d32f2f] transition-colors text-sm font-semibold uppercase tracking-wide ${
              isActive ? 'text-[#d32f2f]' : ''
            }`
          }
        >
          {item.title}
        </NavLink>
      ))}
    </nav>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */
function HeaderCtas({isLoggedIn, cart}) {
  return (
    <nav className="flex items-center gap-6" role="navigation">
      {/* Mobile Menu Toggle */}
      <HeaderMenuMobileToggle />

      {/* Login/Register */}
      <NavLink
        prefetch="intent"
        to="/account"
        className="hidden md:block text-white hover:text-[#d32f2f] transition-colors text-sm font-semibold uppercase tracking-wide"
      >
        <Suspense fallback="LOGIN / REGISTER">
          <Await resolve={isLoggedIn} errorElement="LOGIN / REGISTER">
            {(isLoggedIn) => (isLoggedIn ? 'ACCOUNT' : 'LOGIN / REGISTER')}
          </Await>
        </Suspense>
      </NavLink>

      {/* Cart */}
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="md:hidden text-white hover:text-[#d32f2f] transition-colors p-2"
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
 * @param {{count: number | null}}
 */
function CartBadge({count}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        });
      }}
      className="relative text-white hover:text-[#d32f2f] transition-colors p-2"
      aria-label={`Cart with ${count || 0} items`}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      {count !== null && count > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#d32f2f] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({cart}) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
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
