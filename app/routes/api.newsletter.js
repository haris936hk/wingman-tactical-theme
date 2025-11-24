/**
 * Newsletter API Route - Handle email subscriptions
 * This route processes newsletter signup requests
 *
 * Integration options:
 * 1. Shopify Customer Metafields - Store newsletter subscribers in Shopify
 * 2. Klaviyo - Email marketing platform (recommended for Shopify)
 * 3. Mailchimp - Popular email service
 * 4. Custom database - Store in your own system
 *
 * For production, integrate with your preferred email service provider
 */

/**
 * @param {ActionFunctionArgs}
 */
export async function action({request}) {
  const formData = await request.formData();
  const email = formData.get('email');
  const action = formData.get('action');

  // Validate email
  if (!email || typeof email !== 'string') {
    return Response.json(
      {success: false, error: 'Please provide a valid email address'},
      {status: 400},
    );
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return Response.json(
      {success: false, error: 'Please provide a valid email address'},
      {status: 400},
    );
  }

  if (action === 'subscribe') {
    try {
      // TODO: Integrate with your email service provider
      // Example integrations:

      // 1. KLAVIYO INTEGRATION (Recommended for Shopify)
      // const klaviyoApiKey = process.env.KLAVIYO_API_KEY;
      // const klaviyoListId = process.env.KLAVIYO_LIST_ID;
      // if (klaviyoApiKey && klaviyoListId) {
      //   await fetch('https://a.klaviyo.com/api/v2/list/{listId}/subscribe', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'api-key': klaviyoApiKey,
      //     },
      //     body: JSON.stringify({
      //       profiles: [{email}],
      //     }),
      //   });
      // }

      // 2. MAILCHIMP INTEGRATION
      // const mailchimpApiKey = process.env.MAILCHIMP_API_KEY;
      // const mailchimpAudienceId = process.env.MAILCHIMP_AUDIENCE_ID;
      // const mailchimpDatacenter = mailchimpApiKey.split('-')[1];
      // if (mailchimpApiKey && mailchimpAudienceId) {
      //   await fetch(
      //     `https://${mailchimpDatacenter}.api.mailchimp.com/3.0/lists/${mailchimpAudienceId}/members`,
      //     {
      //       method: 'POST',
      //       headers: {
      //         'Content-Type': 'application/json',
      //         Authorization: `Basic ${Buffer.from(`anystring:${mailchimpApiKey}`).toString('base64')}`,
      //       },
      //       body: JSON.stringify({
      //         email_address: email,
      //         status: 'subscribed',
      //       }),
      //     }
      //   );
      // }

      // 3. SHOPIFY CUSTOMER METAFIELD (Basic implementation)
      // Store newsletter subscribers in Shopify customer metafields
      // This requires Shopify Admin API access
      // const {admin} = context;
      // if (admin) {
      //   await admin.graphql(
      //     `#graphql
      //       mutation customerCreate($input: CustomerInput!) {
      //         customerCreate(input: $input) {
      //           customer {
      //             id
      //           }
      //           userErrors {
      //             field
      //             message
      //           }
      //         }
      //       }
      //     `,
      //     {
      //       variables: {
      //         input: {
      //           email,
      //           emailMarketingConsent: {
      //             marketingState: 'SUBSCRIBED',
      //             marketingOptInLevel: 'SINGLE_OPT_IN',
      //           },
      //         },
      //       },
      //     }
      //   );
      // }

      // For development/demo purposes, just log and return success
      console.log(`Newsletter subscription: ${email}`);

      return Response.json(
        {
          success: true,
          message: 'Successfully subscribed to newsletter',
        },
        {
          status: 200,
        },
      );
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      return Response.json(
        {
          success: false,
          error: 'Failed to subscribe. Please try again later.',
        },
        {status: 500},
      );
    }
  }

  return Response.json(
    {success: false, error: 'Invalid action'},
    {status: 400},
  );
}

/** @typedef {import('@shopify/remix-oxygen').ActionFunctionArgs} ActionFunctionArgs */
