// Virtual entry point for the app
import {storefrontRedirect} from '@shopify/hydrogen';
import {createRequestHandler} from '@shopify/hydrogen/oxygen';
import {createHydrogenRouterContext} from '~/lib/context';

/**
 * Determines the appropriate cache control header based on the request URL
 *
 * CACHE BUSTING STRATEGY:
 * -----------------------
 * 1. /assets/* files: These are built by Vite with automatic hash fingerprinting
 *    (e.g., app-D7nF8kLx.js). Safe to cache for 1 year with "immutable".
 *
 * 2. /public/* files: These DON'T get automatic versioning. Two approaches:
 *    a) Manual versioning: Add ?v=123 query strings when referencing files
 *    b) Rename files when updated: hero-video-v2.mp4
 *    c) Use shorter cache (1 week) to allow updates without breaking cache
 *
 * 3. HTML pages: Use short cache with stale-while-revalidate for better UX
 *
 * @param {URL} url - The request URL
 * @param {number} status - The response status code
 * @returns {string} Cache-Control header value
 */
function getCacheControl(url, status) {
  const {pathname} = url;

  // Don't cache error responses
  if (status !== 200) {
    return 'no-store';
  }

  // Static assets - cache for 1 year (immutable for versioned assets)
  // Vite automatically adds hashes to built assets (e.g., app-D7nF8kLx.js)
  if (pathname.startsWith('/assets/')) {
    return 'public, max-age=31536000, immutable';
  }

  // Public folder static files - cache for 1 week
  // These don't have automatic versioning, so use shorter cache
  // To improve cache busting for /public/ files, consider:
  // - Adding query strings: <img src="/logo.png?v=2" />
  // - Renaming files on updates: logo-v2.png
  if (
    pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico|woff|woff2|ttf|eot|mp4|webm)$/i)
  ) {
    return 'public, max-age=604800, stale-while-revalidate=2592000';
  }

  // No cache for user-specific pages
  if (pathname.startsWith('/account')) {
    return 'private, no-store';
  }

  // No cache for cart
  if (pathname.startsWith('/cart')) {
    return 'private, no-cache, must-revalidate';
  }

  // Product pages - cache for 1 hour with stale-while-revalidate
  if (pathname.startsWith('/products/')) {
    return 'public, max-age=3600, stale-while-revalidate=86400';
  }

  // Collection pages - cache for 30 minutes with stale-while-revalidate
  if (pathname.startsWith('/collections/')) {
    return 'public, max-age=1800, stale-while-revalidate=86400';
  }

  // Search pages - cache for 15 minutes
  if (pathname.startsWith('/search')) {
    return 'public, max-age=900, stale-while-revalidate=3600';
  }

  // API routes - no cache
  if (pathname.startsWith('/api/')) {
    return 'private, no-cache';
  }

  // Homepage - cache for 10 minutes with stale-while-revalidate
  if (pathname === '/') {
    return 'public, max-age=600, stale-while-revalidate=3600';
  }

  // Default for all other pages - cache for 5 minutes
  return 'public, max-age=300, stale-while-revalidate=1800';
}

/**
 * Export a fetch handler in module format.
 */
export default {
  /**
   * @param {Request} request
   * @param {Env} env
   * @param {ExecutionContext} executionContext
   * @return {Promise<Response>}
   */
  async fetch(request, env, executionContext) {
    try {
      const hydrogenContext = await createHydrogenRouterContext(
        request,
        env,
        executionContext,
      );

      /**
       * Create a Remix request handler and pass
       * Hydrogen's Storefront client to the loader context.
       */
      const handleRequest = createRequestHandler({
        // eslint-disable-next-line import/no-unresolved
        build: await import('virtual:react-router/server-build'),
        mode: process.env.NODE_ENV,
        getLoadContext: () => hydrogenContext,
      });

      const response = await handleRequest(request);

      if (hydrogenContext.session.isPending) {
        response.headers.set(
          'Set-Cookie',
          await hydrogenContext.session.commit(),
        );
      }

      if (response.status === 404) {
        /**
         * Check for redirects only when there's a 404 from the app.
         * If the redirect doesn't exist, then `storefrontRedirect`
         * will pass through the 404 response.
         */
        return storefrontRedirect({
          request,
          response,
          storefront: hydrogenContext.storefront,
        });
      }

      // Apply cache control headers
      const url = new URL(request.url);
      const cacheControl = getCacheControl(url, response.status);
      response.headers.set('Cache-Control', cacheControl);

      // Add Vary header for better CDN caching
      // This tells CDN to cache different versions based on Accept-Language
      if (!response.headers.has('Vary')) {
        response.headers.set('Vary', 'Accept-Language');
      }

      // Add CDN-specific cache control for Oxygen/Cloudflare edge caching
      // This allows longer edge cache while keeping shorter browser cache
      if (response.status === 200 && !url.pathname.startsWith('/account') && !url.pathname.startsWith('/cart')) {
        // Cache on CDN for longer than browser cache
        response.headers.set('CDN-Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
      }

      // Remove deprecated/unnecessary security headers
      // X-XSS-Protection is deprecated and can introduce vulnerabilities
      // CSP (Content-Security-Policy) already handles XSS protection
      response.headers.delete('X-XSS-Protection');

      return response;
    } catch (error) {
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};
