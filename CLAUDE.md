# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Shopify Hydrogen** storefront built on **React Router 7.9.x** (not Remix). Hydrogen is Shopify's opinionated framework for building headless commerce storefronts, providing tools, utilities, and best practices for building dynamic and performant commerce applications. The storefront is deployed to **Shopify Oxygen**, a worker-based JavaScript runtime built on Cloudflare's open-source workerd.

**Critical**: This project uses React Router v7, not Remix. Always import from `react-router` packages, never from `@remix-run/*` or `react-router-dom`.

### Why Hydrogen + React Router 7?

As of May 2025, Shopify transitioned Hydrogen from Remix v2 to React Router 7 (framework mode), unlocking key benefits:
- **Route Module Type Safety**: Automatic generation of route-specific types for URL params, loader data, and action data
- **Middleware Support**: Run code before/after response generation for authentication, logging, error handling, and data preprocessing
- **Streaming-First APIs**: Native `defer()` streaming for faster Time to First Byte (TTFB) with non-critical data loading
- **Improved Performance**: Enhanced server-side rendering with client-side navigation optimizations
- **Better Developer Experience**: Config-based routing, improved debugging, and enhanced type inference

## Design Responsibility

**You (Claude Code) are responsible for designing this storefront.** Your primary focus is on creating an exceptional user experience through thoughtful design, visual hierarchy, and modern UI patterns.

### Design Philosophy & Best Practices

#### Visual Design Principles
- **Modern E-commerce Aesthetics**: Create clean, contemporary designs that build trust and drive conversions
- **Visual Hierarchy**: Use size, color, spacing, and typography to guide users through the shopping experience
- **Whitespace**: Embrace generous spacing to prevent visual clutter and improve content scannability
- **Consistency**: Maintain uniform spacing, border radius, shadows, and color usage across all components
- **Mobile-First**: Design for mobile experiences first, then enhance for larger screens

#### UI/UX Best Practices
- **Above-the-Fold Content**: Ensure critical information (hero sections, CTAs, key products) is immediately visible
- **Clear CTAs**: Make buttons and actions obvious with strong contrast and descriptive labels
- **Loading States**: Design skeleton screens, spinners, or content placeholders for all async data
- **Error States**: Create helpful, user-friendly error messages with clear recovery paths
- **Accessibility**: Ensure WCAG 2.1 AA compliance minimum (color contrast, focus states, ARIA labels, keyboard navigation)
- **Touch Targets**: Minimum 44x44px tap targets for mobile interfaces
- **Form Design**: Clear labels, helpful validation messages, logical tab order, visible focus states

#### E-commerce Specific Guidelines
- **Product Cards**: Include high-quality images, clear pricing, product titles, and quick-add functionality
- **Product Detail Pages**: Large, zoomable images, prominent pricing, clear variant selection, detailed descriptions
- **Cart Experience**: Inline editing, clear pricing breakdown, persistent cart indicator, easy checkout access
- **Navigation**: Intuitive menu structure, prominent search, clear category organization
- **Trust Signals**: Display security badges, return policies, customer reviews, and shipping information prominently
- **Urgency & Scarcity**: Use subtle indicators (limited stock, sale timers) without being manipulative
- **Responsive Images**: Use Shopify's Image component with proper sizing and lazy loading

#### Tailwind CSS v4 Usage
- Leverage Tailwind's utility classes for rapid, consistent styling
- Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) for adaptive layouts
- Create cohesive color schemes using Tailwind's color palette or custom theme colors
- Utilize Tailwind's typography plugin for beautiful text styling
- Apply transitions and animations for micro-interactions (`transition-*`, `hover:`, `focus:`, `group-hover:`)
- Use Tailwind's grid and flexbox utilities for complex layouts

#### Component Design Patterns
- **Reusable Components**: Design with composition in mind (buttons, cards, badges, inputs)
- **Component Variants**: Support different sizes, colors, and states (primary/secondary buttons, success/error badges)
- **Responsive Grids**: Product grids that adapt (1 column mobile, 2-3 tablet, 4+ desktop)
- **Interactive Feedback**: Hover effects, active states, disabled states, loading states
- **Progressive Enhancement**: Core functionality works without JavaScript; enhance with interactions

#### Performance & Core Web Vitals
- **Image Optimization**: Always use Shopify's Image component with appropriate sizes and formats
- **Lazy Loading**: Defer below-the-fold images and non-critical resources
- **Critical CSS**: Keep above-the-fold styles minimal for faster FCP
- **Minimize Layout Shift**: Reserve space for images and dynamic content to prevent CLS
- **Optimize Fonts**: Use font-display: swap and preload critical fonts

#### Design System Consistency
- Establish a consistent spacing scale (4px, 8px, 16px, 24px, 32px, 48px, 64px)
- Define a type scale (text-xs to text-5xl) and stick to it
- Use a limited color palette (primary, secondary, accent, neutrals, semantic colors)
- Maintain consistent border radius values across similar elements
- Apply shadows consistently (sm, md, lg) based on elevation hierarchy

### Design Deliverables
When designing or modifying components:
1. Consider the entire user flow, not just individual pages
2. Design for all states (empty, loading, error, success)
3. Ensure responsive behavior across all breakpoints
4. Test with real content (long product titles, missing images, etc.)
5. Validate accessibility (keyboard navigation, screen reader compatibility, color contrast)
6. Consider performance implications (image sizes, number of components, animation complexity)

## Development Commands

### Local Development
```bash
npm run dev              # Start development server with codegen
npm run preview          # Preview production build locally
```

### Build & Deploy
```bash
npm run build            # Build for production with codegen
```

### Code Quality
```bash
npm run lint             # Run ESLint
npm run codegen          # Generate GraphQL types and React Router types
```

### Environment Setup
- Environment variables are defined in `.env` for local development with MiniOxygen
- Use `npx shopify hydrogen link` to inject variables from your Shopify storefront
- Use `npx shopify hydrogen env pull` to populate `.env` from Shopify

## Architecture

### Framework Stack
- **React Router 7.9.x**: File-based routing with loader/action patterns
- **Shopify Hydrogen**: Storefront API client, analytics, caching utilities
- **Vite**: Build tool and dev server
- **Tailwind CSS v4**: Styling via `@tailwindcss/vite` plugin
- **Oxygen**: Deployment target (Cloudflare Workers)

### Critical Import Rule
**NEVER** use these imports:
- ❌ `@remix-run/react`
- ❌ `@remix-run/node`
- ❌ `react-router-dom`

**ALWAYS** use:
- ✅ `react-router` (for hooks, components, types)
- ✅ `@react-router/dev` (for dev tools)
- ✅ `@shopify/hydrogen` (for Hydrogen utilities)

See `.cursor/rules/hydrogen-react-router.mdc` for complete mapping.

### Request Flow

1. **Entry Point**: `server.js` exports Oxygen worker fetch handler
2. **Context Creation**: `app/lib/context.js` creates Hydrogen context with:
   - Storefront API client (GraphQL)
   - Customer Account API client
   - Cart management
   - Session handling
   - i18n configuration
3. **Server Rendering**: `app/entry.server.jsx` handles SSR with CSP
4. **Client Hydration**: `app/entry.client.jsx` hydrates React app
5. **Root Layout**: `app/root.jsx` provides:
   - Header/Footer queries (critical vs deferred data loading)
   - Analytics provider
   - Layout components
   - Error boundaries

### Data Loading Patterns

React Router 7 provides flexible data loading strategies. Choose the appropriate pattern based on your needs:

#### 1. Server-Side Rendering (SSR) - Recommended for SEO

```javascript
// loader runs on server for initial page load and subsequent client navigations
export async function loader({context}) {
  const {product} = await context.storefront.query(PRODUCT_QUERY, {
    cache: context.storefront.CacheLong(),
    variables: {handle: params.handle}
  });
  return {product};
}
```

**When to use**: Product pages, collection pages, content that needs SEO, data that benefits from server-side caching.

#### 2. Streaming with defer() - Best for TTFB Optimization

```javascript
// Critical data (blocks rendering)
async function loadCriticalData({context}) {
  const data = await context.storefront.query(QUERY);
  return data;
}

// Deferred data (loaded after initial render, streams to client)
function loadDeferredData({context}) {
  const data = context.storefront.query(QUERY)
    .catch(error => {
      console.error(error);
      return null; // Never throw in deferred loaders
    });
  return data;
}

export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  // Return deferred data as promises for streaming
  return defer({
    criticalData,
    deferredData // This streams to client after initial render
  });
}
```

**When to use**: Product pages with recommendations, CMS content, analytics data, any non-critical data that can load progressively. Use `<Suspense>` boundaries in components to handle loading states.

#### 3. Client-Side Data Loading

```javascript
// Runs only in the browser, not during SSR
export async function clientLoader({context}) {
  const data = await fetch('/api/user-preferences');
  return data.json();
}
```

**When to use**: User-specific data that doesn't need SSR, browser-only features, personalized content that shouldn't be cached server-side.

#### 4. Hybrid Approach (Server + Client)

```javascript
export async function loader({context}) {
  // SSR for initial page load
  return {products: await context.storefront.query(PRODUCTS_QUERY)};
}

export async function clientLoader({context, serverLoader}) {
  // On client navigation, fetch fresh data or use server data
  const serverData = await serverLoader();
  // Optionally refetch or augment with client-only data
  return serverData;
}
```

**When to use**: Progressive enhancement, optimistic UI updates, combining server and client data sources.

#### Best Practices for Data Loading

- **Prefer SSR for SEO**: Product and collection pages should use server loaders
- **Stream non-critical data**: Use `defer()` for recommendations, reviews, related products
- **Never throw in deferred loaders**: Always catch errors and return null/fallback data
- **Minimize over-fetching**: Query only the fields your components actually use
- **Use appropriate cache strategies**: `CacheLong()` for products, `CacheShort()` for inventory, `CacheNone()` for user data
- **Implement loading states**: Always provide `<Suspense>` boundaries for deferred data
- **Handle errors gracefully**: Export `ErrorBoundary` components for route-level error handling

### GraphQL Organization & Query Optimization

#### File Structure

- **Storefront API**: Queries defined inline in route files or `app/lib/fragments.js`
- **Customer Account API**: Separate queries in `app/graphql/customer-account/*.js`
- **Schema Configuration**: `.graphqlrc.js` defines two projects:
  - `default`: Storefront API queries
  - `customer`: Customer Account API queries
- **Type Generation**: Run `npm run codegen` to generate:
  - `storefrontapi.generated.d.ts`
  - `customer-accountapi.generated.d.ts`
  - React Router types in `.react-router/types/**/*`

#### Query Optimization Best Practices

**1. Avoid Fragment Bloat - Query Only What You Need**

Early Hydrogen versions included exported fragments from UI components, but these became bloated and slow. Shopify removed most fragment exports to encourage fine-tuned queries. Some routes saw load times cut in half after this change.

**❌ Bad - Over-fetching data:**
```graphql
query ProductCard {
  product(id: $id) {
    ...CompleteProductFragment  # Fetches 50+ fields you don't use
  }
}
```

**✅ Good - Selective data loading:**
```graphql
fragment ProductCard on Product {
  id
  title
  handle
  featuredImage {
    url
    altText
    width
    height
  }
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
}
```

**2. Component-Specific Fragments**

Create focused fragments for each component's exact needs:

```graphql
# For product grids - minimal data
fragment ProductCardMinimal on Product {
  id
  title
  handle
  featuredImage { url(transform: {maxWidth: 400}) }
  priceRange { minVariantPrice { amount currencyCode } }
}

# For product detail pages - comprehensive data
fragment ProductDetail on Product {
  id
  title
  handle
  description
  descriptionHtml
  vendor
  tags
  options { name values }
  variants(first: 100) {
    edges {
      node {
        id
        title
        availableForSale
        selectedOptions { name value }
        price { amount currencyCode }
      }
    }
  }
  images(first: 10) {
    edges {
      node {
        url(transform: {maxWidth: 1200})
        altText
        width
        height
      }
    }
  }
}
```

**3. Pagination Best Practices**

Use Hydrogen's `getPaginationVariables` utility for cursor-based pagination:

```javascript
import {getPaginationVariables} from '@shopify/hydrogen';

export async function loader({request, context}) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 24
  });

  const {collection} = await context.storefront.query(COLLECTION_QUERY, {
    variables: {
      handle: params.handle,
      ...paginationVariables
    }
  });
}
```

**4. Deferred Loading for Non-Critical Data**

Use GraphQL directives with deferred loading:

```javascript
function loadDeferredData({context, params}) {
  return context.storefront.query(RECOMMENDATIONS_QUERY, {
    variables: {productId: params.id},
    cache: context.storefront.CacheLong()
  }).catch(() => null);
}
```

**5. No Rate Limits - But Optimize Anyway**

The Storefront API has no rate limits, but optimized queries still improve:
- Faster response times and better TTFB
- Reduced bandwidth usage
- Lower server load on Oxygen workers
- Better user experience with quicker page loads

### Cart Management

Cart is managed via Hydrogen's built-in cart utilities:
- Initialized in context with `CART_QUERY_FRAGMENT` from `app/lib/fragments.js`
- Accessed via `context.cart.get()` in loaders
- Updated via cart action routes (`app/routes/cart*.jsx`)

### Customer Authentication

Customer accounts use Shopify's Customer Account API:
- Authorization flow: `app/routes/account_.authorize.jsx`
- Login: `app/routes/account_.login.jsx`
- Protected routes check `context.customerAccount.isLoggedIn()`
- Customer data queries in `app/graphql/customer-account/`

### Routing Structure

Routes are file-based in `app/routes/`:
- `_index.jsx` - Homepage
- `products.$handle.jsx` - Product detail pages (dynamic param)
- `collections.$handle.jsx` - Collection pages
- `account.jsx` - Account layout (requires auth)
- `account._index.jsx` - Account dashboard
- `account_.login.jsx` - Login (underscore = no layout)
- `[robots.txt].jsx` - Special routes with brackets for non-HTML responses

### Styling Approach

- **Tailwind CSS v4** configured via `@tailwindcss/vite` plugin
- Three CSS files in load order:
  1. `app/styles/tailwind.css` - Tailwind imports
  2. `app/styles/reset.css` - CSS reset
  3. `app/styles/app.css` - Custom styles
- Loaded in `app/root.jsx` Layout component (not in `links()` export due to HMR bug)

### Configuration Files

- `vite.config.js`: Vite plugins (Hydrogen, Oxygen, React Router, Tailwind, tsconfig-paths)
- `react-router.config.js`: Uses `hydrogenPreset()` for Oxygen-optimized settings
- `jsconfig.json`: Path aliases (`~/*` maps to `app/*`)
- `.graphqlrc.js`: GraphQL schema and document configuration

### Environment Variables

Required variables (see `.env`):
- `PUBLIC_STOREFRONT_ID` - Your Shopify storefront ID
- `PUBLIC_STOREFRONT_API_TOKEN` - Public Storefront API token
- `PUBLIC_STORE_DOMAIN` - Your myshopify.com domain
- `PRIVATE_STOREFRONT_API_TOKEN` - Private Storefront API token
- `PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID` - Customer Account API client
- `PUBLIC_CUSTOMER_ACCOUNT_API_URL` - Customer Account API endpoint
- `SESSION_SECRET` - Session encryption secret
- `SHOP_ID` - Numeric shop ID

## Common Patterns

### Adding a New Route
1. Create file in `app/routes/` following naming conventions
2. Export `loader` for data fetching (uses `context.storefront`)
3. Export `meta` for SEO metadata
4. Export default component for rendering
5. Run `npm run codegen` to update route types

### Querying Shopify
```javascript
const {products} = await context.storefront.query(QUERY, {
  cache: context.storefront.CacheLong(),
  variables: {handle: 'product-handle'}
});
```

### Using Customer Account API
```javascript
const {data} = await context.customerAccount.query(CUSTOMER_QUERY);
```

### Error Handling
- Route-level: Export `ErrorBoundary` component
- Root-level: `app/root.jsx` has global error boundary
- Deferred data: Always catch and return null, never throw

## Oxygen Runtime & Deployment

### Understanding Oxygen

Oxygen is Shopify's hosting platform for Hydrogen storefronts, built on Cloudflare's open-source **workerd** runtime (the same runtime that powers Cloudflare Workers). This provides:

- **Global Edge Network**: Deploy to 275+ Cloudflare data centers worldwide
- **Fast Cold Starts**: V8 isolates start in <5ms vs. traditional containers (100ms+)
- **Automatic Scaling**: Handles traffic spikes without configuration
- **Zero Server Management**: Fully managed infrastructure
- **Built-in CDN**: Automatic asset caching at the edge

### Worker Runtime Constraints

Oxygen runs in a **V8 isolate** environment with specific limitations:

**What Works:**
- Modern JavaScript (ES2022+)
- Web APIs (fetch, Request, Response, URL, etc.)
- Streaming responses
- KV storage (via Oxygen variables)
- GraphQL queries via Hydrogen client

**What Doesn't Work:**
- Node.js APIs (fs, path, crypto.randomBytes, etc.)
- Native modules or binaries
- Long-running processes (10-second execution limit)
- WebSockets (use Server-Sent Events instead)
- File system access

**Workarounds:**
```javascript
// ❌ Don't use Node.js crypto
import crypto from 'crypto';
const hash = crypto.randomBytes(16);

// ✅ Use Web Crypto API instead
const array = new Uint8Array(16);
crypto.getRandomValues(array);
```

### Deployment Best Practices

#### 1. Environment Variables

**Local Development (`.env`):**
```bash
PUBLIC_STOREFRONT_ID=gid://shopify/...
PUBLIC_STORE_DOMAIN=your-store.myshopify.com
SESSION_SECRET=local-dev-secret
```

**Production (Oxygen):**
```bash
# Link your Oxygen environment
npx shopify hydrogen link

# Pull production variables
npx shopify hydrogen env pull

# Deploy with environment variables
npx shopify hydrogen deploy
```

**Important**: Never commit `.env` files. Use `.env.example` for documentation.

#### 2. Build Optimization

```javascript
// vite.config.js
export default defineConfig({
  build: {
    target: 'es2022', // Modern syntax for smaller bundles
    minify: 'esbuild', // Faster builds
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code for better caching
          vendor: ['react', 'react-router'],
          hydrogen: ['@shopify/hydrogen'],
        }
      }
    }
  }
});
```

#### 3. Asset Optimization

**Images:**
```javascript
// Always use Shopify's Image component
import {Image} from '@shopify/hydrogen';

<Image
  data={product.featuredImage}
  sizes="(min-width: 768px) 50vw, 100vw"
  loading="lazy" // Below the fold
  // Or loading="eager" for above the fold
/>
```

**Fonts:**
```javascript
// Preload critical fonts in root loader
export function links() {
  return [
    {
      rel: 'preload',
      href: '/fonts/inter-var.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous'
    }
  ];
}
```

#### 4. Worker Limits

**Execution Time:** 10 seconds maximum
- Use `defer()` for slow operations
- Offload heavy computation to external APIs
- Implement timeouts for third-party requests

**Memory:** 128MB per request
- Avoid loading large data sets in memory
- Use streaming for large responses
- Paginate GraphQL queries

**Bundle Size:** <5MB recommended
- Code split by route (automatic with React Router)
- Tree-shake unused dependencies
- Avoid large libraries when smaller alternatives exist

### Monitoring & Debugging

#### Production Logs

```bash
# View deployment logs
npx shopify hydrogen logs

# Monitor real-time requests
npx shopify hydrogen logs --tail
```

#### Error Tracking

```javascript
// app/entry.server.jsx
export function handleError(error, {request}) {
  console.error('SSR Error:', {
    message: error.message,
    stack: error.stack,
    url: request.url,
  });

  // Send to error tracking service (Sentry, etc.)
  // if (process.env.SENTRY_DSN) {
  //   Sentry.captureException(error);
  // }
}
```

#### Performance Monitoring

```javascript
// Track Core Web Vitals
import {Analytics} from '@shopify/hydrogen';

<Analytics.Provider
  // Automatically tracks Web Vitals
  cart={cart}
  shop={shop}
/>
```

### Deployment Workflow

```bash
# 1. Test locally with MiniOxygen (mimics Oxygen runtime)
npm run dev

# 2. Build for production
npm run build

# 3. Preview production build locally
npm run preview

# 4. Deploy to Oxygen
npx shopify hydrogen deploy

# 5. Monitor deployment
npx shopify hydrogen logs --tail
```

### Alternative Deployment Options

While Oxygen is recommended, you can deploy Hydrogen to other platforms with modifications:

**Cloudflare Workers (Direct):**
- Requires custom adapter instead of `@shopify/oxygen`
- Similar runtime constraints (workerd)
- Manual configuration for environment variables

**Node.js Platforms (Vercel, Netlify):**
- Requires Node.js adapter
- Different runtime capabilities
- May lose some Oxygen optimizations

**Note**: Deploying outside Oxygen requires understanding platform-specific limitations and may not support all Hydrogen features out of the box.

## Testing & Debugging

- Development server runs on `localhost:3000` by default
- Preview server mimics production Oxygen environment
- Use browser DevTools for React Router DevTools integration
- GraphQL queries are logged in development mode

## Performance Optimizations

### Caching Strategies

Hydrogen provides built-in caching strategies optimized for Oxygen's edge runtime. Implement multi-level caching for optimal performance:

#### 1. Hydrogen Cache Strategies

```javascript
// Product data - changes infrequently (1 hour)
context.storefront.query(PRODUCT_QUERY, {
  cache: context.storefront.CacheLong()
});

// Inventory/availability - changes frequently (5 minutes)
context.storefront.query(INVENTORY_QUERY, {
  cache: context.storefront.CacheShort()
});

// User-specific/cart data - never cache
context.storefront.query(CART_QUERY, {
  cache: context.storefront.CacheNone()
});

// Custom cache strategy
context.storefront.query(QUERY, {
  cache: context.storefront.CacheCustom({
    mode: 'public',
    maxAge: 3600,
    staleWhileRevalidate: 86400
  })
});
```

**Cache Strategy Guidelines:**
- `CacheLong()`: Static content (products, collections, pages, blogs) - 1 hour cache
- `CacheShort()`: Semi-dynamic content (inventory, pricing) - 5 minutes cache
- `CacheNone()`: Dynamic/personal data (cart, customer info, checkout) - no cache
- `CacheCustom()`: Fine-grained control for specific use cases

#### 2. Multi-Level Caching Architecture

**Layer 1 - Oxygen Edge Cache (Automatic)**
- Oxygen automatically caches at Cloudflare's edge locations
- Respects cache headers from your loaders
- Geographic distribution for global performance

**Layer 2 - Server-Side Caching (Hydrogen)**
- In-memory caching in the worker runtime
- Shared across requests in the same edge location
- Configured via cache strategies above

**Layer 3 - Client-Side Caching (React Router)**
- React Router caches loader data during client-side navigation
- Use `shouldRevalidate` to control when data refetches
- Implement optimistic UI for instant perceived performance

**Layer 4 - Browser Cache (Optional)**
- Cache static assets (images, CSS, JS) via CDN
- Use Shopify's Image CDN for automatic optimization
- Set appropriate Cache-Control headers

#### 3. Cache Invalidation Patterns

```javascript
// In app/root.jsx - Prevent unnecessary refetches
export function shouldRevalidate({currentUrl, nextUrl, defaultShouldRevalidate}) {
  // Only revalidate on search param changes
  if (currentUrl.pathname === nextUrl.pathname) {
    return currentUrl.search !== nextUrl.search;
  }
  return defaultShouldRevalidate;
}
```

**Webhook-Based Cache Invalidation:**
- Set up Shopify webhooks for product updates, inventory changes
- Invalidate specific cache keys or entire collections
- Use cache tags for granular invalidation

#### 4. Additional Performance Optimizations

- **Critical/deferred data split**: Minimizes Time to First Byte (TTFB)
- **Streaming with defer()**: Progressive loading for faster perceived performance
- **SSR with selective bot handling**: Full render for bots via `isbot`, streaming for users
- **Image optimization**: Always use Shopify's Image component with responsive sizes
- **Code splitting**: React Router automatically splits code by route
- **Preloading**: Preload critical resources (fonts, hero images) in root loader
- **Resource hints**: Use `<link rel="preconnect">` for external domains

## Security Best Practices

### Content Security Policy (CSP)

A Content Security Policy adds critical security by mitigating cross-site scripting (XSS) and data injection attacks. Hydrogen provides built-in CSP support configured in `app/entry.server.jsx`.

#### Implementation

```javascript
import {createContentSecurityPolicy} from '@shopify/hydrogen';

export default async function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    // Add custom directives
    scriptSrc: [
      "'self'",
      "'unsafe-inline'", // Avoid if possible
      'https://cdn.shopify.com',
      'https://example-analytics.com',
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'", // Required for Tailwind in development
      'https://fonts.googleapis.com',
    ],
    imgSrc: [
      "'self'",
      'data:',
      'https://cdn.shopify.com',
    ],
    connectSrc: [
      "'self'",
      'https://*.shopify.com',
      'https://analytics.example.com',
    ],
    fontSrc: [
      "'self'",
      'https://fonts.gstatic.com',
    ],
  });

  // Set CSP header
  responseHeaders.set('Content-Security-Policy', header);

  // Wrap app in NonceProvider for third-party scripts
  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>
  );
}
```

#### CSP Best Practices

**1. Start with Report-Only Mode**
```javascript
responseHeaders.set('Content-Security-Policy-Report-Only', header);
```
Test thoroughly before enforcing to avoid breaking functionality.

**2. Minimize Permissiveness**
- Avoid `'unsafe-inline'` and `'unsafe-eval'` when possible
- Only whitelist necessary domains
- Use nonces for inline scripts instead of `'unsafe-inline'`

**3. Third-Party Integration**
When adding analytics, chat widgets, or other third-party tools:
```javascript
scriptSrc: [
  "'self'",
  (request, context) => `'nonce-${nonce}'`, // Use nonces for inline scripts
  'https://trusted-cdn.com',
],
```

**4. Monitor CSP Violations**
Set up CSP violation reporting to catch issues:
```javascript
reportUri: '/csp-violation-report',
```

### Authentication & Customer Accounts

#### Customer Account API Security

Shopify's Customer Account API has strict security requirements:
- **HTTPS Only**: No localhost authentication (use ngrok or similar for local development)
- **OAuth Flow**: Secure token-based authentication
- **Session Management**: Server-side session storage with encryption

#### Implementation Pattern

```javascript
// app/routes/account.jsx - Protected route layout
export async function loader({context}) {
  const {session} = context;

  // Check authentication status
  const isLoggedIn = await context.customerAccount.isLoggedIn();

  if (!isLoggedIn) {
    // Redirect to login
    const loginUrl = context.customerAccount.login({
      uiLocales: context.storefront.i18n.language
    });
    throw redirect(loginUrl);
  }

  // Fetch customer data
  const {data} = await context.customerAccount.query(CUSTOMER_QUERY);
  return {customer: data.customer};
}
```

#### Local Development with HTTPS

Customer Account API requires HTTPS. For local development:

**Option 1 - Using ngrok:**
```bash
ngrok http 3000
# Update Shopify app settings with ngrok URL
```

**Option 2 - Using Cloudflare Tunnel:**
```bash
cloudflared tunnel --url http://localhost:3000
```

Update your `.env` with the HTTPS URL:
```
PUBLIC_CUSTOMER_ACCOUNT_API_URL=https://your-tunnel-url.ngrok-free.app
```

#### Session Security

```javascript
// In app/lib/context.js
const session = await HydrogenSession.init(request, [
  process.env.SESSION_SECRET
]);

// Use strong session secrets (32+ characters)
SESSION_SECRET=your-secure-random-string-min-32-chars
```

**Best Practices:**
- Rotate session secrets regularly
- Use environment-specific secrets (dev, staging, production)
- Never commit secrets to version control
- Use Shopify CLI to manage production secrets: `npx shopify hydrogen env pull`

### Additional Security Measures

**1. Rate Limiting**
While Storefront API has no limits, implement rate limiting for:
- Form submissions
- Customer account actions
- Cart operations

**2. Input Validation**
- Validate all form inputs server-side
- Sanitize user-generated content before rendering
- Use Shopify's built-in sanitization for product descriptions

**3. CORS Configuration**
```javascript
// Restrict origins in production
responseHeaders.set('Access-Control-Allow-Origin', 'https://yourdomain.com');
```

**4. Security Headers**
```javascript
responseHeaders.set('X-Content-Type-Options', 'nosniff');
responseHeaders.set('X-Frame-Options', 'DENY');
responseHeaders.set('X-XSS-Protection', '1; mode=block');
responseHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');
```

## Analytics & Customer Privacy

### Privacy Compliance

Hydrogen integrates with Shopify's Customer Privacy API for GDPR, CCPA, and other privacy law compliance.

#### Implementation

```javascript
// In app/root.jsx
import {Analytics} from '@shopify/hydrogen';

export default function App() {
  return (
    <html>
      <body>
        <Analytics.Provider
          cart={data.cart}
          shop={data.shop}
          consent={{
            // Enable Shopify's cookie banner
            withPrivacyBanner: true,

            // Check privacy settings before tracking
            checkoutDomain: data.shop.checkoutDomain,
            storefrontAccessToken: context.env.PUBLIC_STOREFRONT_API_TOKEN,
          }}
        >
          <Outlet />
        </Analytics.Provider>
      </body>
    </html>
  );
}
```

#### Consent Management

The Analytics component automatically:
- Checks for user consent before firing events
- Loads Shopify's Customer Privacy API
- Displays cookie banner when `withPrivacyBanner: true`
- Respects user consent preferences

**Custom Consent Handling:**
```javascript
import {useAnalytics} from '@shopify/hydrogen';

function TrackingComponent() {
  const {canTrack, subscribe} = useAnalytics();

  useEffect(() => {
    if (canTrack()) {
      // Fire analytics events only after consent
      subscribe('page_viewed', {page: 'product'});
    }
  }, [canTrack, subscribe]);
}
```

#### Privacy Best Practices

**1. Required Disclosures**
- Maintain a privacy policy (`/policies/privacy-policy`)
- Disclose what data you collect and why
- Explain third-party integrations (analytics, marketing tools)

**2. User Rights**
- Allow users to view their data
- Implement data deletion requests
- Provide opt-out mechanisms

**3. Third-Party Compliance**
When integrating third-party analytics:
```javascript
consent={{
  withPrivacyBanner: true,
  // Only load after consent
  onReady: () => {
    if (window.customerPrivacy?.analyticsProcessingAllowed()) {
      // Load Google Analytics, Meta Pixel, etc.
    }
  }
}}
```

**4. Data Minimization**
- Only collect necessary data
- Don't track personally identifiable information (PII) without consent
- Use aggregated analytics when possible

### Analytics Events

```javascript
import {Analytics} from '@shopify/hydrogen';

// Track page views (automatic)
<Analytics.Provider> {/* Automatically tracks page_viewed */}

// Track product views
<Analytics.ProductView product={product} />

// Track add to cart
<Analytics.CartView cart={cart} />

// Custom events
const {publish} = useAnalytics();
publish('custom_event', {
  eventData: 'value'
});
```

## Common Pitfalls & Solutions

### 1. Import Errors - Remix vs React Router

**❌ Common Mistake:**
```javascript
import {useLoaderData} from '@remix-run/react';
import {json} from '@remix-run/node';
import {Link} from 'react-router-dom';
```

**✅ Correct Approach:**
```javascript
import {useLoaderData, json, Link} from 'react-router';
```

**Why**: React Router 7 consolidates all imports into a single package. Using old Remix imports will cause runtime errors.

### 2. Over-fetching GraphQL Data

**❌ Common Mistake:**
```graphql
query ProductPage {
  product(id: $id) {
    # Fetching all possible fields
    id
    title
    description
    descriptionHtml
    vendor
    productType
    tags
    collections { ... }
    metafields { ... }
    # ... 40+ more fields you don't use
  }
}
```

**✅ Correct Approach:**
```graphql
query ProductPage {
  product(id: $id) {
    id
    title
    descriptionHtml  # Only what the page actually displays
    featuredImage {
      url(transform: {maxWidth: 1200})
      altText
    }
    variants(first: 100) {
      edges {
        node {
          id
          price { amount currencyCode }
          availableForSale
        }
      }
    }
  }
}
```

### 3. Throwing Errors in Deferred Loaders

**❌ Common Mistake:**
```javascript
function loadDeferredData({context}) {
  // This will crash if the query fails
  return context.storefront.query(RECOMMENDATIONS_QUERY);
}
```

**✅ Correct Approach:**
```javascript
function loadDeferredData({context}) {
  return context.storefront.query(RECOMMENDATIONS_QUERY)
    .catch((error) => {
      console.error('Failed to load recommendations:', error);
      return null; // Always return fallback, never throw
    });
}
```

### 4. Incorrect Cache Strategy Usage

**❌ Common Mistake:**
```javascript
// Caching cart data (user-specific!)
const cart = await context.storefront.query(CART_QUERY, {
  cache: context.storefront.CacheLong()
});

// Not caching product data (static!)
const product = await context.storefront.query(PRODUCT_QUERY, {
  cache: context.storefront.CacheNone()
});
```

**✅ Correct Approach:**
```javascript
// Never cache user-specific data
const cart = await context.storefront.query(CART_QUERY, {
  cache: context.storefront.CacheNone()
});

// Always cache static product data
const product = await context.storefront.query(PRODUCT_QUERY, {
  cache: context.storefront.CacheLong()
});
```

### 5. Missing Suspense Boundaries for Deferred Data

**❌ Common Mistake:**
```javascript
export default function ProductPage() {
  const {product, recommendations} = useLoaderData();

  // Will crash if recommendations is still loading
  return (
    <div>
      <ProductDetail product={product} />
      <RecommendedProducts products={recommendations.products} />
    </div>
  );
}
```

**✅ Correct Approach:**
```javascript
import {Suspense} from 'react';
import {Await} from 'react-router';

export default function ProductPage() {
  const {product, recommendations} = useLoaderData();

  return (
    <div>
      <ProductDetail product={product} />
      <Suspense fallback={<RecommendationsSkeleton />}>
        <Await resolve={recommendations}>
          {(data) => <RecommendedProducts products={data?.products || []} />}
        </Await>
      </Suspense>
    </div>
  );
}
```

### 6. Node.js APIs in Oxygen Runtime

**❌ Common Mistake:**
```javascript
import fs from 'fs';
import path from 'path';

export async function loader() {
  // These don't exist in V8 isolates!
  const data = fs.readFileSync(path.join(__dirname, 'data.json'));
  return json(data);
}
```

**✅ Correct Approach:**
```javascript
// Use fetch for external data
export async function loader({context}) {
  const response = await fetch('https://api.example.com/data.json');
  const data = await response.json();
  return {data};
}

// Or query from Shopify
export async function loader({context}) {
  const {metaobject} = await context.storefront.query(METAOBJECT_QUERY);
  return {data: metaobject};
}
```

### 7. Not Handling Image Loading States

**❌ Common Mistake:**
```javascript
<Image
  data={product.featuredImage}
  // No sizes specified - loads full resolution
  // No loading strategy - blocks rendering
/>
```

**✅ Correct Approach:**
```javascript
<Image
  data={product.featuredImage}
  sizes="(min-width: 768px) 50vw, 100vw"
  loading={isAboveFold ? "eager" : "lazy"}
  aspectRatio="1/1"
/>
```

### 8. Missing Error Boundaries

**❌ Common Mistake:**
```javascript
// No error handling - entire app crashes on errors
export default function ProductPage() {
  const {product} = useLoaderData();
  return <ProductDetail product={product} />;
}
```

**✅ Correct Approach:**
```javascript
export default function ProductPage() {
  const {product} = useLoaderData();
  return <ProductDetail product={product} />;
}

// Export ErrorBoundary for graceful error handling
export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <ProductNotFound />;
  }

  return <ErrorPage error={error} />;
}
```

## Migration Guide: Remix → React Router 7

If migrating an existing Hydrogen project from Remix to React Router 7:

### Step 1: Update Future Flags (If on Remix)

```javascript
// remix.config.js or vite.config.js
export default {
  future: {
    v3_fetcherPersist: true,
    v3_relativeSplatPath: true,
    v3_throwAbortReason: true,
    v3_singleFetch: true,
    v3_lazyRouteDiscovery: true,
  }
};
```

### Step 2: Run Upgrade Command

```bash
npx shopify hydrogen upgrade
```

This will:
- Update dependencies to React Router 7
- Migrate config files
- Update import statements
- Generate migration guides

### Step 3: Update Imports Across Codebase

**Find and replace across all files:**
- `@remix-run/react` → `react-router`
- `@remix-run/node` → `react-router`
- `react-router-dom` → `react-router`

### Step 4: Update Configuration

**Old (Remix):**
```javascript
// remix.config.js
export default {
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  // ...
};
```

**New (React Router 7):**
```javascript
// react-router.config.js
import {hydrogenPreset} from '@shopify/hydrogen';

export default {
  ...hydrogenPreset()
};
```

### Step 5: Test Thoroughly

- Run `npm run dev` and test all routes
- Check for console errors (especially import errors)
- Test data loading (loaders, actions, defer)
- Verify form submissions still work
- Test error boundaries
- Check production build: `npm run build && npm run preview`

## Key Dependencies

- `@shopify/hydrogen` - Core Hydrogen framework
- `react-router` - Routing framework (v7.9.2)
- `@react-router/dev` - Development tools
- `@shopify/mini-oxygen` - Local Oxygen environment
- `graphql` + `graphql-tag` - GraphQL utilities
- `tailwindcss` v4 - Styling framework
- `isbot` - Bot detection for SSR optimization

## Quick Reference

### Most Common Commands

```bash
# Development
npm run dev                    # Start dev server with codegen
npm run codegen                # Generate GraphQL and route types

# Building & Testing
npm run build                  # Production build
npm run preview                # Preview production build locally

# Deployment
npx shopify hydrogen link      # Link to Oxygen environment
npx shopify hydrogen env pull  # Pull environment variables
npx shopify hydrogen deploy    # Deploy to Oxygen
npx shopify hydrogen logs      # View deployment logs

# Linting
npm run lint                   # Run ESLint
```

### Essential Import Patterns

```javascript
// Routing & Data Loading (ALWAYS use react-router, NEVER @remix-run/*)
import {
  useLoaderData,
  useActionData,
  useFetcher,
  useNavigate,
  useSearchParams,
  Link,
  Form,
  defer,
  redirect,
  json,
} from 'react-router';

// Hydrogen Utilities
import {
  Image,
  Money,
  Analytics,
  getPaginationVariables,
  Seo,
} from '@shopify/hydrogen';

// Suspense for Deferred Data
import {Suspense} from 'react';
import {Await} from 'react-router';
```

### Data Loading Patterns Cheat Sheet

```javascript
// SSR Loader (most common)
export async function loader({params, context}) {
  const {product} = await context.storefront.query(QUERY, {
    cache: context.storefront.CacheLong(),
    variables: {handle: params.handle}
  });
  return {product};
}

// Streaming with Defer
export async function loader({context}) {
  const critical = await loadCritical(context);
  const deferred = loadDeferred(context).catch(() => null);
  return defer({critical, deferred});
}

// Client Loader
export async function clientLoader({params}) {
  const data = await fetch(`/api/data/${params.id}`);
  return data.json();
}

// Form Action
export async function action({request, context}) {
  const formData = await request.formData();
  const result = await context.cart.addLine({/*...*/});
  return redirect('/cart');
}
```

### Cache Strategy Quick Guide

```javascript
// Static content (1 hour) - Products, Collections, Pages
cache: context.storefront.CacheLong()

// Semi-dynamic (5 min) - Inventory, Pricing, Popular Products
cache: context.storefront.CacheShort()

// Dynamic/Personal (no cache) - Cart, Customer Data, Checkout
cache: context.storefront.CacheNone()

// Custom
cache: context.storefront.CacheCustom({
  mode: 'public',
  maxAge: 3600,
  staleWhileRevalidate: 86400
})
```

### GraphQL Query Best Practices

```graphql
# ✅ Good - Minimal data, responsive images
fragment ProductCard on Product {
  id
  title
  handle
  featuredImage {
    url(transform: {maxWidth: 400})
    altText
  }
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
}

# ❌ Bad - Over-fetching, full resolution images
fragment ProductCard on Product {
  ...CompleteProductFragment  # Don't use pre-built fragments
  images(first: 250) {        # Don't fetch more than needed
    url                        # Don't fetch full resolution
  }
}
```

### Security Checklist

- [ ] CSP configured in `app/entry.server.jsx`
- [ ] No `'unsafe-inline'` or `'unsafe-eval'` in production CSP
- [ ] Strong `SESSION_SECRET` (32+ characters)
- [ ] Environment variables not committed to git
- [ ] Customer Account API uses HTTPS (ngrok for local dev)
- [ ] Input validation on all form actions
- [ ] Error boundaries on all routes
- [ ] Analytics consent implemented (`withPrivacyBanner: true`)

### Performance Checklist

- [ ] Use `CacheLong()` for static product data
- [ ] Use `CacheNone()` for user-specific data
- [ ] Implement `defer()` for non-critical data
- [ ] Add `<Suspense>` boundaries for deferred data
- [ ] Use Shopify `<Image>` component with `sizes` prop
- [ ] Set `loading="lazy"` for below-fold images
- [ ] Preload critical fonts
- [ ] Export `ErrorBoundary` on all routes
- [ ] Implement `shouldRevalidate` to prevent unnecessary fetches
- [ ] Keep GraphQL queries minimal (only needed fields)

### Common File Paths

```
app/
├── routes/               # File-based routes
├── components/           # Reusable components
├── lib/
│   ├── context.js       # Hydrogen context setup
│   └── fragments.js     # Shared GraphQL fragments
├── graphql/
│   └── customer-account/ # Customer API queries
├── styles/
│   ├── tailwind.css     # Tailwind imports
│   ├── reset.css        # CSS reset
│   └── app.css          # Custom styles
├── entry.server.jsx     # SSR entry + CSP
├── entry.client.jsx     # Client hydration
└── root.jsx             # Root layout + analytics

Configuration Files:
├── vite.config.js       # Vite + plugins
├── react-router.config.js # React Router config
├── .graphqlrc.js        # GraphQL schemas
├── jsconfig.json        # Path aliases
└── .env                 # Environment variables (not committed)
```

---

## Additional Resources

- [Hydrogen Documentation](https://hydrogen.shopify.dev/updates)
- [React Router 7 Guide](https://reactrouter.com/start/framework/data-loading)
- [Storefront API Reference](https://shopify.dev/docs/api/storefront/latest)
- [Oxygen Runtime Guide](https://shopify.dev/docs/storefronts/headless/hydrogen/deployments/oxygen-runtime)
- [Shopify Hydrogen GitHub](https://github.com/Shopify/hydrogen)

### Sources

Research for this document was compiled from:
- [Hydrogen Updates](https://hydrogen.shopify.dev/updates)
- [Shopify Engineering Blog - How We Built Hydrogen](https://shopify.engineering/how-we-built-hydrogen)
- [React Router Data Loading Guide](https://reactrouter.com/start/framework/data-loading)
- [Shopify Storefront API Performance Best Practices](https://www.xaicode.com/blog/the-shopify-storefront-api-bottleneck-5-workarounds-every-dev-needs-to-know)
- [Hydrogen Caching Documentation](https://shopify.dev/docs/storefronts/headless/hydrogen/caching)
- [Content Security Policy Guide](https://shopify.dev/docs/storefronts/headless/hydrogen/content-security-policy)
- [Hydrogen Analytics and Privacy](https://shopify.dev/docs/storefronts/headless/hydrogen/analytics/consent)
- [Oxygen Runtime Architecture](https://shopify.dev/docs/storefronts/headless/hydrogen/deployments/oxygen-runtime)