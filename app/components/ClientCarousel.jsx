import {useState, useEffect, useRef, useCallback} from 'react';

// Use CDN/public folder paths instead of bundled imports for better performance
const clientsData = [
  {
    id: 1,
    title: 'Client 1',
    description: 'Client description here.',
    image: '/images/clients/image.png',
  },
  {
    id: 2,
    title: 'Client 2',
    description: 'Client description here.',
    image: '/images/clients/image copy.png',
  },
  {
    id: 3,
    title: 'Client 3',
    description: 'Client description here.',
    image: '/images/clients/image copy 2.png',
  },
  {
    id: 4,
    title: 'Client 4',
    description: 'Client description here.',
    image: '/images/clients/image copy 3.png',
  },
  {
    id: 5,
    title: 'Client 5',
    description: 'Client description here.',
    image: '/images/clients/image copy 4.png',
  },
  {
    id: 6,
    title: 'Client 6',
    description: 'Client description here.',
    image: '/images/clients/image copy 5.png',
  },
  {
    id: 7,
    title: 'Client 7',
    description: 'Client description here.',
    image: '/images/clients/image copy 6.png',
  },
  {
    id: 8,
    title: 'Client 8',
    description: 'Client description here.',
    image: '/images/clients/image copy 7.png',
  },
  {
    id: 9,
    title: 'Client 9',
    description: 'Client description here.',
    image: '/images/clients/image copy 8.png',
  },
  {
    id: 10,
    title: 'Client 10',
    description: 'Client description here.',
    image: '/images/clients/image copy 9.png',
  },
  {
    id: 11,
    title: 'Client 11',
    description: 'Client description here.',
    image: '/images/clients/image copy 10.png',
  },
  {
    id: 12,
    title: 'Client 12',
    description: 'Client description here.',
    image: '/images/clients/image copy 11.png',
  },
  {
    id: 13,
    title: 'Client 13',
    description: 'Client description here.',
    image: '/images/clients/image copy 12.png',
  },
  {
    id: 14,
    title: 'Client 14',
    description: 'Client description here.',
    image: '/images/clients/image copy 13.png',
  },
  {
    id: 15,
    title: 'Client 15',
    description: 'Client description here.',
    image: '/images/clients/image copy 14.png',
  },
  {
    id: 16,
    title: 'Client 16',
    description: 'Client description here.',
    image: '/images/clients/image copy 15.png',
  },
  {
    id: 17,
    title: 'Client 17',
    description: 'Client description here.',
    image: '/images/clients/image copy 16.png',
  },
  {
    id: 18,
    title: 'Client 18',
    description: 'Client description here.',
    image: '/images/clients/image copy 17.png',
  },
  {
    id: 19,
    title: 'Client 19',
    description: 'Client description here.',
    image: '/images/clients/image copy 18.png',
  },
  {
    id: 20,
    title: 'Client 20',
    description: 'Client description here.',
    image: '/images/clients/image copy 19.png',
  },
  {
    id: 21,
    title: 'Client 21',
    description: 'Client description here.',
    image: '/images/clients/image copy 20.png',
  },
];

// Debounce utility for performance optimization
function useDebounce(callback, delay) {
  const timeoutRef = useRef(null);

  return useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

export function ClientCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(4);

  // Memoized resize handler function
  const handleResize = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (window.innerWidth < 640) {
      setSlidesToShow(1);
    } else if (window.innerWidth < 1024) {
      setSlidesToShow(2);
    } else if (window.innerWidth < 1280) {
      setSlidesToShow(3);
    } else {
      setSlidesToShow(4);
    }
  }, []);

  // Debounced resize handler (250ms delay for better performance)
  const debouncedResize = useDebounce(handleResize, 250);

  // Handle responsive slides with debounced resize listener
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    handleResize(); // Initial call
    window.addEventListener('resize', debouncedResize, {passive: true});
    return () => window.removeEventListener('resize', debouncedResize);
  }, [handleResize, debouncedResize]);

  const maxIndex = Math.max(0, clientsData.length - slidesToShow);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="overflow-hidden px-2">
        <div
          className="flex transition-transform duration-500 ease-out py-4"
          style={{
            transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
          }}
        >
          {clientsData.map((client, index) => (
            <div
              key={client.id}
              className="flex-shrink-0 px-3"
              style={{width: `${100 / slidesToShow}%`}}
            >
              <div
                className="group bg-white rounded-xl overflow-hidden h-full flex flex-col shadow-md relative will-change-transform motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:hover:scale-105 motion-reduce:hover:scale-100 focus-visible:outline-2 focus-visible:outline-[#FF0000] focus-visible:outline-offset-2"
              >
                {/* Optimized border effect - using box-shadow instead of complex gradient */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 motion-reduce:hidden"
                  style={{
                    boxShadow: 'inset 0 0 0 2px #FF0000',
                  }}
                />

                {/* Image */}
                <div className="relative h-64 bg-gray-200 overflow-hidden">
                  <img
                    src={client.image}
                    alt={client.title}
                    className="w-full h-full object-cover motion-safe:transition-opacity motion-safe:duration-300 group-hover:opacity-90"
                    loading="lazy"
                    decoding="async"
                    width="400"
                    height="300"
                    onError={(e) => {
                      e.target.src =
                        'https://via.placeholder.com/400x300?text=' +
                        encodeURIComponent(client.title);
                    }}
                  />
                </div>

                {/* Content */}
                <div className="p-6 text-center flex-1 flex flex-col bg-gradient-to-b from-white to-gray-50 relative">
                  {/* Decorative line - only scale animation */}
                  <div className="w-16 h-1 bg-[#FF0000] mx-auto mb-4 motion-safe:scale-x-0 motion-safe:group-hover:scale-x-100 motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out" />

                  <h3
                    className="text-2xl font-bold uppercase mb-4 text-[#1a1a1a]"
                    style={{
                      textShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                  >
                    {client.title}
                  </h3>

                  <p className="text-gray-700 leading-relaxed">
                    {client.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots Navigation - moved inside container */}
        <div className="flex justify-center gap-3 mt-8">
          {Array.from({length: maxIndex + 1}).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? 'bg-[#FF0000] w-10 h-3 shadow-lg'
                  : 'bg-gray-300 hover:bg-gray-400 w-3 h-3 hover:scale-125'
              }`}
              style={
                currentIndex === index
                  ? {
                      boxShadow: '0 2px 8px rgba(255, 0, 0, 0.5)',
                    }
                  : {}
              }
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Arrows - Optimized with GPU-accelerated animations only */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-[#FF0000] text-[#FF0000] hover:text-white p-4 rounded-full shadow-lg motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:scale-110 border-2 border-[#FF0000] group z-10"
        aria-label="Previous slide"
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
            strokeWidth={2.5}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-[#FF0000] text-[#FF0000] hover:text-white p-4 rounded-full shadow-lg motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:scale-110 border-2 border-[#FF0000] group z-10"
        aria-label="Next slide"
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
            strokeWidth={2.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
