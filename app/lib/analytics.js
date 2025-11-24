/**
 * Custom Analytics Events
 * Extends Shopify Hydrogen's built-in analytics with custom event tracking
 *
 * These events can be sent to:
 * - Shopify Analytics
 * - Google Analytics 4
 * - Meta Pixel
 * - Custom analytics platforms
 */

/**
 * Send a custom analytics event
 * @param {string} eventName - Name of the event
 * @param {object} eventData - Event properties
 */
export function trackEvent(eventName, eventData = {}) {
  // Send to Shopify Analytics (if available)
  if (typeof window !== 'undefined' && window.Shopify?.analytics) {
    window.Shopify.analytics.publish(eventName, eventData);
  }

  // Send to Google Analytics 4 (if available)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventData);
  }

  // Send to Meta Pixel (if available)
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, eventData);
  }

  // Console log in development
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.log('[Analytics]', eventName, eventData);
  }
}

// ===== Search Events =====

/**
 * Track search query
 * @param {string} query - Search query
 * @param {number} resultsCount - Number of results returned
 */
export function trackSearch(query, resultsCount = 0) {
  trackEvent('search', {
    search_term: query,
    results_count: resultsCount,
  });
}

/**
 * Track predictive search interaction
 * @param {string} query - Search query
 * @param {string} resultType - Type of result clicked (product, collection, page)
 * @param {string} resultId - ID of clicked result
 */
export function trackPredictiveSearchClick(query, resultType, resultId) {
  trackEvent('predictive_search_click', {
    search_term: query,
    result_type: resultType,
    result_id: resultId,
  });
}

// ===== Product Events =====

/**
 * Track product filtering
 * @param {object} filters - Active filters
 */
export function trackProductFilter(filters) {
  trackEvent('product_filter', {
    filters: JSON.stringify(filters),
  });
}

/**
 * Track product sorting
 * @param {string} sortOption - Selected sort option
 */
export function trackProductSort(sortOption) {
  trackEvent('product_sort', {
    sort_option: sortOption,
  });
}

/**
 * Track product quick view
 * @param {string} productId - Product ID
 * @param {string} productTitle - Product title
 */
export function trackProductQuickView(productId, productTitle) {
  trackEvent('product_quick_view', {
    product_id: productId,
    product_title: productTitle,
  });
}

/**
 * Track product image zoom
 * @param {string} productId - Product ID
 */
export function trackProductImageZoom(productId) {
  trackEvent('product_image_zoom', {
    product_id: productId,
  });
}

/**
 * Track variant selection
 * @param {string} productId - Product ID
 * @param {string} variantId - Variant ID
 * @param {object} selectedOptions - Selected options (size, color, etc.)
 */
export function trackVariantChange(productId, variantId, selectedOptions) {
  trackEvent('variant_change', {
    product_id: productId,
    variant_id: variantId,
    selected_options: JSON.stringify(selectedOptions),
  });
}

// ===== Wishlist Events =====

/**
 * Track add to wishlist
 * @param {string} productId - Product ID
 * @param {string} productTitle - Product title
 * @param {number} price - Product price
 */
export function trackAddToWishlist(productId, productTitle, price) {
  trackEvent('add_to_wishlist', {
    product_id: productId,
    product_title: productTitle,
    value: price,
    currency: 'USD',
  });
}

/**
 * Track remove from wishlist
 * @param {string} productId - Product ID
 */
export function trackRemoveFromWishlist(productId) {
  trackEvent('remove_from_wishlist', {
    product_id: productId,
  });
}

// ===== Compare Events =====

/**
 * Track add to comparison
 * @param {string} productId - Product ID
 * @param {string} productTitle - Product title
 */
export function trackAddToCompare(productId, productTitle) {
  trackEvent('add_to_compare', {
    product_id: productId,
    product_title: productTitle,
  });
}

/**
 * Track remove from comparison
 * @param {string} productId - Product ID
 */
export function trackRemoveFromCompare(productId) {
  trackEvent('remove_from_compare', {
    product_id: productId,
  });
}

/**
 * Track comparison view
 * @param {Array<string>} productIds - Array of product IDs being compared
 */
export function trackCompareView(productIds) {
  trackEvent('compare_view', {
    product_ids: productIds.join(','),
    product_count: productIds.length,
  });
}

// ===== Newsletter Events =====

/**
 * Track newsletter signup
 * @param {string} location - Where the signup occurred (footer, popup, etc.)
 * @param {boolean} success - Whether signup was successful
 */
export function trackNewsletterSignup(location, success = true) {
  trackEvent('newsletter_signup', {
    location,
    success,
  });
}

// ===== Exit Intent Events =====

/**
 * Track exit intent popup view
 */
export function trackExitIntentView() {
  trackEvent('exit_intent_view', {});
}

/**
 * Track exit intent popup interaction
 * @param {string} action - Action taken (signup, close, dismiss)
 */
export function trackExitIntentAction(action) {
  trackEvent('exit_intent_action', {
    action,
  });
}

// ===== Navigation Events =====

/**
 * Track menu interaction
 * @param {string} menuItem - Menu item clicked
 * @param {string} menuType - Type of menu (header, footer, mobile)
 */
export function trackMenuClick(menuItem, menuType) {
  trackEvent('menu_click', {
    menu_item: menuItem,
    menu_type: menuType,
  });
}

/**
 * Track breadcrumb click
 * @param {string} breadcrumb - Breadcrumb item clicked
 */
export function trackBreadcrumbClick(breadcrumb) {
  trackEvent('breadcrumb_click', {
    breadcrumb,
  });
}

// ===== Content Interaction Events =====

/**
 * Track tab change
 * @param {string} tabName - Name of the tab
 * @param {string} location - Where the tab is (product page, etc.)
 */
export function trackTabChange(tabName, location) {
  trackEvent('tab_change', {
    tab_name: tabName,
    location,
  });
}

/**
 * Track accordion toggle
 * @param {string} accordionTitle - Title of accordion item
 * @param {boolean} isOpen - Whether accordion is being opened or closed
 */
export function trackAccordionToggle(accordionTitle, isOpen) {
  trackEvent('accordion_toggle', {
    accordion_title: accordionTitle,
    action: isOpen ? 'open' : 'close',
  });
}

/**
 * Track video play
 * @param {string} videoUrl - Video URL
 * @param {string} location - Where the video is located
 */
export function trackVideoPlay(videoUrl, location) {
  trackEvent('video_play', {
    video_url: videoUrl,
    location,
  });
}

// ===== Social Events =====

/**
 * Track social share
 * @param {string} platform - Social platform (facebook, twitter, etc.)
 * @param {string} contentType - Type of content shared (product, article, etc.)
 * @param {string} contentId - ID of shared content
 */
export function trackSocialShare(platform, contentType, contentId) {
  trackEvent('social_share', {
    platform,
    content_type: contentType,
    content_id: contentId,
  });
}

/**
 * Track social follow
 * @param {string} platform - Social platform
 */
export function trackSocialFollow(platform) {
  trackEvent('social_follow', {
    platform,
  });
}

// ===== Error Events =====

/**
 * Track user-facing errors
 * @param {string} errorType - Type of error (form_validation, api_error, etc.)
 * @param {string} errorMessage - Error message shown to user
 * @param {string} location - Where error occurred
 */
export function trackUserError(errorType, errorMessage, location) {
  trackEvent('user_error', {
    error_type: errorType,
    error_message: errorMessage,
    location,
  });
}

// ===== Engagement Events =====

/**
 * Track time on page
 * @param {string} pageType - Type of page (product, collection, etc.)
 * @param {number} timeSeconds - Time spent in seconds
 */
export function trackTimeOnPage(pageType, timeSeconds) {
  trackEvent('time_on_page', {
    page_type: pageType,
    time_seconds: timeSeconds,
  });
}

/**
 * Track scroll depth
 * @param {number} percentage - Scroll depth percentage (25, 50, 75, 100)
 * @param {string} pageType - Type of page
 */
export function trackScrollDepth(percentage, pageType) {
  trackEvent('scroll_depth', {
    percentage,
    page_type: pageType,
  });
}

// ===== Checkout Events =====

/**
 * Track checkout start
 * @param {number} cartTotal - Total cart value
 * @param {number} itemCount - Number of items in cart
 */
export function trackCheckoutStart(cartTotal, itemCount) {
  trackEvent('begin_checkout', {
    value: cartTotal,
    currency: 'USD',
    items_count: itemCount,
  });
}

/**
 * Track promo code application
 * @param {string} promoCode - Promo code used
 * @param {boolean} success - Whether code was valid
 */
export function trackPromoCode(promoCode, success) {
  trackEvent('promo_code', {
    promo_code: promoCode,
    success,
  });
}

// ===== Review Events =====

/**
 * Track review submission
 * @param {string} productId - Product ID
 * @param {number} rating - Star rating
 */
export function trackReviewSubmit(productId, rating) {
  trackEvent('review_submit', {
    product_id: productId,
    rating,
  });
}

/**
 * Track review helpfulness vote
 * @param {string} reviewId - Review ID
 * @param {boolean} helpful - Whether marked as helpful
 */
export function trackReviewVote(reviewId, helpful) {
  trackEvent('review_vote', {
    review_id: reviewId,
    helpful,
  });
}
