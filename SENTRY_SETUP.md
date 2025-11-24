# Sentry Error Logging Setup Guide

This guide will help you set up Sentry error tracking for the Wingman Tactical Shopify theme.

## Prerequisites

- A Sentry account (sign up at https://sentry.io)
- Access to your Shopify Oxygen environment variables

## Installation

### 1. Install Sentry Packages

```bash
npm install @sentry/react @sentry/cloudflare
```

### 2. Create a Sentry Project

1. Log in to your Sentry account at https://sentry.io
2. Create a new project
3. Select "React" as the platform
4. Copy your DSN (Data Source Name) - it looks like: `https://xxx@xxx.ingest.sentry.io/xxx`

## Configuration

### 3. Add Environment Variables

#### Local Development (.env)

Add these variables to your `.env` file:

```bash
# Sentry Configuration
PUBLIC_SENTRY_DSN=https://your-dsn-here@sentry.ingest.io/your-project-id
PUBLIC_SENTRY_ENVIRONMENT=development
SENTRY_DSN=https://your-dsn-here@sentry.ingest.io/your-project-id
SENTRY_ENVIRONMENT=development
```

#### Production (Oxygen)

Add these environment variables to your Shopify Oxygen deployment:

```bash
# Client-side Sentry
PUBLIC_SENTRY_DSN=https://your-dsn-here@sentry.ingest.io/your-project-id
PUBLIC_SENTRY_ENVIRONMENT=production

# Server-side Sentry
SENTRY_DSN=https://your-dsn-here@sentry.ingest.io/your-project-id
SENTRY_ENVIRONMENT=production
```

You can add these via:
- Shopify Admin → Settings → Apps and sales channels → Hydrogen → Your storefront → Environment variables
- Or using the Shopify CLI: `npx shopify hydrogen env push`

## Features

### What's Tracked

#### Client-Side (Browser)
- Unhandled JavaScript errors
- React component errors (via Error Boundary)
- Failed network requests
- Performance monitoring (page load, navigation)
- Session replay for debugging (10% of sessions, 100% on error)

#### Server-Side (Oxygen/Cloudflare Workers)
- Server rendering errors
- GraphQL query errors
- API route errors
- Request context (URL, method, headers)

### Error Filtering

The Sentry configuration automatically filters out:
- Browser extension errors (`chrome-extension://`, `moz-extension://`)
- Common third-party script errors
- ResizeObserver loop errors (benign browser quirks)

## Usage

### Automatic Error Capture

Most errors are captured automatically without any code changes. Simply install the packages and set the environment variables.

### Manual Error Capture

You can also manually capture errors and messages:

```javascript
import { captureException, captureMessage, addBreadcrumb } from '~/lib/sentry.client';

// Capture an exception
try {
  // Your code
} catch (error) {
  captureException(error, { customContext: 'additional info' });
}

// Capture a message
captureMessage('Something important happened', 'warning');

// Add debugging breadcrumbs
addBreadcrumb({
  message: 'User clicked checkout button',
  category: 'user-action',
  level: 'info',
  data: { productId: '123', quantity: 2 }
});
```

### User Context

Track which users are experiencing errors:

```javascript
import { setUser, clearUser } from '~/lib/sentry.client';

// After user logs in
setUser({
  id: customer.id,
  email: customer.email,
});

// On logout
clearUser();
```

### Server-Side Usage

Errors in loaders and actions are automatically captured. For custom error handling:

```javascript
import { initSentry, captureException } from '~/lib/sentry.server';

export async function loader({ request, context }) {
  const sentry = initSentry(
    request,
    context.waitUntil,
    context.env.SENTRY_DSN,
    context.env.SENTRY_ENVIRONMENT
  );

  try {
    // Your code
  } catch (error) {
    captureException(sentry, error, {
      route: 'products.$handle',
      productHandle: params.handle
    });
    throw error;
  }
}
```

## Monitoring & Alerts

### Sentry Dashboard

Access your Sentry dashboard at https://sentry.io to:
- View error reports with stack traces
- See error frequency and trends
- Watch session replays to understand user experience
- Monitor performance metrics

### Setting Up Alerts

1. Go to Alerts in your Sentry project
2. Create alert rules for:
   - New issues (get notified immediately of new errors)
   - Error frequency spikes
   - Performance degradation
3. Configure notifications (email, Slack, etc.)

## Performance Monitoring

Sentry tracks:
- **Page Load Time**: How long it takes for pages to load
- **Route Changes**: Navigation performance in your SPA
- **API Calls**: GraphQL query performance
- **Server Response Time**: Oxygen worker execution time

### Tuning Performance Monitoring

In production, you may want to reduce the trace sample rate to save quota:

Edit `app/lib/sentry.client.js`:
```javascript
tracesSampleRate: 0.1, // 10% of transactions (already set)
```

## Troubleshooting

### Sentry Not Capturing Errors

1. **Check DSN**: Ensure `PUBLIC_SENTRY_DSN` and `SENTRY_DSN` are set correctly
2. **Check Console**: Look for Sentry initialization warnings in browser console
3. **Test Error**: Trigger a test error to verify Sentry is working:
   ```javascript
   // Add to any page temporarily
   throw new Error('Test Sentry Error');
   ```

### High Quota Usage

1. **Reduce trace sample rate**: Lower `tracesSampleRate` in both client and server configs
2. **Reduce replay sample rate**: Lower `replaysSessionSampleRate` in client config
3. **Add more filters**: Update `beforeSend` hook to filter out noise

### Environment Not Showing Correctly

Ensure `SENTRY_ENVIRONMENT` matches your actual environment:
- `development` for local dev
- `staging` for staging deployments
- `production` for live site

## Best Practices

1. **Don't Log Sensitive Data**: Sentry automatically masks PII, but be cautious with custom context
2. **Use Breadcrumbs**: Add breadcrumbs for important user actions to help debug errors
3. **Set Release Versions**: Tag errors with release versions to track regressions
4. **Monitor Release Health**: Use Sentry to track crash-free sessions per release
5. **Create Teams**: Assign different error types to different teams
6. **Set Up Integrations**: Connect Sentry to Slack, Jira, GitHub for better workflow

## Support

- Sentry Documentation: https://docs.sentry.io
- Sentry React Guide: https://docs.sentry.io/platforms/javascript/guides/react/
- Sentry Cloudflare Workers: https://docs.sentry.io/platforms/javascript/guides/cloudflare-workers/

## Files Modified

The following files have been modified to support Sentry:

- `app/lib/sentry.client.js` - Client-side Sentry configuration
- `app/lib/sentry.server.js` - Server-side Sentry configuration
- `app/entry.client.jsx` - Client entry point with Sentry initialization
- `app/entry.server.jsx` - Server entry point with Sentry error capture
- `app/root.jsx` - Environment variable exposure for client-side Sentry
- `package.json` - (needs update) Add @sentry/react and @sentry/cloudflare

## Next Steps

After installation:

1. Deploy to Oxygen with environment variables set
2. Trigger a test error to verify tracking
3. Set up Sentry alerts for your team
4. Monitor the dashboard for the first few days
5. Tune sample rates based on your quota usage
