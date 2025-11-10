import {useEffect, useRef, useState} from 'react';

/**
 * CountUpStat - An animated counter that counts up when in viewport
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon element to display
 * @param {number} props.target - Target number to count to
 * @param {string} props.label - Description text below the number
 * @param {number} [props.duration=2000] - Animation duration in milliseconds
 */
export function CountUpStat({icon, target, label, duration = 2000}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);
  const sessionKey = `countup-${label.replace(/\s+/g, '-').toLowerCase()}`;

  // Check sessionStorage on mount to see if animation already ran this session
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const alreadyAnimated = sessionStorage.getItem(sessionKey);
    if (alreadyAnimated === 'true') {
      setHasAnimated(true);
      setCount(target); // Set to final value immediately
    }
  }, [sessionKey, target]);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    if (hasAnimated) return; // Skip if already animated this session

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // Start animation when element is in viewport and hasn't animated yet
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          sessionStorage.setItem(sessionKey, 'true'); // Mark as animated for this session
          animateCount();
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of element is visible
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [hasAnimated, sessionKey]);

  const animateCount = () => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      // Easing function for smooth animation (ease-out)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * target);

      setCount(currentCount);

      if (now < endTime) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(target); // Ensure final value is exact
      }
    };

    requestAnimationFrame(updateCount);
  };

  return (
    <div ref={elementRef} className="flex flex-col items-center text-center">
      {/* Icon */}
      <div className="mb-4 text-white" style={{
        filter: 'drop-shadow(0 0 8px rgba(211, 47, 47, 0.6)) drop-shadow(0 0 16px rgba(211, 47, 47, 0.4))'
      }}>
        {icon}
      </div>

      {/* Animated Number */}
      <div
        className="text-5xl lg:text-6xl font-bold text-white mb-3"
        style={{
          textShadow: '0 0 10px rgba(211, 47, 47, 0.8), 0 0 20px rgba(211, 47, 47, 0.6), 0 0 30px rgba(211, 47, 47, 0.4)'
        }}
      >
        {count}
      </div>

      {/* Label */}
      <p className="text-base lg:text-lg text-gray-300 font-medium max-w-[200px]">
        {label}
      </p>
    </div>
  );
}
