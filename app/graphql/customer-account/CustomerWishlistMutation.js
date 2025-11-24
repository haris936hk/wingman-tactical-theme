// Mutation to update customer's wishlist metafield
export const UPDATE_CUSTOMER_WISHLIST_MUTATION = `#graphql
  mutation customerWishlistMutation($input: CustomerUpdateInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        metafield(namespace: "custom", key: "wishlist") {
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;
