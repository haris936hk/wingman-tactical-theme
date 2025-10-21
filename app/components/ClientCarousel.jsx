import {useState, useEffect} from 'react';

const clientsData = [
  {
    id: 1,
    title: 'USAF 121 FS',
    description:
      "121st Fighter Squadron based at Joint Base Andrews, Camp Springs, Maryland gave Wingman Tactical the privilege to design & restock the Flight Helmet Visor covers for 121 Sqn fighter pilots wearing HMIT & JHMCS.",
    image: '/images/clients/usaf-121-fs.jpg',
  },
  {
    id: 2,
    title: 'VAQ-129 SQN',
    description:
      "Wingman Tactical proudly delivered custom JHMCS and HGU55P helmet visor covers to VAQ-129 Squadron—ensuring their aviators' critical helmets stay protected, mission-ready, and performance-focused during high-tempo electronic warfare training and operations.",
    image: '/images/clients/vaq-129.jpg',
  },
  {
    id: 3,
    title: 'VAQ-133 SQN',
    description:
      'We equipped the US Navy VAQ-133 Squadron with mission-specific Vietnam tiger stripe pattern flight suits designed by Wingman Tactical, built to endure intense operations while delivering superior fit, comfort, and reliability in the skies.',
    image: '/images/clients/vaq-133.jpg',
  },
  {
    id: 4,
    title: 'VFA-151 SQN',
    description:
      "Proud to support US Navy VFA-151 Squadron with tailored helmet visor covers—crafted to shield critical JHMCS helmet, maintain visibility, and withstand demanding carrier-based operations for the US Navy's premier strike fighter team.",
    image: '/images/clients/vfa-151.jpg',
  },
  {
    id: 5,
    title: 'VMFA-314 SQN',
    description:
      'Supporting the legendary Black Knights of VMFA-314 with precision-engineered flight gear and custom helmet visor covers designed for the demanding conditions of carrier operations and combat missions.',
    image: '/images/clients/vmfa-314.jpg',
  },
  {
    id: 6,
    title: 'VFA-2 SQN',
    description:
      'Wingman Tactical equipped the Bounty Hunters of VFA-2 with mission-critical flight suits and tactical gear, ensuring superior performance during high-stakes naval aviation operations.',
    image: '/images/clients/vfa-2.jpg',
  },
];

export function ClientCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(4);

  // Handle responsive slides
  useEffect(() => {
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
    <div className="relative py-8">
      {/* Carousel Container */}
      <div className="overflow-hidden px-2">
        <div
          className="flex transition-transform duration-500 ease-out py-4"
          style={{
            transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
          }}
        >
          {clientsData.map((client) => (
            <div
              key={client.id}
              className="flex-shrink-0 px-3"
              style={{width: `${100 / slidesToShow}%`}}
            >
              <div className="group bg-white rounded-xl overflow-hidden h-full flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl shadow-md relative">
                {/* Animated border effect */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
                  background: 'linear-gradient(45deg, #d32f2f, transparent, #d32f2f)',
                  padding: '2px',
                  zIndex: -1,
                }}>
                  <div className="w-full h-full bg-white rounded-xl" />
                </div>

                {/* Image */}
                <div className="relative h-64 bg-gray-200 overflow-hidden">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                  <img
                    src={client.image}
                    alt={client.title}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src =
                        'https://via.placeholder.com/400x300?text=' +
                        encodeURIComponent(client.title);
                    }}
                  />

                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 text-center flex-1 flex flex-col bg-gradient-to-b from-white to-gray-50 relative">
                  {/* Decorative line */}
                  <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#d32f2f] to-transparent mx-auto mb-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                  <h3 className="text-2xl font-bold uppercase mb-4 text-[#1a1a1a] transform transition-all duration-300 group-hover:text-[#d32f2f]" style={{
                    textShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}>
                    {client.title}
                  </h3>

                  <p className="text-gray-700 leading-relaxed transition-colors duration-300 group-hover:text-gray-900">
                    {client.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots Navigation - moved inside container */}
        <div className="flex justify-center gap-3 mt-8 mb-2">
          {Array.from({length: maxIndex + 1}).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? 'bg-[#d32f2f] w-10 h-3 shadow-lg'
                  : 'bg-gray-300 hover:bg-gray-400 w-3 h-3 hover:scale-125'
              }`}
              style={
                currentIndex === index
                  ? {
                      boxShadow: '0 2px 8px rgba(211, 47, 47, 0.4)',
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
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-[#d32f2f] text-[#d32f2f] hover:text-white p-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-[#d32f2f] group z-10"
        aria-label="Previous slide"
        style={{
          boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 0 20px rgba(211, 47, 47, 0.2)'
        }}
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
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-[#d32f2f] text-[#d32f2f] hover:text-white p-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-[#d32f2f] group z-10"
        aria-label="Next slide"
        style={{
          boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 0 20px rgba(211, 47, 47, 0.2)'
        }}
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
