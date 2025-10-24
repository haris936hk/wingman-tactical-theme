import {useState, useEffect} from 'react';
import {Link} from 'react-router';
import aboutUsImg from '~/assets/aboutus.png';

export function CustomProductCarousel({items, showCTA = false}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(4);

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

  return (
    <div className="relative">
      {/* Carousel Container - full width with proper padding for shadows */}
      <div className="py-8">
        <div className="overflow-x-hidden -mx-6 px-6 pt-8 pb-4">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
            }}
          >
            {items.map((item) => (
              <div
                key={item.image}
                className="flex-shrink-0 px-3"
                style={{width: `${100 / slidesToShow}%`}}
              >
                <CustomProductCard item={item} />
              </div>
            ))}
          </div>

          {/* CTA Image Section - inside overflow container */}
          {showCTA && (
            <div className="mt-6 px-3">
              <Link to="/pages/quote" className="relative block h-[250px] md:h-[280px] rounded-lg overflow-hidden group">
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
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-8">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase text-white mb-4 text-center leading-tight">
                    GET A QUOTE FOR YOUR<br />CUSTOM GEAR NOW!
                  </h3>
                  <span className="inline-block px-6 py-3 bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold text-base md:text-lg uppercase rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(255,0,0,0.8)] transition-all duration-300 transform group-hover:scale-105">
                    Get a Quote
                  </span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Arrows - vertically centered on carousel cards */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-[220px] -translate-y-1/2 -translate-x-4 bg-white hover:bg-[#FF0000] text-[#FF0000] hover:text-white p-4 rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(255,0,0,0.6)] transition-all duration-300 hover:scale-110 border-2 border-[#FF0000] group z-10"
        aria-label="Previous slide"
      >
        <svg
          className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform duration-300"
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
        className="absolute right-0 top-[220px] -translate-y-1/2 translate-x-4 bg-white hover:bg-[#FF0000] text-[#FF0000] hover:text-white p-4 rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(255,0,0,0.6)] transition-all duration-300 hover:scale-110 border-2 border-[#FF0000] group z-10"
        aria-label="Next slide"
      >
        <svg
          className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300"
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
function CustomProductCard({item}) {
  return (
    <Link
      to={item.link || '/pages/quote'}
      className="group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-[0_0_25px_rgba(255,0,0,0.6)] transition-all duration-300 transform hover:-translate-y-2"
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
      <div className="p-6 text-center">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#FF0000] transition-colors duration-300 line-clamp-2 min-h-[3.5rem]">
          {item.title}
        </h3>
      </div>
    </Link>
  );
}
