import {useFetcher, useLocation} from 'react-router';
import {useState, useEffect, useRef} from 'react';
import {SUPPORTED_COUNTRIES} from '~/lib/i18n';

/**
 * CountrySelector Component - Currency/Country switcher for Shopify Markets
 * @param {{currentCountry: string}} props
 */
export function CountrySelector({currentCountry = 'US'}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const fetcher = useFetcher();
  const location = useLocation();

  const currentCountryData = SUPPORTED_COUNTRIES[currentCountry] || SUPPORTED_COUNTRIES.US;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close dropdown on ESC key
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleCountryChange = (countryCode) => {
    const formData = new FormData();
    formData.append('country', countryCode);
    formData.append('redirectTo', location.pathname + location.search);

    fetcher.submit(formData, {
      method: 'POST',
      action: '/api/country',
    });

    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-white hover:text-[#FF0000]
          transition-colors min-w-[44px] min-h-[44px] rounded
          focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2 focus:ring-offset-black"
        aria-label="Select currency and country"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-sm font-bold">
          {currentCountryData.symbol} {currentCountryData.currency}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-64 bg-black border-2 border-[#FF0000]/30
            rounded-lg shadow-[0_0_30px_rgba(255,0,0,0.3)] z-50
            motion-safe:animate-[fadeSlideUp_200ms_ease-out]"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-2">
            <div className="px-4 py-2 text-xs uppercase text-gray-200 font-bold">
              Select Country & Currency
            </div>

            {Object.entries(SUPPORTED_COUNTRIES).map(([code, data]) => (
              <button
                key={code}
                onClick={() => handleCountryChange(code)}
                className={`w-full px-4 py-3 text-left flex items-center justify-between
                  transition-colors hover:bg-[#FF0000]/10
                  ${code === currentCountry ? 'bg-[#FF0000]/20' : ''}
                  focus:outline-none focus:bg-[#FF0000]/10`}
                role="menuitem"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{data.symbol}</span>
                  <div>
                    <div className="text-white font-medium text-sm">
                      {data.name}
                    </div>
                    <div className="text-gray-200 text-xs">
                      {data.currency}
                    </div>
                  </div>
                </div>

                {code === currentCountry && (
                  <svg
                    className="w-5 h-5 text-[#FF0000]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
