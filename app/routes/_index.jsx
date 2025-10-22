import {Await, useLoaderData, Link} from 'react-router';
import {Suspense, lazy} from 'react';
import {Image} from '@shopify/hydrogen';
import {ProductItem} from '~/components/ProductItem';
import {CountUpStat} from '~/components/CountUpStat';
import {ClientCarousel} from '~/components/ClientCarousel';
import {ProductCarousel} from '~/components/ProductCarousel';

// Client-only lazy load for GridGlobe to prevent server bundle bloat
const GridGlobe = lazy(() => import('~/components/GridGlobe'));

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

  const discountedProducts = context.storefront
    .query(DISCOUNTED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
    discountedProducts,
  };
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  return (
    <div className="home">
      <HeroSection />
      <SplitContentSection />
      <ClientShowcaseSection />
      <WingmanFeaturedSection products={data.recommendedProducts} />
      <DiscountsSection products={data.discountedProducts} />
      <CustomProductsSection products={data.recommendedProducts} />
      <AboutSellSection />
      <CTASection />
    </div>
  );
}

/* Wingman Tactical Hero Section */
function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] pt-[156px] pb-20 lg:pb-32">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Side */}
          <div className="text-white text-center">
            <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold uppercase leading-tight mb-6">
              YOUR GEAR/MERCHANDISE IS FAILING? BOOK YOUR CUSTOM AVIATION GEAR & MERCH
            </h1>
            <p className="text-sm lg:text-base text-gray-300 mb-6 leading-relaxed">
              Every day you're hauling your fragile helmet around in that cheap, off-the-shelf bag is another day you risk dents, scratches—and a flight-ending failure. Walking into pre-flight briefs with generic, baggy flight suits and lousy patches sends the wrong message: you don't care. Stop risking thousands in equipment damage and your professional reputation.
            </p>
            <p className="text-sm lg:text-base text-gray-300 mb-6 leading-relaxed">
              Get a Quote today for precision-engineered helmet bags, sleek flight suits, and custom patches today & prove you're serious about the need for speed!
            </p>
            <div className="flex justify-center">
              <Link
                to="/pages/quote"
                className="relative inline-block px-8 py-4 font-bold uppercase tracking-wide text-white overflow-hidden rounded-lg backdrop-blur-md bg-gradient-to-r from-[#d32f2f] via-gray-600 to-[#d32f2f] bg-[length:200%_100%] animate-[gradient_3s_linear_infinite] shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-white/20"
              >
                GET A QUOTE
              </Link>
            </div>
          </div>

          {/* Video Side */}
          <div className="relative h-[400px] lg:h-[500px]">
            {/* SVG animated border */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex: 10}}>
              <rect
                x="2"
                y="2"
                width="calc(100% - 4px)"
                height="calc(100% - 4px)"
                rx="8"
                fill="none"
                stroke="url(#borderGradient)"
                strokeWidth="3"
                strokeDasharray="50 150"
                style={{
                  animation: 'border-spin 4s linear infinite'
                }}
              />
              <defs>
                <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#d32f2f" />
                  <stop offset="50%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#d32f2f" />
                </linearGradient>
              </defs>
            </svg>

            {/* Video container */}
            <div className="relative h-full rounded-lg overflow-hidden shadow-2xl border-2 border-gray-800">
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                controls
              >
                <source src="/videos/hero-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Split Content Section - Two Column Layout */
function SplitContentSection() {
  return (
    <section className="relative bg-gradient-to-r from-[#2a2a2a] to-[#1a1a1a] py-20 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Globe */}
          <div className="relative h-[400px] lg:h-[500px]">
            {/* SVG animated border */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex: 10}}>
              <rect
                x="2"
                y="2"
                width="calc(100% - 4px)"
                height="calc(100% - 4px)"
                rx="8"
                fill="none"
                stroke="url(#splitBorderGradient)"
                strokeWidth="3"
                strokeDasharray="50 150"
                style={{
                  animation: 'border-spin 4s linear infinite'
                }}
              />
              <defs>
                <linearGradient id="splitBorderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#d32f2f" />
                  <stop offset="50%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#d32f2f" />
                </linearGradient>
              </defs>
            </svg>

            {/* Globe container */}
            <div className="relative h-full rounded-lg overflow-hidden shadow-2xl border-2 border-gray-800 bg-black">
              <Suspense fallback={
                <div className="flex items-center justify-center w-full h-full">
                  <div className="text-white text-center">
                    <div className="animate-pulse">Loading Globe...</div>
                  </div>
                </div>
              }>
                <GridGlobe />
              </Suspense>
            </div>
          </div>

          {/* Right Side - Stats Content */}
          <div>
            <h2
              className="text-2xl lg:text-3xl font-bold uppercase mb-12 text-center text-white"
              style={{
                textShadow: '0 0 10px rgba(211, 47, 47, 0.8), 0 0 20px rgba(211, 47, 47, 0.6), 0 0 30px rgba(211, 47, 47, 0.4)'
              }}
            >
              CLIENTS SERVED ACROSS THE WORLD
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Aviation Organisations Stat */}
              <CountUpStat
                icon={
                  <svg className="w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                  </svg>
                }
                target={19}
                label="Aviation Organisations & Air Forces"
                duration={2500}
              />

              {/* 5 Star Reviews Stat */}
              <CountUpStat
                icon={
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                }
                target={100}
                label="5 star reviews"
                duration={2500}
              />

              {/* Aviation Gear Products Stat */}
              <CountUpStat
                icon={
                  <svg className="w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                  </svg>
                }
                target={30}
                label="Aviation gear products"
                duration={2500}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Client Showcase Section */
function ClientShowcaseSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="text-3xl lg:text-4xl font-bold uppercase text-center mb-12 text-[#1a1a1a]">
          EXPLORE OUR ACROSS THE WORLD SERVED CLIENTS
        </h2>

        <ClientCarousel />
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
              <ProductCarousel products={response?.products.nodes || []} />
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
              <ProductCarousel products={response?.products.nodes || []} showSaleBadge={true} />
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
              <p className="text-white text-lg">We are your online wingman, dedicated to providing quality Aviation gear and merchandise. Join our formation to get access to the best OEM manufacturing services with the lowest MOQs and maximum customization.</p>
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
              <p className="text-white text-lg">Want to create your own private label brand? Do you have a great product within our niche and don&apos;t know how to sell? Let&apos;s join hands and we will help you with everything we have got to make you earn passive income while you can leave the product supply chain till delivery hustles on us.</p>
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

const DISCOUNTED_PRODUCTS_QUERY = `#graphql
  fragment DiscountedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
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
  query DiscountedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...DiscountedProduct
      }
    }
  }
`;

/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
