/**
 * Review Utilities for Shopify Product Reviews
 * Handles parsing review data from Shopify metafields or third-party apps
 */

/**
 * Parse reviews from Shopify product metafields
 * Supports Judge.me, Yotpo, Stamped.io, and Shopify Product Reviews
 * @param {Object} product - Shopify product object with metafields
 * @returns {{reviews: Array, averageRating: number, totalReviews: number}}
 */
export function parseProductReviews(product) {
  if (!product) {
    return {reviews: [], averageRating: 0, totalReviews: 0};
  }

  // Check for reviews in various metafield formats
  const reviewsMetafield =
    product.metafields?.find((m) => m.namespace === 'reviews' && m.key === 'data') ||
    product.metafields?.find((m) => m.namespace === 'judgeme' && m.key === 'reviews') ||
    product.metafields?.find((m) => m.namespace === 'yotpo' && m.key === 'reviews');

  const ratingMetafield =
    product.metafields?.find((m) => m.namespace === 'reviews' && m.key === 'rating') ||
    product.metafields?.find((m) => m.namespace === 'judgeme' && m.key === 'rating');

  const countMetafield =
    product.metafields?.find((m) => m.namespace === 'reviews' && m.key === 'count') ||
    product.metafields?.find((m) => m.namespace === 'judgeme' && m.key === 'count');

  // Parse review data
  let reviews = [];
  if (reviewsMetafield?.value) {
    try {
      const parsed = JSON.parse(reviewsMetafield.value);
      reviews = Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error parsing reviews metafield:', error);
    }
  }

  // Get average rating and count
  const averageRating = ratingMetafield?.value ? parseFloat(ratingMetafield.value) : 0;
  const totalReviews = countMetafield?.value ? parseInt(countMetafield.value, 10) : reviews.length;

  return {
    reviews: reviews.map(normalizeReview),
    averageRating,
    totalReviews,
  };
}

/**
 * Normalize review object to consistent format
 * Handles different review app formats
 * @param {Object} review - Raw review object
 * @returns {Object} Normalized review
 */
function normalizeReview(review) {
  return {
    id: review.id || review._id || `review-${Date.now()}`,
    rating: review.rating || review.score || 5,
    author: review.author || review.reviewer || review.name || 'Anonymous',
    title: review.title || review.heading || '',
    content: review.content || review.body || review.text || '',
    createdAt: review.createdAt || review.created_at || review.date || new Date().toISOString(),
    verified: review.verified || review.verified_buyer || false,
    images: review.images || review.photos || [],
  };
}

/**
 * Calculate rating distribution for display
 * @param {Array} reviews - Array of review objects
 * @returns {Array} Rating distribution [5,4,3,2,1] with counts and percentages
 */
export function calculateRatingDistribution(reviews) {
  const total = reviews.length;
  return [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((r) => Math.floor(r.rating) === rating).length;
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return {rating, count, percentage};
  });
}

/**
 * Generate mock reviews for development/testing
 * @param {number} count - Number of reviews to generate
 * @returns {Array} Array of mock review objects
 */
export function generateMockReviews(count = 5) {
  const names = ['John D.', 'Sarah M.', 'Mike R.', 'Emily K.', 'David L.', 'Anna P.'];
  const titles = [
    'Excellent Product!',
    'Worth Every Penny',
    'Great Quality',
    'Highly Recommend',
    'Perfect Fit',
    'Amazing Purchase',
  ];
  const contents = [
    'This product exceeded my expectations. The quality is outstanding and it fits perfectly.',
    'I\'ve been using this for a few weeks now and I\'m very impressed with the durability.',
    'Exactly what I was looking for. Fast shipping and great customer service.',
    'The craftsmanship is excellent. You can tell this is a premium product.',
    'Very satisfied with this purchase. It performs better than similar products I\'ve tried.',
  ];

  return Array.from({length: count}, (_, i) => ({
    id: `mock-review-${i + 1}`,
    rating: Math.random() > 0.2 ? 5 : Math.floor(Math.random() * 2) + 3,
    author: names[Math.floor(Math.random() * names.length)],
    title: titles[Math.floor(Math.random() * titles.length)],
    content: contents[Math.floor(Math.random() * contents.length)],
    createdAt: new Date(
      Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    verified: Math.random() > 0.3,
    images: [],
  }));
}

/**
 * GraphQL fragment for fetching review metafields
 * Add this to your product queries
 */
export const PRODUCT_REVIEWS_FRAGMENT = `#graphql
  fragment ProductReviews on Product {
    metafields(identifiers: [
      {namespace: "reviews", key: "rating"},
      {namespace: "reviews", key: "count"},
      {namespace: "reviews", key: "data"},
      {namespace: "judgeme", key: "rating"},
      {namespace: "judgeme", key: "count"},
      {namespace: "judgeme", key: "reviews"}
    ]) {
      namespace
      key
      value
      type
    }
  }
`;
