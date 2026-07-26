---
name: Wanderlust Luxury Design System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3d4947'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6d7a77'
  outline-variant: '#bcc9c6'
  surface-tint: '#006a61'
  primary: '#00685f'
  on-primary: '#ffffff'
  primary-container: '#008378'
  on-primary-container: '#f4fffc'
  inverse-primary: '#6bd8cb'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#9f3d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c74e00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7c2e00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-h1:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-h2:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-h3:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 1px
  body-reg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  headline-h1-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 20px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style
The brand personality is rooted in the concept of "Mindful Exploration." It bridges the gap between rugged adventure and high-end hospitality by utilizing a design language that is both grounded and ethereal. The aesthetic follows a **Japanese Minimalist** philosophy—focusing on intentionality, negative space, and "Ma" (the interval between things)—integrated with modern **Corporate/Modern** Western functionalism.

The UI should evoke a sense of calm reliability. It is adventurous yet composed, avoiding cluttered layouts in favor of structured serenity. Visuals are crisp, utilizing light-weight borders and generous white space to allow high-quality travel photography to act as the primary window into the brand's world.

## Colors
The shipped palette is the warm one in `landingPage.png`: sun-bleached paper, deep forest shade and fired clay. It is inspired by the grounding tones of stone and earth rather than the sea. The values below are what `src/lib/theme.ts` exports (the token keys keep their historical `teal` / `navy` names).

- **Primary Terracotta (#C0623A):** The core brand identity—warm and steady. Used for primary actions, eyebrows and active states. Deepens to #A44F2C on hover.
- **Deep Forest (#1F2A24):** Provides weight and authority. Used for high-level headings, dark bands and footer backgrounds to create a sense of luxury.
- **Warm Stone (#7C7360):** Softens the interface, used for secondary text to reduce eye strain. Body copy sits one step darker at #5F5849.
- **Clay Light (#F2E8DD):** A tinted surface for featured cards, badges and callout bands.
- **Surface & Background:** Cream canvas (#F4EFE6) as Level 0 with paper surfaces (#FBF8F2) as Level 1, separated by a 1px warm border (#E3DACB) rather than heavy lines.

## Typography
The three deliverables (email, destination page, printed itinerary) use **Inter** exclusively to achieve a systematic, utilitarian, and modern look. The landing page adds **Playfair Display** for display headings only, matching the editorial hero in `landingPage.png`; body, labels and data stay on Inter and IBM Plex Mono. The typography relies on weight and casing rather than varying typefaces to maintain a cohesive, "Zen" discipline.

- **Headlines:** H1 and H2 use tighter letter spacing for a more editorial, high-end appearance. 
- **Eyebrows:** The `label-caps` style is used for category tags or section headers to provide clear hierarchy without taking up significant vertical space.
- **Readability:** Body text is optimized at 14px to maintain a refined, delicate aesthetic suitable for luxury content, ensuring ample line height for breathability.

## Layout & Spacing
The layout follows a **Fluid Grid** model with high horizontal margins on desktop to mimic the "centered" feel of minimalist gallery designs. 

- **Grid:** A 12-column system for desktop, 8-column for tablet, and 4-column for mobile.
- **Rhythm:** An 8px linear scale is used for component spacing, while 24px and 48px increments are used to separate major content sections to maintain the "Ma" (negative space).
- **Adaptation:** On mobile, padding is reduced to 16px, and grid-heavy layouts reflow into single-column vertical stacks.

## Elevation & Depth
Depth is created through **Low-contrast outlines** and tonal layering rather than aggressive shadows. 

- **Surface Tiers:** The `Light Gray BG` acts as Level 0. White cards act as Level 1.
- **Borders:** Surfaces use a subtle 1px border (#E2E8F0) to define edges. 
- **Shadows:** When necessary for floating elements (like modals or dropdowns), use a single "Ambient Shadow": `0px 4px 20px rgba(15, 23, 42, 0.05)`. This keeps the UI feeling light and airy.

## Shapes
The shape language is "Soft-Modern." While the layout is rigid and structured, the corners are slightly rounded to provide a sense of approachability and comfort.

- **Base Radius:** 8px (`rounded-md`) for buttons and cards.
- **Extreme Radius:** Pill shapes (full rounding) are reserved specifically for Badges and Chips to differentiate them from actionable buttons.

## Components
- **Buttons:** Primary buttons use the Teal background with White text and 8px corners. Secondary buttons should use a ghost style with a Warm Gray border.
- **Cards:** Defined by a White background, 8px radius, and a #E2E8F0 border. Images within cards should have a top-only 8px radius.
- **Badges:** Pill-shaped. Use `Primary Teal Light` background with `Primary Teal` text for travel categories. Use `Success Green` for status indicators (e.g., "Available").
- **Input Fields:** 8px radius with a #E2E8F0 border. On focus, the border transitions to Primary Teal with a subtle 2px outer glow.
- **Icons:** Use 2px stroke-width line icons. Icons for Flight, Hotel, and Dining should be minimalist, avoiding filled states unless active.
- **Lists:** Use 16px vertical padding between list items with a hairline #F1F5F9 separator to maintain a clean, organized itinerary view.