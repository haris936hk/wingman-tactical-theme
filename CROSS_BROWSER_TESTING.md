# Cross-Browser Testing Guide

This document provides a comprehensive testing strategy for ensuring the Wingman Tactical Shopify theme works consistently across all major browsers and devices.

## Quick Stats

- **Target Browsers**: Chrome, Firefox, Safari, Edge, Mobile Browsers
- **Testing Approach**: Manual + Automated
- **Critical User Flows**: 12+ scenarios
- **Last Updated**: January 2025

---

## Browser Compatibility Matrix

### Desktop Browsers

| Browser | Version | Priority | Market Share | Status |
|---------|---------|----------|--------------|--------|
| **Chrome** | Latest 2 versions | High | ~65% | ✅ Primary |
| **Safari** | Latest 2 versions | High | ~20% | ✅ Primary |
| **Firefox** | Latest 2 versions | Medium | ~8% | ✅ Secondary |
| **Edge** | Latest 2 versions | Medium | ~5% | ✅ Secondary |
| **Opera** | Latest | Low | ~2% | ⚠️ Best effort |

### Mobile Browsers

| Browser | Platform | Priority | Market Share | Status |
|---------|----------|----------|--------------|--------|
| **Safari iOS** | iOS 15+ | High | ~60% mobile | ✅ Primary |
| **Chrome Mobile** | Android 10+ | High | ~35% mobile | ✅ Primary |
| **Samsung Internet** | Android 10+ | Medium | ~5% mobile | ✅ Secondary |
| **Firefox Mobile** | Android/iOS | Low | <1% | ⚠️ Best effort |

---

## Critical User Flows to Test

Test these flows in **each browser** to ensure core functionality:

### 1. Homepage Experience
- [ ] Hero section loads and displays correctly
- [ ] Images lazy load properly
- [ ] Featured products grid displays correctly
- [ ] Navigation menu works (desktop + mobile)
- [ ] Search functionality opens and works
- [ ] Footer links are clickable

### 2. Product Discovery
- [ ] Collection pages load with correct grid layout
- [ ] Filters work (sidebar + mobile drawer)
- [ ] Sort options function correctly
- [ ] Pagination works
- [ ] Product cards display images and pricing
- [ ] Hover effects work on desktop
- [ ] Mobile touch interactions work

### 3. Product Detail Page
- [ ] Product images load and display
- [ ] Image gallery navigation works
- [ ] Zoom functionality works (if implemented)
- [ ] Variant selection updates price and availability
- [ ] Add to Cart button functions
- [ ] Quantity selector works
- [ ] Product tabs/accordion work
- [ ] Recommendations load

### 4. Search Functionality
- [ ] Search input accepts text
- [ ] Search autocomplete/predictive search works
- [ ] Search results display correctly
- [ ] Filter search results
- [ ] No results state displays

### 5. Cart Experience
- [ ] Add to cart updates cart count
- [ ] Cart drawer/page opens
- [ ] Line items display correctly
- [ ] Quantity adjustment works
- [ ] Remove item works
- [ ] Cart upsells display
- [ ] Checkout button navigates correctly

### 6. Checkout Flow
- [ ] Checkout page loads
- [ ] Form fields accept input
- [ ] Address autocomplete works
- [ ] Payment fields display (Shopify Payments)
- [ ] Submit order works
- [ ] Thank you page displays

### 7. Account Management
- [ ] Login form works
- [ ] Account dashboard loads
- [ ] Order history displays
- [ ] Address management works
- [ ] Wishlist displays and functions
- [ ] Profile editing works

### 8. Mobile Navigation
- [ ] Hamburger menu opens/closes
- [ ] Mobile menu navigation works
- [ ] Touch gestures work (swipe, tap)
- [ ] Mobile search works
- [ ] Mobile filters work
- [ ] Mobile cart drawer works

### 9. Forms and Inputs
- [ ] All input fields accept text
- [ ] Required field validation works
- [ ] Email validation works
- [ ] Error messages display
- [ ] Success messages display
- [ ] Submit buttons work

### 10. Visual Elements
- [ ] Fonts load correctly
- [ ] Colors display accurately
- [ ] Shadows and gradients render
- [ ] Border radius appears correctly
- [ ] Animations/transitions work smoothly
- [ ] Red glow effects display (tactical theme)

### 11. Third-Party Integrations
- [ ] Analytics tracking fires (Google Analytics)
- [ ] Customer reviews load (if using review app)
- [ ] Newsletter signup works
- [ ] Social media links work
- [ ] Live chat widget displays (if implemented)

### 12. Performance & Loading
- [ ] Page loads within 3 seconds
- [ ] Images load progressively
- [ ] No layout shift during load
- [ ] Smooth scrolling
- [ ] No console errors

---

## Browser-Specific Issues & Workarounds

### Safari (Desktop & iOS)

#### Known Issues
1. **Flexbox gap property** - Older versions don't support `gap` in flexbox
   ```css
   /* Workaround: Use margin instead */
   .flex-container > * + * {
     margin-left: 1rem;
   }
   ```

2. **Date input styling** - Safari has limited custom styling for date inputs
   ```css
   /* Use -webkit-appearance: none; carefully */
   input[type="date"] {
     -webkit-appearance: none;
     appearance: none;
   }
   ```

3. **Position: sticky** - Can be buggy with overflow properties
   ```css
   /* Ensure parent doesn't have overflow: hidden */
   .parent {
     overflow: visible; /* or overflow-x: auto if needed */
   }
   ```

4. **Video autoplay** - Requires muted attribute
   ```html
   <video autoplay muted playsinline>
   ```

5. **Touch event handling** - Requires specific event listeners
   ```javascript
   element.addEventListener('touchstart', handler, {passive: true});
   ```

#### Safari-Specific Testing Checklist
- [ ] Test on macOS Safari (latest)
- [ ] Test on iOS Safari (iPhone, iPad)
- [ ] Check smooth scrolling with `-webkit-overflow-scrolling`
- [ ] Verify backdrop-filter effects work
- [ ] Test focus-visible polyfill for older versions

---

### Chrome (Desktop & Mobile)

#### Known Issues
1. **Autofill styling** - Yellow background on autofilled inputs
   ```css
   input:-webkit-autofill {
     -webkit-box-shadow: 0 0 0 1000px white inset;
     -webkit-text-fill-color: #000;
   }
   ```

2. **Scroll snap** - Can be overly aggressive
   ```css
   scroll-snap-type: x mandatory;
   scroll-snap-stop: normal; /* Instead of always */
   ```

3. **Font rendering** - Can appear thinner than other browsers
   ```css
   body {
     -webkit-font-smoothing: antialiased;
     -moz-osx-font-smoothing: grayscale;
   }
   ```

#### Chrome-Specific Testing Checklist
- [ ] Test on Windows Chrome
- [ ] Test on macOS Chrome
- [ ] Test Chrome Mobile on Android
- [ ] Check DevTools performance profiling
- [ ] Verify service worker functionality (if implemented)

---

### Firefox

#### Known Issues
1. **Scrollbar styling** - Doesn't support `::-webkit-scrollbar`
   ```css
   /* Use scrollbar-width and scrollbar-color instead */
   .scrollable {
     scrollbar-width: thin;
     scrollbar-color: #FF0000 #000000;
   }
   ```

2. **Flexbox min-height** - Requires explicit min-height: 0
   ```css
   .flex-item {
     min-height: 0;
   }
   ```

3. **Image rendering** - Requires -moz prefix for some properties
   ```css
   img {
     image-rendering: -moz-crisp-edges;
     image-rendering: crisp-edges;
   }
   ```

#### Firefox-Specific Testing Checklist
- [ ] Test on Windows Firefox
- [ ] Test on macOS Firefox
- [ ] Check custom scrollbar styling fallbacks
- [ ] Verify CSS Grid layouts
- [ ] Test flexbox layouts thoroughly

---

### Edge (Chromium-based)

#### Known Issues
1. **Legacy Edge** - If supporting pre-2020 Edge, use IE11 fallbacks
2. **Chromium Edge** - Generally same as Chrome, but test independently
3. **Windows-specific rendering** - Font rendering differs from macOS

#### Edge-Specific Testing Checklist
- [ ] Test on Windows 10 Edge
- [ ] Test on Windows 11 Edge
- [ ] Verify no IE11 compatibility mode issues
- [ ] Check smooth scrolling behavior

---

### Mobile Browser Specifics

#### iOS Safari

**Viewport Issues**
```html
<!-- Prevent zoom on input focus -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
```

**100vh Issue** - Viewport height includes/excludes address bar
```css
/* Use dvh (dynamic viewport height) if supported */
.full-height {
  height: 100vh;
  height: 100dvh; /* Fallback for modern browsers */
}
```

**Touch Callouts**
```css
/* Disable long-press callout on images */
img {
  -webkit-touch-callout: none;
}
```

#### Chrome Mobile (Android)

**Address Bar Auto-hide**
```css
/* Account for dynamic address bar */
@supports (height: 100dvh) {
  .mobile-full-height {
    height: 100dvh;
  }
}
```

**Touch Ripple Effect**
```css
/* Customize tap highlight color */
* {
  -webkit-tap-highlight-color: rgba(255, 0, 0, 0.2);
}
```

#### Samsung Internet

**Dark Mode** - Respects system dark mode aggressively
```css
@media (prefers-color-scheme: dark) {
  /* Ensure your dark mode styles work */
}
```

---

## CSS Vendor Prefix Requirements

### Current Prefixes Needed (2025)

```css
/* Backdrop Filter (Safari < 15) */
.backdrop-blur {
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

/* User Select (Safari, older browsers) */
.no-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

/* Appearance (form controls) */
input[type="search"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

/* Font Smoothing (macOS/iOS) */
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Sticky Position (older Safari) */
.sticky {
  position: -webkit-sticky;
  position: sticky;
}
```

### Prefixes No Longer Needed (2025)

These can be safely removed:
- Flexbox properties (`-webkit-flex`, `-ms-flex`)
- Grid properties (`-ms-grid`)
- Transform properties (`-webkit-transform`)
- Transition properties (`-webkit-transition`)
- Border-radius (`-webkit-border-radius`)
- Box-shadow (`-webkit-box-shadow`)

---

## JavaScript API Compatibility

### Features Requiring Polyfills or Fallbacks

#### Intersection Observer (Lazy Loading)
```javascript
// Check for support
if ('IntersectionObserver' in window) {
  // Use Intersection Observer
} else {
  // Fallback: load all images immediately
}
```

#### Resize Observer (Responsive Components)
```javascript
if ('ResizeObserver' in window) {
  const resizeObserver = new ResizeObserver(entries => {
    // Handle resize
  });
} else {
  // Fallback: use window.addEventListener('resize')
}
```

#### CSS.supports (Feature Detection)
```javascript
if (CSS.supports('display', 'grid')) {
  // Use CSS Grid
} else {
  // Fallback to flexbox
}
```

#### Fetch API (Older Browsers)
```javascript
// All modern browsers support fetch, but check if supporting IE11
if ('fetch' in window) {
  fetch('/api/endpoint');
} else {
  // Use XMLHttpRequest fallback or polyfill
}
```

#### localStorage (Privacy Mode)
```javascript
function isLocalStorageAvailable() {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return true;
  } catch (e) {
    return false; // Safari private mode blocks localStorage
  }
}
```

---

## Testing Tools & Resources

### Automated Testing Tools

#### 1. **BrowserStack** (Recommended)
- Real device testing (iOS, Android)
- Desktop browser testing
- Screenshot comparison
- Automated testing with Selenium
- **URL**: https://www.browserstack.com

#### 2. **Sauce Labs**
- Cross-browser testing
- Mobile app testing
- Visual regression testing
- **URL**: https://saucelabs.com

#### 3. **LambdaTest**
- Live interactive testing
- Screenshot testing
- Responsive testing
- **URL**: https://www.lambdatest.com

#### 4. **Playwright** (Open Source)
```bash
npm install -D @playwright/test

# Run tests across Chromium, Firefox, WebKit
npx playwright test
```

Example test:
```javascript
import { test, expect } from '@playwright/test';

test('product page loads correctly', async ({ page }) => {
  await page.goto('https://wingmantactical.com/products/example');

  // Check product title is visible
  await expect(page.locator('h1')).toBeVisible();

  // Check add to cart button exists
  await expect(page.locator('button:has-text("Add to Cart")')).toBeVisible();

  // Take screenshot
  await page.screenshot({ path: 'product-page.png' });
});
```

---

### Manual Testing Tools

#### 5. **Browser DevTools**
- **Chrome DevTools**: Device simulation, network throttling
- **Firefox Developer Tools**: CSS Grid inspector, font debugging
- **Safari Web Inspector**: iOS device debugging
- **Edge DevTools**: Chromium-based, similar to Chrome

#### 6. **Can I Use** (Browser Support Lookup)
- Check CSS/JS feature support
- **URL**: https://caniuse.com

#### 7. **Responsively App** (Free Desktop Tool)
- Preview multiple device sizes simultaneously
- **URL**: https://responsively.app

#### 8. **Real Device Testing**
- **iOS**: Use Xcode Simulator (free for Mac users)
- **Android**: Use Android Studio Emulator (free)
- **Physical Devices**: Test on actual iPhones, Android phones

---

## Mobile Browser Testing Checklist

### iOS Safari Testing
- [ ] Test on iPhone (latest iOS)
- [ ] Test on iPad (latest iPadOS)
- [ ] Test in portrait and landscape
- [ ] Test touch gestures (tap, swipe, pinch)
- [ ] Test with keyboard open/closed
- [ ] Test with Safari's Reader Mode
- [ ] Test add to home screen (PWA behavior)
- [ ] Verify safe area insets (notch compatibility)

### Chrome Mobile Testing
- [ ] Test on Android phone (latest)
- [ ] Test on Android tablet
- [ ] Test with different font size settings
- [ ] Test with data saver mode
- [ ] Test with dark mode enabled
- [ ] Test with accessibility settings (TalkBack)

### Samsung Internet Testing
- [ ] Test on Samsung Galaxy device
- [ ] Test with built-in ad blocker enabled
- [ ] Test with dark mode
- [ ] Test with high contrast mode

---

## Performance Testing Across Browsers

### Metrics to Track

| Metric | Chrome | Safari | Firefox | Edge | Target |
|--------|--------|--------|---------|------|--------|
| **FCP** (First Contentful Paint) | | | | | < 1.8s |
| **LCP** (Largest Contentful Paint) | | | | | < 2.5s |
| **TTI** (Time to Interactive) | | | | | < 3.8s |
| **TBT** (Total Blocking Time) | | | | | < 200ms |
| **CLS** (Cumulative Layout Shift) | | | | | < 0.1 |

### Performance Testing Tools

**Chrome DevTools Lighthouse**
```bash
# Run Lighthouse from command line
npx lighthouse https://wingmantactical.com --view
```

**WebPageTest** (Multi-browser testing)
- URL: https://www.webpagetest.org
- Test from different locations
- Compare performance across browsers

**Safari Web Inspector Timeline**
- Record page load
- Analyze network waterfall
- Check main thread activity

---

## Known Browser Quirks

### Safari
- **Bug**: 100vh includes address bar on mobile
- **Workaround**: Use `100dvh` or JavaScript calculation

### Firefox
- **Bug**: Flexbox with `min-height: auto` can cause overflow
- **Workaround**: Set `min-height: 0` explicitly

### Chrome
- **Bug**: Autofill changes input background to yellow
- **Workaround**: Use `box-shadow` inset to override

### Edge
- **Bug**: Smooth scrolling can be janky on Windows
- **Workaround**: Test with different `scroll-behavior` values

### iOS Safari
- **Bug**: `position: fixed` breaks when keyboard opens
- **Workaround**: Switch to `position: absolute` when input is focused

---

## Testing Workflow

### 1. **Development Phase**
- Primary browser: Chrome (fastest DevTools)
- Test responsive design in Chrome DevTools
- Verify functionality works

### 2. **Pre-Deploy Phase**
- Test in Safari (macOS + iOS Simulator)
- Test in Firefox
- Test in Edge (if Windows available)
- Test on real mobile devices (iOS + Android)

### 3. **Staging/QA Phase**
- Use BrowserStack for comprehensive testing
- Run automated Playwright tests
- Test critical user flows in all browsers
- Document any browser-specific issues

### 4. **Post-Deploy Phase**
- Monitor real user analytics by browser
- Check error tracking (Sentry, LogRocket) by browser
- Address any browser-specific bugs reported by users

---

## Browser Testing Checklist Template

Use this template for each major release:

```markdown
## Release: [Version Number] - [Date]

### Desktop Browsers
- [ ] Chrome (Windows) - Tester: _____ | Issues: _____
- [ ] Chrome (macOS) - Tester: _____ | Issues: _____
- [ ] Safari (macOS) - Tester: _____ | Issues: _____
- [ ] Firefox (Windows) - Tester: _____ | Issues: _____
- [ ] Edge (Windows) - Tester: _____ | Issues: _____

### Mobile Browsers
- [ ] Safari iOS (iPhone) - Tester: _____ | Issues: _____
- [ ] Safari iOS (iPad) - Tester: _____ | Issues: _____
- [ ] Chrome Mobile (Android) - Tester: _____ | Issues: _____
- [ ] Samsung Internet - Tester: _____ | Issues: _____

### Critical Flows Tested
- [ ] Homepage load
- [ ] Product discovery (collection pages)
- [ ] Product detail page
- [ ] Add to cart
- [ ] Checkout
- [ ] Account login
- [ ] Search

### Performance Scores
- Chrome Lighthouse: ___/100
- Safari Web Inspector: Pass/Fail
- Firefox DevTools: Pass/Fail

### Known Issues
[List any browser-specific issues found]

### Sign-off
- [ ] All critical flows working
- [ ] No blocking issues
- [ ] Performance acceptable
- [ ] Ready for production

**Tested by**: _______________
**Date**: _______________
```

---

## Debugging Tips by Browser

### Chrome DevTools
```javascript
// Check if element is visible in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
  );
}

// Log performance metrics
performance.getEntriesByType('navigation').forEach(entry => {
  console.log('DOM loaded:', entry.domContentLoadedEventEnd);
  console.log('Page loaded:', entry.loadEventEnd);
});
```

### Safari Web Inspector
- Use **Timelines** tab to record page activity
- Use **Storage** tab to inspect localStorage/sessionStorage
- Use **Console** to check for errors (Safari hides some errors by default)

### Firefox Developer Tools
- Use **CSS Grid Inspector** for grid debugging
- Use **Accessibility Inspector** for a11y issues
- Use **Performance** tab for frame rate analysis

---

## Resources

- [MDN Browser Compatibility Data](https://github.com/mdn/browser-compat-data)
- [Can I Use](https://caniuse.com)
- [Autoprefixer CSS Online](https://autoprefixer.github.io/)
- [BrowserStack Blog](https://www.browserstack.com/blog/)
- [WebKit Feature Status](https://webkit.org/status/)
- [Chrome Platform Status](https://chromestatus.com/)
- [Firefox Platform Status](https://platform-status.mozilla.org/)

---

## Sign-off

- [ ] All critical browsers tested
- [ ] Mobile browsers tested on real devices
- [ ] Known issues documented and triaged
- [ ] Performance metrics meet targets across browsers
- [ ] No blocking bugs found
- [ ] Workarounds implemented for browser quirks
- [ ] Team trained on browser-specific issues

**Tested By**: _______________
**Date**: _______________
**Next Test Date**: _______________
