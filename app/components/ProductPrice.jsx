import {Money} from '@shopify/hydrogen';

/**
 * @param {{
 *   price?: MoneyV2;
 *   compareAtPrice?: MoneyV2 | null;
 * }}
 */
export function ProductPrice({price, compareAtPrice, size = 'large'}) {
  const sizeClasses = {
    small: 'text-lg font-bold',
    large: 'text-2xl lg:text-3xl font-bold',
  };

  return (
    <div className={`${sizeClasses[size]}`}>
      {compareAtPrice ? (
        <div className="flex items-baseline gap-3 flex-wrap">
          {/* Sale Price in Red */}
          {price ? (
            <span className="text-[#FF0000]">
              <Money data={price} />
            </span>
          ) : null}
          {/* Original Price Strikethrough */}
          <s className="text-gray-400 text-xl">
            <Money data={compareAtPrice} />
          </s>
          {/* Sale Badge */}
          <span className="text-xs font-bold uppercase px-2 py-1 bg-[#FF0000] text-white rounded shadow-[0_0_10px_rgba(255,0,0,0.5)]">
            Sale
          </span>
        </div>
      ) : price ? (
        <span className="text-white">
          <Money data={price} />
        </span>
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}

/** @typedef {import('@shopify/hydrogen/storefront-api-types').MoneyV2} MoneyV2 */
