import { useState, useEffect, useRef } from 'react';

/**
 * Quote Modal Component - Shows contact options (Form & Email)
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {() => void} props.onClose - Function to close the modal
 */
export function QuoteModal({ isOpen, onClose }) {
  const [view, setView] = useState('selection'); // 'selection' | 'form' | 'success'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    productType: 'Flight suits',
    organization: '',
    details: '',
    files: null
  });
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setView('selection');
      setErrors({});
      setFormData({
        name: '',
        email: '',
        phone: '',
        productType: 'Flight suits',
        organization: '',
        details: '',
        files: null
      });
    }
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({ ...prev, files: e.target.files[0] }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';

    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.productType) newErrors.productType = 'Product type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form Submitted:', formData);
      // Here you would typically send the data to an API
      setView('success');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* Modal Content */}
      <div
        className="relative bg-[#000000] rounded-lg border-2 border-[#FF0000] shadow-[0_0_40px_rgba(255,0,0,0.6)] w-full max-w-[900px] p-6 md:p-10 motion-safe:animate-[fadeSlideUp_300ms_ease-out] max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-[#FF0000] transition-colors p-2 z-10"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <h2
          id="quote-modal-title"
          className="text-xl md:text-3xl font-bold uppercase text-center text-white mb-2 whitespace-nowrap"
          style={{
            fontFamily: 'var(--font-family-shock)',
            textShadow: '0 0 10px rgba(255, 0, 0, 0.6)'
          }}
        >
          {view === 'success' ? 'REQUEST SENT' : 'GET A QUOTE'}
        </h2>

        {view === 'selection' && (
          <>
            <p className="text-center text-gray-300 mb-6 md:mb-8 text-sm">
              Choose your preferred contact method
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Fill a Form Option */}
              <button
                onClick={() => setView('form')}
                className="flex flex-col items-center justify-center p-6 md:p-8 bg-gradient-to-br from-[#1a1a1a] to-[#000000] rounded-lg border-2 border-[#FF0000]/30 hover:border-[#FF0000] transition-all duration-300 motion-safe:hover:scale-105 motion-safe:hover:-translate-y-1 shadow-lg hover:shadow-[0_0_20px_rgba(255,0,0,0.6)] group min-h-[180px] w-full"
              >
                <div className="mb-4 text-white group-hover:text-[#FF0000] transition-colors">
                  <svg className="w-14 h-14 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-white font-bold uppercase text-base md:text-lg group-hover:text-[#FF0000] transition-colors mb-2">
                  Fill a Quote Form
                </span>
                <span className="text-gray-400 text-sm whitespace-nowrap">
                  Get a custom quote
                </span>
              </button>

              {/* Email Option */}
              <a
                href="mailto:sales@wingmandepot.com"
                className="flex flex-col items-center justify-center p-6 md:p-8 bg-gradient-to-br from-[#1a1a1a] to-[#000000] rounded-lg border-2 border-[#FF0000]/30 hover:border-[#FF0000] transition-all duration-300 motion-safe:hover:scale-105 motion-safe:hover:-translate-y-1 shadow-lg hover:shadow-[0_0_20px_rgba(255,0,0,0.6)] group min-h-[180px]"
              >
                <div className="mb-4 text-white group-hover:text-[#FF0000] transition-colors">
                  <svg className="w-14 h-14 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-white font-bold uppercase text-base md:text-lg group-hover:text-[#FF0000] transition-colors mb-2">
                  Email Us
                </span>
                <span className="text-gray-400 text-sm break-words text-center px-2">
                  sales@wingmandepot.com
                </span>
              </a>
            </div>

            <p className="text-center text-gray-400 text-sm mt-6 md:mt-8">
              Our team will get back to you within 24 hours
            </p>
          </>
        )}

        {view === 'form' && (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="block text-white text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className="w-full px-4 py-3 bg-black border-2 border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#FF0000] transition-colors"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-white text-sm font-medium">Email <span className="text-[#FF0000]">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className={`w-full px-4 py-3 bg-black border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors ${errors.email ? 'border-[#FF0000]' : 'border-white/30 focus:border-[#FF0000]'}`}
                />
                {errors.email && <p className="text-[#FF0000] text-xs">{errors.email}</p>}
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label className="block text-white text-sm font-medium">Phone Number <span className="text-[#FF0000]">*</span></label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className={`w-full px-4 py-3 bg-black border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors ${errors.phone ? 'border-[#FF0000]' : 'border-white/30 focus:border-[#FF0000]'}`}
                />
                {errors.phone && <p className="text-[#FF0000] text-xs">{errors.phone}</p>}
              </div>

              {/* Product Type */}
              <div className="space-y-1">
                <label className="block text-white text-sm font-medium">Product Type <span className="text-[#FF0000]">*</span></label>
                <div className="relative">
                  <select
                    name="productType"
                    value={formData.productType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black border-2 border-white/30 rounded-lg text-white appearance-none focus:outline-none focus:border-[#FF0000] transition-colors"
                  >
                    {[
                      'Flight suits', 'Flight Helmet bags', 'Visor covers', 'Sweat caps',
                      'Flight headbands', 'Flight gloves', 'Kneeboards', 'Flight scarves',
                      'Patches', 'Keychains', 'Hats', 'T-shirts', 'Hoodies', 'Tracksuits'
                    ].map(type => (
                      <option key={type} value={type} className="bg-black text-white">{type}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Squadron or Organisation */}
            <div className="space-y-1">
              <label className="block text-white text-sm font-medium">Squadron or organisation</label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                placeholder="Squadron or Organisation"
                className="w-full px-4 py-3 bg-black border-2 border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#FF0000] transition-colors"
              />
            </div>

            {/* Custom Reference / Files */}
            <div className="space-y-1">
              <label className="block text-white text-sm font-medium">Custom Reference / Files</label>
              <div className="flex">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-3 bg-white/10 border-2 border-white/30 border-r-0 rounded-l-lg text-white hover:bg-white/20 transition-colors whitespace-nowrap"
                >
                  Choose Files
                </button>
                <div className="w-full px-4 py-3 bg-black border-2 border-white/30 rounded-r-lg text-white truncate flex items-center">
                  {formData.files ? formData.files.name : <span className="text-gray-400">No file chosen</span>}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* RFQ Details */}
            <div className="space-y-1">
              <label className="block text-white text-sm font-medium">RFQ Details</label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleInputChange}
                placeholder="RFQ Details"
                rows={6}
                className="w-full px-4 py-3 bg-black border-2 border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#FF0000] transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#FF0000] text-white font-bold uppercase py-4 rounded-lg hover:bg-[#CC0000] hover:shadow-[0_0_20px_rgba(255,0,0,0.6)] transition-all duration-300 mt-4"
            >
              SEND
            </button>
          </form>
        )}

        {view === 'success' && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-[#FF0000]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[#FF0000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Thank You!</h3>
            <p className="text-gray-300 mb-8">
              Your quote request has been received. Our team will review your details and get back to you within 24 hours.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-[#FF0000] text-white font-bold uppercase rounded hover:bg-red-700 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
