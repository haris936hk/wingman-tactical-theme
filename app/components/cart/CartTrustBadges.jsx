/**
 * Cart Trust Badges - Security & Policy Information
 * Displays trust signals to reduce cart abandonment
 */

export function CartTrustBadges() {
  return (
    <div className="mt-4 space-y-3">
      {/* Security & Payment Icons */}
      <div className="flex items-center justify-center gap-3 py-3 px-4
        bg-black/30 border border-white/10 rounded-lg">
        {/* SSL Security */}
        <div className="flex items-center gap-1.5 text-gray-300" title="SSL Encrypted">
          <svg
            className="w-4 h-4 text-green-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-xs font-bold uppercase tracking-wide">
            Secure
          </span>
        </div>

        <div className="w-px h-4 bg-white/20" />

        {/* Payment Methods */}
        <div className="flex items-center gap-2">
          {/* Visa */}
          <div className="w-8 h-5 bg-white/10 rounded flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">VISA</span>
          </div>
          {/* Mastercard */}
          <div className="w-8 h-5 bg-white/10 rounded flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">MC</span>
          </div>
          {/* Amex */}
          <div className="w-8 h-5 bg-white/10 rounded flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">AMEX</span>
          </div>
        </div>
      </div>

      {/* Policy Quick Links */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {/* Shipping Policy */}
        <div className="flex items-center gap-2 text-gray-300">
          <svg
            className="w-4 h-4 text-[#FF0000] flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
          <span>Free Shipping $100+</span>
        </div>

        {/* Return Policy */}
        <div className="flex items-center gap-2 text-gray-300">
          <svg
            className="w-4 h-4 text-[#FF0000] flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
            />
          </svg>
          <span>30-Day Returns</span>
        </div>

        {/* Customer Support */}
        <div className="flex items-center gap-2 text-gray-300">
          <svg
            className="w-4 h-4 text-[#FF0000] flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <span>24/7 Support</span>
        </div>

        {/* Warranty/Guarantee */}
        <div className="flex items-center gap-2 text-gray-300">
          <svg
            className="w-4 h-4 text-[#FF0000] flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span>Quality Guarantee</span>
        </div>
      </div>
    </div>
  );
}
