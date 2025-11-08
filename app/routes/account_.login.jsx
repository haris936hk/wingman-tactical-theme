/**
 * @param {Route.LoaderArgs}
 */
export async function loader({request, context}) {
  return context.customerAccount.login({
    countryCode: context.storefront.i18n.country,
  });
}

/**
 * Login page - shows branded loading state while redirecting to Shopify OAuth
 */
export default function Login() {
  return (
    <div className="bg-[#000000] min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        {/* Loading Spinner */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-900 mb-6">
          <svg
            className="animate-spin w-12 h-12 text-[#FF0000]"
            fill="none"
            viewBox="0 0 24 24"
            style={{
              filter: 'drop-shadow(0 0 10px rgba(255, 0, 0, 0.6))',
            }}
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>

        {/* Message */}
        <h1
          className="text-3xl lg:text-4xl font-bold uppercase text-white mb-4"
          style={{
            fontFamily: 'var(--font-family-shock)',
            textShadow: '0 0 15px rgba(255, 0, 0, 0.6)',
          }}
        >
          Redirecting to Login
        </h1>
        <p className="text-lg text-gray-300">
          Taking you to secure authentication...
        </p>
      </div>
    </div>
  );
}

/** @typedef {import('./+types/account_.login').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
