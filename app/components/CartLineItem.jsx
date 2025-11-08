import {CartForm, Image} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';

/**
 * A single line item in the cart - Enhanced with card layout and animations
 * Displays product image, title, price with micro-interactions
 * @param {{
 *   layout: CartLayout;
 *   line: CartLine;
 * }}
 */
export function CartLineItem({layout, line}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();

  return (
    <li
      key={id}
      className="group relative bg-black/30 backdrop-blur-sm border border-[#FF0000]/20
        rounded-lg p-4 mb-3
        motion-safe:transition-all motion-reduced:transition-none
        duration-300 ease-out
        hover:border-[#FF0000]/40 hover:shadow-[0_0_20px_rgba(255,0,0,0.2)]
        motion-safe:hover:scale-[1.02]"
    >
      <div className="flex gap-4">
        {/* Product Image */}
        {image && (
          <Link
            prefetch="intent"
            to={lineItemUrl}
            onClick={() => {
              if (layout === 'aside') {
                close();
              }
            }}
            className="flex-shrink-0"
          >
            <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-white/20
              motion-safe:transition-all duration-200
              group-hover:border-[#FF0000]/50">
              <Image
                alt={title}
                aspectRatio="1/1"
                data={image}
                height={96}
                loading="lazy"
                width={96}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
        )}

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          {/* Product Title */}
          <Link
            prefetch="intent"
            to={lineItemUrl}
            onClick={() => {
              if (layout === 'aside') {
                close();
              }
            }}
            className="block mb-2"
          >
            <h4 className="text-sm font-bold text-white uppercase tracking-wide
              line-clamp-2 hover:text-[#FF0000] transition-colors duration-200">
              {product.title}
            </h4>
          </Link>

          {/* Selected Options/Variants */}
          {selectedOptions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {selectedOptions.map((option) => (
                <span
                  key={option.name}
                  className="inline-block px-2 py-0.5 text-xs
                    bg-[#FF0000]/20 border border-[#FF0000]/40
                    text-white rounded
                    uppercase tracking-wide"
                >
                  {option.value}
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="mb-3">
            <ProductPrice
              price={line?.cost?.totalAmount}
              className="text-[#FF0000] font-bold text-lg"
            />
          </div>

          {/* Quantity Controls */}
          <CartLineQuantity line={line} />
        </div>
      </div>
    </li>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart
 * Enhanced with styled buttons and smooth animations
 * @param {{line: CartLine}}
 */
function CartLineQuantity({line}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center justify-between gap-3">
      {/* Quantity Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 uppercase tracking-wide">Qty:</span>
        <div className="flex items-center gap-1 bg-black/50 border border-white/20 rounded-lg p-1">
          <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
            <button
              aria-label="Decrease quantity"
              disabled={quantity <= 1 || !!isOptimistic}
              name="decrease-quantity"
              value={prevQuantity}
              className="w-7 h-7 flex items-center justify-center
                text-white bg-transparent border-0
                hover:bg-[#FF0000]/20 hover:text-[#FF0000]
                disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent
                rounded transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2
                focus:ring-offset-black"
            >
              <span className="text-lg leading-none">−</span>
            </button>
          </CartLineUpdateButton>

          <span className="w-8 text-center text-white font-bold text-sm">
            {quantity}
          </span>

          <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
            <button
              aria-label="Increase quantity"
              name="increase-quantity"
              value={nextQuantity}
              disabled={!!isOptimistic}
              className="w-7 h-7 flex items-center justify-center
                text-white bg-transparent border-0
                hover:bg-[#FF0000]/20 hover:text-[#FF0000]
                disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent
                rounded transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2
                focus:ring-offset-black"
            >
              <span className="text-lg leading-none">+</span>
            </button>
          </CartLineUpdateButton>
        </div>
      </div>

      {/* Remove Button */}
      <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
    </div>
  );
}

/**
 * A button that removes a line item from the cart
 * Enhanced with icon and hover effects
 * @param {{
 *   lineIds: string[];
 *   disabled: boolean;
 * }}
 */
function CartLineRemoveButton({lineIds, disabled}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        disabled={disabled}
        type="submit"
        aria-label="Remove item from cart"
        className="flex items-center gap-1.5 px-3 py-1.5
          bg-transparent border border-[#FF0000]/40
          text-[#FF0000] text-xs font-bold uppercase tracking-wide
          rounded-lg
          hover:bg-[#FF0000]/20 hover:border-[#FF0000]
          disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2
          focus:ring-offset-black"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        Remove
      </button>
    </CartForm>
  );
}

/**
 * @param {{
 *   children: React.ReactNode;
 *   lines: CartLineUpdateInput[];
 * }}
 */
function CartLineUpdateButton({children, lines}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

/**
 * Returns a unique key for the update action. This is used to make sure actions modifying the same line
 * items are not run concurrently, but cancel each other. For example, if the user clicks "Increase quantity"
 * and "Decrease quantity" in rapid succession, the actions will cancel each other and only the last one will run.
 * @returns
 * @param {string[]} lineIds - line ids affected by the update
 */
function getUpdateKey(lineIds) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}

/** @typedef {OptimisticCartLine<CartApiQueryFragment>} CartLine */

/** @typedef {import('@shopify/hydrogen/storefront-api-types').CartLineUpdateInput} CartLineUpdateInput */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('@shopify/hydrogen').OptimisticCartLine} OptimisticCartLine */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
