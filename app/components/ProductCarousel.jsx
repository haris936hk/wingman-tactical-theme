import {useState, useEffect, useCallback, useRef} from 'react';
import {ProductItem} from '~/components/ProductItem';

// Debounce utility for performance optimization
function useDebounce(callback, delay) {
  const timeoutRef = useRef(null);
  return useCallback(
    (...args) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay]
  );
}

export function ProductCarousel({products, showSaleBadge = false}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(4);

  // Memoized resize handler
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

  if (!products || products.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        No products available
      </div>
    );
  }

  const maxIndex = Math.max(0, products.length - slidesToShow);

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
      <div className="overflow-hidden px-1 sm:px-2">
        <div
          className="flex transition-transform duration-500 ease-out py-3 sm:py-4"
          style={{
            transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
          }}
        >
          {products.map((product, index) => (
            <div
              key={product.id}
              className="flex-shrink-0 px-2 sm:px-3"
              style={{width: `${100 / slidesToShow}%`}}
            >
              <ProductItem product={product} loading="lazy" showSaleBadge={showSaleBadge} index={index} />
            </div>
          ))}
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
          {Array.from({length: maxIndex + 1}).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-300 min-w-[32px] min-h-[32px] flex items-center justify-center ${
                currentIndex === index
                  ? 'bg-[#FF0000] w-8 sm:w-10 h-2.5 sm:h-3 shadow-lg'
                  : 'bg-gray-300 hover:bg-gray-400 w-2.5 sm:w-3 h-2.5 sm:h-3 hover:scale-125'
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

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 bg-white hover:bg-[#FF0000] text-[#FF0000] hover:text-white p-2 sm:p-3 md:p-4 rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(255,0,0,0.6)] transition-all duration-300 hover:scale-110 border-2 border-[#FF0000] group z-10"
        aria-label="Previous slide"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:-translate-x-1 transition-transform duration-300"
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
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 bg-white hover:bg-[#FF0000] text-[#FF0000] hover:text-white p-2 sm:p-3 md:p-4 rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(255,0,0,0.6)] transition-all duration-300 hover:scale-110 border-2 border-[#FF0000] group z-10"
        aria-label="Next slide"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:translate-x-1 transition-transform duration-300"
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
