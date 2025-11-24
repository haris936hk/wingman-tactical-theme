/**
 * Sentry Server-Side Error Tracking (Oxygen/Cloudflare Workers)
 *
 * Installation:
 * npm install @sentry/cloudflare
 *
 * Environment Variables (add to Oxygen environment):
 * SENTRY_DSN=your_sentry_dsn_here
 * SENTRY_ENVIRONMENT=production (or development, staging)
 */

import {Toucan} from '@sentry/cloudflare';

/**
 * Initialize Sentry for server-side error tracking in Oxygen/Cloudflare Workers
 * @param {Request} request
 * @param {ExecutionContext} ctx
 * @param {string} dsn
 * @param {string} environment
 * @returns {Toucan}
 */
export function initSentry(request, ctx, dsn, environment = 'production') {
  if (!dsn) {
    console.warn('Sentry DSN not provided. Server error tracking disabled.');
    return null;
  }

  const sentry = new Toucan({
    dsn,
    environment,
    context: ctx,
    request,

    // Performance monitoring
    tracesSampleRate: environment === 'production' ? 0.1 : 1.0,

    // Add custom tags
    initialScope: {
      tags: {
        storefront: 'wingman-tactical',
        runtime: 'oxygen',
      },
    },

    // beforeSend hook to filter errors
    beforeSend(event) {
      // Filter out certain errors if needed
      return event;
    },
  });

  return sentry;
}

/**
 * Capture exception with server-side Sentry
 * @param {Toucan} sentry
 * @param {Error} error
 * @param {object} context
 */
export function captureException(sentry, error, context = {}) {
  if (!sentry) {
    console.error('Sentry not initialized:', error);
    return;
  }

  sentry.captureException(error, {
    contexts: {
      custom: context,
    },
  });
}

/**
 * Capture message with server-side Sentry
 * @param {Toucan} sentry
 * @param {string} message
 * @param {'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug'} level
 */
export function captureMessage(sentry, message, level = 'info') {
  if (!sentry) {
    console.warn('Sentry not initialized. Message:', message);
    return;
  }

  sentry.captureMessage(message, level);
}

/**
 * Set user context
 * @param {Toucan} sentry
 * @param {{id?: string, email?: string}} user
 */
export function setUser(sentry, user) {
  if (!sentry) return;

  sentry.setUser(user);
}

/**
 * Add breadcrumb for debugging
 * @param {Toucan} sentry
 * @param {{message: string, category?: string, level?: string, data?: object}} breadcrumb
 */
export function addBreadcrumb(sentry, breadcrumb) {
  if (!sentry) return;

  sentry.addBreadcrumb(breadcrumb);
}

/**
 * Wrap route handlers with Sentry error tracking
 * @param {Toucan} sentry
 * @param {Function} handler
 * @returns {Function}
 */
export function withSentry(sentry, handler) {
  return async (...args) => {
    try {
      return await handler(...args);
    } catch (error) {
      captureException(sentry, error, {
        handler: handler.name,
      });
      throw error; // Re-throw to let the application handle it
    }
  };
}
