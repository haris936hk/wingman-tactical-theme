import {
  data as remixData,
  Form,
  NavLink,
  Outlet,
  useLoaderData,
  Await,
} from 'react-router';
import {Suspense} from 'react';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';

export function shouldRevalidate({formMethod}) {
  // Revalidate on mutations (address updates, profile updates, logout)
  if (formMethod && formMethod !== 'GET') return true;

  // Don't revalidate on tab navigation within account section
  return false;
}

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  const {customerAccount} = context;

  // Use Promise instead of await to defer the query
  const customerPromise = customerAccount.query(CUSTOMER_DETAILS_QUERY, {
    variables: {
      language: customerAccount.i18n.language,
    },
  }).then(({data, errors}) => {
    if (errors?.length || !data?.customer) {
      throw new Error('Customer not found');
    }
    return data.customer;
  });

  // Return immediately with the promise - don't block rendering
  return remixData(
    {customer: customerPromise},
    {
      headers: {
        'Cache-Control': 'private, max-age=300, stale-while-revalidate=600',
      },
    },
  );
}

export default function AccountLayout() {
  /** @type {LoaderReturnData} */
  const {customer} = useLoaderData();

  return (
    <div className="bg-[#000000] min-h-screen pt-[180px] pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Account Navigation */}
        <AccountMenu />

        {/* Main Content */}
        <div className="mt-8">
          <Suspense
            fallback={
              <div className="flex justify-center items-center py-12">
                <div className="text-white text-center">
                  <div className="w-12 h-12 border-4 border-[#FF0000] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-300">Loading account...</p>
                </div>
              </div>
            }
          >
            <Await resolve={customer}>
              {(resolvedCustomer) => <Outlet context={{customer: resolvedCustomer}} />}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function AccountMenu() {
  return (
    <nav
      role="navigation"
      className="bg-black/50 backdrop-blur-sm border-2 border-[#FF0000]/30 rounded-lg p-2
        shadow-[0_0_20px_rgba(255,0,0,0.2)]"
      aria-label="Account navigation"
    >
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
        {/* Dashboard Link */}
        <NavLink
          to="/account"
          end
          className={({isActive}) =>
            `px-4 sm:px-6 py-3.5 sm:py-4 min-h-[44px] flex items-center justify-center
            rounded-lg font-bold uppercase tracking-wide text-sm
            transition-all duration-300 relative
            ${
              isActive
                ? 'text-white bg-[#FF0000] shadow-[0_0_15px_rgba(255,0,0,0.6)]'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`
          }
        >
          Dashboard
        </NavLink>

        {/* Orders Link */}
        <NavLink
          to="/account/orders"
          className={({isActive}) =>
            `px-4 sm:px-6 py-3.5 sm:py-4 min-h-[44px] flex items-center justify-center
            rounded-lg font-bold uppercase tracking-wide text-sm
            transition-all duration-300 relative
            ${
              isActive
                ? 'text-white bg-[#FF0000] shadow-[0_0_15px_rgba(255,0,0,0.6)]'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`
          }
        >
          Orders
        </NavLink>

        {/* Profile Link */}
        <NavLink
          to="/account/profile"
          className={({isActive}) =>
            `px-4 sm:px-6 py-3.5 sm:py-4 min-h-[44px] flex items-center justify-center
            rounded-lg font-bold uppercase tracking-wide text-sm
            transition-all duration-300 relative
            ${
              isActive
                ? 'text-white bg-[#FF0000] shadow-[0_0_15px_rgba(255,0,0,0.6)]'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`
          }
        >
          Profile
        </NavLink>

        {/* Addresses Link */}
        <NavLink
          to="/account/addresses"
          className={({isActive}) =>
            `px-4 sm:px-6 py-3.5 sm:py-4 min-h-[44px] flex items-center justify-center
            rounded-lg font-bold uppercase tracking-wide text-sm
            transition-all duration-300 relative
            ${
              isActive
                ? 'text-white bg-[#FF0000] shadow-[0_0_15px_rgba(255,0,0,0.6)]'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`
          }
        >
          Addresses
        </NavLink>

        {/* Wishlist Link */}
        <NavLink
          to="/account/wishlist"
          className={({isActive}) =>
            `px-4 sm:px-6 py-3.5 sm:py-4 min-h-[44px] flex items-center justify-center
            rounded-lg font-bold uppercase tracking-wide text-sm
            transition-all duration-300 relative
            ${
              isActive
                ? 'text-white bg-[#FF0000] shadow-[0_0_15px_rgba(255,0,0,0.6)]'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`
          }
        >
          Wishlist
        </NavLink>

        {/* Logout Button */}
        <Logout />
      </div>
    </nav>
  );
}

function Logout() {
  return (
    <Form method="POST" action="/account/logout" className="ml-auto">
      <button
        type="submit"
        className="px-4 sm:px-6 py-3.5 sm:py-4 min-h-[44px] rounded-lg font-bold uppercase tracking-wide text-sm
          text-gray-300 hover:text-white hover:bg-white/10
          transition-all duration-300 flex items-center justify-center gap-2"
        aria-label="Sign out"
      >
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        <span className="hidden sm:inline">Sign Out</span>
        <span className="sm:hidden">Out</span>
      </button>
    </Form>
  );
}

/** @typedef {import('./+types/account').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
