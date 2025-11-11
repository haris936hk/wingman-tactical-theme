import {useState, useEffect} from 'react';
import {Image} from '@shopify/hydrogen';

/**
 * ProductImageGallery Component - Image gallery with animated border and zoom
 * Features animated SVG border frame with red/white gradient
 * Zoom on hover functionality
 * Navigation arrows and thumbnail dots
 */
export function ProductImageGallery({images, selectedVariantImage, productTitle}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Organize images: prioritize selected variant image, then show all product images
  const allImages = [];
  if (selectedVariantImage) {
    allImages.push(selectedVariantImage);
  }
  if (images && images.length > 0) {
    // Add remaining images that aren't the selected variant image
    images.forEach(img => {
      if (!selectedVariantImage || img.id !== selectedVariantImage.id) {
        allImages.push(img);
      }
    });
  }

  // Reset to first image when variant changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedVariantImage?.id]);

  // Handle escape key to close fullscreen
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isFullscreen]);

  // Lock body scroll when fullscreen is active
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  // Preload all images on mount for instant fullscreen viewing
  useEffect(() => {
    if (allImages.length === 0) return;

    // Use requestIdleCallback for low-priority preloading
    const preloadAllImages = () => {
      allImages.forEach((image) => {
        if (image?.url) {
          const img = new window.Image();
          img.src = image.url;
        }
      });
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadAllImages);
    } else {
      setTimeout(preloadAllImages, 100);
    }
  }, [allImages]);

  // Preload adjacent images for faster navigation
  useEffect(() => {
    if (allImages.length <= 1) return;

    const preloadImage = (index) => {
      const image = allImages[index];
      if (image?.url) {
        const img = new window.Image();
        img.src = image.url;
      }
    };

    // Preload next and previous images immediately
    const nextIndex = (currentIndex + 1) % allImages.length;
    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;

    preloadImage(nextIndex);
    preloadImage(prevIndex);
  }, [currentIndex, allImages]);

  const currentImage = allImages[currentIndex];
  const hasMultipleImages = allImages.length > 1;

  const changeImage = (newIndex) => {
    if (isTransitioning) return; // Prevent rapid clicking

    setIsTransitioning(true);

    // Wait for fade out, then change image
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsTransitioning(false);
    }, 150); // Half of the transition duration for smooth crossfade
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? allImages.length - 1 : currentIndex - 1;
    changeImage(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex === allImages.length - 1 ? 0 : currentIndex + 1;
    changeImage(newIndex);
  };

  // Touch handlers for swipe gestures
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50; // Minimum swipe distance in pixels

    if (Math.abs(distance) < minSwipeDistance) return;

    if (distance > 0) {
      // Swiped left - go to next image
      goToNext();
    } else {
      // Swiped right - go to previous image
      goToPrevious();
    }

    // Reset touch positions
    setTouchStart(0);
    setTouchEnd(0);
  };

  if (!currentImage) {
    return (
      <div className="relative w-full">
        {/* Animated SVG Border Frame */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{zIndex: 10}}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF0000" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#FF0000" />
            </linearGradient>
          </defs>
          <rect
            x="2"
            y="2"
            width="calc(100% - 4px)"
            height="calc(100% - 4px)"
            rx="8"
            fill="none"
            stroke="url(#borderGradient)"
            strokeWidth="3"
            strokeDasharray="50 150"
            style={{
              animation: 'border-spin 4s linear infinite',
            }}
          />
        </svg>

        {/* Placeholder for missing image */}
        <div className="aspect-square bg-gray-800 rounded-lg flex items-center justify-center border-2 border-gray-700">
          <svg
            className="w-24 h-24 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="relative w-full group">
        {/* Animated SVG Border Frame */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{zIndex: 10}}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF0000" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#FF0000" />
            </linearGradient>
          </defs>
          <rect
            x="2"
            y="2"
            width="calc(100% - 4px)"
            height="calc(100% - 4px)"
            rx="8"
            fill="none"
            stroke="url(#borderGradient)"
            strokeWidth="3"
            strokeDasharray="50 150"
            style={{
              animation: 'border-spin 4s linear infinite',
            }}
          />
        </svg>

        {/* Navigation Arrows */}
        {hasMultipleImages && (
          <>
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-[#FF0000] text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-[#FF0000] text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Fullscreen Button */}
        <button
          onClick={() => setIsFullscreen(true)}
          onMouseEnter={() => {
            // Preload current image when hovering fullscreen button
            if (currentImage?.url) {
              const img = new window.Image();
              img.src = currentImage.url;
            }
          }}
          className="absolute bottom-4 right-4 z-20 bg-black/70 hover:bg-[#FF0000] text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
          aria-label="View fullscreen"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>

        {/* Image Container with Zoom Effect */}
        <div
          className="rounded-lg overflow-hidden shadow-2xl border-2 border-gray-800 bg-gray-900"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="aspect-square overflow-hidden">
            <Image
              data={currentImage}
              alt={currentImage.altText || productTitle || 'Product Image'}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
              loading="eager"
              fetchpriority="high"
            />
          </div>
        </div>

        {/* Red Glow Shadow Effect on Hover */}
        <div
          className="absolute inset-0 rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            boxShadow: '0 0 40px rgba(255, 0, 0, 0.4)',
            zIndex: 5,
          }}
        />
      </div>

      {/* Thumbnail Dots Indicator */}
      {hasMultipleImages && (
        <div className="flex justify-center gap-2 mt-4">
          {allImages.map((_, index) => (
            <button
              key={index}
              onClick={() => changeImage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-[#FF0000] w-8 shadow-[0_0_10px_rgba(255,0,0,0.6)]'
                  : 'bg-gray-600 hover:bg-gray-400'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setIsFullscreen(false)}
        >
          <div className="relative w-full h-full flex items-center justify-center px-4 py-20 sm:px-8 sm:py-24">
            {/* Close Button (X Icon) */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 z-20 bg-black/70 hover:bg-[#FF0000] text-white p-3 sm:p-4 rounded-full transition-all duration-300 hover:scale-110"
              aria-label="Close fullscreen"
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation Arrows in Fullscreen */}
            {hasMultipleImages && (
              <>
                {/* Previous Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-[#FF0000] text-white p-3 sm:p-4 rounded-full transition-all duration-300 hover:scale-110"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Next Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-[#FF0000] text-white p-3 sm:p-4 rounded-full transition-all duration-300 hover:scale-110"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Fullscreen Image */}
            <div
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                data={currentImage}
                alt={currentImage.altText || productTitle || 'Product Image'}
                className={`max-w-full max-h-full w-auto h-auto object-contain transition-opacity duration-300 ${
                  isTransitioning ? 'opacity-0' : 'opacity-100'
                }`}
                sizes="(min-width: 1536px) 1400px, (min-width: 1024px) 90vw, 95vw"
                loading="eager"
                fetchpriority="high"
              />
            </div>

            {/* Image Counter */}
            {hasMultipleImages && (
              <div className="absolute top-4 sm:top-8 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold">
                {currentIndex + 1} / {allImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
