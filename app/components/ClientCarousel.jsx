import {useState, useEffect} from 'react';

// Import client images for cache busting
import client1 from '~/assets/images/clients/image.png';
import client2 from '~/assets/images/clients/image copy.png';
import client3 from '~/assets/images/clients/image copy 2.png';
import client4 from '~/assets/images/clients/image copy 3.png';
import client5 from '~/assets/images/clients/image copy 4.png';
import client6 from '~/assets/images/clients/image copy 5.png';
import client7 from '~/assets/images/clients/image copy 6.png';
import client8 from '~/assets/images/clients/image copy 7.png';
import client9 from '~/assets/images/clients/image copy 8.png';
import client10 from '~/assets/images/clients/image copy 9.png';
import client11 from '~/assets/images/clients/image copy 10.png';
import client12 from '~/assets/images/clients/image copy 11.png';
import client13 from '~/assets/images/clients/image copy 12.png';
import client14 from '~/assets/images/clients/image copy 13.png';
import client15 from '~/assets/images/clients/image copy 14.png';
import client16 from '~/assets/images/clients/image copy 15.png';
import client17 from '~/assets/images/clients/image copy 16.png';
import client18 from '~/assets/images/clients/image copy 17.png';
import client19 from '~/assets/images/clients/image copy 18.png';
import client20 from '~/assets/images/clients/image copy 19.png';
import client21 from '~/assets/images/clients/image copy 20.png';

const clientsData = [
  {
    id: 1,
    title: 'Client 1',
    description: 'Client description here.',
    image: client1,
  },
  {
    id: 2,
    title: 'Client 2',
    description: 'Client description here.',
    image: client2,
  },
  {
    id: 3,
    title: 'Client 3',
    description: 'Client description here.',
    image: client3,
  },
  {
    id: 4,
    title: 'Client 4',
    description: 'Client description here.',
    image: client4,
  },
  {
    id: 5,
    title: 'Client 5',
    description: 'Client description here.',
    image: client5,
  },
  {
    id: 6,
    title: 'Client 6',
    description: 'Client description here.',
    image: client6,
  },
  {
    id: 7,
    title: 'Client 7',
    description: 'Client description here.',
    image: client7,
  },
  {
    id: 8,
    title: 'Client 8',
    description: 'Client description here.',
    image: client8,
  },
  {
    id: 9,
    title: 'Client 9',
    description: 'Client description here.',
    image: client9,
  },
  {
    id: 10,
    title: 'Client 10',
    description: 'Client description here.',
    image: client10,
  },
  {
    id: 11,
    title: 'Client 11',
    description: 'Client description here.',
    image: client11,
  },
  {
    id: 12,
    title: 'Client 12',
    description: 'Client description here.',
    image: client12,
  },
  {
    id: 13,
    title: 'Client 13',
    description: 'Client description here.',
    image: client13,
  },
  {
    id: 14,
    title: 'Client 14',
    description: 'Client description here.',
    image: client14,
  },
  {
    id: 15,
    title: 'Client 15',
    description: 'Client description here.',
    image: client15,
  },
  {
    id: 16,
    title: 'Client 16',
    description: 'Client description here.',
    image: client16,
  },
  {
    id: 17,
    title: 'Client 17',
    description: 'Client description here.',
    image: client17,
  },
  {
    id: 18,
    title: 'Client 18',
    description: 'Client description here.',
    image: client18,
  },
  {
    id: 19,
    title: 'Client 19',
    description: 'Client description here.',
    image: client19,
  },
  {
    id: 20,
    title: 'Client 20',
    description: 'Client description here.',
    image: client20,
  },
  {
    id: 21,
    title: 'Client 21',
    description: 'Client description here.',
    image: client21,
  },
];

export function ClientCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(4);

  // Handle responsive slides
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else if (window.innerWidth < 1280) {
        setSlidesToShow(3);
      } else {
        setSlidesToShow(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
                className="group bg-white rounded-xl overflow-hidden h-full flex flex-col shadow-md relative will-change-transform motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-out hover:scale-[1.03] hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(255,0,0,0.6)] focus-visible:scale-[1.03] focus-visible:-translate-y-2 focus-visible:shadow-[0_0_25px_rgba(255,0,0,0.6)] focus-visible:outline-2 focus-visible:outline-[#FF0000] focus-visible:outline-offset-2 opacity-0 translate-y-4 motion-safe:animate-[fadeSlideUp_300ms_ease-out_forwards]"
                style={{animationDelay: `${index * 50}ms`}}
              >
                {/* Optimized border effect - only opacity changes */}
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10"
                  style={{
                    background: 'linear-gradient(45deg, #FF0000 0%, transparent 50%, #FF0000 100%)',
                    padding: '2px',
                  }}
                >
                  <div className="w-full h-full bg-white rounded-xl" />
                </div>

                {/* Image */}
                <div className="relative h-64 bg-gray-200 overflow-hidden">
                  {/* Simplified gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                  <img
                    src={client.image}
                    alt={client.title}
                    className="w-full h-full object-cover"
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
                  {/* Simplified decorative line */}
                  <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#FF0000] to-transparent mx-auto mb-4 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />

                  <h3
                    className="text-2xl font-bold uppercase mb-4 text-[#1a1a1a] transition-colors duration-300 ease-out group-hover:text-[#FF0000]"
                    style={{
                      textShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                  >
                    {client.title}
                  </h3>

                  <p className="text-gray-700 leading-relaxed transition-colors duration-300 ease-out group-hover:text-gray-900">
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

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-[#FF0000] text-[#FF0000] hover:text-white p-4 rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(255,0,0,0.6)] transition-all duration-300 hover:scale-110 border-2 border-[#FF0000] group z-10"
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
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-[#FF0000] text-[#FF0000] hover:text-white p-4 rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(255,0,0,0.6)] transition-all duration-300 hover:scale-110 border-2 border-[#FF0000] group z-10"
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
