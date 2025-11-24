# Wingman Tactical Design System

This document defines the visual design language for the Wingman Tactical Shopify theme.

## Brand Colors

### Primary Colors
- **Tactical Red**: `#FF0000` - Primary brand color, use sparingly for high emphasis
- **Dark Red**: `#CC0000` - Hover states for red elements
- **Pure Black**: `#000000` - Primary background color
- **Off Black**: `#0A0A0A` - Secondary background for depth

### Neutral Colors
- **White**: `#FFFFFF` - Primary text and clean backgrounds
- **Light Gray**: `#F5F5F5` - Card backgrounds, input fields
- **Medium Gray**: `#9CA3AF` - Secondary text, disabled states
- **Dark Gray**: `#374151` - Tertiary text, borders

### Semantic Colors
- **Success Green**: `#10B981` - Success states, in-stock indicators
- **Warning Yellow**: `#F59E0B` - Low stock, warnings
- **Error Red**: `#EF4444` - Errors, out of stock
- **Info Blue**: `#3B82F6` - Informational messages

---

## Red Glow Usage Guidelines

### ⚠️ Problem: Overuse of Red Glow
The red glow effect (`text-shadow: 0 0 10px rgba(255, 0, 0, 0.6)` and `box-shadow: 0 0 20px rgba(255, 0, 0, 0.5)`) has been overused, reducing its impact and creating visual fatigue.

### ✅ Proper Usage Hierarchy

#### **Level 1: High Emphasis (Use Red Glow)**
Use the red glow ONLY for these critical elements:
- **Main page headings (H1)** - Hero titles, page titles
- **Primary CTAs** - "Add to Cart", "Checkout" buttons
- **Critical notifications** - Sale badges, urgent alerts
- **Active navigation** - Current page indicator

**Code Example:**
```css
/* H1 Headings */
text-shadow: 0 0 15px rgba(255, 0, 0, 0.6);

/* Primary Buttons on Hover */
box-shadow: 0 0 20px rgba(255, 0, 0, 0.6);
```

#### **Level 2: Medium Emphasis (Use Red Accent)**
Use solid red color WITHOUT glow for:
- **Secondary headings (H2)** - Section titles
- **Links and interactive elements** - Hover states
- **Borders and dividers** - Section separators
- **Icons** - Navigation icons, feature icons

**Code Example:**
```css
/* Red text without glow */
color: #FF0000;

/* Red border without glow */
border-color: #FF0000;
```

#### **Level 3: Low Emphasis (Use Subtle Red)**
Use muted red for background elements:
- **Background accents** - `bg-[#FF0000]/10` or `bg-[#FF0000]/20`
- **Hover states** - Subtle background changes
- **Disabled states** - `opacity-50`

**Code Example:**
```css
/* Subtle red background */
background-color: rgba(255, 0, 0, 0.1);

/* Subtle red border */
border-color: rgba(255, 0, 0, 0.3);
```

#### **Level 4: No Red (Use Neutral)**
Use white, gray, or black for:
- **Body text** - All paragraph text
- **Secondary buttons** - Cancel, back buttons
- **Form labels** - Input field labels
- **Tertiary information** - Metadata, timestamps

---

## Typography Scale

### Font Families
```css
--font-family-shock: 'Impact', 'Arial Black', sans-serif; /* Headings */
--font-family-base: system-ui, -apple-system, sans-serif; /* Body text */
```

### Size Scale
- **Text 5XL**: `48px` (3rem) - Hero headings
- **Text 4XL**: `36px` (2.25rem) - Page titles
- **Text 3XL**: `30px` (1.875rem) - Section headings
- **Text 2XL**: `24px` (1.5rem) - Subsection headings
- **Text XL**: `20px` (1.25rem) - Card titles
- **Text LG**: `18px` (1.125rem) - Large body text
- **Text Base**: `16px` (1rem) - Body text
- **Text SM**: `14px` (0.875rem) - Secondary text
- **Text XS**: `12px` (0.75rem) - Captions, labels

### Font Weights
- **Bold**: 700 - Headings, CTAs
- **Semibold**: 600 - Subheadings, emphasis
- **Medium**: 500 - Labels, navigation
- **Normal**: 400 - Body text

---

## Spacing Scale

Use consistent spacing values based on 4px increments:

- **0**: 0px
- **1**: 4px
- **2**: 8px
- **3**: 12px
- **4**: 16px
- **5**: 20px
- **6**: 24px
- **8**: 32px
- **10**: 40px
- **12**: 48px
- **16**: 64px
- **20**: 80px
- **24**: 96px

### Component Spacing
- **Card padding**: `p-6` (24px) on desktop, `p-4` (16px) on mobile
- **Section spacing**: `py-12` (48px) on desktop, `py-8` (32px) on mobile
- **Element gap**: `gap-4` (16px) for related items
- **Button padding**: `px-6 py-3` (24px horizontal, 12px vertical)

---

## Shadow System

### Elevation Levels

#### **Level 0: Flat**
No shadow - for backgrounds, dividers
```css
box-shadow: none;
```

#### **Level 1: Raised**
Subtle shadow - for cards, inputs
```css
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
```

#### **Level 2: Floating**
Medium shadow - for dropdowns, popovers
```css
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
```

#### **Level 3: Elevated**
Strong shadow - for modals, sticky elements
```css
box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
```

#### **Level 4: High Emphasis (RED GLOW)**
Red glow shadow - ONLY for primary CTAs and critical elements
```css
box-shadow: 0 0 20px rgba(255, 0, 0, 0.6);
```

---

## Border Radius

- **None**: `0px` - Strictly rectangular elements
- **SM**: `4px` - Badges, small buttons
- **Base**: `8px` - Cards, inputs, buttons
- **LG**: `12px` - Large cards, images
- **XL**: `16px` - Hero sections, modals
- **Full**: `9999px` - Pills, circular buttons

---

## Component Patterns

### Button Styles

#### **Primary Button**
```jsx
<button className="bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold uppercase px-6 py-3 rounded transition-all hover:shadow-[0_0_20px_rgba(255,0,0,0.6)]">
  Add to Cart
</button>
```

#### **Secondary Button**
```jsx
<button className="border-2 border-white/30 text-white font-bold uppercase px-6 py-3 rounded hover:bg-white/10 transition-all">
  Learn More
</button>
```

#### **Tertiary Button (Link Style)**
```jsx
<button className="text-[#FF0000] hover:text-[#CC0000] font-medium underline underline-offset-2">
  View Details
</button>
```

### Card Styles

#### **Standard Card**
```jsx
<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
  {/* Card content */}
</div>
```

#### **Elevated Card (Tactical Theme)**
```jsx
<div className="bg-white/5 backdrop-blur-sm rounded-lg border border-[#FF0000]/30 p-6">
  {/* Card content */}
</div>
```

#### **Interactive Card (Hover Effect)**
```jsx
<div className="bg-white border border-gray-200 rounded-lg shadow-sm group hover:scale-[1.03] hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(255,0,0,0.6)] transition-all duration-200">
  {/* Card content */}
</div>
```

### Heading Styles

#### **H1: Page Title (High Emphasis)**
```jsx
<h1
  className="text-4xl md:text-5xl font-bold uppercase text-white mb-4"
  style={{
    fontFamily: 'var(--font-family-shock)',
    textShadow: '0 0 15px rgba(255, 0, 0, 0.6)',
  }}
>
  Page Title
</h1>
```

#### **H2: Section Title (Medium Emphasis)**
```jsx
<h2 className="text-3xl font-bold uppercase text-white mb-6 border-b border-[#FF0000]/30 pb-4">
  Section Title
</h2>
```

#### **H3: Subsection Title (Low Emphasis)**
```jsx
<h3 className="text-2xl font-semibold text-white mb-4">
  Subsection Title
</h3>
```

---

## Animation Guidelines

### Transition Timing
- **Fast**: `150ms` - Micro-interactions (hover, focus)
- **Medium**: `300ms` - Standard transitions (modals, dropdowns)
- **Slow**: `500ms` - Page transitions, large movements

### Easing Functions
- **Ease-out**: Default for UI animations
- **Ease-in**: For closing/hiding elements
- **Ease-in-out**: For smooth bidirectional motion

### Best Practices
- **Use motion-safe**: Respect user's motion preferences
- **Limit simultaneous animations**: Max 3 elements at once
- **Avoid layout shift**: Reserve space for animated content
- **Optimize performance**: Use `transform` and `opacity` for animations

---

## Accessibility Requirements

### Color Contrast
- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio
- **Interactive elements**: Minimum 3:1 contrast ratio

### Focus States
All interactive elements MUST have visible focus indicators:
```css
focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2 outline-none
```

### Touch Targets
- **Minimum size**: 44x44px for all interactive elements
- **Mobile spacing**: At least 8px gap between touch targets

---

## Responsive Breakpoints

```css
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Small desktops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large desktops */
```

### Mobile-First Approach
Always design for mobile first, then enhance for larger screens:
```jsx
<div className="text-2xl md:text-3xl lg:text-4xl">
  Responsive Heading
</div>
```

---

## Files to Update for Red Glow Reduction

Based on the current codebase, the following files should be audited for excessive red glow usage:

1. **Homepage** (`app/routes/_index.jsx`)
2. **Product Pages** (`app/routes/products.$handle.jsx`)
3. **Collection Pages** (`app/routes/collections.$handle.jsx`)
4. **Product Cards** (`app/components/ProductItem.jsx`)
5. **Headers and Titles** (All route files with H1/H2 headings)
6. **Buttons and CTAs** (Components with primary actions)

### Recommended Changes

#### **Remove Red Glow From:**
- Secondary headings (H2, H3, H4)
- Body text
- Navigation links
- Secondary buttons
- Card borders (except on hover)
- Background elements

#### **Keep Red Glow For:**
- Page titles (H1 only)
- Primary "Add to Cart" buttons (on hover)
- Sale badges
- Active navigation indicators
- Critical alerts

---

## Implementation Checklist

- [ ] Audit all components for red glow usage
- [ ] Remove glow from secondary headings
- [ ] Standardize button styles (primary vs secondary)
- [ ] Update card hover effects (selective glow)
- [ ] Create reusable heading components
- [ ] Document component variants
- [ ] Test visual hierarchy on real content
- [ ] Validate accessibility (contrast, focus states)

---

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design Elevation](https://material.io/design/environment/elevation.html)
- [Inclusive Components](https://inclusive-components.design/)
