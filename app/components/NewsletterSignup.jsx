import {useFetcher} from 'react-router';
import {useState} from 'react';

/**
 * NewsletterSignup Component - Email subscription form
 * Collects email addresses for marketing campaigns
 * @param {{
 *   variant?: 'default' | 'compact' | 'hero';
 *   title?: string;
 *   description?: string;
 *   className?: string;
 * }}
 */
export function NewsletterSignup({
  variant = 'default',
  title = 'Stay Informed',
  description = 'Subscribe to receive updates on new products, exclusive offers, and tactical gear news.',
  className = '',
}) {
  const fetcher = useFetcher();
  const [email, setEmail] = useState('');

  const isSubmitting = fetcher.state === 'submitting';
  const isSuccess = fetcher.data?.success;
  const error = fetcher.data?.error;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    fetcher.submit(
      {email, action: 'subscribe'},
      {method: 'POST', action: '/api/newsletter'},
    );
  };

  // Reset form on success
  if (isSuccess && email) {
    setTimeout(() => setEmail(''), 100);
  }

  if (variant === 'compact') {
    return (
      <div className={className}>
        <h3 className="text-lg font-bold text-white uppercase mb-3" style={{fontFamily: 'var(--font-family-shock)'}}>
          {title}
        </h3>
        <p className="text-sm text-gray-200 mb-4">{description}</p>
        <fetcher.Form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={isSubmitting || isSuccess}
              className="flex-1 px-4 py-2 bg-black border-2 border-white/30 rounded-lg
                text-white placeholder-gray-400
                focus:outline-none focus:border-[#FF0000] transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Email address"
            />
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="px-6 py-2 bg-[#FF0000] text-white font-bold uppercase text-sm
                rounded-lg hover:bg-[#CC0000] transition-all duration-300
                shadow-[0_0_15px_rgba(255,0,0,0.5)] hover:shadow-[0_0_25px_rgba(255,0,0,0.7)]
                disabled:opacity-50 disabled:cursor-not-allowed
                min-w-[44px] min-h-[44px]"
            >
              {isSubmitting ? (
                <svg
                  className="animate-spin h-5 w-5 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
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
              ) : isSuccess ? (
                '✓'
              ) : (
                'Sign Up'
              )}
            </button>
          </div>
          {isSuccess && (
            <p className="text-sm text-[#FF0000] font-medium" role="status">
              Thank you for subscribing!
            </p>
          )}
          {error && (
            <p className="text-sm text-orange-400" role="alert">
              {error}
            </p>
          )}
        </fetcher.Form>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div
        className={`bg-gradient-to-r from-black via-[#1a0000] to-black border-2 border-[#FF0000]/30 rounded-lg p-8 lg:p-12 ${className}`}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-3xl lg:text-4xl font-bold uppercase text-[#FF0000] mb-4"
            style={{fontFamily: 'var(--font-family-shock)'}}
          >
            {title}
          </h2>
          <p className="text-gray-200 mb-8 text-lg">{description}</p>
          <fetcher.Form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                disabled={isSubmitting || isSuccess}
                className="flex-1 px-6 py-4 bg-black border-2 border-white/30 rounded-lg
                  text-white placeholder-gray-400 text-lg
                  focus:outline-none focus:border-[#FF0000] transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Email address"
              />
              <button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className="px-8 py-4 bg-[#FF0000] text-white font-bold uppercase text-lg
                  rounded-lg hover:bg-[#CC0000] transition-all duration-300
                  shadow-[0_0_20px_rgba(255,0,0,0.6)] hover:shadow-[0_0_30px_rgba(255,0,0,0.8)]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  min-w-[44px] min-h-[44px]"
              >
                {isSubmitting ? 'Subscribing...' : isSuccess ? 'Subscribed!' : 'Subscribe'}
              </button>
            </div>
            {isSuccess && (
              <p
                className="text-[#FF0000] font-medium text-lg"
                role="status"
              >
                ✓ Thank you for subscribing! Check your email to confirm.
              </p>
            )}
            {error && (
              <p className="text-orange-400" role="alert">
                {error}
              </p>
            )}
          </fetcher.Form>
          <p className="text-gray-400 text-sm mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={`bg-black/50 border-2 border-[#FF0000]/30 rounded-lg p-6 ${className}`}
    >
      <h3
        className="text-2xl font-bold uppercase text-[#FF0000] mb-3"
        style={{fontFamily: 'var(--font-family-shock)'}}
      >
        {title}
      </h3>
      <p className="text-gray-200 mb-6">{description}</p>
      <fetcher.Form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={isSubmitting || isSuccess}
            className="flex-1 px-4 py-3 bg-black border-2 border-white/30 rounded-lg
              text-white placeholder-gray-400
              focus:outline-none focus:border-[#FF0000] transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Email address"
          />
          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className="px-6 py-3 bg-[#FF0000] text-white font-bold uppercase
              rounded-lg hover:bg-[#CC0000] transition-all duration-300
              shadow-[0_0_15px_rgba(255,0,0,0.5)] hover:shadow-[0_0_25px_rgba(255,0,0,0.7)]
              disabled:opacity-50 disabled:cursor-not-allowed
              min-w-[44px] min-h-[44px] flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
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
                <span>Subscribing...</span>
              </>
            ) : isSuccess ? (
              <span>✓ Subscribed!</span>
            ) : (
              <span>Subscribe</span>
            )}
          </button>
        </div>
        {isSuccess && (
          <p className="text-sm text-[#FF0000] font-medium" role="status">
            ✓ Thank you for subscribing! Check your email to confirm.
          </p>
        )}
        {error && (
          <p className="text-sm text-orange-400" role="alert">
            {error}
          </p>
        )}
      </fetcher.Form>
      <p className="text-gray-400 text-xs mt-4">
        By subscribing, you agree to receive marketing emails from Wingman
        Tactical. You can unsubscribe at any time.
      </p>
    </div>
  );
}

/**
 * NewsletterPopup Component - Inline newsletter signup in sections
 * Can be used in homepage or other strategic locations
 * @param {{className?: string}}
 */
export function NewsletterSection({className = ''}) {
  return (
    <section className={`py-16 lg:py-24 bg-black ${className}`}>
      <div className="max-w-[1400px] mx-auto px-6">
        <NewsletterSignup variant="hero" />
      </div>
    </section>
  );
}
