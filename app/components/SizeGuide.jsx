import {useState, useEffect, useRef} from 'react';

/**
 * SizeGuide Component - Modal with product sizing information
 * Displays size charts for apparel and tactical gear
 * @param {{isOpen: boolean, onClose: () => void, productType?: string}}
 */
export function SizeGuide({isOpen, onClose, productType = 'apparel'}) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Focus trap and ESC key handling
  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    setTimeout(() => {
      const firstFocusable = modalRef.current?.querySelector('button');
      firstFocusable?.focus();
    }, 100);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-guide-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className="relative bg-[#000000] rounded-lg border-2 border-[#FF0000] shadow-[0_0_40px_rgba(255,0,0,0.6)] w-full max-w-4xl max-h-[90vh] overflow-hidden motion-safe:animate-[fadeSlideUp_300ms_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-black border-b border-[#FF0000]/30 p-6 flex items-center justify-between z-10">
          <h2
            id="size-guide-title"
            className="text-2xl md:text-3xl font-bold uppercase text-white"
            style={{
              fontFamily: 'var(--font-family-shock)',
              textShadow: '0 0 10px rgba(255, 0, 0, 0.6)',
            }}
          >
            Size Guide
          </h2>
          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-white hover:text-[#FF0000] transition-colors"
            aria-label="Close size guide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-88px)] p-6">
          {productType === 'apparel' && <ApparelSizeChart />}
          {productType === 'gloves' && <GlovesSizeChart />}
          {productType === 'footwear' && <FootwearSizeChart />}
          {productType === 'headwear' && <HeadwearSizeChart />}

          {/* Measurement Instructions */}
          <MeasurementInstructions />
        </div>
      </div>
    </div>
  );
}

/**
 * Apparel Size Chart - Flight suits, uniforms, jackets
 */
function ApparelSizeChart() {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-white uppercase mb-4">Apparel Sizing</h3>
      <p className="text-gray-200 text-sm mb-4">
        All measurements are in inches. For the best fit, measure yourself and compare to the chart below.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-2 border-white/30 rounded-lg overflow-hidden">
          <thead className="bg-[#FF0000]">
            <tr>
              <th className="px-4 py-3 text-left text-white font-bold uppercase">Size</th>
              <th className="px-4 py-3 text-left text-white font-bold uppercase">Chest</th>
              <th className="px-4 py-3 text-left text-white font-bold uppercase">Waist</th>
              <th className="px-4 py-3 text-left text-white font-bold uppercase">Sleeve</th>
              <th className="px-4 py-3 text-left text-white font-bold uppercase">Inseam</th>
            </tr>
          </thead>
          <tbody className="bg-black/50">
            {[
              {size: 'XS', chest: '32-34', waist: '26-28', sleeve: '31-32', inseam: '29-30'},
              {size: 'S', chest: '34-36', waist: '28-30', sleeve: '32-33', inseam: '30-31'},
              {size: 'M', chest: '38-40', waist: '32-34', sleeve: '33-34', inseam: '31-32'},
              {size: 'L', chest: '42-44', waist: '36-38', sleeve: '34-35', inseam: '32-33'},
              {size: 'XL', chest: '46-48', waist: '40-42', sleeve: '35-36', inseam: '33-34'},
              {size: '2XL', chest: '50-52', waist: '44-46', sleeve: '36-37', inseam: '34-35'},
              {size: '3XL', chest: '54-56', waist: '48-50', sleeve: '37-38', inseam: '35-36'},
            ].map((row, index) => (
              <tr key={row.size} className={index % 2 === 0 ? 'bg-white/5' : ''}>
                <td className="px-4 py-3 text-white font-bold">{row.size}</td>
                <td className="px-4 py-3 text-gray-200">{row.chest}</td>
                <td className="px-4 py-3 text-gray-200">{row.waist}</td>
                <td className="px-4 py-3 text-gray-200">{row.sleeve}</td>
                <td className="px-4 py-3 text-gray-200">{row.inseam}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Gloves Size Chart
 */
function GlovesSizeChart() {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-white uppercase mb-4">Glove Sizing</h3>
      <p className="text-gray-200 text-sm mb-4">
        Measure around the widest part of your hand (excluding thumb) to find your size.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-2 border-white/30 rounded-lg overflow-hidden">
          <thead className="bg-[#FF0000]">
            <tr>
              <th className="px-4 py-3 text-left text-white font-bold uppercase">Size</th>
              <th className="px-4 py-3 text-left text-white font-bold uppercase">Hand Circumference (in)</th>
              <th className="px-4 py-3 text-left text-white font-bold uppercase">Hand Length (in)</th>
            </tr>
          </thead>
          <tbody className="bg-black/50">
            {[
              {size: 'XS', circumference: '6.5-7', length: '6.5-7'},
              {size: 'S', circumference: '7-7.5', length: '7-7.5'},
              {size: 'M', circumference: '7.5-8', length: '7.5-8'},
              {size: 'L', circumference: '8-8.5', length: '8-8.5'},
              {size: 'XL', circumference: '8.5-9', length: '8.5-9'},
              {size: '2XL', circumference: '9-9.5', length: '9-9.5'},
            ].map((row, index) => (
              <tr key={row.size} className={index % 2 === 0 ? 'bg-white/5' : ''}>
                <td className="px-4 py-3 text-white font-bold">{row.size}</td>
                <td className="px-4 py-3 text-gray-200">{row.circumference}</td>
                <td className="px-4 py-3 text-gray-200">{row.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Footwear Size Chart
 */
function FootwearSizeChart() {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-white uppercase mb-4">Footwear Sizing</h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Men's Sizes */}
        <div>
          <h4 className="text-lg font-bold text-white mb-3">Men's Sizes</h4>
          <table className="w-full border-2 border-white/30 rounded-lg overflow-hidden text-sm">
            <thead className="bg-[#FF0000]">
              <tr>
                <th className="px-3 py-2 text-left text-white font-bold">US</th>
                <th className="px-3 py-2 text-left text-white font-bold">UK</th>
                <th className="px-3 py-2 text-left text-white font-bold">EU</th>
              </tr>
            </thead>
            <tbody className="bg-black/50">
              {[
                {us: '7', uk: '6', eu: '40'},
                {us: '8', uk: '7', eu: '41'},
                {us: '9', uk: '8', eu: '42'},
                {us: '10', uk: '9', eu: '43'},
                {us: '11', uk: '10', eu: '44'},
                {us: '12', uk: '11', eu: '45'},
              ].map((row, index) => (
                <tr key={row.us} className={index % 2 === 0 ? 'bg-white/5' : ''}>
                  <td className="px-3 py-2 text-white font-bold">{row.us}</td>
                  <td className="px-3 py-2 text-gray-200">{row.uk}</td>
                  <td className="px-3 py-2 text-gray-200">{row.eu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Women's Sizes */}
        <div>
          <h4 className="text-lg font-bold text-white mb-3">Women's Sizes</h4>
          <table className="w-full border-2 border-white/30 rounded-lg overflow-hidden text-sm">
            <thead className="bg-[#FF0000]">
              <tr>
                <th className="px-3 py-2 text-left text-white font-bold">US</th>
                <th className="px-3 py-2 text-left text-white font-bold">UK</th>
                <th className="px-3 py-2 text-left text-white font-bold">EU</th>
              </tr>
            </thead>
            <tbody className="bg-black/50">
              {[
                {us: '6', uk: '4', eu: '37'},
                {us: '7', uk: '5', eu: '38'},
                {us: '8', uk: '6', eu: '39'},
                {us: '9', uk: '7', eu: '40'},
                {us: '10', uk: '8', eu: '41'},
              ].map((row, index) => (
                <tr key={row.us} className={index % 2 === 0 ? 'bg-white/5' : ''}>
                  <td className="px-3 py-2 text-white font-bold">{row.us}</td>
                  <td className="px-3 py-2 text-gray-200">{row.uk}</td>
                  <td className="px-3 py-2 text-gray-200">{row.eu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/**
 * Headwear Size Chart
 */
function HeadwearSizeChart() {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-white uppercase mb-4">Headwear Sizing</h3>
      <p className="text-gray-200 text-sm mb-4">
        Measure around your head just above your ears to find your hat size.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-2 border-white/30 rounded-lg overflow-hidden">
          <thead className="bg-[#FF0000]">
            <tr>
              <th className="px-4 py-3 text-left text-white font-bold uppercase">Size</th>
              <th className="px-4 py-3 text-left text-white font-bold uppercase">Head Circumference (in)</th>
              <th className="px-4 py-3 text-left text-white font-bold uppercase">Head Circumference (cm)</th>
            </tr>
          </thead>
          <tbody className="bg-black/50">
            {[
              {size: 'S', inches: '21-22', cm: '53-56'},
              {size: 'M', inches: '22-23', cm: '56-58'},
              {size: 'L', inches: '23-24', cm: '58-61'},
              {size: 'XL', inches: '24-25', cm: '61-63'},
            ].map((row, index) => (
              <tr key={row.size} className={index % 2 === 0 ? 'bg-white/5' : ''}>
                <td className="px-4 py-3 text-white font-bold">{row.size}</td>
                <td className="px-4 py-3 text-gray-200">{row.inches}</td>
                <td className="px-4 py-3 text-gray-200">{row.cm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Measurement Instructions
 */
function MeasurementInstructions() {
  return (
    <div className="bg-white/5 border border-white/20 rounded-lg p-6">
      <h3 className="text-lg font-bold text-white uppercase mb-4">How to Measure</h3>

      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="text-white font-bold mb-2">Chest</h4>
          <p className="text-gray-200">Measure around the fullest part of your chest, keeping the tape level under your arms.</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-2">Waist</h4>
          <p className="text-gray-200">Measure around your natural waistline, keeping the tape comfortably loose.</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-2">Sleeve</h4>
          <p className="text-gray-200">Measure from the center back neck, across the shoulder, and down to the wrist.</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-2">Inseam</h4>
          <p className="text-gray-200">Measure from the top of the inner thigh straight down to the ankle bone.</p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-[#FF0000]/10 border border-[#FF0000]/30 rounded">
        <p className="text-sm text-gray-200">
          <strong className="text-white">Note:</strong> If you're between sizes, we recommend ordering the larger size for a more comfortable fit.
        </p>
      </div>
    </div>
  );
}
