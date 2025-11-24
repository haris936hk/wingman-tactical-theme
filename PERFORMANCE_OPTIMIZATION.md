# Performance Testing & Optimization Guide

This document provides comprehensive performance testing procedures, optimization strategies, and best practices for the Wingman Tactical Shopify Hydrogen theme.

## Quick Stats

- **Target Load Time**: < 2.5 seconds (LCP)
- **Target Performance Score**: 90+ (Lighthouse)
- **Framework**: React Router 7 + Shopify Hydrogen
- **Deployment**: Shopify Oxygen (Cloudflare Workers)
- **Last Updated**: January 2025

---

## Core Web Vitals Targets

Google's Core Web Vitals are the key metrics for measuring user experience:

| Metric | Abbreviation | Good | Needs Improvement | Poor | Current |
|--------|--------------|------|-------------------|------|---------|
| **Largest Contentful Paint** | LCP | ≤ 2.5s | 2.5s - 4.0s | > 4.0s | _____ |
| **First Input Delay** | FID | ≤ 100ms | 100ms - 300ms | > 300ms | _____ |
| **Cumulative Layout Shift** | CLS | ≤ 0.1 | 0.1 - 0.25 | > 0.25 | _____ |
| **Interaction to Next Paint** | INP | ≤ 200ms | 200ms - 500ms | > 500ms | _____ |

### Additional Key Metrics

| Metric | Target | Description |
|--------|--------|-------------|
| **First Contentful Paint (FCP)** | < 1.8s | Time until first text/image appears |
| **Time to Interactive (TTI)** | < 3.8s | Time until page is fully interactive |
| **Total Blocking Time (TBT)** | < 200ms | Time main thread is blocked |
| **Speed Index** | < 3.4s | How quickly content is visually displayed |
| **Time to First Byte (TTFB)** | < 600ms | Server response time |

---

## Performance Testing Tools

### 1. **Lighthouse** (Chrome DevTools)

**How to Run**:
```bash
# From Chrome DevTools
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Check "Performance", "Accessibility", "Best Practices", "SEO"
4. Select "Desktop" or "Mobile"
5. Click "Analyze page load"

# From Command Line
npx lighthouse https://wingmantactical.com --view
npx lighthouse https://wingmantactical.com --output html --output-path report.html

# Specific device emulation
npx lighthouse https://wingmantactical.com --preset=desktop
npx lighthouse https://wingmantactical.com --preset=mobile
```

**Key Reports to Review**:
- Performance score (target: 90+)
- Opportunities (suggestions for improvement)
- Diagnostics (potential issues)
- Passed audits (verification)

---

### 2. **WebPageTest**

**URL**: https://www.webpagetest.org

**Configuration**:
- Test Location: Choose location nearest to your target audience
- Browser: Chrome, Firefox, Safari (iOS)
- Connection: Cable, 4G, 3G (test slower connections)
- Number of Runs: 3-5 for average results

**Key Metrics**:
- First Byte Time (TTFB)
- Start Render
- Speed Index
- Largest Contentful Paint
- Total Blocking Time
- Waterfall chart (request timeline)

---

### 3. **Chrome DevTools Performance Panel**

**How to Use**:
```
1. Open DevTools → Performance tab
2. Click Record button (or Cmd/Ctrl + Shift + E)
3. Perform actions (page load, scrolling, interactions)
4. Stop recording
5. Analyze flame chart, bottom-up, call tree
```

**What to Look For**:
- Long tasks (> 50ms) on main thread
- Layout thrashing (forced reflows)
- JavaScript execution time
- Rendering bottlenecks
- Memory leaks

---

### 4. **React DevTools Profiler**

**How to Use**:
```jsx
import { Profiler } from 'react';

function onRenderCallback(
  id, // component being profiled
  phase, // "mount" or "update"
  actualDuration, // time spent rendering
  baseDuration, // estimated time without memoization
  startTime, // when React began rendering
  commitTime // when React committed the update
) {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);
}

export default function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <YourComponents />
    </Profiler>
  );
}
```

**React DevTools Extension**:
- Install React DevTools browser extension
- Go to Profiler tab
- Click record button
- Perform actions
- Analyze component render times

---

### 5. **Bundle Analyzer**

**For Hydrogen/Vite**:
```bash
npm install -D rollup-plugin-visualizer

# Add to vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    // ... other plugins
    visualizer({
      filename: './dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});

# Run build to generate bundle analysis
npm run build
```

**What to Look For**:
- Large dependencies (can they be replaced?)
- Duplicate code (can it be deduplicated?)
- Unused code (can it be tree-shaken?)
- Code splitting opportunities

---

## Image Optimization

### Current Status

**Shopify Images**:
- Shopify serves images via Shopify CDN
- Hydrogen's `<Image>` component automatically optimizes
- Supports WebP and AVIF formats
- Lazy loading built-in

### Best Practices

#### 1. **Use Hydrogen's Image Component**

```jsx
import { Image } from '@shopify/hydrogen';

<Image
  data={product.featuredImage}
  sizes="(min-width: 1024px) 50vw, 100vw"
  loading="lazy" // or "eager" for above-fold images
  alt={product.title}
/>
```

**Why**: Automatic srcset generation, format optimization, lazy loading

#### 2. **Specify Correct Sizes**

```jsx
// Product card in grid (desktop 4 columns)
<Image
  data={product.featuredImage}
  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
/>

// Hero image (full width)
<Image
  data={heroImage}
  sizes="100vw"
  loading="eager" // Above fold = eager loading
/>

// Product detail (2-column layout)
<Image
  data={product.featuredImage}
  sizes="(min-width: 1024px) 50vw, 100vw"
/>
```

**Why**: Browser downloads correctly-sized image, saving bandwidth

#### 3. **Optimize Above-Fold Images**

```jsx
// Hero section - load immediately
<Image
  data={heroImage}
  loading="eager"
  fetchpriority="high"
  sizes="100vw"
/>

// Below-fold images - lazy load
<Image
  data={productImage}
  loading="lazy"
  sizes="(min-width: 1024px) 25vw, 50vw"
/>
```

**Why**: Improves LCP by prioritizing critical images

#### 4. **Avoid Layout Shift**

```jsx
// Reserve space for image with aspect ratio
<div className="relative" style={{ aspectRatio: '4/3' }}>
  <Image
    data={product.featuredImage}
    className="absolute inset-0 w-full h-full object-cover"
    sizes="(min-width: 1024px) 25vw, 50vw"
  />
</div>
```

**Why**: Prevents CLS by reserving space before image loads

---

## JavaScript Optimization

### 1. **Code Splitting**

Hydrogen/React Router automatically code-splits by route. Ensure you're taking advantage:

```jsx
// ✅ Good: Each route is a separate chunk
export default function ProductPage() {
  return <ProductDetails />;
}

// ❌ Bad: Importing heavy library at top level
import heavyLibrary from 'heavy-library'; // Loaded for all routes

// ✅ Good: Dynamic import when needed
async function handleAction() {
  const { heavyFunction } = await import('heavy-library');
  heavyFunction();
}
```

### 2. **Lazy Loading Components**

```jsx
import { lazy, Suspense } from 'react';

// Lazy load non-critical components
const ProductReviews = lazy(() => import('~/components/ProductReviews'));
const ProductRecommendations = lazy(() => import('~/components/ProductRecommendations'));

export default function ProductPage() {
  return (
    <div>
      {/* Critical content loads immediately */}
      <ProductDetails />

      {/* Reviews lazy loaded */}
      <Suspense fallback={<SkeletonReviews />}>
        <ProductReviews />
      </Suspense>

      {/* Recommendations lazy loaded */}
      <Suspense fallback={<SkeletonProductGrid count={4} />}>
        <ProductRecommendations />
      </Suspense>
    </div>
  );
}
```

**When to Lazy Load**:
- Product reviews (below the fold)
- Product recommendations (below the fold)
- Modals/drawers (only when opened)
- Heavy third-party widgets

**When NOT to Lazy Load**:
- Above-fold content
- Navigation components
- Critical product information

### 3. **Memoization**

```jsx
import { useMemo, memo } from 'react';

// Memoize expensive calculations
function ProductGrid({ products, filters }) {
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Expensive filtering logic
      return matchesFilters(product, filters);
    });
  }, [products, filters]); // Only recalculate when these change

  return <div>{/* Render filteredProducts */}</div>;
}

// Memoize components that don't change often
const ProductCard = memo(function ProductCard({ product }) {
  return (
    <div>
      <Image data={product.featuredImage} />
      <h3>{product.title}</h3>
      <ProductPrice price={product.price} />
    </div>
  );
});
```

### 4. **Debouncing and Throttling**

```jsx
import { useState, useCallback } from 'react';

// Debounce search input
function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearch = useCallback(
    debounce((value) => {
      // Perform search
      fetch(`/api/search?q=${value}`);
    }, 300),
    []
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return <input value={searchTerm} onChange={handleChange} />;
}

// Utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
```

---

## CSS Optimization

### 1. **Tailwind CSS Purging**

Tailwind v4 automatically purges unused styles in production. Ensure your config is correct:

```javascript
// vite.config.js
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    // Vite automatically tree-shakes unused CSS in production
  ],
});
```

**Verify Purging**:
```bash
npm run build
# Check dist/assets/*.css file size
# Should be < 50KB after gzip
```

### 2. **Critical CSS**

Hydrogen handles this automatically via SSR. Ensure critical styles are loaded:

```jsx
// app/root.jsx
export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        {/* Critical CSS is inlined automatically */}
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
```

### 3. **Avoid Expensive CSS**

```css
/* ❌ Bad: Expensive selectors */
div > div > div > a {
  color: red;
}

* {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

/* ✅ Good: Simple class selectors */
.product-link {
  color: red;
}

.card {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
```

### 4. **Use CSS Containment**

```css
/* Optimize rendering performance */
.product-card {
  contain: layout style paint;
}

.blog-post {
  contain: layout;
}
```

---

## GraphQL Query Optimization

### 1. **Request Only What You Need**

```graphql
# ❌ Bad: Requesting too much data
query Product($handle: String!) {
  product(handle: $handle) {
    id
    title
    description
    descriptionHtml
    vendor
    productType
    tags
    collections(first: 250) {
      nodes {
        id
        title
        handle
        description
        image {
          url
          altText
        }
      }
    }
    variants(first: 250) {
      nodes {
        id
        title
        price {
          amount
          currencyCode
        }
        # ... 20 more fields
      }
    }
  }
}

# ✅ Good: Request only needed fields
query Product($handle: String!) {
  product(handle: $handle) {
    id
    title
    description
    featuredImage {
      url
      altText
      width
      height
    }
    variants(first: 10) {
      nodes {
        id
        title
        price {
          amount
          currencyCode
        }
        availableForSale
      }
    }
  }
}
```

### 2. **Use GraphQL Fragments**

```javascript
// app/lib/fragments.js
export const PRODUCT_CARD_FRAGMENT = `#graphql
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
`;

// app/routes/collections.$handle.jsx
import { PRODUCT_CARD_FRAGMENT } from '~/lib/fragments';

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query Collection($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      products(first: $first) {
        nodes {
          ...ProductCard
        }
      }
    }
  }
`;
```

**Why**: Reusable, consistent, avoids over-fetching

### 3. **Implement Pagination**

```javascript
// ✅ Good: Load products in chunks
const PRODUCTS_PER_PAGE = 24;

export async function loader({ request, context, params }) {
  const url = new URL(request.url);
  const cursor = url.searchParams.get('cursor');

  const { collection } = await context.storefront.query(COLLECTION_QUERY, {
    variables: {
      handle: params.handle,
      first: PRODUCTS_PER_PAGE,
      after: cursor,
    },
  });

  return { collection };
}
```

### 4. **Use Proper Caching**

```javascript
// app/routes/products.$handle.jsx
export async function loader({ params, context }) {
  const { product } = await context.storefront.query(PRODUCT_QUERY, {
    variables: { handle: params.handle },
    cache: context.storefront.CacheLong(), // ✅ Cache product data
  });

  return { product };
}

// app/routes/cart.jsx
export async function loader({ context }) {
  const cart = await context.cart.get();
  // ❌ Don't cache cart data - it's user-specific
  return { cart };
}
```

**Caching Strategies**:
- `CacheLong()` - 1 hour (products, collections, static pages)
- `CacheShort()` - 1 minute (frequently changing data)
- `CacheNone()` - No cache (user-specific data like cart, account)

---

## Server-Side Rendering (SSR) Optimization

### 1. **Critical vs Deferred Data**

```javascript
// app/routes/products.$handle.jsx

// Load critical data first (blocks rendering)
async function loadCriticalData({ params, context }) {
  const { product } = await context.storefront.query(PRODUCT_QUERY, {
    variables: { handle: params.handle },
    cache: context.storefront.CacheLong(),
  });

  if (!product) {
    throw new Response('Product Not Found', { status: 404 });
  }

  return { product };
}

// Load deferred data (doesn't block rendering)
function loadDeferredData({ params, context }) {
  const recommendations = context.storefront
    .query(RECOMMENDATIONS_QUERY, {
      variables: { productId: params.handle },
      cache: context.storefront.CacheLong(),
    })
    .catch((error) => {
      console.error('Failed to load recommendations:', error);
      return null; // Never throw in deferred data
    });

  return { recommendations };
}

export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return {
    ...criticalData,
    ...deferredData,
  };
}

// Component uses Suspense for deferred data
export default function ProductPage() {
  const { product, recommendations } = useLoaderData();

  return (
    <div>
      {/* Critical content renders immediately */}
      <ProductDetails product={product} />

      {/* Deferred content streams in */}
      <Suspense fallback={<SkeletonProductGrid count={4} />}>
        <Await resolve={recommendations}>
          {(data) => <ProductRecommendations products={data?.products} />}
        </Await>
      </Suspense>
    </div>
  );
}
```

### 2. **Avoid Blocking the Main Thread**

```javascript
// ❌ Bad: Heavy computation in loader blocks response
export async function loader({ params, context }) {
  const { products } = await context.storefront.query(PRODUCTS_QUERY);

  // This blocks the response
  const processedProducts = products.map((product) => {
    return expensiveProcessing(product); // Takes 500ms per product
  });

  return { processedProducts };
}

// ✅ Good: Move heavy processing to client-side
export async function loader({ params, context }) {
  const { products } = await context.storefront.query(PRODUCTS_QUERY);
  return { products }; // Send raw data quickly
}

export default function ProductsPage() {
  const { products } = useLoaderData();

  // Process on client side, optionally with useMemo
  const processedProducts = useMemo(() => {
    return products.map(expensiveProcessing);
  }, [products]);

  return <ProductGrid products={processedProducts} />;
}
```

---

## Network Optimization

### 1. **HTTP/2 and HTTP/3**

Shopify Oxygen (Cloudflare Workers) automatically uses HTTP/2 and HTTP/3.

**Benefits**:
- Multiplexing (multiple requests over single connection)
- Header compression
- Server push (not widely used)

**No Action Required** - handled by Oxygen platform

### 2. **Preconnect to Required Origins**

```jsx
// app/root.jsx
export function links() {
  return [
    // Preconnect to Shopify CDN
    { rel: 'preconnect', href: 'https://cdn.shopify.com' },
    // Preconnect to Google Fonts (if using)
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  ];
}
```

### 3. **Resource Hints**

```jsx
// Preload critical assets
export function links() {
  return [
    // Preload critical fonts
    {
      rel: 'preload',
      href: '/fonts/impact.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
    // Preload hero image
    {
      rel: 'preload',
      href: '/images/hero.webp',
      as: 'image',
      type: 'image/webp',
    },
  ];
}
```

---

## Third-Party Script Optimization

### 1. **Defer Non-Critical Scripts**

```jsx
// app/root.jsx
export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Layout>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />

        {/* Defer third-party scripts */}
        <script defer src="https://analytics.example.com/script.js" />
        <script defer src="https://cdn.example.com/widget.js" />
      </body>
    </html>
  );
}
```

### 2. **Use Façades for Heavy Embeds**

```jsx
// YouTube embed façade
function YouTubeEmbed({ videoId }) {
  const [showPlayer, setShowPlayer] = useState(false);

  if (!showPlayer) {
    // Show thumbnail with play button
    return (
      <div
        className="relative cursor-pointer"
        onClick={() => setShowPlayer(true)}
      >
        <img
          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
          alt="Video thumbnail"
        />
        <button className="absolute inset-0 flex items-center justify-center">
          ▶ Play Video
        </button>
      </div>
    );
  }

  // Load actual YouTube player only when clicked
  return (
    <iframe
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
      allow="autoplay; encrypted-media"
      allowFullScreen
    />
  );
}
```

**Why**: Saves 500KB+ by not loading YouTube's JavaScript until needed

---

## Performance Monitoring

### 1. **Real User Monitoring (RUM)**

**Google Analytics 4** - Already tracks Core Web Vitals

```javascript
// app/root.jsx - Hydrogen Analytics already configured
import {Analytics} from '@shopify/hydrogen';

export default function App() {
  return (
    <html lang="en">
      <body>
        <Analytics.Provider
          cart={data.cart}
          shop={data.shop}
          customData={{...}}
        >
          {/* Your app */}
        </Analytics.Provider>
      </body>
    </html>
  );
}
```

**View Core Web Vitals in GA4**:
1. Go to Reports → Engagement → Events
2. Filter by event name: `web_vitals`
3. View LCP, FID, CLS metrics by page

### 2. **Shopify Analytics**

Shopify automatically tracks:
- Page load times
- Server response times
- Cart conversion rates
- Checkout performance

**Access**:
1. Shopify Admin → Analytics → Reports
2. View "Online Store Speed" report

### 3. **Custom Performance Monitoring**

```javascript
// app/entry.client.jsx
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { RemixBrowser } from '@remix-run/react';

// Log Core Web Vitals
function sendToAnalytics({ name, delta, value, id }) {
  // Send to your analytics service
  console.log(`${name}: ${value} (delta: ${delta})`);

  // Example: Send to Google Analytics
  if (window.gtag) {
    window.gtag('event', name, {
      event_category: 'Web Vitals',
      value: Math.round(name === 'CLS' ? delta * 1000 : delta),
      event_label: id,
      non_interaction: true,
    });
  }
}

// Measure Core Web Vitals
if (typeof window !== 'undefined') {
  import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
    onCLS(sendToAnalytics);
    onFID(sendToAnalytics);
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
    onINP(sendToAnalytics);
  });
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );
});
```

---

## Performance Budget

Set limits to prevent performance regressions:

| Resource | Budget | Current | Status |
|----------|--------|---------|--------|
| **Total Page Size** | < 1.5 MB | _____ | _____ |
| **JavaScript** | < 300 KB | _____ | _____ |
| **CSS** | < 50 KB | _____ | _____ |
| **Images** | < 1 MB | _____ | _____ |
| **Fonts** | < 100 KB | _____ | _____ |
| **Requests** | < 50 | _____ | _____ |
| **Lighthouse Score** | ≥ 90 | _____ | _____ |
| **LCP** | ≤ 2.5s | _____ | _____ |
| **CLS** | ≤ 0.1 | _____ | _____ |

**Enforce with Bundlesize**:
```bash
npm install -D bundlesize

# package.json
{
  "bundlesize": [
    {
      "path": "./dist/assets/*.js",
      "maxSize": "300 KB"
    },
    {
      "path": "./dist/assets/*.css",
      "maxSize": "50 KB"
    }
  ],
  "scripts": {
    "test:size": "bundlesize"
  }
}
```

---

## Optimization Checklist

### Images
- [ ] Using Shopify's `<Image>` component everywhere
- [ ] Correct `sizes` attribute specified
- [ ] Above-fold images use `loading="eager"`
- [ ] Below-fold images use `loading="lazy"`
- [ ] No layout shift (aspect ratio reserved)
- [ ] Alt text provided for all images

### JavaScript
- [ ] Code splitting by route (automatic with React Router)
- [ ] Heavy components lazy loaded with `React.lazy()`
- [ ] Expensive calculations memoized with `useMemo()`
- [ ] Components memoized with `memo()` where appropriate
- [ ] Debouncing/throttling for frequent events
- [ ] No console.log statements in production

### CSS
- [ ] Tailwind CSS purging enabled
- [ ] Critical CSS inlined (automatic with SSR)
- [ ] No expensive selectors
- [ ] CSS containment used where appropriate
- [ ] Animations use `transform` and `opacity` only

### GraphQL
- [ ] Only fetching needed fields
- [ ] Using fragments to avoid duplication
- [ ] Pagination implemented for large lists
- [ ] Proper caching strategy (CacheLong/CacheShort/CacheNone)
- [ ] No over-fetching data

### SSR
- [ ] Critical data loaded synchronously
- [ ] Non-critical data deferred
- [ ] No heavy processing in loaders
- [ ] Proper error handling in deferred data

### Network
- [ ] HTTP/2 enabled (automatic on Oxygen)
- [ ] Preconnect to required origins
- [ ] Resource hints for critical assets
- [ ] Third-party scripts deferred
- [ ] Heavy embeds use façades

### Fonts
- [ ] Font files preloaded
- [ ] `font-display: swap` used
- [ ] Subset fonts (only needed characters)
- [ ] WOFF2 format used

### Monitoring
- [ ] Core Web Vitals tracked in GA4
- [ ] Shopify Analytics enabled
- [ ] Performance budget defined
- [ ] Alerts set up for regressions

---

## Common Performance Issues & Fixes

### Issue 1: High LCP (Slow Image Loading)

**Symptoms**: Largest Contentful Paint > 2.5s

**Diagnosis**:
```bash
# Run Lighthouse and check "Opportunities" section
# Look for "Properly size images" or "Defer offscreen images"
```

**Fixes**:
1. Use `loading="eager"` on hero image
2. Add `fetchpriority="high"` to LCP image
3. Ensure correct `sizes` attribute
4. Preload LCP image in `<head>`

```jsx
// app/root.jsx
export function links() {
  return [
    {
      rel: 'preload',
      href: '/images/hero.webp',
      as: 'image',
      type: 'image/webp',
      fetchpriority: 'high',
    },
  ];
}
```

---

### Issue 2: High CLS (Layout Shift)

**Symptoms**: Cumulative Layout Shift > 0.1

**Diagnosis**:
- Images loading without reserved space
- Web fonts causing text reflow
- Dynamic content injecting above fold

**Fixes**:

```jsx
// ✅ Reserve space for images
<div className="relative" style={{ aspectRatio: '16/9' }}>
  <Image
    data={image}
    className="absolute inset-0 w-full h-full object-cover"
  />
</div>

// ✅ Use font-display: swap and preload fonts
export function links() {
  return [
    {
      rel: 'preload',
      href: '/fonts/impact.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
  ];
}

// In CSS
@font-face {
  font-family: 'Impact';
  src: url('/fonts/impact.woff2') format('woff2');
  font-display: swap; /* Prevent invisible text */
}
```

---

### Issue 3: High TBT (Main Thread Blocked)

**Symptoms**: Total Blocking Time > 200ms

**Diagnosis**:
- Heavy JavaScript execution
- Long tasks on main thread
- Synchronous operations

**Fixes**:

```javascript
// ❌ Bad: Synchronous heavy operation
function processProducts(products) {
  return products.map(expensiveOperation); // Blocks for 500ms
}

// ✅ Good: Defer to next frame or use web worker
function processProducts(products) {
  return new Promise((resolve) => {
    requestIdleCallback(() => {
      const result = products.map(expensiveOperation);
      resolve(result);
    });
  });
}

// Or use React's useTransition
function ProductsPage() {
  const [isPending, startTransition] = useTransition();
  const [filteredProducts, setFilteredProducts] = useState([]);

  const handleFilter = (filterValue) => {
    startTransition(() => {
      // Heavy filtering doesn't block UI
      const filtered = products.filter(product =>
        matchesFilter(product, filterValue)
      );
      setFilteredProducts(filtered);
    });
  };
}
```

---

### Issue 4: Large JavaScript Bundle

**Symptoms**: JavaScript bundle > 300 KB

**Diagnosis**:
```bash
npm run build
# Check dist/assets/*.js file sizes
```

**Fixes**:
1. Code split by route (automatic)
2. Lazy load heavy components
3. Replace heavy dependencies with lighter alternatives
4. Remove unused code

```bash
# Find large dependencies
npx vite-bundle-visualizer

# Example: Replace moment.js (67KB) with date-fns (13KB)
npm uninstall moment
npm install date-fns

# Example: Replace lodash with individual imports
# ❌ Bad
import _ from 'lodash'; // Imports entire library

# ✅ Good
import debounce from 'lodash/debounce'; // Tree-shakeable
```

---

## Performance Testing Schedule

| Frequency | Task | Tool | Responsible |
|-----------|------|------|-------------|
| **Every Deploy** | Lighthouse audit | Chrome DevTools | Developer |
| **Weekly** | WebPageTest | WebPageTest.org | QA Team |
| **Monthly** | Bundle size check | Bundle analyzer | Tech Lead |
| **Monthly** | Core Web Vitals review | Google Analytics | Product Manager |
| **Quarterly** | Full performance audit | All tools | Performance Team |

---

## Resources

- [Web.dev Performance Guides](https://web.dev/performance/)
- [Shopify Hydrogen Performance Docs](https://shopify.dev/docs/custom-storefronts/hydrogen/performance)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Core Web Vitals](https://web.dev/vitals/)
- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/)
- [WebPageTest Documentation](https://docs.webpagetest.org/)

---

## Sign-off

- [ ] Lighthouse score ≥ 90 on all key pages
- [ ] Core Web Vitals meet "Good" thresholds
- [ ] Performance budget defined and enforced
- [ ] All images optimized with correct loading strategy
- [ ] GraphQL queries optimized (no over-fetching)
- [ ] Code splitting and lazy loading implemented
- [ ] Third-party scripts deferred or removed
- [ ] Performance monitoring enabled
- [ ] Team trained on performance best practices

**Audited By**: _______________
**Date**: _______________
**Next Audit Due**: _______________
