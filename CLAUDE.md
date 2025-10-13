# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Shopify Hydrogen** storefront built on **React Router 7.9.x** (not Remix). Hydrogen is Shopify's framework for building headless commerce storefronts, deployed to Shopify Oxygen (Cloudflare Workers runtime).

**Critical**: This project uses React Router v7, not Remix. Always import from `react-router` packages, never from `@remix-run/*` or `react-router-dom`.

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

Routes follow a consistent pattern:
```javascript
// Critical data (blocks rendering)
async function loadCriticalData({context}) {
  const data = await context.storefront.query(QUERY);
  return data;
}

// Deferred data (loaded after initial render)
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
  return {...deferredData, ...criticalData};
}
```

### GraphQL Organization

- **Storefront API**: Queries defined inline in route files or `app/lib/fragments.js`
- **Customer Account API**: Separate queries in `app/graphql/customer-account/*.js`
- **Schema Configuration**: `.graphqlrc.js` defines two projects:
  - `default`: Storefront API queries
  - `customer`: Customer Account API queries
- **Type Generation**: Run `npm run codegen` to generate:
  - `storefrontapi.generated.d.ts`
  - `customer-accountapi.generated.d.ts`
  - React Router types in `.react-router/types/**/*`

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

## Testing & Debugging

- Development server runs on `localhost:3000` by default
- Preview server mimics production Oxygen environment
- Use browser DevTools for React Router DevTools integration
- GraphQL queries are logged in development mode

## Performance Optimizations

- Critical/deferred data split minimizes TTFB
- `shouldRevalidate` in `app/root.jsx` prevents unnecessary refetches
- Hydrogen caching strategies: `CacheLong()`, `CacheShort()`, `CacheNone()`
- SSR with selective bot handling (full render for bots via `isbot`)
- Content Security Policy configured in `app/entry.server.jsx`

## Key Dependencies

- `@shopify/hydrogen` - Core Hydrogen framework
- `react-router` - Routing framework (v7.9.2)
- `@react-router/dev` - Development tools
- `@shopify/mini-oxygen` - Local Oxygen environment
- `graphql` + `graphql-tag` - GraphQL utilities
- `tailwindcss` v4 - Styling framework
- `isbot` - Bot detection for SSR optimization
