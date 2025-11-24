import {useState} from 'react';
import {ReviewStars} from './ReviewStars';

/**
 * ProductReviews Component - Display product reviews with statistics
 * @param {{
 *   reviews?: Array<Review>;
 *   averageRating?: number;
 *   totalReviews?: number;
 *   productId?: string;
 * }}
 */
export function ProductReviews({
  reviews = [],
  averageRating = 0,
  totalReviews = 0,
  productId,
}) {
  const [sortBy, setSortBy] = useState('newest');
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((r) => Math.floor(r.rating) === rating).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return {rating, count, percentage};
  });

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'newest':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return (
    <section className="py-12 border-t border-[#FF0000]">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Section Header */}
        <h2
          className="text-3xl lg:text-4xl font-bold uppercase text-white mb-8"
          style={{
            fontFamily: 'var(--font-family-shock)',
            textShadow: '0 0 10px rgba(255, 0, 0, 0.6)',
          }}
        >
          Customer Reviews
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left: Review Summary */}
          <div className="lg:col-span-1">
            <ReviewSummary
              averageRating={averageRating}
              totalReviews={totalReviews}
              ratingDistribution={ratingDistribution}
            />

            {/* Write a Review Button */}
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="w-full mt-6 px-6 py-3 bg-[#FF0000] text-white font-bold uppercase
                rounded-lg hover:bg-[#CC0000] transition-all duration-300
                shadow-[0_0_15px_rgba(255,0,0,0.5)] hover:shadow-[0_0_25px_rgba(255,0,0,0.7)]
                motion-safe:hover:scale-105"
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          </div>

          {/* Right: Reviews List */}
          <div className="lg:col-span-2">
            {/* Review Form */}
            {showReviewForm && (
              <ReviewForm
                productId={productId}
                onClose={() => setShowReviewForm(false)}
              />
            )}

            {/* Sort Dropdown */}
            {reviews.length > 0 && (
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-200 text-sm">
                  Showing {sortedReviews.length} {sortedReviews.length === 1 ? 'review' : 'reviews'}
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-black border-2 border-white/30 rounded-lg
                    text-white focus:outline-none focus:border-[#FF0000] transition-colors"
                >
                  <option value="newest">Newest First</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                </select>
              </div>
            )}

            {/* Reviews List */}
            {sortedReviews.length > 0 ? (
              <div className="space-y-6">
                {sortedReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <EmptyReviews />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * ReviewSummary Component - Display rating statistics
 */
function ReviewSummary({averageRating, totalReviews, ratingDistribution}) {
  return (
    <div className="bg-black/50 border-2 border-[#FF0000]/30 rounded-lg p-6">
      {/* Average Rating */}
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-white mb-2">
          {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
        </div>
        <ReviewStars
          rating={averageRating}
          showCount={false}
          size="lg"
          showRating={false}
        />
        <p className="text-gray-200 text-sm mt-2">
          Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
        </p>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-2">
        {ratingDistribution.map(({rating, count, percentage}) => (
          <div key={rating} className="flex items-center gap-3">
            <span className="text-sm text-white font-medium w-8">
              {rating} ★
            </span>
            <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FF0000] transition-all duration-300"
                style={{width: `${percentage}%`}}
              />
            </div>
            <span className="text-sm text-gray-200 w-8 text-right">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * ReviewCard Component - Individual review display
 */
function ReviewCard({review}) {
  const date = new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-black/50 border-2 border-white/30 rounded-lg p-6
      hover:border-[#FF0000]/50 transition-colors">
      {/* Review Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <ReviewStars rating={review.rating} showCount={false} size="sm" />
          <h3 className="text-white font-bold mt-2">{review.author}</h3>
          <p className="text-gray-200 text-sm">{date}</p>
        </div>

        {review.verified && (
          <span className="text-xs font-bold uppercase px-3 py-1 bg-[#FF0000] text-white rounded">
            Verified Purchase
          </span>
        )}
      </div>

      {/* Review Title */}
      {review.title && (
        <h4 className="text-white font-bold text-lg mb-2">{review.title}</h4>
      )}

      {/* Review Content */}
      <p className="text-gray-200 leading-relaxed">{review.content}</p>

      {/* Review Images (if any) */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mt-4">
          {review.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Review ${index + 1}`}
              className="w-20 h-20 object-cover rounded border-2 border-white/30
                hover:border-[#FF0000] transition-colors cursor-pointer"
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * ReviewForm Component - Submit a new review
 */
function ReviewForm({productId, onClose}) {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div className="bg-black/50 border-2 border-[#FF0000]/30 rounded-lg p-6 mb-8">
      <h3 className="text-xl font-bold text-white mb-4">Write Your Review</h3>

      <form className="space-y-4">
        {/* Rating Input */}
        <div>
          <label className="block text-white font-bold mb-2">
            Rating <span className="text-[#FF0000]">*</span>
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center
                  focus:outline-none focus:ring-2 focus:ring-[#FF0000] rounded"
              >
                <svg
                  className={`w-8 h-8 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? 'text-[#FF0000]'
                      : 'text-gray-600'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Name Input */}
        <div>
          <label htmlFor="review-name" className="block text-white font-bold mb-2">
            Name <span className="text-[#FF0000]">*</span>
          </label>
          <input
            id="review-name"
            type="text"
            required
            className="w-full px-4 py-3 bg-black border-2 border-white/30 rounded-lg
              text-white placeholder-gray-400
              focus:outline-none focus:border-[#FF0000] transition-colors"
            placeholder="Your name"
          />
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="review-email" className="block text-white font-bold mb-2">
            Email <span className="text-[#FF0000]">*</span>
          </label>
          <input
            id="review-email"
            type="email"
            required
            className="w-full px-4 py-3 bg-black border-2 border-white/30 rounded-lg
              text-white placeholder-gray-400
              focus:outline-none focus:border-[#FF0000] transition-colors"
            placeholder="your@email.com"
          />
        </div>

        {/* Review Title */}
        <div>
          <label htmlFor="review-title" className="block text-white font-bold mb-2">
            Review Title
          </label>
          <input
            id="review-title"
            type="text"
            className="w-full px-4 py-3 bg-black border-2 border-white/30 rounded-lg
              text-white placeholder-gray-400
              focus:outline-none focus:border-[#FF0000] transition-colors"
            placeholder="Give your review a title"
          />
        </div>

        {/* Review Content */}
        <div>
          <label htmlFor="review-content" className="block text-white font-bold mb-2">
            Your Review <span className="text-[#FF0000]">*</span>
          </label>
          <textarea
            id="review-content"
            required
            rows={5}
            className="w-full px-4 py-3 bg-black border-2 border-white/30 rounded-lg
              text-white placeholder-gray-400
              focus:outline-none focus:border-[#FF0000] transition-colors resize-none"
            placeholder="Share your experience with this product..."
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-[#FF0000] text-white font-bold uppercase
              rounded-lg hover:bg-[#CC0000] transition-all duration-300
              shadow-[0_0_15px_rgba(255,0,0,0.5)] hover:shadow-[0_0_25px_rgba(255,0,0,0.7)]"
          >
            Submit Review
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-transparent text-white font-bold uppercase
              border-2 border-white/30 rounded-lg hover:border-[#FF0000] transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * EmptyReviews Component - Displayed when no reviews exist
 */
function EmptyReviews() {
  return (
    <div className="text-center py-12">
      <svg
        className="w-16 h-16 text-gray-600 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
      <h3 className="text-xl font-bold text-white mb-2">No Reviews Yet</h3>
      <p className="text-gray-200">
        Be the first to review this product and help others make informed decisions!
      </p>
    </div>
  );
}

/**
 * @typedef {{
 *   id: string;
 *   rating: number;
 *   author: string;
 *   title?: string;
 *   content: string;
 *   createdAt: string;
 *   verified?: boolean;
 *   images?: string[];
 * }} Review
 */
