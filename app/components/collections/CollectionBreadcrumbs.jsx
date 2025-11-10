import {Link} from 'react-router';

/**
 * Collection Breadcrumbs - Wingman Tactical Brand
 * Breadcrumb navigation with Schema.org structured data for SEO
 * @param {{
 *   items: Array<{name: string; url: string}>;
 * }}
 */
export function CollectionBreadcrumbs({items}) {
  // Generate schema.org breadcrumb markup
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url,
    })),
  };

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbSchema)}}
      />

      {/* Visual Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 motion-safe:animate-[fadeSlideUp_0.4s_ease-out]"
      >
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={item.url} className="flex items-center gap-2">
                {!isLast ? (
                  <>
                    <Link
                      to={item.url}
                      className="text-gray-400 hover:text-[#FF0000] transition-colors duration-200
                        uppercase tracking-wide font-medium"
                    >
                      {item.name}
                    </Link>
                    {/* Chevron Separator */}
                    <svg
                      className="w-4 h-4 text-[#FF0000]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </>
                ) : (
                  <span
                    className="text-white uppercase tracking-wide font-bold"
                    aria-current="page"
                  >
                    {item.name}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
