import {Link, useOutletContext, useLoaderData} from 'react-router';
import {data as remixData} from 'react-router';
import {AccountCard} from '~/components/account/AccountCard';
import {CUSTOMER_ORDERS_QUERY} from '~/graphql/customer-account/CustomerOrdersQuery';

/**
 * Account Dashboard - Wingman Tactical branded
 * Shows welcome message, stats, and recent orders
 */

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  const {customerAccount} = context;

  // Fetch recent orders (first 3)
  const {data, errors} = await customerAccount.query(CUSTOMER_ORDERS_QUERY, {
    variables: {
      first: 3,
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length) {
    throw new Error('Failed to load orders');
  }

  const orders = data?.customer?.orders?.nodes || [];

  return remixData(
    {orders},
    {
      headers: {
        'Cache-Control': 'private, max-age=60',
      },
    },
  );
}

export default function AccountDashboard() {
  const {customer} = useOutletContext();
  const {orders} = useLoaderData();

  const firstName = customer?.firstName || 'there';
  const addressCount = customer?.addresses?.nodes?.length || 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-8 sm:py-10 md:py-12">
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase text-white mb-3 sm:mb-4 px-4"
          style={{
            fontFamily: 'var(--font-family-shock)',
            textShadow: '0 0 15px rgba(255, 0, 0, 0.7)',
          }}
        >
          Welcome Back, {firstName}!
        </h1>
        <p className="text-base sm:text-lg text-gray-300 px-4">
          Manage your orders, addresses, and account settings
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Total Orders Card */}
        <AccountCard title="Total Orders" hover={false}>
          <div className="text-center py-8">
            <div
              className="text-5xl font-bold text-[#FF0000] mb-2"
              style={{
                fontFamily: 'var(--font-family-shock)',
                textShadow: '0 0 20px rgba(255, 0, 0, 0.6)',
              }}
            >
              {orders.length}
            </div>
            <p className="text-gray-400 uppercase text-sm tracking-wide">
              Recent Orders
            </p>
          </div>
          <Link
            to="/account/orders"
            className="block text-center text-white hover:text-[#FF0000] transition-colors font-bold uppercase text-sm py-3 min-h-[44px] flex items-center justify-center"
          >
            View All Orders →
          </Link>
        </AccountCard>

        {/* Saved Addresses Card */}
        <AccountCard title="Saved Addresses" hover={false}>
          <div className="text-center py-8">
            <div
              className="text-5xl font-bold text-[#FF0000] mb-2"
              style={{
                fontFamily: 'var(--font-family-shock)',
                textShadow: '0 0 20px rgba(255, 0, 0, 0.6)',
              }}
            >
              {addressCount}
            </div>
            <p className="text-gray-400 uppercase text-sm tracking-wide">
              Addresses
            </p>
          </div>
          <Link
            to="/account/addresses"
            className="block text-center text-white hover:text-[#FF0000] transition-colors font-bold uppercase text-sm py-3 min-h-[44px] flex items-center justify-center"
          >
            Manage Addresses →
          </Link>
        </AccountCard>
      </div>

      {/* Quick Actions */}
      <AccountCard title="Quick Actions">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Link
            to="/account/profile"
            className="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 min-h-[60px] rounded-lg
              bg-black/30 border border-white/20
              hover:border-[#FF0000] hover:bg-[#FF0000]/10
              transition-all duration-300 group"
          >
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 text-[#FF0000] group-hover:scale-110 transition-transform flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold uppercase text-sm sm:text-base">Edit Profile</div>
              <div className="text-gray-400 text-xs sm:text-sm">Update your information</div>
            </div>
          </Link>

          <Link
            to="/account/addresses"
            className="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 min-h-[60px] rounded-lg
              bg-black/30 border border-white/20
              hover:border-[#FF0000] hover:bg-[#FF0000]/10
              transition-all duration-300 group"
          >
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 text-[#FF0000] group-hover:scale-110 transition-transform flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold uppercase text-sm sm:text-base">Manage Addresses</div>
              <div className="text-gray-400 text-xs sm:text-sm">Add or edit addresses</div>
            </div>
          </Link>
        </div>
      </AccountCard>

      {/* Recent Orders */}
      {orders.length > 0 && (
        <AccountCard
          title="Recent Orders"
          footer={
            <Link
              to="/account/orders"
              className="text-white hover:text-[#FF0000] transition-colors font-bold uppercase text-sm py-3 min-h-[44px] flex items-center justify-center"
            >
              View All Orders →
            </Link>
          }
        >
          <div className="space-y-3 sm:space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/account/orders/${btoa(order.id)}`}
                className="block px-4 sm:px-5 py-4 min-h-[60px] rounded-lg
                  bg-black/30 border border-white/20
                  hover:border-[#FF0000] hover:bg-[#FF0000]/10
                  transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                  <div className="font-bold text-white uppercase text-sm sm:text-base">
                    Order #{order.number}
                  </div>
                  <div className="text-[#FF0000] font-bold text-sm sm:text-base">
                    {order.totalPrice.amount} {order.totalPrice.currencyCode}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400">
                  <div>
                    {new Date(order.processedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="uppercase">
                    {order.fulfillmentStatus || order.financialStatus}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </AccountCard>
      )}
    </div>
  );
}

/** @typedef {import('./+types/account._index').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
