# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

House of Diamonds is a static landing page for a premium jewelry retailer in Sydney, Australia, specializing in lab-grown diamond engagement rings. The page is optimized for Google Ads conversion campaigns.

## Tech Stack

- **HTML5** with semantic markup
- **Tailwind CSS** via CDN (no build step required)
- **Vanilla JavaScript** for form handling and interactions
- **Custom CSS** (`styles.css`) for animations, luxury effects, and Google Fonts

## Development

### Running Locally

No build process required. Options:
```bash
# Python 3
python -m http.server 8000

# Node.js (if http-server installed)
npx http-server -p 8000
```
Then visit http://localhost:8000

Or simply open `index.html` directly in a browser.

## Architecture

### Single-Page Structure

The landing page (`index.html`) contains these sections in order:
1. Hero section with CTA buttons
2. Trust signals (stats, testimonials, certifications)
3. Booking form with image sidebar
4. Services & expertise grid (6 service cards)
5. Key benefits dark panel
6. FAQ accordion-style section
7. Final CTA with background image
8. Footer with contact info and social links

### Custom Tailwind Configuration

Tailwind is configured inline in `index.html` with a custom gold color palette:
```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                gold: {
                    400: '#d4af37',  // Primary brand gold
                    500: '#b8960f',
                    600: '#a07c0a',
                    // ... full palette defined
                }
            }
        }
    }
}
```

### Key Files

- `index.html` - Complete landing page (main file)
- `booking-form.js` - Form validation class with Australian phone formatting, date/time validation, loading states, and success/error messages
- `styles.css` - Custom animations, luxury button effects, form enhancements, accessibility improvements, print styles
- `assets/` - Hero images in WebP and JPG formats

### Component HTML Files (for reference)

- `features-section.html` / `features-section-updated.html` - Service cards
- `faq-section.html` - FAQ content
- `tracking.html` - Analytics/tracking code snippets

## Form Handling

The booking form in `index.html` requires backend integration. The `BookingForm` class in `booking-form.js`:
- Validates required fields, email format, Australian phone numbers
- Formats phone numbers as `04XX XXX XXX`
- Constrains date picker to next 6 months
- Currently simulates submission (backend endpoint needed at `/api/bookings`)

To enable real submissions, uncomment the `submitToBackend()` call in `handleSubmit()` and configure your API endpoint.

## Tracking Integration

Add tracking codes to `<head>` section:
- Google Ads conversion tracking
- Google Analytics 4
- Facebook Pixel (optional)

See `README.md` for complete tracking code examples and Google Tag Manager setup.

## Design System

- **Primary gold**: `#d4af37` (gold-400)
- **Typography**: Playfair Display (headings), Cormorant Garamond (body serif), Inter (sans-serif)
- **Spacing**: Tailwind defaults with `py-20` / `py-24` for section padding
- **Cards**: White background, `border-slate-200`, `rounded-2xl`, hover shadow effects
- **Buttons**: Gold gradient primary, outline secondary, `rounded-full` for hero CTAs
