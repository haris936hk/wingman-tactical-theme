/**
 * Structured Data Utilities - JSON-LD Schema Generation
 * Generates Schema.org structured data for improved SEO and rich results
 * https://schema.org/
 */

/**
 * Organization Schema - Store information
 * @param {{
 *   name: string;
 *   url: string;
 *   logo?: string;
 *   description?: string;
 *   address?: {
 *     street: string;
 *     city: string;
 *     state: string;
 *     postalCode: string;
 *     country: string;
 *   };
 *   contactPoint?: {
 *     telephone: string;
 *     email: string;
 *   };
 *   sameAs?: string[];
 * }}
 */
export function organizationSchema({
  name,
  url,
  logo,
  description,
  address,
  contactPoint,
  sameAs = [],
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
  };

  if (logo) schema.logo = logo;
  if (description) schema.description = description;
  if (sameAs.length > 0) schema.sameAs = sameAs;

  if (address) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.postalCode,
      addressCountry: address.country,
    };
  }

  if (contactPoint) {
    schema.contactPoint = {
      '@type': 'ContactPoint',
      telephone: contactPoint.telephone,
      email: contactPoint.email,
      contactType: 'Customer Service',
    };
  }

  return schema;
}

/**
 * Product Schema - Product page structured data
 * @param {{
 *   name: string;
 *   description: string;
 *   image: string[];
 *   sku?: string;
 *   brand?: string;
 *   offers: {
 *     price: string;
 *     priceCurrency: string;
 *     availability: string;
 *     url: string;
 *   };
 *   aggregateRating?: {
 *     ratingValue: number;
 *     reviewCount: number;
 *   };
 *   reviews?: Array<{
 *     author: string;
 *     datePublished: string;
 *     reviewBody: string;
 *     reviewRating: number;
 *   }>;
 * }}
 */
export function productSchema({
  name,
  description,
  image,
  sku,
  brand = 'Wingman Tactical',
  offers,
  aggregateRating,
  reviews = [],
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: Array.isArray(image) ? image : [image],
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    offers: {
      '@type': 'Offer',
      price: offers.price,
      priceCurrency: offers.priceCurrency,
      availability: `https://schema.org/${offers.availability}`,
      url: offers.url,
    },
  };

  if (sku) schema.sku = sku;

  if (aggregateRating && aggregateRating.reviewCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
    };
  }

  if (reviews.length > 0) {
    schema.review = reviews.map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      datePublished: review.datePublished,
      reviewBody: review.reviewBody,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.reviewRating,
      },
    }));
  }

  return schema;
}

/**
 * Breadcrumb List Schema - Navigation breadcrumbs
 * @param {Array<{name: string, url: string}>} items
 */
export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Website Schema - Site-wide information
 * @param {{
 *   name: string;
 *   url: string;
 *   potentialAction?: {
 *     target: string;
 *     queryInput: string;
 *   };
 * }}
 */
export function websiteSchema({name, url, potentialAction}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
  };

  if (potentialAction) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: potentialAction.target,
      },
      'query-input': `required name=${potentialAction.queryInput}`,
    };
  }

  return schema;
}

/**
 * Collection/Category Page Schema
 * @param {{
 *   name: string;
 *   description: string;
 *   url: string;
 *   numberOfItems?: number;
 * }}
 */
export function collectionPageSchema({name, description, url, numberOfItems}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url,
  };

  if (numberOfItems !== undefined) {
    schema.mainEntity = {
      '@type': 'ItemList',
      numberOfItems,
    };
  }

  return schema;
}

/**
 * FAQ Schema - Frequently Asked Questions
 * @param {Array<{question: string, answer: string}>} faqs
 */
export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Local Business Schema - Physical store information
 * @param {{
 *   name: string;
 *   address: object;
 *   geo?: {latitude: number, longitude: number};
 *   telephone?: string;
 *   priceRange?: string;
 *   openingHours?: string[];
 * }}
 */
export function localBusinessSchema({
  name,
  address,
  geo,
  telephone,
  priceRange,
  openingHours = [],
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
  };

  if (geo) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: geo.latitude,
      longitude: geo.longitude,
    };
  }

  if (telephone) schema.telephone = telephone;
  if (priceRange) schema.priceRange = priceRange;
  if (openingHours.length > 0) schema.openingHoursSpecification = openingHours;

  return schema;
}

/**
 * Helper to render JSON-LD script tag
 * Use in component: <StructuredData data={schema} />
 * @param {{data: object}}
 */
export function StructuredData({data}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(data)}}
    />
  );
}

/**
 * Convert Shopify availability to Schema.org availability
 * @param {boolean} availableForSale
 * @returns {string}
 */
export function getSchemaAvailability(availableForSale) {
  return availableForSale ? 'InStock' : 'OutOfStock';
}
