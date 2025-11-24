import { useEffect } from 'react';
import { useFetcher } from 'react-router';
import { data as remixData } from 'react-router';
import { getLocalWishlist, saveLocalWishlist, parseWishlistMetafield } from '~/lib/wishlist';
import { CUSTOMER_WISHLIST_QUERY } from '~/graphql/customer-account/CustomerWishlistQuery';

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({ context }) {
  return context.customerAccount.authorize();
}

/**
 * Action to sync guest wishlist with customer account
 * @param {Route.ActionArgs}
 */
export async function action({ request, context }) {
  const { customerAccount } = context;
  const formData = await request.formData();
  const guestWishlistJson = formData.get('guestWishlist');

  if (!guestWishlistJson) {
    return remixData({ success: false, message: 'No guest wishlist provided' });
  }

  try {
    const guestWishlist = JSON.parse(guestWishlistJson);

    // Get current customer wishlist from metafield
    const { data: customerData } = await customerAccount.query(
      CUSTOMER_WISHLIST_QUERY,
      {
        variables: { language: customerAccount.i18n.language },
      },
    );

    const customerWishlist = parseWishlistMetafield(
      customerData?.customer?.metafield?.value,
    );

    // Merge wishlists (remove duplicates)
    const mergedWishlist = [
      ...new Set([...customerWishlist, ...guestWishlist]),
    ];

    // Update customer metafield with merged wishlist
    const UPDATE_MUTATION = `#graphql
      mutation customerAuthorizeUpdate($input: CustomerUpdateInput!) {
        customerUpdate(input: $input) {
          customer {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const { data, errors } = await customerAccount.mutate(UPDATE_MUTATION, {
      variables: {
        input: {
          metafields: [
            {
              namespace: 'custom',
              key: 'wishlist',
              value: JSON.stringify(mergedWishlist),
            },
          ],
        },
      },
    });

    if (errors?.length || data?.customerUpdate?.userErrors?.length) {
      console.error(
        'Error syncing wishlist:',
        errors || data.customerUpdate.userErrors,
      );
      return remixData({ success: false, message: 'Failed to sync wishlist' });
    }

    return remixData({
      success: true,
      merged: mergedWishlist.length - customerWishlist.length,
    });
  } catch (error) {
    console.error('Error syncing guest wishlist:', error);
    return remixData({ success: false, message: error.message });
  }
}

/**
 * Authorize callback page - shows branded loading state while completing OAuth
 * Also syncs guest wishlist to customer account after login
 */
export default function Authorize() {
  const fetcher = useFetcher();

  // Sync guest wishlist to customer account after login
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const guestWishlist = getLocalWishlist();

    // If there are items in guest wishlist, sync them
    if (guestWishlist.length > 0 && fetcher.state === 'idle') {
      fetcher.submit(
        { guestWishlist: JSON.stringify(guestWishlist) },
        { method: 'POST' },
      );
    }
  }, []);

  // Clear localStorage after successful sync
  useEffect(() => {
    if (fetcher.data?.success) {
      saveLocalWishlist([]);
      console.log(
        `✅ Synced ${fetcher.data.merged} wishlist items to your account`,
      );
    }
  }, [fetcher.data]);

  return (
    <div className="bg-[#000000] min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        {/* Loading Spinner */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-900 mb-6">
          <svg
            className="animate-spin w-12 h-12 text-[#FF0000]"
            fill="none"
            viewBox="0 0 24 24"
            style={{
              filter: 'drop-shadow(0 0 10px rgba(255, 0, 0, 0.6))',
            }}
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>

        {/* Message */}
        <h1
          className="text-3xl lg:text-4xl font-bold uppercase text-white mb-4"
          style={{
            fontFamily: 'var(--font-family-shock)',
            textShadow: '0 0 15px rgba(255, 0, 0, 0.6)',
          }}
        >
          Completing Login
        </h1>
        <p className="text-lg text-gray-300">
          Finalizing your secure authentication...
        </p>
      </div>
    </div>
  );
}

/** @typedef {import('./+types/account_.authorize').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
