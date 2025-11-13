import * as React from 'react';
import {Pagination} from '@shopify/hydrogen';

/**
 * <PaginatedResourceSection > is a component that encapsulate how the previous and next behaviors throughout your application.
 * @param {Class<Pagination<NodesType>>['connection']>}
 */
export function PaginatedResourceSection({
  connection,
  children,
  resourcesClassName,
}) {
  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink}) => {
        const resourcesMarkup = nodes.map((node, index) =>
          children({node, index}),
        );

        return (
          <div className="space-y-4 sm:space-y-6">
            <PreviousLink
              className="flex items-center justify-center gap-2 w-full min-h-[44px] px-4 sm:px-6 py-3 sm:py-4
                bg-black/50 backdrop-blur-sm border-2 border-[#FF0000]/30 rounded-lg
                text-white font-bold uppercase tracking-wide text-sm sm:text-base
                hover:border-[#FF0000] hover:bg-[#FF0000]/10 hover:shadow-[0_0_20px_rgba(255,0,0,0.4)]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[#FF0000]/30 disabled:hover:bg-transparent
                transition-all duration-300 group"
            >
              {isLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 group-hover:-translate-y-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  <span>Load Previous</span>
                </>
              )}
            </PreviousLink>
            {resourcesClassName ? (
              <div className={resourcesClassName}>{resourcesMarkup}</div>
            ) : (
              resourcesMarkup
            )}
            <NextLink
              className="flex items-center justify-center gap-2 w-full min-h-[44px] px-4 sm:px-6 py-3 sm:py-4
                bg-black/50 backdrop-blur-sm border-2 border-[#FF0000]/30 rounded-lg
                text-white font-bold uppercase tracking-wide text-sm sm:text-base
                hover:border-[#FF0000] hover:bg-[#FF0000]/10 hover:shadow-[0_0_20px_rgba(255,0,0,0.4)]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[#FF0000]/30 disabled:hover:bg-transparent
                transition-all duration-300 group"
            >
              {isLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>Load More</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-y-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </NextLink>
          </div>
        );
      }}
    </Pagination>
  );
}
