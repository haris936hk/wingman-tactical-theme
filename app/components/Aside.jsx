import {createContext, useContext, useEffect, useState} from 'react';

/**
 * A side bar component with Overlay
 * @example
 * ```jsx
 * <Aside type="search" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 * @param {{
 *   children?: React.ReactNode;
 *   type: AsideType;
 *   heading: React.ReactNode;
 * }}
 */
export function Aside({children, heading, type}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;

  useEffect(() => {
    const abortController = new AbortController();

    if (expanded) {
      document.addEventListener(
        'keydown',
        function handler(event) {
          if (event.key === 'Escape') {
            close();
          }
        },
        {signal: abortController.signal},
      );
    }
    return () => abortController.abort();
  }, [close, expanded]);

  return (
    <div
      aria-modal
      className={`bg-black/80 fixed inset-0 transition-opacity duration-400 ease-in-out z-[100] ${
        expanded ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible'
      }`}
      role="dialog"
    >
      <button className="bg-transparent border-0 text-transparent h-full left-0 absolute top-0 w-[calc(100%-var(--aside-width))]" onClick={close} />
      <aside className={`bg-black shadow-[0_0_50px_rgba(255,0,0,0.5)] h-screen w-[min(var(--aside-width),100vw)] fixed -right-[var(--aside-width)] top-0 transition-transform duration-200 ease-in-out ${
        expanded ? '-translate-x-[var(--aside-width)]' : ''
      }`}>
        <header className="flex items-center border-b border-[var(--color-red)] h-16 justify-between px-5 text-white">
          <h3 className="m-0">{heading}</h3>
          <button className="border-0 bg-inherit text-inherit font-bold opacity-80 no-underline transition-all duration-200 w-5 h-6 leading-6 hover:opacity-100 hover:text-[var(--color-red)] hover:underline hover:cursor-pointer" onClick={close} aria-label="Close">
            &times;
          </button>
        </header>
        <main className="m-4">{children}</main>
      </aside>
    </div>
  );
}

const AsideContext = createContext(null);

Aside.Provider = function AsideProvider({children}) {
  const [type, setType] = useState('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}

/** @typedef {'search' | 'cart' | 'mobile' | 'closed'} AsideType */
/**
 * @typedef {{
 *   type: AsideType;
 *   open: (mode: AsideType) => void;
 *   close: () => void;
 * }} AsideContextValue
 */

/** @typedef {import('react').ReactNode} ReactNode */
