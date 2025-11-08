import {CartForm, Money} from '@shopify/hydrogen';
import {useEffect, useRef} from 'react';
import {useFetcher} from 'react-router';

/**
 * Cart Summary - Enhanced with visual hierarchy and styled components
 * @param {CartSummaryProps}
 */
export function CartSummary({cart, layout}) {
  return (
    <div
      aria-labelledby="cart-summary"
      className="sticky bottom-0 bg-black/95 backdrop-blur-md border-t-2 border-[#FF0000]/30 p-4 md:p-6"
    >
      {/* Order Summary Header */}
      <h4
        className="text-lg font-bold uppercase text-white mb-4 tracking-wide"
        style={{
          fontFamily: 'var(--font-family-shock)',
          textShadow: '0 0 10px rgba(255, 0, 0, 0.6)',
        }}
      >
        Order Summary
      </h4>

      {/* Subtotal */}
      <dl className="space-y-3 mb-4">
        <div className="flex justify-between items-center text-white">
          <dt className="text-sm text-gray-300 uppercase tracking-wide">Subtotal</dt>
          <dd className="text-lg font-bold">
            {cart?.cost?.subtotalAmount?.amount ? (
              <Money data={cart?.cost?.subtotalAmount} />
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </dd>
        </div>

        {/* Taxes & Shipping Info */}
        <div className="text-xs text-gray-400 pt-2 border-t border-white/10">
          Shipping & taxes calculated at checkout
        </div>
      </dl>

      {/* Discounts & Gift Cards */}
      <div className="space-y-3 mb-4">
        <CartDiscounts discountCodes={cart?.discountCodes} />
        <CartGiftCard giftCardCodes={cart?.appliedGiftCards} />
      </div>

      {/* Checkout Action */}
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
    </div>
  );
}

/**
 * Checkout Actions - Enhanced with prominent CTA button
 * @param {{checkoutUrl?: string}}
 */
function CartCheckoutActions({checkoutUrl}) {
  if (!checkoutUrl) return null;

  return (
    <div className="space-y-3">
      {/* Primary Checkout Button */}
      <a
        href={checkoutUrl}
        target="_self"
        className="relative block w-full px-8 py-4 font-bold uppercase tracking-wide text-white text-center
          rounded-lg overflow-hidden backdrop-blur-md
          bg-gradient-to-r from-[#FF0000] via-gray-600 to-[#FF0000]
          bg-[length:200%_100%]
          motion-safe:animate-[gradient_3s_linear_infinite]
          shadow-[0_0_20px_rgba(255,0,0,0.6)]
          hover:shadow-[0_0_30px_rgba(255,0,0,0.8)]
          motion-safe:hover:-translate-y-0.5
          transition-all duration-300
          border border-white/20
          focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2
          focus:ring-offset-black"
      >
        <span className="flex items-center justify-center gap-2">
          Secure Checkout
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </span>
      </a>
    </div>
  );
}

/**
 * Cart Discounts - Enhanced with styled inputs and badges
 * @param {{
 *   discountCodes?: CartApiQueryFragment['discountCodes'];
 * }}
 */
function CartDiscounts({discountCodes}) {
  const codes =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="space-y-3">
      {/* Applied Discount */}
      {codes.length > 0 && (
        <div className="bg-green-900/20 border border-green-500/40 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs font-bold uppercase text-green-400 tracking-wide">
                Discount Applied
              </span>
            </div>
            <UpdateDiscountForm>
              <button
                type="submit"
                className="text-xs text-[#FF0000] hover:text-white transition-colors
                  font-bold uppercase tracking-wide"
                aria-label="Remove discount"
              >
                Remove
              </button>
            </UpdateDiscountForm>
          </div>
          <code className="block mt-2 text-sm text-white font-mono">
            {codes?.join(', ')}
          </code>
        </div>
      )}

      {/* Apply Discount Form */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="space-y-2">
          <label htmlFor="discount-code" className="block text-xs font-bold uppercase text-gray-300 tracking-wide">
            Discount Code
          </label>
          <div className="flex gap-2">
            <input
              id="discount-code"
              type="text"
              name="discountCode"
              placeholder="Enter code"
              className="flex-1 px-3 py-2 rounded-lg text-sm
                bg-black/50 backdrop-blur-sm
                border border-white/30
                text-white placeholder:text-gray-500
                focus:outline-none focus:ring-2 focus:ring-[#FF0000]
                focus:border-[#FF0000]
                transition-all duration-300"
            />
            <button
              type="submit"
              className="px-4 py-2 font-bold uppercase tracking-wide text-white text-xs
                bg-transparent border border-[#FF0000]/60
                rounded-lg
                hover:bg-[#FF0000]/20 hover:border-[#FF0000]
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2
                focus:ring-offset-black"
            >
              Apply
            </button>
          </div>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

/**
 * @param {{
 *   discountCodes?: string[];
 *   children: React.ReactNode;
 * }}
 */
function UpdateDiscountForm({discountCodes, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

/**
 * Cart Gift Card - Enhanced with styled inputs and badges
 * @param {{
 *   giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
 * }}
 */
function CartGiftCard({giftCardCodes}) {
  const appliedGiftCardCodes = useRef([]);
  const giftCardCodeInput = useRef(null);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});

  // Clear the gift card code input after the gift card is added
  useEffect(() => {
    if (giftCardAddFetcher.data) {
      giftCardCodeInput.current.value = '';
    }
  }, [giftCardAddFetcher.data]);

  function saveAppliedCode(code) {
    const formattedCode = code.replace(/\s/g, ''); // Remove spaces
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
  }

  return (
    <div className="space-y-3">
      {/* Applied Gift Cards */}
      {giftCardCodes && giftCardCodes.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase text-gray-300 tracking-wide">
            Applied Gift Card(s)
          </div>
          {giftCardCodes.map((giftCard) => (
            <RemoveGiftCardForm key={giftCard.id} giftCardId={giftCard.id}>
              <div className="flex items-center justify-between bg-black/30 border border-white/20 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-[#FF0000]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                    />
                  </svg>
                  <div>
                    <code className="text-sm text-white font-mono">
                      •••• {giftCard.lastCharacters}
                    </code>
                    <div className="text-xs text-gray-400 mt-0.5">
                      <Money data={giftCard.amountUsed} /> applied
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="text-xs text-[#FF0000] hover:text-white transition-colors
                    font-bold uppercase tracking-wide"
                  aria-label="Remove gift card"
                >
                  Remove
                </button>
              </div>
            </RemoveGiftCardForm>
          ))}
        </div>
      )}

      {/* Apply Gift Card Form */}
      <UpdateGiftCardForm
        giftCardCodes={appliedGiftCardCodes.current}
        saveAppliedCode={saveAppliedCode}
        fetcherKey="gift-card-add"
      >
        <div className="space-y-2">
          <label htmlFor="gift-card-code" className="block text-xs font-bold uppercase text-gray-300 tracking-wide">
            Gift Card
          </label>
          <div className="flex gap-2">
            <input
              id="gift-card-code"
              type="text"
              name="giftCardCode"
              placeholder="Enter gift card code"
              ref={giftCardCodeInput}
              className="flex-1 px-3 py-2 rounded-lg text-sm
                bg-black/50 backdrop-blur-sm
                border border-white/30
                text-white placeholder:text-gray-500
                focus:outline-none focus:ring-2 focus:ring-[#FF0000]
                focus:border-[#FF0000]
                transition-all duration-300"
            />
            <button
              type="submit"
              disabled={giftCardAddFetcher.state !== 'idle'}
              className="px-4 py-2 font-bold uppercase tracking-wide text-white text-xs
                bg-transparent border border-[#FF0000]/60
                rounded-lg
                hover:bg-[#FF0000]/20 hover:border-[#FF0000]
                disabled:opacity-30 disabled:cursor-not-allowed
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2
                focus:ring-offset-black"
            >
              Apply
            </button>
          </div>
        </div>
      </UpdateGiftCardForm>
    </div>
  );
}

/**
 * @param {{
 *   giftCardCodes?: string[];
 *   saveAppliedCode?: (code: string) => void;
 *   fetcherKey?: string;
 *   children: React.ReactNode;
 * }}
 */
function UpdateGiftCardForm({
  giftCardCodes,
  saveAppliedCode,
  fetcherKey,
  children,
}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher) => {
        const code = fetcher.formData?.get('giftCardCode');
        if (code && saveAppliedCode) {
          saveAppliedCode(code);
        }
        return children;
      }}
    </CartForm>
  );
}

/**
 * @param {{
 *   giftCardId: string;
 *   children: React.ReactNode;
 * }}
 */
function RemoveGiftCardForm({giftCardId, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      {children}
    </CartForm>
  );
}

/**
 * @typedef {{
 *   cart: OptimisticCart<CartApiQueryFragment | null>;
 *   layout: CartLayout;
 * }} CartSummaryProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('@shopify/hydrogen').OptimisticCart} OptimisticCart */
/** @typedef {import('react-router').FetcherWithComponents} FetcherWithComponents */
