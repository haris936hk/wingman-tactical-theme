/**
 * API Route for syncing local wishlist with server wishlist
 * Called when user logs in to merge guest wishlist items
 */

import { parseWishlistMetafield, mergeWishlists } from '~/lib/wishlist';
import { CUSTOMER_WISHLIST_QUERY } from '~/graphql/customer-account/CustomerWishlistQuery';

export async function action({ request, context }) {
  const { customerAccount } = context;

  // Check if user is logged in
  if (!(await customerAccount.isLoggedIn())) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { localWishlist } = await request.json();

  if (!Array.isArray(localWishlist) || localWishlist.length === 0) {
    return Response.json({ success: true, message: 'No local items to sync' });
  }

  try {
    // Get current server wishlist
    const { data: customerData } = await customerAccount.query(
      CUSTOMER_WISHLIST_QUERY,
      {
        variables: { language: customerAccount.i18n.language },
      },
    );

    const serverWishlist = parseWishlistMetafield(
      customerData?.customer?.metafield?.value,
    );

    // Merge local and server wishlists
    const mergedWishlist = mergeWishlists(serverWishlist, localWishlist);

    // Only update if there are new items
    if (mergedWishlist.length === serverWishlist.length) {
      return Response.json({
        success: true,
        message: 'No new items to sync',
        count: 0,
      });
    }

    // Update customer metafield
    const UPDATE_MUTATION = `#graphql
      mutation customerWishlistUpdate($input: CustomerInput!) {
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
      return Response.json(
        { error: 'Failed to sync wishlist' },
        { status: 500 },
      );
    }

    const newItemsCount = mergedWishlist.length - serverWishlist.length;

    return Response.json({
      success: true,
      message: `Synced ${newItemsCount} wishlist ${newItemsCount === 1 ? 'item' : 'items'}`,
      count: newItemsCount,
      totalItems: mergedWishlist.length,
    });
  } catch (error) {
    console.error('Error in wishlist sync:', error);
    return Response.json({ error: 'Failed to sync wishlist' }, { status: 500 });
  }
}
