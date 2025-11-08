import {
  data as remixData,
  Form,
  NavLink,
  Outlet,
  useLoaderData,
} from 'react-router';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';

export function shouldRevalidate() {
  return true;
}

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  const {customerAccount} = context;
  const {data, errors} = await customerAccount.query(CUSTOMER_DETAILS_QUERY, {
    variables: {
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return remixData(
    {customer: data.customer},
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function AccountLayout() {
  /** @type {LoaderReturnData} */
  const {customer} = useLoaderData();

  return (
    <div className="bg-[#000000] min-h-screen pt-[180px] pb-16">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Account Navigation */}
        <AccountMenu />

        {/* Main Content */}
        <div className="mt-8">
          <Outlet context={{customer}} />
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
            `px-6 py-3 rounded-lg font-bold uppercase tracking-wide text-sm
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
            `px-6 py-3 rounded-lg font-bold uppercase tracking-wide text-sm
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
            `px-6 py-3 rounded-lg font-bold uppercase tracking-wide text-sm
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
            `px-6 py-3 rounded-lg font-bold uppercase tracking-wide text-sm
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
        className="px-6 py-3 rounded-lg font-bold uppercase tracking-wide text-sm
          text-gray-300 hover:text-white hover:bg-white/10
          transition-all duration-300 flex items-center gap-2"
      >
        <svg
          className="w-4 h-4"
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
        Sign Out
      </button>
    </Form>
  );
}

/** @typedef {import('./+types/account').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
