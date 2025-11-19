import {useFetcher} from 'react-router';
import {useState, useEffect} from 'react';
import {
  getLocalWishlist,
  addToLocalWishlist,
  removeFromLocalWishlist,
} from '~/lib/wishlist';

/**
 * Wishlist heart button
 * Handles both logged-in (server) and guest (localStorage) users
 *
 * @param {{
 *   productId: string;
 *   isLoggedIn?: boolean;
 *   initialInWishlist?: boolean;
 *   className?: string;
 * }}
 */
export function WishlistButton({
  productId,
  isLoggedIn = false,
  initialInWishlist = false,
  className = '',
}) {
  const fetcher = useFetcher();
  const [isInWishlist, setIsInWishlist] = useState(initialInWishlist);

  // For guest users, check localStorage on mount
  useEffect(() => {
    if (!isLoggedIn && typeof window !== 'undefined') {
      const localWishlist = getLocalWishlist();
      setIsInWishlist(localWishlist.includes(productId));
    }
  }, [productId, isLoggedIn]);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoggedIn) {
      // Logged-in user: use server action
      fetcher.submit(
        {
          action: isInWishlist ? 'remove' : 'add',
          productId,
        },
        {
          method: 'POST',
          action: '/account/wishlist',
        },
      );
      // Optimistic update
      setIsInWishlist(!isInWishlist);
    } else {
      // Guest user: use localStorage
      if (isInWishlist) {
        removeFromLocalWishlist(productId);
      } else {
        addToLocalWishlist(productId);
      }
      setIsInWishlist(!isInWishlist);
    }
  };

  const isLoading = fetcher.state !== 'idle';

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all disabled:opacity-50 ${className}`}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <svg
        className={`w-5 h-5 transition-colors ${
          isInWishlist ? 'text-[#FF0000] fill-current' : 'text-gray-600'
        }`}
        fill={isInWishlist ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
