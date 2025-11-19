// Query to get customer's wishlist from metafield
export const CUSTOMER_WISHLIST_QUERY = `#graphql
  query CustomerWishlist($language: LanguageCode)
  @inContext(language: $language) {
    customer {
      id
      metafield(namespace: "custom", key: "wishlist") {
        value
      }
    }
  }
`;
