/**
 * Sentry Client-Side Error Tracking
 *
 * Installation:
 * npm install @sentry/react
 *
 * Environment Variables (add to .env):
 * PUBLIC_SENTRY_DSN=your_sentry_dsn_here
 * PUBLIC_SENTRY_ENVIRONMENT=production (or development, staging)
 */

import * as Sentry from '@sentry/react';

/**
 * Initialize Sentry for client-side error tracking
 * @param {string} dsn - Sentry DSN from environment variables
 * @param {string} environment - Current environment (production, staging, development)
 */
export function initSentry(dsn, environment = 'production') {
  if (!dsn) {
    console.warn('Sentry DSN not provided. Error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn,
    environment,

    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // Recommended to lower this in production (e.g., 0.1 = 10%)
    tracesSampleRate: environment === 'production' ? 0.1 : 1.0,

    // Capture Replay for 10% of all sessions,
    // plus 100% of sessions with an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Integrations
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // Filter out certain errors
    beforeSend(event, hint) {
      // Filter out known third-party errors or noise
      const error = hint.originalException;

      if (error && typeof error === 'object' && 'message' in error) {
        const message = error.message;

        // Filter out browser extension errors
        if (
          message.includes('chrome-extension://') ||
          message.includes('moz-extension://')
        ) {
          return null;
        }

        // Filter out common third-party script errors
        if (
          message.includes('Script error') ||
          message.includes('ResizeObserver loop')
        ) {
          return null;
        }
      }

      return event;
    },

    // Add custom tags
    initialScope: {
      tags: {
        storefront: 'wingman-tactical',
      },
    },
  });
}

/**
 * Manually capture an exception
 * @param {Error} error
 * @param {object} context - Additional context
 */
export function captureException(error, context = {}) {
  Sentry.captureException(error, {
    contexts: {
      custom: context,
    },
  });
}

/**
 * Manually capture a message
 * @param {string} message
 * @param {'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug'} level
 */
export function captureMessage(message, level = 'info') {
  Sentry.captureMessage(message, level);
}

/**
 * Set user context for error tracking
 * @param {{id?: string, email?: string, username?: string}} user
 */
export function setUser(user) {
  Sentry.setUser(user);
}

/**
 * Clear user context (e.g., on logout)
 */
export function clearUser() {
  Sentry.setUser(null);
}

/**
 * Add breadcrumb for debugging
 * @param {{message: string, category?: string, level?: string, data?: object}} breadcrumb
 */
export function addBreadcrumb(breadcrumb) {
  Sentry.addBreadcrumb(breadcrumb);
}

/**
 * ErrorBoundary component from Sentry
 */
export const ErrorBoundary = Sentry.ErrorBoundary;

/**
 * withErrorBoundary HOC
 */
export const withErrorBoundary = Sentry.withErrorBoundary;
