/**
 * View Toggle - Wingman Tactical Brand
 * Grid view switcher (2/3/4 columns) with icon buttons
 * @param {{
 *   currentView: '2' | '3' | '4';
 *   onViewChange: (view: '2' | '3' | '4') => void;
 * }}
 */
export function ViewToggle({currentView, onViewChange}) {
  const views = [
    {
      value: '2',
      label: '2 Columns',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 3h8v18H3V3zm10 0h8v18h-8V3z" />
        </svg>
      ),
    },
    {
      value: '3',
      label: '3 Columns',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 3h5v18H3V3zm7 0h4v18h-4V3zm6 0h5v18h-5V3z" />
        </svg>
      ),
    },
    {
      value: '4',
      label: '4 Columns',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 3h3.5v18H3V3zm5 0h3.5v18H8V3zm5 0h3.5v18H13V3zm5 0h3v18h-3V3z" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className="hidden lg:flex items-center gap-1 p-1 rounded-lg
        bg-black/50 backdrop-blur-sm border border-white/20"
      role="group"
      aria-label="Grid view options"
    >
      {views.map((view) => {
        const isActive = currentView === view.value;

        return (
          <button
            key={view.value}
            onClick={() => onViewChange(view.value)}
            className={`
              relative p-2 rounded-lg transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2
              focus:ring-offset-black
              ${
                isActive
                  ? 'bg-[#FF0000] text-white shadow-[0_0_15px_rgba(255,0,0,0.6)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }
            `}
            aria-label={view.label}
            aria-pressed={isActive}
          >
            {view.icon}
          </button>
        );
      })}
    </div>
  );
}
