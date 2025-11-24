import {useEffect, useRef} from 'react';
import {getLocalWishlist, clearLocalWishlist} from '~/lib/wishlist';

/**
 * Hook to sync local wishlist with server when user logs in
 * @param {boolean} isLoggedIn - Whether user is currently logged in
 */
export function useWishlistSync(isLoggedIn) {
  const hasSyncedRef = useRef(false);
  const previousLoginStateRef = useRef(isLoggedIn);

  useEffect(() => {
    // Detect login event (transition from not logged in to logged in)
    const justLoggedIn =
      isLoggedIn && !previousLoginStateRef.current && !hasSyncedRef.current;

    if (justLoggedIn) {
      const localWishlist = getLocalWishlist();

      if (localWishlist.length > 0) {
        // Sync local wishlist to server
        fetch('/api/wishlist-sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({localWishlist}),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              console.log('Wishlist synced:', data.message);
              // Clear local wishlist after successful sync
              clearLocalWishlist();
              hasSyncedRef.current = true;
            } else {
              console.error('Failed to sync wishlist:', data.error);
            }
          })
          .catch((error) => {
            console.error('Error syncing wishlist:', error);
          });
      }
    }

    // Update previous login state
    previousLoginStateRef.current = isLoggedIn;

    // Reset sync flag if user logs out
    if (!isLoggedIn) {
      hasSyncedRef.current = false;
    }
  }, [isLoggedIn]);
}
