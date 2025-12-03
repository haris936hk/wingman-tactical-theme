# Wingman Tactical Theme

A high-performance **Shopify Hydrogen** storefront built with **React Router 7** and deployed on **Shopify Oxygen**. This modern e-commerce storefront provides a blazing-fast shopping experience with edge-optimized performance and beautiful, responsive design.

## Tech Stack

- **[Shopify Hydrogen](https://shopify.dev/docs/storefronts/headless/hydrogen)** - Shopify's framework for headless commerce
- **[React Router 7.9.x](https://reactrouter.com/)** - File-based routing with loader/action patterns
- **[Vite](https://vitejs.dev/)** - Next-generation build tool and dev server
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first styling framework
- **[Shopify Oxygen](https://shopify.dev/docs/storefronts/headless/hydrogen/deployments)** - Edge runtime deployment (Cloudflare Workers)
- **GraphQL** - Type-safe data fetching with Shopify Storefront API

## Key Features

- **Edge-First Performance**: Deployed to 275+ Cloudflare data centers worldwide
- **Streaming SSR**: Fast Time to First Byte (TTFB) with progressive data loading
- **Type-Safe**: Automatic TypeScript generation for routes and GraphQL queries
- **Optimized Caching**: Multi-level caching strategy for optimal performance
- **Mobile-First Design**: Responsive, accessible UI built with Tailwind CSS
- **Customer Accounts**: Full authentication flow with Shopify Customer Account API
- **Shopping Cart**: Persistent cart management with inline editing
- **SEO Optimized**: Server-side rendering with metadata management
- **Privacy Compliant**: GDPR/CCPA ready with built-in consent management

## Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher
- **Shopify Store**: Access to a Shopify store with Storefront API credentials

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/haris936hk/wingman-tactical-theme.git
cd wingman-tactical-theme
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
# Shopify Storefront API
PUBLIC_STOREFRONT_ID=gid://shopify/HydrogenStorefront/1
PUBLIC_STOREFRONT_API_TOKEN=your_public_token
PUBLIC_STORE_DOMAIN=your-store.myshopify.com
PRIVATE_STOREFRONT_API_TOKEN=your_private_token

# Customer Account API
PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID=your_client_id
PUBLIC_CUSTOMER_ACCOUNT_API_URL=https://shopify.com/your_shop_id

# Session Management
SESSION_SECRET=your_secure_random_string_min_32_characters

# Shop Configuration
SHOP_ID=12345678
```

**Option 1 - Link to existing Shopify store:**
```bash
npx shopify hydrogen link
npx shopify hydrogen env pull
```

**Option 2 - Manual setup:**
Copy your credentials from your Shopify store's app settings.

### 4. Generate GraphQL Types

```bash
npm run codegen
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your storefront.

## Development Commands

### Development

```bash
npm run dev              # Start dev server with hot reload
npm run preview          # Preview production build locally
npm run codegen          # Generate GraphQL and route types
```

### Building & Deployment

```bash
npm run build            # Build for production
npm run lint             # Run ESLint
```

### Shopify CLI

```bash
npx shopify hydrogen link        # Link to Oxygen environment
npx shopify hydrogen env pull    # Pull environment variables
npx shopify hydrogen deploy      # Deploy to Oxygen
npx shopify hydrogen logs        # View deployment logs
npx shopify hydrogen logs --tail # Monitor real-time logs
```

## Project Structure

```
wingman-tactical-theme/
├── app/
│   ├── routes/                 # File-based routes
│   │   ├── _index.jsx         # Homepage
│   │   ├── products.$handle.jsx
│   │   ├── collections.$handle.jsx
│   │   └── account.jsx        # Protected customer routes
│   ├── components/            # Reusable UI components
│   ├── lib/
│   │   ├── context.js        # Hydrogen context setup
│   │   └── fragments.js      # Shared GraphQL fragments
│   ├── graphql/
│   │   └── customer-account/  # Customer API queries
│   ├── styles/
│   │   ├── tailwind.css      # Tailwind imports
│   │   ├── reset.css         # CSS reset
│   │   └── app.css           # Custom styles
│   ├── entry.server.jsx      # SSR entry + CSP
│   ├── entry.client.jsx      # Client hydration
│   └── root.jsx              # Root layout + analytics
├── public/                    # Static assets
├── server.js                  # Oxygen worker entry
├── vite.config.js            # Vite configuration
├── react-router.config.js    # React Router configuration
├── .graphqlrc.js             # GraphQL schema config
└── .env                      # Environment variables (not committed)
```

## Important: Import Guidelines

This project uses **React Router 7**, not Remix. Always use correct imports:

### ✅ Correct Imports

```javascript
import {
  useLoaderData,
  Link,
  Form,
  redirect,
  defer,
  json
} from 'react-router';

import {Image, Money, Analytics} from '@shopify/hydrogen';
```

### ❌ Never Use These

```javascript
// ❌ Wrong - Will cause errors
import {useLoaderData} from '@remix-run/react';
import {json} from '@remix-run/node';
import {Link} from 'react-router-dom';
```

## Data Loading Patterns

### Server-Side Rendering (Recommended for SEO)

```javascript
export async function loader({params, context}) {
  const {product} = await context.storefront.query(PRODUCT_QUERY, {
    cache: context.storefront.CacheLong(),
    variables: {handle: params.handle}
  });
  return {product};
}
```

### Streaming with defer() (Best for TTFB)

```javascript
export async function loader({context}) {
  const critical = await loadCritical(context);
  const deferred = loadDeferred(context).catch(() => null);

  return defer({
    critical,
    deferred // Streams after initial render
  });
}
```

## Deployment

### Deploy to Shopify Oxygen

```bash
# 1. Link your Oxygen environment
npx shopify hydrogen link

# 2. Build for production
npm run build

# 3. Deploy
npx shopify hydrogen deploy

# 4. Monitor deployment
npx shopify hydrogen logs --tail
```

### Environment Variables

Production environment variables are managed through Shopify CLI:

```bash
# Pull from Oxygen
npx shopify hydrogen env pull

# Variables are automatically injected during deployment
npx shopify hydrogen deploy
```

## Performance Optimizations

- **Multi-level caching**: Edge, server, client, and browser caching
- **Image optimization**: Automatic optimization via Shopify CDN
- **Code splitting**: Automatic route-based code splitting
- **Streaming SSR**: Progressive rendering for faster perceived performance
- **Edge deployment**: <5ms cold starts on Cloudflare Workers

## Security

- **Content Security Policy**: Configured in `app/entry.server.jsx`
- **Session encryption**: Secure session management with encrypted cookies
- **HTTPS only**: Customer Account API requires HTTPS
- **Input validation**: Server-side validation on all forms
- **Privacy compliance**: GDPR/CCPA consent management built-in

## Customer Account Setup

The Customer Account API requires HTTPS for local development:

**Using ngrok:**
```bash
ngrok http 3000
```

**Using Cloudflare Tunnel:**
```bash
cloudflared tunnel --url http://localhost:3000
```

Update your `.env` with the HTTPS URL:
```
PUBLIC_CUSTOMER_ACCOUNT_API_URL=https://your-tunnel-url.ngrok-free.app
```

## Documentation

- [Hydrogen Documentation](https://shopify.dev/docs/storefronts/headless/hydrogen)
- [React Router 7 Guide](https://reactrouter.com/start/framework/data-loading)
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront/latest)
- [Oxygen Runtime](https://shopify.dev/docs/storefronts/headless/hydrogen/deployments/oxygen-runtime)
- [Project Guidelines](./CLAUDE.md)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or contributions, please [open an issue](https://github.com/yourusername/wingman-tactical-theme/issues) on GitHub.

---

Built with [Shopify Hydrogen](https://shopify.dev/docs/storefronts/headless/hydrogen) and deployed on [Shopify Oxygen](https://shopify.dev/docs/storefronts/headless/hydrogen/deployments)
