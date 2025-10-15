import {Await, useLoaderData, Link} from 'react-router';
import {Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import {ProductItem} from '~/components/ProductItem';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Hydrogen | Home'}];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context}) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context}) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  return (
    <div className="home">
      <HeroSection />
      <StatsSection />
      <FeaturedProducts products={data.recommendedProducts} />
      <WingmanFeaturedSection products={data.recommendedProducts} />
      <DiscountsSection products={data.recommendedProducts} />
      <CustomProductsSection products={data.recommendedProducts} />
      <AboutSellSection />
      <CTASection />
    </div>
  );
}

/* Wingman Tactical Hero Section */
function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] py-20 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Side */}
          <div className="text-white">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold uppercase leading-tight mb-6">
              YOUR GEAR/MERCHANDISE IS FAILING? BOOK YOUR CUSTOM AVIATION GEAR & MERCH
            </h1>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Premium tactical aviation gear designed for professionals. Custom solutions tailored to your squadron's needs.
            </p>
            <Link
              to="/pages/quote"
              className="inline-block bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold uppercase tracking-wide px-8 py-4 rounded transition-colors"
            >
              GET A QUOTE
            </Link>
          </div>

          {/* Image Side */}
          <div className="relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <img
              src="https://cdn.shopify.com/s/files/1/0000/0000/files/pilot-gear.jpg"
              alt="Aviation Gear"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* Stats Section with World Map */
function StatsSection() {
  return (
    <section className="bg-[#e5d4b8] py-16 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <h2 className="text-3xl font-bold uppercase text-center mb-12 text-[#1a1a1a]">
          CLIENTS SERVED ACROSS THE WORLD
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Stat 1 */}
          <div className="flex flex-col items-center">
            <div className="text-6xl mb-4">✈️</div>
            <div className="text-4xl font-bold text-[#d32f2f] mb-2">500+</div>
            <p className="text-lg font-semibold uppercase">Squadrons & Pilots Flown</p>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col items-center">
            <div className="text-6xl mb-4">⭐</div>
            <div className="text-4xl font-bold text-[#d32f2f] mb-2">1,000+</div>
            <p className="text-lg font-semibold uppercase">5 Star Reviews</p>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col items-center">
            <div className="text-6xl mb-4">⚙️</div>
            <div className="text-4xl font-bold text-[#d32f2f] mb-2">2,500+</div>
            <p className="text-lg font-semibold uppercase">Custom Orders</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Featured Products Section */
function FeaturedProducts({products}) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="text-3xl lg:text-4xl font-bold uppercase text-center mb-12">
          EXPLORE OUR ACROSS THE WORLD SERVED CLIENTS
        </h2>

        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <Await resolve={products}>
            {(response) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {response?.products.nodes.map((product) => (
                  <ProductItem key={product.id} product={product} />
                ))}
              </div>
            )}
          </Await>
        </Suspense>
      </div>
    </section>
  );
}

/* Wingman Featured Section */
function WingmanFeaturedSection({products}) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="text-3xl lg:text-4xl font-bold uppercase text-center mb-12">
          WINGMAN FEATURED
        </h2>

        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <Await resolve={products}>
            {(response) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {response?.products.nodes.map((product) => (
                  <ProductItem key={product.id} product={product} />
                ))}
              </div>
            )}
          </Await>
        </Suspense>
      </div>
    </section>
  );
}

/* Discounts & Offers Section */
function DiscountsSection({products}) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="text-3xl lg:text-4xl font-bold uppercase text-center mb-12">
          DISCOUNTS & OFFERS
        </h2>

        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <Await resolve={products}>
            {(response) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {response?.products.nodes.map((product) => (
                  <ProductItem key={product.id} product={product} />
                ))}
              </div>
            )}
          </Await>
        </Suspense>
      </div>
    </section>
  );
}

/* Custom Products Section */
function CustomProductsSection({products}) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="text-3xl lg:text-4xl font-bold uppercase text-center mb-12">
          CUSTOM PRODUCTS
        </h2>

        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <Await resolve={products}>
            {(response) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {response?.products.nodes.map((product) => (
                  <ProductItem key={product.id} product={product} />
                ))}
              </div>
            )}
          </Await>
        </Suspense>
      </div>
    </section>
  );
}

/* About Us / Sell With Us Section */
function AboutSellSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* About Us Card */}
          <Link to="/pages/about" className="relative h-[400px] rounded-lg overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-10" />
            <img
              src="https://cdn.shopify.com/s/files/1/0000/0000/files/about-us.jpg"
              alt="About Us"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
              <h3 className="text-4xl font-bold uppercase text-white mb-4">ABOUT US</h3>
              <p className="text-white text-lg">Learn about our commitment to quality and service</p>
            </div>
          </Link>

          {/* Sell With Us Card */}
          <Link to="/pages/sell" className="relative h-[400px] rounded-lg overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-10" />
            <img
              src="https://cdn.shopify.com/s/files/1/0000/0000/files/sell-with-us.jpg"
              alt="Sell With Us"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
              <h3 className="text-4xl font-bold uppercase text-white mb-4">SELL WITH US</h3>
              <p className="text-white text-lg">Partner with Wingman Tactical</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* CTA Section */
function CTASection() {
  return (
    <section className="bg-[#1a1a1a] py-20">
      <div className="max-w-[1400px] mx-auto px-6 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold uppercase text-white mb-8">
          GET A QUOTE FOR YOUR CUSTOM GEAR NOW!
        </h2>
        <Link
          to="/pages/quote"
          className="inline-block bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold uppercase tracking-wide px-12 py-5 text-lg rounded transition-colors"
        >
          GET A QUOTE
        </Link>
      </div>
    </section>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
