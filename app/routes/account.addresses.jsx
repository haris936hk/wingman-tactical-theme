import {
  data,
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
} from 'react-router';
import {useState, useEffect} from 'react';
import {
  UPDATE_ADDRESS_MUTATION,
  DELETE_ADDRESS_MUTATION,
  CREATE_ADDRESS_MUTATION,
} from '~/graphql/customer-account/CustomerAddressMutations';
import {AccountCard} from '~/components/account/AccountCard';
import {FormInput} from '~/components/account/FormInput';
import {FormButton} from '~/components/account/FormButton';
import {FormFieldset} from '~/components/account/FormFieldset';
import {EmptyState} from '~/components/account/EmptyState';
import {SuccessMessage} from '~/components/account/SuccessMessage';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Addresses'}];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  context.customerAccount.handleAuthStatus();

  return {};
}

/**
 * @param {Route.ActionArgs}
 */
export async function action({request, context}) {
  const {customerAccount} = context;

  try {
    const form = await request.formData();

    const addressId = form.has('addressId')
      ? String(form.get('addressId'))
      : null;
    if (!addressId) {
      throw new Error('You must provide an address id.');
    }

    // this will ensure redirecting to login never happen for mutatation
    const isLoggedIn = await customerAccount.isLoggedIn();
    if (!isLoggedIn) {
      return data(
        {error: {[addressId]: 'Unauthorized'}},
        {
          status: 401,
        },
      );
    }

    const defaultAddress = form.has('defaultAddress')
      ? String(form.get('defaultAddress')) === 'on'
      : false;
    const address = {};
    const keys = [
      'address1',
      'address2',
      'city',
      'company',
      'territoryCode',
      'firstName',
      'lastName',
      'phoneNumber',
      'zoneCode',
      'zip',
    ];

    for (const key of keys) {
      const value = form.get(key);
      if (typeof value === 'string') {
        address[key] = value;
      }
    }

    switch (request.method) {
      case 'POST': {
        // handle new address creation
        try {
          const {data, errors} = await customerAccount.mutate(
            CREATE_ADDRESS_MUTATION,
            {
              variables: {
                address,
                defaultAddress,
                language: customerAccount.i18n.language,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressCreate?.userErrors?.length) {
            throw new Error(data?.customerAddressCreate?.userErrors[0].message);
          }

          if (!data?.customerAddressCreate?.customerAddress) {
            throw new Error('Customer address create failed.');
          }

          return {
            error: null,
            createdAddress: data?.customerAddressCreate?.customerAddress,
            defaultAddress,
          };
        } catch (error) {
          if (error instanceof Error) {
            return data(
              {error: {[addressId]: error.message}},
              {
                status: 400,
              },
            );
          }
          return data(
            {error: {[addressId]: error}},
            {
              status: 400,
            },
          );
        }
      }

      case 'PUT': {
        // handle address updates
        try {
          const {data, errors} = await customerAccount.mutate(
            UPDATE_ADDRESS_MUTATION,
            {
              variables: {
                address,
                addressId: decodeURIComponent(addressId),
                defaultAddress,
                language: customerAccount.i18n.language,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressUpdate?.userErrors?.length) {
            throw new Error(data?.customerAddressUpdate?.userErrors[0].message);
          }

          if (!data?.customerAddressUpdate?.customerAddress) {
            throw new Error('Customer address update failed.');
          }

          return {
            error: null,
            updatedAddress: address,
            defaultAddress,
          };
        } catch (error) {
          if (error instanceof Error) {
            return data(
              {error: {[addressId]: error.message}},
              {
                status: 400,
              },
            );
          }
          return data(
            {error: {[addressId]: error}},
            {
              status: 400,
            },
          );
        }
      }

      case 'DELETE': {
        // handles address deletion
        try {
          const {data, errors} = await customerAccount.mutate(
            DELETE_ADDRESS_MUTATION,
            {
              variables: {
                addressId: decodeURIComponent(addressId),
                language: customerAccount.i18n.language,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressDelete?.userErrors?.length) {
            throw new Error(data?.customerAddressDelete?.userErrors[0].message);
          }

          if (!data?.customerAddressDelete?.deletedAddressId) {
            throw new Error('Customer address delete failed.');
          }

          return {error: null, deletedAddress: addressId};
        } catch (error) {
          if (error instanceof Error) {
            return data(
              {error: {[addressId]: error.message}},
              {
                status: 400,
              },
            );
          }
          return data(
            {error: {[addressId]: error}},
            {
              status: 400,
            },
          );
        }
      }

      default: {
        return data(
          {error: {[addressId]: 'Method not allowed'}},
          {
            status: 405,
          },
        );
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      return data(
        {error: error.message},
        {
          status: 400,
        },
      );
    }
    return data(
      {error},
      {
        status: 400,
      },
    );
  }
}

export default function Addresses() {
  const {customer} = useOutletContext();
  const {defaultAddress, addresses} = customer;
  const action = useActionData();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);

  // Show success message after address operations
  useEffect(() => {
    if (action && !action.error) {
      if (action.createdAddress || action.updatedAddress || action.deletedAddress) {
        setShowSuccess(true);
        if (action.createdAddress) {
          setShowNewForm(false);
        }
      }
    }
  }, [action]);

  const hasAddresses = addresses.nodes.length > 0;

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {showSuccess && (
        <SuccessMessage
          message={
            action?.createdAddress
              ? 'Address created successfully!'
              : action?.updatedAddress
              ? 'Address updated successfully!'
              : 'Address deleted successfully!'
          }
          variant="success"
          onDismiss={() => setShowSuccess(false)}
        />
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl lg:text-4xl font-bold uppercase text-white mb-2"
            style={{
              fontFamily: 'var(--font-family-shock)',
              textShadow: '0 0 15px rgba(255, 0, 0, 0.6)',
            }}
          >
            My Addresses
          </h1>
          <p className="text-gray-300">
            Manage your saved shipping and billing addresses
          </p>
        </div>

        {/* Add Address Button */}
        {hasAddresses && !showNewForm && (
          <FormButton
            type="button"
            onClick={() => setShowNewForm(true)}
            fullWidth={false}
            className="hidden md:inline-block"
          >
            + Add New Address
          </FormButton>
        )}
      </div>

      {/* Mobile Add Button */}
      {hasAddresses && !showNewForm && (
        <FormButton
          type="button"
          onClick={() => setShowNewForm(true)}
          className="md:hidden"
        >
          + Add New Address
        </FormButton>
      )}

      {/* New Address Form */}
      {showNewForm && (
        <NewAddressForm onCancel={() => setShowNewForm(false)} />
      )}

      {/* Empty State */}
      {!hasAddresses ? (
        <EmptyState
          icon={
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          }
          title="No Addresses Saved"
          description="You haven't added any addresses yet. Add an address to make checkout faster."
          ctaText="Add Your First Address"
          ctaLink="#"
        />
      ) : (
        /* Address List */
        <ExistingAddresses
          addresses={addresses}
          defaultAddress={defaultAddress}
        />
      )}
    </div>
  );
}

function NewAddressForm({onCancel}) {
  const newAddress = {
    address1: '',
    address2: '',
    city: '',
    company: '',
    territoryCode: '',
    firstName: '',
    id: 'new',
    lastName: '',
    phoneNumber: '',
    zoneCode: '',
    zip: '',
  };

  return (
    <AccountCard title="Add New Address">
      <AddressForm
        addressId={'NEW_ADDRESS_ID'}
        address={newAddress}
        defaultAddress={null}
      >
        {({stateForMethod}) => (
          <div className="flex gap-3 flex-wrap">
            <FormButton
              type="submit"
              formMethod="POST"
              loading={stateForMethod('POST') !== 'idle'}
              fullWidth={false}
            >
              Create Address
            </FormButton>
            <FormButton
              type="button"
              variant="secondary"
              fullWidth={false}
              onClick={onCancel}
            >
              Cancel
            </FormButton>
          </div>
        )}
      </AddressForm>
    </AccountCard>
  );
}

/**
 * @param {Pick<CustomerFragment, 'addresses' | 'defaultAddress'>}
 */
function ExistingAddresses({addresses, defaultAddress}) {
  const [editingId, setEditingId] = useState(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {addresses.nodes.map((address) => {
        const isEditing = editingId === address.id;
        const isDefault = defaultAddress?.id === address.id;

        return isEditing ? (
          <AccountCard key={address.id} title="Edit Address">
            <AddressForm
              addressId={address.id}
              address={address}
              defaultAddress={defaultAddress}
            >
              {({stateForMethod}) => (
                <div className="flex gap-3 flex-wrap">
                  <FormButton
                    type="submit"
                    formMethod="PUT"
                    loading={stateForMethod('PUT') !== 'idle'}
                    fullWidth={false}
                  >
                    Save Changes
                  </FormButton>
                  <FormButton
                    type="button"
                    variant="secondary"
                    fullWidth={false}
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </FormButton>
                </div>
              )}
            </AddressForm>
          </AccountCard>
        ) : (
          <AccountCard key={address.id} className="relative">
            {/* Default Badge */}
            {isDefault && (
              <div className="absolute top-4 right-4">
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold uppercase
                    bg-[#FF0000] text-white shadow-[0_0_15px_rgba(255,0,0,0.6)]"
                >
                  Default
                </span>
              </div>
            )}

            {/* Address Display */}
            <div className="space-y-4">
              <div className="pr-24">
                <h3 className="text-lg font-bold uppercase text-white mb-2">
                  {address.firstName} {address.lastName}
                </h3>
                <div className="text-gray-300 text-sm space-y-1">
                  {address.company && <p>{address.company}</p>}
                  <p>{address.address1}</p>
                  {address.address2 && <p>{address.address2}</p>}
                  <p>
                    {address.city}, {address.zoneCode} {address.zip}
                  </p>
                  <p>{address.territoryCode}</p>
                  {address.phoneNumber && <p>{address.phoneNumber}</p>}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#FF0000]/20 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingId(address.id)}
                  className="flex items-center gap-2 text-white hover:text-[#FF0000]
                    transition-colors font-bold uppercase text-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </button>

                <Form method="DELETE">
                  <input type="hidden" name="addressId" value={address.id} />
                  <button
                    type="submit"
                    className="flex items-center gap-2 text-gray-400 hover:text-[#FF0000]
                      transition-colors font-bold uppercase text-sm"
                    onClick={(e) => {
                      if (!confirm('Are you sure you want to delete this address?')) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </Form>
              </div>
            </div>
          </AccountCard>
        );
      })}
    </div>
  );
}

/**
 * @param {{
 *   addressId: AddressFragment['id'];
 *   address: CustomerAddressInput;
 *   defaultAddress: CustomerFragment['defaultAddress'];
 *   children: (props: {
 *     stateForMethod: (method: 'PUT' | 'POST' | 'DELETE') => Fetcher['state'];
 *   }) => React.ReactNode;
 * }}
 */
export function AddressForm({addressId, address, defaultAddress, children}) {
  const {state, formMethod} = useNavigation();
  /** @type {ActionReturnData} */
  const action = useActionData();
  const error = action?.error?.[addressId];
  const isDefaultAddress = defaultAddress?.id === addressId;

  return (
    <Form id={addressId}>
      <input type="hidden" name="addressId" defaultValue={addressId} />

      <FormFieldset>
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            name="firstName"
            label="First Name"
            type="text"
            autoComplete="given-name"
            placeholder="Enter first name"
            defaultValue={address?.firstName ?? ''}
            required
          />
          <FormInput
            name="lastName"
            label="Last Name"
            type="text"
            autoComplete="family-name"
            placeholder="Enter last name"
            defaultValue={address?.lastName ?? ''}
            required
          />
        </div>

        {/* Company Field */}
        <FormInput
          name="company"
          label="Company (Optional)"
          type="text"
          autoComplete="organization"
          placeholder="Company name"
          defaultValue={address?.company ?? ''}
        />

        {/* Address Fields */}
        <FormInput
          name="address1"
          label="Address Line 1"
          type="text"
          autoComplete="address-line1"
          placeholder="Street address"
          defaultValue={address?.address1 ?? ''}
          required
        />
        <FormInput
          name="address2"
          label="Address Line 2 (Optional)"
          type="text"
          autoComplete="address-line2"
          placeholder="Apartment, suite, etc."
          defaultValue={address?.address2 ?? ''}
        />

        {/* City, State, Zip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormInput
            name="city"
            label="City"
            type="text"
            autoComplete="address-level2"
            placeholder="City"
            defaultValue={address?.city ?? ''}
            required
          />
          <FormInput
            name="zoneCode"
            label="State/Province"
            type="text"
            autoComplete="address-level1"
            placeholder="State"
            defaultValue={address?.zoneCode ?? ''}
            required
          />
          <FormInput
            name="zip"
            label="Zip Code"
            type="text"
            autoComplete="postal-code"
            placeholder="Zip"
            defaultValue={address?.zip ?? ''}
            required
          />
        </div>

        {/* Country and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            name="territoryCode"
            label="Country Code"
            type="text"
            autoComplete="country"
            placeholder="US"
            defaultValue={address?.territoryCode ?? ''}
            required
          />
          <FormInput
            name="phoneNumber"
            label="Phone Number (Optional)"
            type="tel"
            autoComplete="tel"
            placeholder="+1 (555) 123-4567"
            defaultValue={address?.phoneNumber ?? ''}
          />
        </div>

        {/* Default Address Checkbox */}
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="defaultAddress"
            defaultChecked={isDefaultAddress}
            className="w-5 h-5 rounded border-2 border-white/30
              bg-transparent checked:bg-[#FF0000] checked:border-[#FF0000]
              focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2 focus:ring-offset-black
              transition-colors cursor-pointer"
          />
          <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
            Set as default address
          </span>
        </label>

        {/* Error Message */}
        {error && (
          <div
            className="p-4 rounded-lg bg-[#FF0000]/20 border-2 border-[#FF0000]
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
              <p className="text-[#FF0000] text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Form Actions */}
        {children({
          stateForMethod: (method) => (formMethod === method ? state : 'idle'),
        })}
      </FormFieldset>
    </Form>
  );
}

/**
 * @typedef {{
 *   addressId?: string | null;
 *   createdAddress?: AddressFragment;
 *   defaultAddress?: string | null;
 *   deletedAddress?: string | null;
 *   error: Record<AddressFragment['id'], string> | null;
 *   updatedAddress?: AddressFragment;
 * }} ActionResponse
 */

/** @typedef {import('@shopify/hydrogen/customer-account-api-types').CustomerAddressInput} CustomerAddressInput */
/** @typedef {import('customer-accountapi.generated').AddressFragment} AddressFragment */
/** @typedef {import('customer-accountapi.generated').CustomerFragment} CustomerFragment */
/** @template T @typedef {import('react-router').Fetcher<T>} Fetcher */
/** @typedef {import('./+types/account.addresses').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof action>} ActionReturnData */
