/**
 * i18n Utilities for Shopify Markets
 * Handles country and language detection for multi-currency support
 */

/**
 * Supported countries and their currencies
 * Add more countries as needed for your Shopify Markets configuration
 */
export const SUPPORTED_COUNTRIES = {
  US: {
    name: 'United States',
    currency: 'USD',
    symbol: '$',
    language: 'EN',
  },
  CA: {
    name: 'Canada',
    currency: 'CAD',
    symbol: 'CA$',
    language: 'EN',
  },
  GB: {
    name: 'United Kingdom',
    currency: 'GBP',
    symbol: '£',
    language: 'EN',
  },
  AU: {
    name: 'Australia',
    currency: 'AUD',
    symbol: 'A$',
    language: 'EN',
  },
  EU: {
    name: 'European Union',
    currency: 'EUR',
    symbol: '€',
    language: 'EN',
  },
};

export const DEFAULT_COUNTRY = 'US';
export const DEFAULT_LANGUAGE = 'EN';

/**
 * Get country from URL path (e.g., /en-us/products)
 * @param {URL} url
 * @returns {string | null}
 */
function getCountryFromPath(url) {
  const pathParts = url.pathname.split('/').filter(Boolean);
  if (pathParts.length > 0) {
    const localeMatch = pathParts[0].match(/^[a-z]{2}-([a-z]{2})$/i);
    if (localeMatch) {
      return localeMatch[1].toUpperCase();
    }
  }
  return null;
}

/**
 * Get country from cookie
 * @param {Request} request
 * @returns {string | null}
 */
function getCountryFromCookie(request) {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [key, ...values] = c.trim().split('=');
      return [key, values.join('=')];
    }),
  );

  return cookies.shopify_country?.toUpperCase() || null;
}

/**
 * Get country from Cloudflare headers (if available)
 * @param {Request} request
 * @returns {string | null}
 */
function getCountryFromHeaders(request) {
  // Cloudflare provides CF-IPCountry header
  const cfCountry = request.headers.get('CF-IPCountry');
  if (cfCountry && cfCountry !== 'XX') {
    return cfCountry.toUpperCase();
  }
  return null;
}

/**
 * Detect country and language from request
 * Priority: URL path > Cookie > Cloudflare header > Default
 * @param {Request} request
 * @returns {{country: string, language: string}}
 */
export function detectCountryLanguage(request) {
  const url = new URL(request.url);

  // Try to get country from different sources in priority order
  let country =
    getCountryFromPath(url) ||
    getCountryFromCookie(request) ||
    getCountryFromHeaders(request) ||
    DEFAULT_COUNTRY;

  // Validate country is supported
  if (!SUPPORTED_COUNTRIES[country]) {
    country = DEFAULT_COUNTRY;
  }

  const language = SUPPORTED_COUNTRIES[country].language || DEFAULT_LANGUAGE;

  return {country, language};
}

/**
 * Get currency information for a country
 * @param {string} countryCode
 * @returns {{currency: string, symbol: string}}
 */
export function getCurrencyInfo(countryCode) {
  const country = SUPPORTED_COUNTRIES[countryCode] || SUPPORTED_COUNTRIES[DEFAULT_COUNTRY];
  return {
    currency: country.currency,
    symbol: country.symbol,
  };
}

/**
 * Set country cookie
 * @param {string} countryCode
 * @returns {string} Cookie string
 */
export function setCountryCookie(countryCode) {
  const maxAge = 60 * 60 * 24 * 365; // 1 year
  return `shopify_country=${countryCode}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}
