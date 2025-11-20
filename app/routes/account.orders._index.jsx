import {
  Link,
  useLoaderData,
  useNavigation,
  useSearchParams,
  Await,
} from 'react-router';
import {useRef, Suspense, memo} from 'react';
import {
  Money,
  getPaginationVariables,
  flattenConnection,
} from '@shopify/hydrogen';
import {
  buildOrderSearchQuery,
  parseOrderFilters,
  ORDER_FILTER_FIELDS,
} from '~/lib/orderFilters';
import {CUSTOMER_ORDERS_QUERY} from '~/graphql/customer-account/CustomerOrdersQuery';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {AccountCard} from '~/components/account/AccountCard';
import {FormInput} from '~/components/account/FormInput';
import {FormButton} from '~/components/account/FormButton';
import {FormFieldset} from '~/components/account/FormFieldset';
import {EmptyState} from '~/components/account/EmptyState';
import {LoadingSpinner} from '~/components/account/LoadingSpinner';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Orders'}];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({request, context}) {
  const {customerAccount} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  });

  const url = new URL(request.url);
  const filters = parseOrderFilters(url.searchParams);
  const query = buildOrderSearchQuery(filters);

  // Defer orders query for faster initial render
  const customerPromise = customerAccount.query(CUSTOMER_ORDERS_QUERY, {
    variables: {
      ...paginationVariables,
      query,
      language: customerAccount.i18n.language,
    },
  }).then(({data, errors}) => {
    if (errors?.length || !data?.customer) {
      console.error('Failed to load customer orders:', errors);
      return null;
    }
    return data.customer;
  }).catch((error) => {
    console.error('Failed to load customer orders:', error);
    return null;
  });

  return {
    customer: customerPromise,
    filters,
    headers: {
      'Cache-Control': 'private, max-age=300, stale-while-revalidate=600',
    },
  };
}

export default function Orders() {
  /** @type {LoaderReturnData} */
  const {customer, filters} = useLoaderData();

  return (
    <div className="space-y-6 sm:space-y-8">
      <OrderSearchForm currentFilters={filters} />
      <Suspense
        fallback={
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner text="Loading orders..." />
          </div>
        }
      >
        <Await
          resolve={customer}
          errorElement={
            <div className="text-center py-12">
              <div className="text-white bg-red-900/20 border border-red-500/30 rounded-lg p-6 max-w-md mx-auto">
                <svg className="w-12 h-12 text-[#FF0000] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h2 className="text-xl font-bold text-white mb-2">Failed to Load Orders</h2>
                <p className="text-gray-300">We couldn't load your orders. Please try refreshing the page.</p>
              </div>
            </div>
          }
        >
          {(resolvedCustomer) => {
            if (!resolvedCustomer) {
              return (
                <div className="text-center py-12">
                  <div className="text-white bg-red-900/20 border border-red-500/30 rounded-lg p-6 max-w-md mx-auto">
                    <svg className="w-12 h-12 text-[#FF0000] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h2 className="text-xl font-bold text-white mb-2">Orders Not Found</h2>
                    <p className="text-gray-300">Your orders could not be loaded. Please try again.</p>
                  </div>
                </div>
              );
            }
            return <OrdersTable orders={resolvedCustomer.orders} filters={filters} />;
          }}
        </Await>
      </Suspense>
    </div>
  );
}

/**
 * @param {{
 *   orders: CustomerOrdersFragment['orders'];
 *   filters: OrderFilterParams;
 * }}
 */
function OrdersTable({orders, filters}) {
  const hasFilters = !!(filters.name || filters.confirmationNumber);

  return (
    <div className="acccount-orders" aria-live="polite">
      {orders?.nodes.length ? (
        <PaginatedResourceSection connection={orders}>
          {({node: order}) => <OrderItem key={order.id} order={order} />}
        </PaginatedResourceSection>
      ) : (
        <EmptyOrders hasFilters={hasFilters} />
      )}
    </div>
  );
}

/**
 * @param {{hasFilters?: boolean}}
 */
function EmptyOrders({hasFilters = false}) {
  if (hasFilters) {
    return (
      <EmptyState
        icon={
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        }
        title="No Orders Found"
        description="No orders found matching your search criteria. Try adjusting your filters."
        ctaText="Clear Filters"
        ctaLink="/account/orders"
      />
    );
  }

  return (
    <EmptyState
      icon={
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      }
      title="No Orders Yet"
      description="You haven't placed any orders yet. Start shopping to see your orders here."
      ctaText="Start Shopping"
      ctaLink="/collections"
    />
  );
}

/**
 * @param {{
 *   currentFilters: OrderFilterParams;
 * }}
 */
const OrderSearchForm = memo(function OrderSearchForm({currentFilters}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const isSearching =
    navigation.state !== 'idle' &&
    navigation.location?.pathname?.includes('orders');
  const formRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    const name = formData.get(ORDER_FILTER_FIELDS.NAME)?.toString().trim();
    const confirmationNumber = formData
      .get(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER)
      ?.toString()
      .trim();

    if (name) params.set(ORDER_FILTER_FIELDS.NAME, name);
    if (confirmationNumber)
      params.set(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER, confirmationNumber);

    setSearchParams(params, {preventScrollReset: true});
  };

  const hasFilters = currentFilters.name || currentFilters.confirmationNumber;

  return (
    <form ref={formRef} onSubmit={handleSubmit} aria-label="Search orders">
      <FormFieldset legend="Filter Orders">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <FormInput
            name={ORDER_FILTER_FIELDS.NAME}
            type="search"
            placeholder="Order #"
            defaultValue={currentFilters.name || ''}
            label="Order Number"
          />
          <FormInput
            name={ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER}
            type="search"
            placeholder="Confirmation #"
            defaultValue={currentFilters.confirmationNumber || ''}
            label="Confirmation Number"
          />
        </div>

        <div className="flex gap-3 flex-wrap mt-4">
          <FormButton type="submit" loading={isSearching} fullWidth={false}>
            Search Orders
          </FormButton>
          {hasFilters && (
            <FormButton
              type="button"
              variant="secondary"
              disabled={isSearching}
              fullWidth={false}
              onClick={() => {
                setSearchParams(new URLSearchParams(), {preventScrollReset: true});
                formRef.current?.reset();
              }}
            >
              Clear Filters
            </FormButton>
          )}
        </div>
      </FormFieldset>
    </form>
  );
});

/**
 * @param {{order: OrderItemFragment}}
 */
const OrderItem = memo(function OrderItem({order}) {
  const fulfillmentStatus = flattenConnection(order.fulfillments)[0]?.status;
  const orderDate = new Date(order.processedAt);

  // Status badge color mapping
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('fulfilled') || statusLower.includes('paid')) {
      return 'bg-green-900/30 text-green-400 border-green-500';
    }
    if (statusLower.includes('pending') || statusLower.includes('unfulfilled')) {
      return 'bg-yellow-900/30 text-yellow-400 border-yellow-500';
    }
    if (statusLower.includes('cancelled') || statusLower.includes('refunded')) {
      return 'bg-red-900/30 text-red-400 border-[#FF0000]';
    }
    return 'bg-gray-900/30 text-gray-400 border-gray-500';
  };

  return (
    <AccountCard className="mb-4">
      <div className="space-y-4">
        {/* Order Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              to={`/account/orders/${btoa(order.id)}`}
              className="text-xl font-bold uppercase text-white hover:text-[#FF0000] transition-colors"
              style={{
                fontFamily: 'var(--font-family-shock)',
              }}
            >
              Order #{order.number}
            </Link>
            <p className="text-gray-400 text-sm mt-1">
              {orderDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#FF0000]">
              <Money data={order.totalPrice} />
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {order.confirmationNumber && (
            <div>
              <span className="text-gray-400 uppercase">Confirmation:</span>
              <span className="text-white ml-2 font-mono">
                {order.confirmationNumber}
              </span>
            </div>
          )}

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2">
            {order.financialStatus && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(
                  order.financialStatus,
                )}`}
              >
                {order.financialStatus}
              </span>
            )}
            {fulfillmentStatus && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(
                  fulfillmentStatus,
                )}`}
              >
                {fulfillmentStatus}
              </span>
            )}
          </div>
        </div>

        {/* View Order Link */}
        <div className="pt-4 border-t border-[#FF0000]/20">
          <Link
            to={`/account/orders/${btoa(order.id)}`}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px]
              text-white hover:text-[#FF0000]
              transition-colors font-bold uppercase text-sm group"
          >
            View Order Details
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>
    </AccountCard>
  );
});

/**
 * @typedef {{
 *   customer: CustomerOrdersFragment;
 *   filters: OrderFilterParams;
 * }} OrdersLoaderData
 */

/** @typedef {import('./+types/account.orders._index').Route} Route */
/** @typedef {import('~/lib/orderFilters').OrderFilterParams} OrderFilterParams */
/** @typedef {import('customer-accountapi.generated').CustomerOrdersFragment} CustomerOrdersFragment */
/** @typedef {import('customer-accountapi.generated').OrderItemFragment} OrderItemFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
