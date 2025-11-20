import {CUSTOMER_UPDATE_MUTATION} from '~/graphql/customer-account/CustomerUpdateMutation';
import {
  data,
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
} from 'react-router';
import {useState, useEffect} from 'react';
import {AccountCard} from '~/components/account/AccountCard';
import {FormInput} from '~/components/account/FormInput';
import {FormButton} from '~/components/account/FormButton';
import {FormFieldset} from '~/components/account/FormFieldset';
import {SuccessMessage} from '~/components/account/SuccessMessage';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Profile'}];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  context.customerAccount.handleAuthStatus();

  return data(
    {},
    {
      headers: {
        'Cache-Control': 'private, max-age=300, stale-while-revalidate=600',
      },
    },
  );
}

/**
 * @param {Route.ActionArgs}
 */
export async function action({request, context}) {
  const {customerAccount} = context;

  if (request.method !== 'PUT') {
    return data({error: 'Method not allowed'}, {status: 405});
  }

  const form = await request.formData();

  try {
    const customer = {};
    const validInputKeys = ['firstName', 'lastName'];
    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key)) {
        continue;
      }
      if (typeof value === 'string' && value.length) {
        customer[key] = value;
      }
    }

    // update customer and possibly password
    const {data, errors} = await customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {
        variables: {
          customer,
          language: customerAccount.i18n.language,
        },
      },
    );

    if (errors?.length) {
      throw new Error(errors[0].message);
    }

    if (!data?.customerUpdate?.customer) {
      throw new Error('Customer profile update failed.');
    }

    return {
      error: null,
      customer: data?.customerUpdate?.customer,
    };
  } catch (error) {
    return data(
      {error: error.message, customer: null},
      {
        status: 400,
      },
    );
  }
}

export default function AccountProfile() {
  const account = useOutletContext();
  const {state} = useNavigation();
  /** @type {ActionReturnData} */
  const action = useActionData();
  const customer = action?.customer ?? account?.customer;
  const [showSuccess, setShowSuccess] = useState(false);

  // Show success message when profile is updated
  useEffect(() => {
    if (action?.customer && !action?.error) {
      setShowSuccess(true);
    }
  }, [action]);

  const isUpdating = state !== 'idle';

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Success Message */}
      {showSuccess && (
        <SuccessMessage
          message="Profile updated successfully!"
          variant="success"
          onDismiss={() => setShowSuccess(false)}
        />
      )}

      {/* Profile Header */}
      <div>
        <h1
          className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase text-white mb-2"
          style={{
            fontFamily: 'var(--font-family-shock)',
            textShadow: '0 0 15px rgba(255, 0, 0, 0.6)',
          }}
        >
          My Profile
        </h1>
        <p className="text-sm sm:text-base text-gray-300">Manage your personal information</p>
      </div>

      {/* Profile Form */}
      <AccountCard title="Personal Information">
        <Form method="PUT">
          <FormFieldset>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <FormInput
                name="firstName"
                label="First Name"
                type="text"
                autoComplete="given-name"
                placeholder="Enter your first name"
                defaultValue={customer.firstName ?? ''}
                required
              />
              <FormInput
                name="lastName"
                label="Last Name"
                type="text"
                autoComplete="family-name"
                placeholder="Enter your last name"
                defaultValue={customer.lastName ?? ''}
                required
              />
            </div>

            {/* Error Message */}
            {action?.error && (
              <div
                className="mt-4 p-4 rounded-lg bg-[#FF0000]/20 border-2 border-[#FF0000]
                  backdrop-blur-sm"
              >
                <div className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-[#FF0000] flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-[#FF0000] text-sm font-medium">{action.error}</p>
                </div>
              </div>
            )}

            <div className="mt-6">
              <FormButton type="submit" loading={isUpdating}>
                {isUpdating ? 'Updating Profile...' : 'Save Changes'}
              </FormButton>
            </div>
          </FormFieldset>
        </Form>
      </AccountCard>

      {/* Account Info Card */}
      <AccountCard title="Account Information" hover={false}>
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 sm:py-3 border-b border-white/10 gap-1 sm:gap-0">
            <span className="text-gray-400 uppercase text-xs sm:text-sm">Account ID:</span>
            <span className="text-white font-mono text-xs sm:text-sm break-all">{customer.id?.split('/').pop()}</span>
          </div>
          {customer.emailAddress && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 sm:py-3 border-b border-white/10 gap-1 sm:gap-0">
              <span className="text-gray-400 uppercase text-xs sm:text-sm">Email:</span>
              <span className="text-white text-xs sm:text-sm break-all">{customer.emailAddress?.emailAddress}</span>
            </div>
          )}
        </div>
      </AccountCard>
    </div>
  );
}

/**
 * @typedef {{
 *   error: string | null;
 *   customer: CustomerFragment | null;
 * }} ActionResponse
 */

/** @typedef {import('customer-accountapi.generated').CustomerFragment} CustomerFragment */
/** @typedef {import('@shopify/hydrogen/customer-account-api-types').CustomerUpdateInput} CustomerUpdateInput */
/** @typedef {import('./+types/account.profile').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof action>} ActionReturnData */
