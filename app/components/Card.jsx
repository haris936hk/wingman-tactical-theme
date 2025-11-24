/**
 * Standardized Card Component System
 * Provides consistent card styling across the application
 *
 * Variants:
 * - default: Standard white card with subtle shadow
 * - elevated: Dark card with red border (tactical theme)
 * - interactive: Hover effects with scale and shadow
 * - outline: Transparent with border only
 * - flat: No shadow, minimal styling
 */

/**
 * Base Card Component
 * @param {{
 *   variant?: 'default' | 'elevated' | 'interactive' | 'outline' | 'flat';
 *   padding?: 'none' | 'sm' | 'md' | 'lg';
 *   className?: string;
 *   children: React.ReactNode;
 *   onClick?: () => void;
 *   as?: 'div' | 'article' | 'section';
 * }}
 */
export function Card({
  variant = 'default',
  padding = 'md',
  className = '',
  children,
  onClick,
  as: Component = 'div',
}) {
  const baseStyles = 'rounded-lg transition-all duration-200';

  const variantStyles = {
    default:
      'bg-white border border-gray-200 shadow-sm hover:shadow-md',
    elevated:
      'bg-white/5 backdrop-blur-sm border border-[#FF0000]/30 shadow-[0_4px_20px_rgba(255,0,0,0.1)]',
    interactive:
      'bg-white border border-gray-200 shadow-sm group hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg cursor-pointer',
    outline:
      'bg-transparent border-2 border-white/20 hover:border-white/40',
    flat: 'bg-white border border-gray-200',
  };

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`;

  return (
    <Component className={combinedClassName} onClick={onClick}>
      {children}
    </Component>
  );
}

/**
 * Card Header Component
 * @param {{
 *   title: string;
 *   subtitle?: string;
 *   action?: React.ReactNode;
 *   className?: string;
 * }}
 */
export function CardHeader({title, subtitle, action, className = ''}) {
  return (
    <div className={`flex items-start justify-between mb-4 ${className}`}>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div className="ml-4">{action}</div>}
    </div>
  );
}

/**
 * Card Body Component
 * @param {{
 *   children: React.ReactNode;
 *   className?: string;
 * }}
 */
export function CardBody({children, className = ''}) {
  return <div className={`text-gray-700 ${className}`}>{children}</div>;
}

/**
 * Card Footer Component
 * @param {{
 *   children: React.ReactNode;
 *   className?: string;
 *   divider?: boolean;
 * }}
 */
export function CardFooter({children, divider = true, className = ''}) {
  return (
    <div
      className={`mt-4 ${divider ? 'pt-4 border-t border-gray-200' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Card Image Component
 * @param {{
 *   src: string;
 *   alt: string;
 *   aspectRatio?: string;
 *   className?: string;
 *   position?: 'top' | 'full';
 * }}
 */
export function CardImage({
  src,
  alt,
  aspectRatio = '16/9',
  className = '',
  position = 'top',
}) {
  const positionStyles = {
    top: 'rounded-t-lg -mt-6 -mx-6 mb-4',
    full: 'rounded-lg',
  };

  return (
    <div
      className={`overflow-hidden bg-gray-100 ${positionStyles[position]} ${className}`}
      style={{aspectRatio}}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}

/**
 * Tactical-themed Card (Dark with Red Accents)
 * Pre-configured elevated card for tactical theme
 * @param {{
 *   children: React.ReactNode;
 *   className?: string;
 *   glow?: boolean;
 * }}
 */
export function TacticalCard({children, className = '', glow = false}) {
  const glowStyle = glow
    ? 'shadow-[0_0_30px_rgba(255,0,0,0.4)]'
    : 'shadow-[0_4px_20px_rgba(255,0,0,0.1)]';

  return (
    <div
      className={`bg-white/5 backdrop-blur-sm rounded-lg border border-[#FF0000]/30 p-6 ${glowStyle} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Stats Card Component
 * Displays key metrics or statistics
 * @param {{
 *   label: string;
 *   value: string | number;
 *   icon?: React.ReactNode;
 *   trend?: 'up' | 'down' | 'neutral';
 *   trendValue?: string;
 *   variant?: 'default' | 'tactical';
 * }}
 */
export function StatsCard({
  label,
  value,
  icon,
  trend,
  trendValue,
  variant = 'default',
}) {
  const CardComponent = variant === 'tactical' ? TacticalCard : Card;
  const textColor = variant === 'tactical' ? 'text-white' : 'text-gray-900';
  const subtextColor = variant === 'tactical' ? 'text-gray-300' : 'text-gray-500';

  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-gray-500',
  };

  return (
    <CardComponent padding="md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${subtextColor} mb-1`}>
            {label}
          </p>
          <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
          {trend && trendValue && (
            <p className={`text-sm mt-2 ${trendColors[trend]}`}>
              {trend === 'up' && '↑ '}
              {trend === 'down' && '↓ '}
              {trendValue}
            </p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${variant === 'tactical' ? 'bg-[#FF0000]/20' : 'bg-gray-100'}`}>
            {icon}
          </div>
        )}
      </div>
    </CardComponent>
  );
}

/**
 * Feature Card Component
 * Displays a feature with icon, title, and description
 * @param {{
 *   icon: React.ReactNode;
 *   title: string;
 *   description: string;
 *   variant?: 'default' | 'tactical';
 * }}
 */
export function FeatureCard({icon, title, description, variant = 'default'}) {
  const CardComponent = variant === 'tactical' ? TacticalCard : Card;
  const textColor = variant === 'tactical' ? 'text-white' : 'text-gray-900';
  const subtextColor = variant === 'tactical' ? 'text-gray-300' : 'text-gray-600';

  return (
    <CardComponent padding="lg">
      <div className="text-center">
        <div className={`inline-flex p-4 rounded-full mb-4 ${variant === 'tactical' ? 'bg-[#FF0000]/20 text-[#FF0000]' : 'bg-gray-100 text-gray-700'}`}>
          {icon}
        </div>
        <h3 className={`text-xl font-bold ${textColor} mb-2`}>{title}</h3>
        <p className={`${subtextColor} leading-relaxed`}>{description}</p>
      </div>
    </CardComponent>
  );
}

/**
 * Notification Card Component
 * For alerts, messages, and status updates
 * @param {{
 *   type?: 'info' | 'success' | 'warning' | 'error';
 *   title?: string;
 *   message: string;
 *   dismissible?: boolean;
 *   onDismiss?: () => void;
 * }}
 */
export function NotificationCard({
  type = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
}) {
  const typeStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    success: 'bg-green-50 border-green-200 text-green-900',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    error: 'bg-red-50 border-red-200 text-red-900',
  };

  const iconColors = {
    info: 'text-blue-500',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    error: 'text-red-500',
  };

  const icons = {
    info: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
    success: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
  };

  return (
    <div
      className={`rounded-lg border p-4 ${typeStyles[type]}`}
      role="alert"
    >
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${iconColors[type]}`}>
          {icons[type]}
        </div>
        <div className="ml-3 flex-1">
          {title && <h3 className="font-semibold mb-1">{title}</h3>}
          <p className="text-sm">{message}</p>
        </div>
        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600"
            aria-label="Dismiss"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
