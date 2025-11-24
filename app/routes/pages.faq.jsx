import {useState} from 'react';
import {trackAccordionToggle} from '~/lib/analytics';

export const meta = () => {
  return [
    {title: 'Frequently Asked Questions | Wingman Tactical'},
    {
      name: 'description',
      content:
        'Find answers to common questions about Wingman Tactical products, shipping, returns, and more.',
    },
  ];
};

const faqCategories = [
  {
    category: 'Orders & Shipping',
    questions: [
      {
        question: 'How long does shipping take?',
        answer:
          'Standard shipping typically takes 3-5 business days within the continental United States. Expedited shipping options (2-day and overnight) are available at checkout. International shipping times vary by destination, typically 7-14 business days.',
      },
      {
        question: 'Do you ship internationally?',
        answer:
          'Yes, we ship to most countries worldwide. International shipping costs and delivery times vary by destination. Please note that customs fees, duties, and taxes may apply and are the responsibility of the customer.',
      },
      {
        question: 'How can I track my order?',
        answer:
          'Once your order ships, you\'ll receive a confirmation email with a tracking number. You can also track your order by logging into your account and viewing your order history.',
      },
      {
        question: 'Can I change or cancel my order?',
        answer:
          'Orders can be modified or canceled within 1 hour of placement. After that, orders enter our fulfillment process and cannot be changed. Please contact us immediately if you need to make changes.',
      },
    ],
  },
  {
    category: 'Returns & Exchanges',
    questions: [
      {
        question: 'What is your return policy?',
        answer:
          'We offer a 30-day return policy on most items. Products must be unused, in original condition, and in original packaging. Custom or personalized items cannot be returned unless defective. Return shipping costs are the responsibility of the customer unless the item is defective.',
      },
      {
        question: 'How do I start a return?',
        answer:
          'Log into your account, go to Order History, select the order you wish to return, and click "Return Items." Follow the prompts to generate a return authorization. Ship the item back using the provided instructions.',
      },
      {
        question: 'When will I receive my refund?',
        answer:
          'Refunds are processed within 5-7 business days after we receive and inspect your returned item. The refund will be issued to your original payment method. Please allow 3-5 additional business days for the refund to appear in your account.',
      },
      {
        question: 'Can I exchange an item?',
        answer:
          'Yes! We\'re happy to exchange items for a different size, color, or variant. Start a return for the original item and place a new order for the replacement. This ensures you get your new item as quickly as possible.',
      },
    ],
  },
  {
    category: 'Products & Sizing',
    questions: [
      {
        question: 'How do I choose the right size?',
        answer:
          'Each product page includes a detailed size chart. Measure yourself according to the instructions and compare your measurements to our charts. If you\'re between sizes, we generally recommend sizing up for tactical gear to ensure proper fit with equipment.',
      },
      {
        question: 'Are your products authentic?',
        answer:
          'Absolutely. We source all products directly from manufacturers or authorized distributors. Every item is guaranteed authentic, and we stand behind the quality of everything we sell.',
      },
      {
        question: 'Do you offer customization or patches?',
        answer:
          'Yes! We offer custom patches, embroidery, and personalization services for many of our products. Visit our customization page or contact us for details on available options and pricing.',
      },
      {
        question: 'What materials are used in your flight suits?',
        answer:
          'Our flight suits are made from high-quality, fire-resistant Nomex® fabric or durable cotton blends, depending on the model. All materials meet military specifications and are designed for comfort, durability, and safety.',
      },
    ],
  },
  {
    category: 'Payment & Security',
    questions: [
      {
        question: 'What payment methods do you accept?',
        answer:
          'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. All transactions are processed securely through Shopify\'s encrypted payment gateway.',
      },
      {
        question: 'Is my payment information secure?',
        answer:
          'Yes. We use industry-standard SSL encryption to protect your payment information. We never store complete credit card numbers on our servers. All payment processing is handled securely by Shopify Payments.',
      },
      {
        question: 'Do you offer military or first responder discounts?',
        answer:
          'Yes! We offer a 10% discount to active military, veterans, and first responders. Verify your status through ID.me at checkout to receive your discount. Thank you for your service!',
      },
      {
        question: 'Can I use multiple discount codes?',
        answer:
          'Only one discount code can be applied per order. If you have multiple codes, use the one that provides the greatest savings. Some promotions cannot be combined with other offers.',
      },
    ],
  },
  {
    category: 'Account & Support',
    questions: [
      {
        question: 'Do I need an account to place an order?',
        answer:
          'No, you can checkout as a guest. However, creating an account allows you to track orders, save addresses, view order history, create wishlists, and receive exclusive member offers.',
      },
      {
        question: 'How do I reset my password?',
        answer:
          'Click "Login" at the top of the page, then click "Forgot Password." Enter your email address and we\'ll send you a password reset link. Check your spam folder if you don\'t see the email within a few minutes.',
      },
      {
        question: 'How can I contact customer support?',
        answer:
          'You can reach us by email at sales@wingmandepot.com or call us at +1-202-674-8681 during business hours (Monday-Friday, 9 AM - 5 PM ET). We typically respond to emails within 24 hours.',
      },
      {
        question: 'Do you have a physical store?',
        answer:
          'Currently, we operate exclusively online to offer the best prices and widest selection. This allows us to serve customers worldwide and keep costs low.',
      },
    ],
  },
  {
    category: 'Warranty & Care',
    questions: [
      {
        question: 'Do your products come with a warranty?',
        answer:
          'Most products come with manufacturer warranties ranging from 90 days to lifetime, depending on the brand and item. Warranty details are listed on individual product pages. Contact us for warranty claims or questions.',
      },
      {
        question: 'How do I care for my tactical gear?',
        answer:
          'Care instructions vary by product. Generally, machine wash cold on gentle cycle and air dry. Avoid bleach and fabric softeners. For Nomex® and fire-resistant materials, follow the care label closely to maintain protective properties.',
      },
      {
        question: 'What if my item arrives defective?',
        answer:
          'We inspect all items before shipping, but if you receive a defective product, contact us immediately. We\'ll arrange a free return and send a replacement or provide a full refund, including return shipping costs.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="bg-[#000000] min-h-screen pt-[180px] pb-16">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold uppercase text-white mb-4"
            style={{
              fontFamily: 'var(--font-family-shock)',
              textShadow: '0 0 15px rgba(255, 0, 0, 0.6)',
            }}
          >
            Frequently Asked Questions
          </h1>
          <p className="text-gray-300 text-lg">
            Find answers to common questions about our products, shipping, and
            policies.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {faqCategories.map((category, categoryIndex) => (
            <div
              key={category.category}
              className="bg-white/5 backdrop-blur-sm rounded-lg border border-[#FF0000]/30 p-6 md:p-8"
            >
              {/* Category Title */}
              <h2 className="text-2xl font-bold uppercase text-white mb-6 pb-4 border-b border-white/10" style={{fontFamily: 'var(--font-family-shock)'}}>
                {category.category}
              </h2>

              {/* Questions */}
              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => (
                  <FAQItem
                    key={questionIndex}
                    question={faq.question}
                    answer={faq.answer}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-16 bg-gradient-to-r from-[#FF0000]/20 to-transparent rounded-lg border border-[#FF0000]/50 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4" style={{fontFamily: 'var(--font-family-shock)'}}>
            Still Have Questions?
          </h2>
          <p className="text-gray-300 mb-6">
            Our customer support team is here to help. Reach out and we'll get
            back to you within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:sales@wingmandepot.com"
              className="inline-block px-8 py-3 bg-[#FF0000] text-white font-bold uppercase rounded hover:bg-[#CC0000] transition-colors"
            >
              Email Us
            </a>
            <a
              href="tel:+12026748681"
              className="inline-block px-8 py-3 border-2 border-white/30 text-white font-bold uppercase rounded hover:bg-white/10 transition-colors"
            >
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Individual FAQ Accordion Item
 */
function FAQItem({question, answer}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    trackAccordionToggle(question, newState);
  };

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="text-white font-semibold pr-4">{question}</span>
        <svg
          className={`w-5 h-5 text-[#FF0000] flex-shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 text-gray-300 leading-relaxed border-t border-white/10 pt-4 bg-white/5">
          {answer}
        </div>
      )}
    </div>
  );
}
