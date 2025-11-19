import {useState, useEffect} from 'react';
import {Link} from 'react-router';
import aboutUsImg from '~/assets/aboutus.png';

export function CustomProductCarousel({items, showCTA = false, onQuoteClick}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(4);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum swipe distance (in pixels)
  const minSwipeDistance = 50;

  // Handle responsive slides
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 768) {
        setSlidesToShow(2);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(3);
      } else {
        setSlidesToShow(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!items || items.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        No products available
      </div>
    );
  }

  const maxIndex = Math.max(0, items.length - slidesToShow);

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
          {items.map((item, index) => (
            <div
              key={item.image}
              className="flex-shrink-0 px-2 sm:px-3"
              style={{width: `${100 / slidesToShow}%`}}
            >
              <CustomProductCard item={item} index={index} />
            </div>
          ))}
        </div>

        {/* CTA Image Section - inside overflow container */}
        {showCTA && (
          <div className="mt-8 sm:mt-10 md:mt-12 px-2 sm:px-3">
            <div className="relative block h-[200px] sm:h-[250px] md:h-[280px] lg:h-[300px] rounded-lg overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60 z-10" />
              <img
                src={aboutUsImg}
                alt="Get a Quote for Custom Aviation Gear"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                decoding="async"
                width="1400"
                height="280"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4 sm:px-6 md:px-8">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold uppercase text-white mb-3 sm:mb-4 text-center leading-tight">
                  GET A QUOTE FOR YOUR<br className="hidden sm:block" /> CUSTOM GEAR NOW!
                </h3>
                <button
                  onClick={onQuoteClick}
                  className="relative inline-block w-full sm:w-auto min-h-[44px] px-6 sm:px-8 py-3 sm:py-4 font-bold uppercase tracking-wide text-white overflow-hidden rounded-lg backdrop-blur-md bg-gradient-to-r from-[#FF0000] via-gray-600 to-[#FF0000] bg-[length:200%_100%] motion-safe:animate-[gradient_3s_linear_infinite] shadow-[0_0_20px_rgba(255,0,0,0.6)] hover:shadow-[0_0_30px_rgba(255,0,0,0.8)] motion-safe:hover:-translate-y-1 transition-all duration-300 border border-white/20"
                >
                  GET A QUOTE
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Arrows - vertically centered on carousel cards */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-[180px] sm:top-[220px] -translate-y-1/2 -translate-x-2 sm:-translate-x-4 bg-white hover:bg-[#FF0000] text-[#FF0000] hover:text-white p-2 sm:p-3 md:p-4 rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(255,0,0,0.6)] transition-all duration-300 hover:scale-110 border-2 border-[#FF0000] group z-10"
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
        className="absolute right-0 top-[180px] sm:top-[220px] -translate-y-1/2 translate-x-2 sm:translate-x-4 bg-white hover:bg-[#FF0000] text-[#FF0000] hover:text-white p-2 sm:p-3 md:p-4 rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(255,0,0,0.6)] transition-all duration-300 hover:scale-110 border-2 border-[#FF0000] group z-10"
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

// Simplified Custom Product Card - Only Image and Title
function CustomProductCard({item, index}) {
  return (
    <Link
      to={item.link || '/pages/quote'}
      className="group block bg-white rounded-lg overflow-hidden shadow-md will-change-transform motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:hover:scale-105 motion-reduce:hover:scale-100 focus-visible:outline-2 focus-visible:outline-[#FF0000] focus-visible:outline-offset-2 opacity-0 translate-y-4 motion-safe:animate-[fadeSlideUp_300ms_ease-out_forwards]"
      style={{animationDelay: `${index * 50}ms`}}
    >
      {/* Image Container with Aspect Ratio */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          decoding="async"
          width="400"
          height="400"
        />

        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Title Container */}
      <div className="p-4 sm:p-5 md:p-6 text-center">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#FF0000] transition-colors duration-300 line-clamp-2 min-h-[3rem] sm:min-h-[3.5rem]">
          {item.title}
        </h3>
      </div>
    </Link>
  );
}
