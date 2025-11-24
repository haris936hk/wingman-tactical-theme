import {CartForm} from '@shopify/hydrogen';

/**
 * @param {{
 *   analytics?: unknown;
 *   children: React.ReactNode;
 *   disabled?: boolean;
 *   lines: Array<OptimisticCartLineInput>;
 *   onClick?: () => void;
 * }}
 */
export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className="relative w-full px-8 py-4 font-bold uppercase tracking-wide text-white
              rounded-lg
              bg-[#FF0000] hover:bg-[#CC0000]
              shadow-[0_0_20px_rgba(255,0,0,0.6)]
              hover:shadow-[0_0_30px_rgba(255,0,0,0.8)]
              motion-safe:hover:-translate-y-1
              transition-all duration-300
              border border-white/20
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}

/** @typedef {import('react-router').FetcherWithComponents} FetcherWithComponents */
/** @typedef {import('@shopify/hydrogen').OptimisticCartLineInput} OptimisticCartLineInput */
