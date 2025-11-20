import {redirect, useLoaderData, Await} from 'react-router';
import {Suspense} from 'react';
import {Money, Image} from '@shopify/hydrogen';
import {CUSTOMER_ORDER_QUERY} from '~/graphql/customer-account/CustomerOrderQuery';
import {LoadingSpinner} from '~/components/account/LoadingSpinner';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [{title: `Order ${data?.order?.name}`}];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({params, context}) {
  const {customerAccount} = context;
  if (!params.id) {
    return redirect('/account/orders');
  }

  const orderId = atob(params.id);

  // Defer order query for faster initial render
  const orderPromise = customerAccount.query(CUSTOMER_ORDER_QUERY, {
    variables: {
      orderId,
      language: customerAccount.i18n.language,
    },
  }).then(({data, errors}) => {
    if (errors?.length || !data?.order) {
      console.error('Failed to load order:', errors);
      return null;
    }

    const {order} = data;

    // Extract line items directly from nodes array
    const lineItems = order.lineItems.nodes;

    // Extract discount applications directly from nodes array
    const discountApplications = order.discountApplications.nodes;

    // Get fulfillment status from first fulfillment node
    const fulfillmentStatus = order.fulfillments.nodes[0]?.status ?? 'N/A';

    // Get first discount value with proper type checking
    const firstDiscount = discountApplications[0]?.value;

    // Type guard for MoneyV2 discount
    const discountValue =
      firstDiscount?.__typename === 'MoneyV2' ? firstDiscount : null;

    // Type guard for percentage discount
    const discountPercentage =
      firstDiscount?.__typename === 'PricingPercentageValue'
        ? firstDiscount.percentage
        : null;

    return {
      order,
      lineItems,
      discountValue,
      discountPercentage,
      fulfillmentStatus,
    };
  }).catch((error) => {
    console.error('Failed to load order:', error);
    return null;
  });

  return {
    orderData: orderPromise,
    headers: {
      'Cache-Control': 'private, max-age=300, stale-while-revalidate=600',
    },
  };
}

export default function OrderRoute() {
  /** @type {LoaderReturnData} */
  const {orderData} = useLoaderData();

  return (
    <Suspense
      fallback={
        <div className="max-w-5xl">
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner text="Loading order details..." />
          </div>
        </div>
      }
    >
      <Await
        resolve={orderData}
        errorElement={
          <div className="max-w-5xl">
            <div className="text-center py-12">
              <div className="text-white bg-red-900/20 border border-red-500/30 rounded-lg p-6 max-w-md mx-auto">
                <svg className="w-12 h-12 text-[#FF0000] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h2 className="text-xl font-bold text-white mb-2">Failed to Load Order</h2>
                <p className="text-gray-300">We couldn't load this order. Please try again.</p>
              </div>
            </div>
          </div>
        }
      >
        {(resolvedData) => {
          if (!resolvedData) {
            return (
              <div className="max-w-5xl">
                <div className="text-center py-12">
                  <div className="text-white bg-red-900/20 border border-red-500/30 rounded-lg p-6 max-w-md mx-auto">
                    <svg className="w-12 h-12 text-[#FF0000] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h2 className="text-xl font-bold text-white mb-2">Order Not Found</h2>
                    <p className="text-gray-300">This order could not be loaded.</p>
                  </div>
                </div>
              </div>
            );
          }

          const {order, lineItems, discountValue, discountPercentage, fulfillmentStatus} = resolvedData;

          return (
    <div className="max-w-5xl">
      {/* Order Header */}
      <div className="bg-black/50 backdrop-blur-sm border-2 border-[#FF0000]/30 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-white mb-3 sm:mb-4">
          Order {order.name}
        </h1>
        <div className="space-y-2 text-gray-300">
          <p className="text-sm sm:text-base">
            <span className="text-gray-400">Placed on:</span>{' '}
            {new Date(order.processedAt).toDateString()}
          </p>
          {order.confirmationNumber && (
            <p className="text-sm sm:text-base">
              <span className="text-gray-400">Confirmation:</span>{' '}
              {order.confirmationNumber}
            </p>
          )}
        </div>
      </div>

      {/* Line Items - Mobile Card Layout */}
      <div className="md:hidden space-y-4 mb-6">
        {lineItems.map((lineItem, lineItemIndex) => (
          <OrderLineCard key={lineItemIndex} lineItem={lineItem} />
        ))}
      </div>

      {/* Line Items - Desktop Table Layout */}
      <div className="hidden md:block bg-black/50 backdrop-blur-sm border-2 border-[#FF0000]/30 rounded-lg overflow-hidden mb-6 sm:mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FF0000] text-white">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide">
                  Product
                </th>
                <th scope="col" className="px-4 py-3 text-right text-sm font-bold uppercase tracking-wide">
                  Price
                </th>
                <th scope="col" className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wide">
                  Quantity
                </th>
                <th scope="col" className="px-4 py-3 text-right text-sm font-bold uppercase tracking-wide">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FF0000]/20">
              {lineItems.map((lineItem, lineItemIndex) => (
                // eslint-disable-next-line react/no-array-index-key
                <OrderLineRow key={lineItemIndex} lineItem={lineItem} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-black/50 backdrop-blur-sm border-2 border-[#FF0000]/30 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold uppercase text-white mb-4 sm:mb-6">
          Order Summary
        </h2>
        <div className="space-y-3 sm:space-y-4">
          {((discountValue && discountValue.amount) || discountPercentage) && (
            <div className="flex justify-between items-center pb-3 border-b border-[#FF0000]/20">
              <span className="text-sm sm:text-base text-gray-300 font-medium">Discount</span>
              <span className="text-sm sm:text-base text-[#FF0000] font-bold">
                {discountPercentage ? (
                  <span>-{discountPercentage}% OFF</span>
                ) : (
                  discountValue && <Money data={discountValue} />
                )}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center pb-3 border-b border-[#FF0000]/20">
            <span className="text-sm sm:text-base text-gray-300 font-medium">Subtotal</span>
            <span className="text-sm sm:text-base text-white font-bold">
              <Money data={order.subtotal} />
            </span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-[#FF0000]/20">
            <span className="text-sm sm:text-base text-gray-300 font-medium">Tax</span>
            <span className="text-sm sm:text-base text-white font-bold">
              <Money data={order.totalTax} />
            </span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-base sm:text-lg text-white font-bold uppercase">Total</span>
            <span className="text-lg sm:text-xl text-[#FF0000] font-bold">
              <Money data={order.totalPrice} />
            </span>
          </div>
        </div>
      </div>

      {/* Shipping & Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Shipping Address */}
        <div className="bg-black/50 backdrop-blur-sm border-2 border-[#FF0000]/30 rounded-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold uppercase text-white mb-3 sm:mb-4">
            Shipping Address
          </h3>
          {order?.shippingAddress ? (
            <address className="not-italic text-sm sm:text-base text-gray-300 leading-relaxed space-y-1">
              <p className="font-medium text-white">{order.shippingAddress.name}</p>
              {order.shippingAddress.formatted && (
                <p>{order.shippingAddress.formatted}</p>
              )}
              {order.shippingAddress.formattedArea && (
                <p>{order.shippingAddress.formattedArea}</p>
              )}
            </address>
          ) : (
            <p className="text-sm sm:text-base text-gray-400">No shipping address defined</p>
          )}
        </div>

        {/* Fulfillment Status */}
        <div className="bg-black/50 backdrop-blur-sm border-2 border-[#FF0000]/30 rounded-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold uppercase text-white mb-3 sm:mb-4">
            Fulfillment Status
          </h3>
          <div className="inline-block px-4 py-2 bg-[#FF0000]/20 border border-[#FF0000] rounded-lg">
            <p className="text-sm sm:text-base text-white font-bold uppercase">
              {fulfillmentStatus}
            </p>
          </div>
        </div>
      </div>

      {/* Order Status Link */}
      <div className="text-center">
        <a
          target="_blank"
          href={order.statusPageUrl}
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 min-h-[44px]
            bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold uppercase tracking-wide text-sm sm:text-base
            rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,0,0,0.6)]
            focus-visible:outline-2 focus-visible:outline-[#FF0000] focus-visible:outline-offset-2"
        >
          View Order Status
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </div>
          );
        }}
      </Await>
    </Suspense>
  );
}

/**
 * @param {{lineItem: OrderLineItemFullFragment}}
 */
function OrderLineRow({lineItem}) {
  return (
    <tr className="text-white hover:bg-white/5 transition-colors">
      <td className="px-4 py-4">
        <div className="flex items-center gap-4">
          {lineItem?.image && (
            <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-white">
              <Image data={lineItem.image} width={64} height={64} loading="lazy" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm sm:text-base truncate">{lineItem.title}</p>
            {lineItem.variantTitle && (
              <p className="text-xs sm:text-sm text-gray-400 mt-1">{lineItem.variantTitle}</p>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-right text-sm sm:text-base">
        <Money data={lineItem.price} />
      </td>
      <td className="px-4 py-4 text-center text-sm sm:text-base font-medium">
        {lineItem.quantity}
      </td>
      <td className="px-4 py-4 text-right text-sm sm:text-base font-bold">
        <Money data={lineItem.totalDiscount} />
      </td>
    </tr>
  );
}

/**
 * @param {{lineItem: OrderLineItemFullFragment}}
 */
function OrderLineCard({lineItem}) {
  return (
    <div className="bg-black/50 backdrop-blur-sm border-2 border-[#FF0000]/30 rounded-lg p-4 hover:border-[#FF0000]/50 transition-colors">
      <div className="flex gap-4">
        {/* Product Image */}
        {lineItem?.image && (
          <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-white">
            <Image
              data={lineItem.image}
              width={96}
              height={96}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base sm:text-lg text-white mb-1 line-clamp-2">
            {lineItem.title}
          </h3>
          {lineItem.variantTitle && (
            <p className="text-xs sm:text-sm text-gray-400 mb-3">
              {lineItem.variantTitle}
            </p>
          )}

          {/* Price Details Grid */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-400 text-xs mb-1">Price</p>
              <p className="text-white font-medium">
                <Money data={lineItem.price} />
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Quantity</p>
              <p className="text-white font-medium">{lineItem.quantity}</p>
            </div>
          </div>

          {/* Total */}
          <div className="mt-3 pt-3 border-t border-[#FF0000]/20 flex justify-between items-center">
            <span className="text-xs sm:text-sm text-gray-400 font-medium uppercase">Total</span>
            <span className="text-base sm:text-lg text-[#FF0000] font-bold">
              <Money data={lineItem.totalDiscount} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** @typedef {import('./+types/account.orders.$id').Route} Route */
/** @typedef {import('customer-accountapi.generated').OrderLineItemFullFragment} OrderLineItemFullFragment */
/** @typedef {import('customer-accountapi.generated').OrderQuery} OrderQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
