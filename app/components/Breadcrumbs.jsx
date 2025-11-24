import {Link} from 'react-router';

/**
 * Breadcrumbs Component - Navigation breadcrumb trail
 * Provides hierarchical navigation and improves SEO
 * @param {{
 *   items: Array<{label: string, url?: string}>;
 *   className?: string;
 * }}
 */
export function Breadcrumbs({items, className = ''}) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`text-sm text-gray-200 ${className}`}
    >
      <ol
        className="flex flex-wrap items-center gap-2"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const position = index + 1;

          return (
            <li
              key={index}
              className="flex items-center gap-2"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {item.url && !isLast ? (
                <>
                  <Link
                    to={item.url}
                    className="hover:text-[#FF0000] transition-colors underline-offset-2 hover:underline
                      min-w-[44px] min-h-[44px] flex items-center"
                    itemProp="item"
                  >
                    <span itemProp="name">{item.label}</span>
                  </Link>
                  <meta itemProp="position" content={position.toString()} />
                  {/* Separator */}
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
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
                <>
                  <span
                    className="text-white font-medium"
                    itemProp="name"
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                  <meta itemProp="position" content={position.toString()} />
                  {!isLast && (
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * ProductBreadcrumbs - Pre-configured breadcrumbs for product pages
 * Automatically generates breadcrumb trail: Home > Collection > Product
 * @param {{
 *   productTitle: string;
 *   collectionHandle?: string;
 *   collectionTitle?: string;
 *   className?: string;
 * }}
 */
export function ProductBreadcrumbs({
  productTitle,
  collectionHandle,
  collectionTitle,
  className,
}) {
  const items = [
    {label: 'Home', url: '/'},
  ];

  // Add collection if available
  if (collectionHandle && collectionTitle) {
    items.push({
      label: collectionTitle,
      url: `/collections/${collectionHandle}`,
    });
  } else {
    // Fallback to "Products" if no collection
    items.push({
      label: 'Products',
      url: '/collections/all',
    });
  }

  // Add current product (no URL, it's the current page)
  items.push({
    label: productTitle,
  });

  return <Breadcrumbs items={items} className={className} />;
}

/**
 * CollectionBreadcrumbs - Pre-configured breadcrumbs for collection pages
 * Generates: Home > Collections > [Collection Name]
 * @param {{
 *   collectionTitle: string;
 *   className?: string;
 * }}
 */
export function CollectionBreadcrumbs({collectionTitle, className}) {
  const items = [
    {label: 'Home', url: '/'},
    {label: 'Collections', url: '/collections'},
    {label: collectionTitle},
  ];

  return <Breadcrumbs items={items} className={className} />;
}

/**
 * AccountBreadcrumbs - Pre-configured breadcrumbs for account pages
 * Generates: Home > Account > [Page Name]
 * @param {{
 *   pageName: string;
 *   className?: string;
 * }}
 */
export function AccountBreadcrumbs({pageName, className}) {
  const items = [
    {label: 'Home', url: '/'},
    {label: 'Account', url: '/account'},
    {label: pageName},
  ];

  return <Breadcrumbs items={items} className={className} />;
}

/**
 * SearchBreadcrumbs - Pre-configured breadcrumbs for search pages
 * Generates: Home > Search > [Query]
 * @param {{
 *   searchQuery: string;
 *   className?: string;
 * }}
 */
export function SearchBreadcrumbs({searchQuery, className}) {
  const items = [
    {label: 'Home', url: '/'},
    {label: 'Search', url: '/search'},
    {label: searchQuery ? `Results for "${searchQuery}"` : 'Search Results'},
  ];

  return <Breadcrumbs items={items} className={className} />;
}
