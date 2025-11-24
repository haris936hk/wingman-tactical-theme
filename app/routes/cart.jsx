import {useLoaderData, data, Link, useRouteError, isRouteErrorResponse} from 'react-router';
import {CartForm} from '@shopify/hydrogen';
import {CartMain} from '~/components/CartMain';
import {RECOMMENDED_PRODUCTS_QUERY} from '~/lib/fragments';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: `Hydrogen | Cart`}];
};

/**
 * @type {HeadersFunction}
 */
export const headers = ({actionHeaders}) => actionHeaders;

/**
 * @param {Route.ActionArgs}
 */
export async function action({request, context}) {
  const {cart} = context;

  const formData = await request.formData();

  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;

      // User inputted discount code
      const discountCodes = formDiscountCode ? [formDiscountCode] : [];

      // Combine discount codes already applied on cart
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesUpdate: {
      const formGiftCardCode = inputs.giftCardCode;

      // User inputted gift card code
      const giftCardCodes = formGiftCardCode ? [formGiftCardCode] : [];

      // Combine gift card codes already applied on cart
      giftCardCodes.push(...inputs.giftCardCodes);

      result = await cart.updateGiftCardCodes(giftCardCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesRemove: {
      const appliedGiftCardIds = inputs.giftCardCodes;
      result = await cart.removeGiftCardCodes(appliedGiftCardIds);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const {cart: cartResult, errors, warnings} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return data(
    {
      cart: cartResult,
      errors,
      warnings,
      analytics: {
        cartId,
      },
    },
    {status, headers},
  );
}

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  const {cart, storefront} = context;

  // Fetch cart and recommended products in parallel
  const [cartData, recommendedProductsData] = await Promise.all([
    cart.get(),
    storefront
      .query(RECOMMENDED_PRODUCTS_QUERY, {
        cache: storefront.CacheLong(),
        variables: {
          first: 4,
          country: storefront.i18n.country,
          language: storefront.i18n.language,
        },
      })
      .then((response) => response?.products?.nodes || [])
      .catch((error) => {
        console.error('Error fetching recommended products:', error);
        return [];
      }),
  ]);

  return {
    cart: cartData,
    recommendedProducts: recommendedProductsData,
  };
}

export default function Cart() {
  /** @type {LoaderReturnData} */
  const {cart, recommendedProducts} = useLoaderData();

  return (
    <div className="cart">
      <h1 className="text-3xl md:text-4xl font-bold uppercase text-white mb-6" style={{fontFamily: 'var(--font-family-shock)'}}>Cart</h1>
      <CartMain layout="page" cart={cart} recommendedProducts={recommendedProducts} />
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{fontFamily: 'var(--font-family-shock)'}}>{error.status}</h1>
          <p className="text-lg text-gray-400 mb-6">{error.statusText || 'Cart Error'}</p>
          {error.data && <p className="text-sm text-gray-500 mb-8">{error.data}</p>}
          <Link
            to="/"
            className="inline-block bg-[#FF0000] text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4" style={{fontFamily: 'var(--font-family-shock)'}}>Cart Error</h1>
        <p className="text-lg text-gray-400 mb-8">
          {error instanceof Error ? error.message : 'An unexpected error occurred with your cart'}
        </p>
        <Link
          to="/"
          className="inline-block bg-[#FF0000] text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

/** @typedef {import('react-router').HeadersFunction} HeadersFunction */
/** @typedef {import('./+types/cart').Route} Route */
/** @typedef {import('@shopify/hydrogen').CartQueryDataReturn} CartQueryDataReturn */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof action>} ActionReturnData */
