import {useState} from 'react';
import {data as remixData, useLoaderData} from 'react-router';
import {Image, Money, CartForm} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';

export const meta = () => {
  return [
    {title: 'Gift Card | Wingman Tactical'},
    {
      name: 'description',
      content:
        'Give the gift of choice with a Wingman Tactical gift card. Perfect for tactical gear enthusiasts.',
    },
  ];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  const {storefront} = context;

  // Query for gift card product
  const {product} = await storefront.query(GIFT_CARD_QUERY, {
    variables: {handle: 'gift-card'},
    cache: storefront.CacheLong(),
  });

  if (!product) {
    throw new Response('Gift Card Not Found', {status: 404});
  }

  return remixData({product});
}

const PRESET_AMOUNTS = [25, 50, 100, 150, 200, 250];

export default function GiftCardPage() {
  const {product} = useLoaderData();
  const {open} = useAside();
  const [selectedAmount, setSelectedAmount] = useState(PRESET_AMOUNTS[2]); // Default to $100
  const [customAmount, setCustomAmount] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [useCustomAmount, setUseCustomAmount] = useState(false);

  // Find the variant matching the selected or custom amount
  const getCurrentAmount = () => {
    return useCustomAmount && customAmount
      ? parseFloat(customAmount)
      : selectedAmount;
  };

  const selectedVariant = product.variants.nodes.find(
    (variant) => parseFloat(variant.price.amount) === getCurrentAmount(),
  ) || product.variants.nodes[0];

  return (
    <div className="bg-[#000000] min-h-screen pt-[180px] pb-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column: Gift Card Visual */}
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-[500px]">
              {/* Gift Card Design */}
              <div
                className="bg-gradient-to-br from-black via-gray-900 to-black rounded-2xl p-8 shadow-[0_0_50px_rgba(255,0,0,0.5)] border-2 border-[#FF0000]"
                style={{aspectRatio: '1.586'}}
              >
                <div className="h-full flex flex-col justify-between">
                  {/* Header */}
                  <div>
                    <h2
                      className="text-3xl md:text-4xl font-bold uppercase text-white"
                      style={{
                        fontFamily: 'var(--font-family-shock)',
                        textShadow: '0 0 20px rgba(255, 0, 0, 0.8)',
                      }}
                    >
                      Wingman Tactical
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">Gift Card</p>
                  </div>

                  {/* Amount Display */}
                  <div className="text-center py-8">
                    <div
                      className="text-6xl md:text-7xl font-bold text-[#FF0000]"
                      style={{textShadow: '0 0 30px rgba(255, 0, 0, 0.8)'}}
                    >
                      ${getCurrentAmount()}
                    </div>
                    <p className="text-white mt-2 text-sm">Gift Card Value</p>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-end text-xs text-gray-400">
                    <span>Valid for online purchases</span>
                    <span>No expiration date</span>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#FF0000]/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#FF0000]/20 rounded-full blur-3xl"></div>
            </div>
          </div>

          {/* Right Column: Purchase Form */}
          <div>
            <h1
              className="text-4xl md:text-5xl font-bold uppercase text-white mb-4"
              style={{
                fontFamily: 'var(--font-family-shock)',
                textShadow: '0 0 15px rgba(255, 0, 0, 0.6)',
              }}
            >
              Give the Perfect Gift
            </h1>
            <p className="text-gray-300 mb-8 text-lg">
              Let them choose their own tactical gear with a Wingman Tactical
              gift card. Delivered instantly by email with no expiration date.
            </p>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-[#FF0000]/30 p-6">
              {/* Amount Selection */}
              <div className="mb-6">
                <label className="block text-white font-semibold mb-3">
                  Select Amount
                </label>

                {/* Preset Amounts */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {PRESET_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amount);
                        setUseCustomAmount(false);
                        setCustomAmount('');
                      }}
                      className={`py-3 px-4 rounded-lg font-bold transition-all ${
                        selectedAmount === amount && !useCustomAmount
                          ? 'bg-[#FF0000] text-white shadow-[0_0_15px_rgba(255,0,0,0.6)]'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div>
                  <button
                    type="button"
                    onClick={() => setUseCustomAmount(!useCustomAmount)}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                      useCustomAmount
                        ? 'bg-[#FF0000] text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {useCustomAmount ? 'Using Custom Amount' : 'Custom Amount'}
                  </button>

                  {useCustomAmount && (
                    <div className="mt-3">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-lg">
                          $
                        </span>
                        <input
                          type="number"
                          min="10"
                          max="500"
                          step="1"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          placeholder="Enter amount (10-500)"
                          className="w-full pl-8 pr-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-[#FF0000] focus:ring-2 focus:ring-[#FF0000]/50 outline-none"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Enter an amount between $10 and $500
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recipient Information */}
              <div className="mb-6 space-y-4">
                <h3 className="text-white font-semibold text-lg border-b border-white/10 pb-2" style={{fontFamily: 'var(--font-family-shock)'}}>
                  Recipient Information
                </h3>

                <div>
                  <label className="block text-white text-sm mb-2">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-[#FF0000] focus:ring-2 focus:ring-[#FF0000]/50 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm mb-2">
                    Recipient Email
                  </label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="recipient@example.com"
                    className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-[#FF0000] focus:ring-2 focus:ring-[#FF0000]/50 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-[#FF0000] focus:ring-2 focus:ring-[#FF0000]/50 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm mb-2">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Happy Birthday! Enjoy your new gear!"
                    rows={4}
                    maxLength={300}
                    className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-[#FF0000] focus:ring-2 focus:ring-[#FF0000]/50 outline-none resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {message.length}/300 characters
                  </p>
                </div>
              </div>

              {/* Add to Cart Button */}
              <CartForm
                route="/cart"
                inputs={{
                  lines: [
                    {
                      merchandiseId: selectedVariant.id,
                      quantity: 1,
                      attributes: [
                        {key: 'Recipient Name', value: recipientName || 'Not specified'},
                        {key: 'Recipient Email', value: recipientEmail || 'Not specified'},
                        {key: 'Sender Name', value: senderName || 'Anonymous'},
                        {key: 'Personal Message', value: message || 'None'},
                      ],
                    },
                  ],
                }}
                action={CartForm.ACTIONS.LinesAdd}
              >
                {(fetcher) => (
                  <button
                    type="submit"
                    onClick={() => open('cart')}
                    disabled={fetcher.state !== 'idle'}
                    className="w-full bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold uppercase text-lg py-4 rounded-lg transition-all hover:shadow-[0_0_20px_rgba(255,0,0,0.6)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {fetcher.state !== 'idle'
                      ? 'Adding...'
                      : 'Add Gift Card to Cart'}
                  </button>
                )}
              </CartForm>

              {/* Gift Card Features */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <h4 className="text-white font-semibold mb-4">
                  Gift Card Benefits
                </h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-[#FF0000] flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Delivered instantly via email
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-[#FF0000] flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Never expires
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-[#FF0000] flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Redeemable on any product
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-[#FF0000] flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Can be used multiple times until balance is zero
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const GIFT_CARD_QUERY = `#graphql
  query GiftCardProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      variants(first: 50) {
        nodes {
          id
          title
          price {
            amount
            currencyCode
          }
          availableForSale
        }
      }
    }
  }
`;

/** @typedef {import('./+types/products.gift-card').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
