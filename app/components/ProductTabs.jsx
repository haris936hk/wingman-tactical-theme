import {useState, useRef, useEffect} from 'react';

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
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabRefs = useRef({});

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

  // Update indicator position when active tab changes
  useEffect(() => {
    const activeButton = tabRefs.current[activeTab];
    if (activeButton) {
      const {offsetLeft, offsetWidth} = activeButton;
      setIndicatorStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
      });
    }
  }, [activeTab]);

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content || '';

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex border-b border-[#FF0000]/30 mb-6 relative">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => (tabRefs.current[tab.id] = el)}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-bold uppercase text-sm tracking-wide
              transition-colors duration-300 relative
              ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
          >
            {tab.label}
          </button>
        ))}

        {/* Animated Active Tab Indicator */}
        <div
          className="absolute bottom-0 h-0.5 bg-[#FF0000] transition-all duration-300 ease-out"
          style={{
            ...indicatorStyle,
            boxShadow: '0 0 10px rgba(255, 0, 0, 0.6)',
          }}
        />
      </div>

      {/* Tab Content */}
      <div
        className="text-white motion-safe:animate-[fadeSlideUp_300ms_ease-out]
          [&_p]:mb-4 [&_h1]:mb-4 [&_h2]:mb-4 [&_h3]:mb-4 [&_h4]:mb-4 [&_h5]:mb-4 [&_h6]:mb-4
          [&_ul]:mb-4 [&_ol]:mb-4 [&_li]:mb-2
          [&_ul]:pl-6 [&_ol]:pl-6
          [&_ul]:list-disc [&_ol]:list-decimal
          [&_blockquote]:pl-4 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-500 [&_blockquote]:mb-4
          [&_img]:mb-4 [&_table]:mb-4"
        dangerouslySetInnerHTML={{__html: activeContent}}
      />
    </div>
  );
}
