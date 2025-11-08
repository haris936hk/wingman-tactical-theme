import {useState} from 'react';

/**
 * ProductTabs Component - Tabbed interface for product information
 * Tabs: Description, Materials/Ingredients, Shipping, Reviews
 */
export function ProductTabs({
  descriptionHtml,
  materialsContent,
  shippingContent,
  reviewsContent,
}) {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    {id: 'description', label: 'Description', content: descriptionHtml},
    {
      id: 'materials',
      label: 'Materials',
      content: materialsContent || '<p class="text-gray-400">No materials information available.</p>',
    },
    {
      id: 'shipping',
      label: 'Shipping',
      content:
        shippingContent ||
        `<div class="text-gray-300">
          <p class="mb-4"><strong class="text-white">Free Shipping</strong> on orders over $100</p>
          <p class="mb-4"><strong class="text-white">Standard Shipping:</strong> 5-7 business days</p>
          <p class="mb-4"><strong class="text-white">Express Shipping:</strong> 2-3 business days</p>
          <p><strong class="text-white">International Shipping:</strong> 10-15 business days</p>
        </div>`,
    },
    {
      id: 'reviews',
      label: 'Reviews',
      content:
        reviewsContent ||
        '<p class="text-gray-400">No reviews yet. Be the first to review this product!</p>',
    },
  ];

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content || '';

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex border-b border-[#FF0000]/30 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-bold uppercase text-sm tracking-wide
              transition-all duration-300 relative
              ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
          >
            {tab.label}

            {/* Active Tab Indicator */}
            {activeTab === tab.id && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF0000]"
                style={{
                  boxShadow: '0 0 10px rgba(255, 0, 0, 0.6)',
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        className="prose prose-invert max-w-none
          prose-headings:text-white prose-headings:font-bold prose-headings:uppercase
          prose-p:text-gray-300 prose-p:leading-relaxed
          prose-strong:text-white
          prose-ul:text-gray-300 prose-ol:text-gray-300
          prose-li:text-gray-300
          prose-a:text-[#FF0000] prose-a:no-underline hover:prose-a:underline
          motion-safe:animate-[fadeSlideUp_300ms_ease-out]"
        dangerouslySetInnerHTML={{__html: activeContent}}
      />
    </div>
  );
}
