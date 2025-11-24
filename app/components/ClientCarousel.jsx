import { useState, useEffect, useRef, useCallback, memo } from 'react';

// Real squadron and client data from Social Proof document
const clientsData = [
  {
    id: 1,
    title: 'VAQ-133 SQN',
    description: 'We equipped the US Navy VAQ-133 Squadron with mission-specific Vietnam tiger stripe pattern flight suits designed by Wingman Tactical, built to endure intense operations while delivering superior fit, comfort, and reliability in the skies.',
    image: '/images/clients/vaq-133.webp',
  },
  {
    id: 2,
    title: 'VFA-151 SQN',
    description: 'Proud to support US Navy VFA-151 Squadron with tailored helmet visor covers—crafted to shield critical JHMCS helmet, maintain visibility, and withstand demanding carrier-based operations for the US Navy\'s premier strike fighter team.',
    image: '/images/clients/vfa-151.webp',
  },
  {
    id: 3,
    title: 'VAQ-129 SQN',
    description: 'Wingman Tactical proudly delivered custom JHMCS and HGU55P helmet visor covers to VAQ-129 Squadron—ensuring their aviators\' critical helmets stay protected, mission-ready, and performance-focused during high-tempo electronic warfare training and operations.',
    image: '/images/clients/vaq-129.webp',
  },
  {
    id: 4,
    title: '149 FS',
    description: 'We equipped the USAF 149th FS—operators of the legendary F-22 Raptor—with Wingman Tactical helmet bags, purpose-built for HMDS protection, mission readiness, and the uncompromising needs of fifth-generation fighter aviators.',
    image: '/images/clients/149-fs.webp',
  },
  {
    id: 5,
    title: '409 SQN – RCAF',
    description: 'Wingman Tactical equipped 409 Squadron of the Royal Canadian Air Force with precision-engineered visor covers—protecting pilot optics and ensuring operational readiness in high-performance CF-18 Hornet missions.',
    image: '/images/clients/409-rcaf.webp',
  },
  {
    id: 6,
    title: 'FANNY VIALLARD – AEROBATIC CHAMPION',
    description: 'Wingman Tactical proudly outfitted French aerobatic pilot Fanny Viallard with a custom black CWU-27/P flight suit—crafted for performance, flexibility, and style to match her precision in the skies as an aerobatic champion.',
    image: '/images/clients/fanny-viallard.webp',
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

export const ClientCarousel = memo(function ClientCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(4);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum swipe distance (in pixels)
  const minSwipeDistance = 50;

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
    window.addEventListener('resize', debouncedResize, { passive: true });
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

  // Touch handlers for swipe functionality
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="overflow-hidden px-1 sm:px-2">
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="flex transition-transform duration-500 ease-out py-3 sm:py-4"
          style={{
            transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
          }}
        >
          {clientsData.map((client, index) => (
            <div
              key={client.id}
              className="flex-shrink-0 px-2 sm:px-3"
              style={{ width: `${100 / slidesToShow}%` }}
            >
              <div
                className="group bg-white rounded-xl overflow-hidden flex flex-col shadow-md relative will-change-transform motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:hover:scale-105 motion-reduce:hover:scale-100 focus-visible:outline-2 focus-visible:outline-[#FF0000] focus-visible:outline-offset-2"
              >
                {/* Optimized border effect - using box-shadow instead of complex gradient */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 motion-reduce:hidden"
                  style={{
                    boxShadow: 'inset 0 0 0 2px #FF0000',
                  }}
                />

                {/* Image */}
                <div className="relative h-48 sm:h-56 md:h-64 bg-gray-200 overflow-hidden">
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
                <div className="px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4 text-center flex flex-col bg-gradient-to-b from-white to-gray-50 relative">
                  {/* Decorative line - only scale animation */}
                  <div className="w-12 sm:w-16 h-1 bg-[#FF0000] mx-auto mb-2 sm:mb-3 motion-safe:scale-x-0 motion-safe:group-hover:scale-x-100 motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out" />

                  <h3
                    className="text-xl sm:text-2xl font-bold uppercase mb-2 text-[#1a1a1a] leading-tight"
                    style={{
                      fontFamily: 'var(--font-family-shock)',
                      textShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                  >
                    {client.title}
                  </h3>

                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {client.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots Navigation - moved inside container */}
        <div className="flex justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 transition-all duration-300"
              aria-label={`Go to slide ${index + 1}`}
            >
              <span
                className={`rounded-full transition-all duration-300 ${currentIndex === index
                  ? 'bg-[#FF0000] w-6 sm:w-8 h-2 sm:h-2.5 shadow-lg'
                  : 'bg-gray-300 hover:bg-gray-400 w-2 sm:w-2.5 h-2 sm:h-2.5 hover:scale-125'
                  }`}
                style={
                  currentIndex === index
                    ? {
                      boxShadow: '0 2px 8px rgba(255, 0, 0, 0.5)',
                    }
                    : {}
                }
              />
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Arrows - Optimized with GPU-accelerated animations only */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 bg-white hover:bg-[#FF0000] text-[#FF0000] hover:text-white p-2 sm:p-3 md:p-4 rounded-full shadow-lg motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:scale-110 border-2 border-[#FF0000] group z-10"
        aria-label="Previous slide"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
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
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 bg-white hover:bg-[#FF0000] text-[#FF0000] hover:text-white p-2 sm:p-3 md:p-4 rounded-full shadow-lg motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:scale-110 border-2 border-[#FF0000] group z-10"
        aria-label="Next slide"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
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
});
