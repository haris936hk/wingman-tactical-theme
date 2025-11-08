import {useOptimisticCart} from '@shopify/hydrogen';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {CartProgress} from './cart/CartProgress';
import {CartTrustBadges} from './cart/CartTrustBadges';
import {CartEmptyState} from './cart/CartEmptyState';
import {CartUpsells} from './cart/CartUpsells';

/**
 * The main cart component - Enhanced with progress, trust badges, and upsells
 * Displays cart items, summary, and recommendations
 * Used by both /cart route and cart aside dialog
 * @param {CartMainProps}
 */
export function CartMain({layout, cart: originalCart, recommendedProducts}) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;
  const subtotalAmount = cart?.cost?.subtotalAmount?.amount
    ? parseFloat(cart.cost.subtotalAmount.amount)
    : 0;
  const currencyCode = cart?.cost?.subtotalAmount?.currencyCode || 'USD';

  return (
    <div className="h-full flex flex-col">
      {!cartHasItems ? (
        /* Empty Cart State */
        <CartEmptyState />
      ) : (
        <>
          {/* Cart Items Section - Scrollable */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {/* Free Shipping Progress */}
            <CartProgress
              currentAmount={subtotalAmount}
              freeShippingThreshold={100}
              currencyCode={currencyCode}
            />

            {/* Cart Items List */}
            <div aria-labelledby="cart-lines" className="mb-4">
              <ul className="space-y-0">
                {(cart?.lines?.nodes ?? []).map((line) => (
                  <CartLineItem key={line.id} line={line} layout={layout} />
                ))}
              </ul>
            </div>

            {/* Upsell Products */}
            {recommendedProducts && recommendedProducts.length > 0 && (
              <CartUpsells products={recommendedProducts} />
            )}

            {/* Trust Badges - Only show in aside layout */}
            {layout === 'aside' && <CartTrustBadges />}
          </div>

          {/* Cart Summary - Sticky Footer */}
          <CartSummary cart={cart} layout={layout} />
        </>
      )}
    </div>
  );
}

/** @typedef {'page' | 'aside'} CartLayout */
/**
 * @typedef {{
 *   cart: CartApiQueryFragment | null;
 *   layout: CartLayout;
 *   recommendedProducts?: Array<{
 *     id: string;
 *     handle: string;
 *     title: string;
 *     priceRange: {
 *       minVariantPrice: {
 *         amount: string;
 *         currencyCode: string;
 *       };
 *     };
 *     featuredImage?: {
 *       url: string;
 *       altText: string | null;
 *       width: number;
 *       height: number;
 *     };
 *   }>;
 * }} CartMainProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
