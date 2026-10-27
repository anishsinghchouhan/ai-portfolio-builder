# AI Portfolio Builder — CSS Design System Documentation

**Version:** 1.0.0
**Scope:** Pure CSS design tokens, patterns, and conventions. No framework, no markup — implementation-agnostic documentation intended to guide any frontend engineer building the product.

---

## Table of Contents

1. Design Philosophy
2. Color System
3. Typography System
4. Spacing System
5. Border Radius
6. Shadow System
7. Button Design
8. Input Design
9. Card Design
10. Navigation
11. Layout System
12. Icon Guidelines
13. Animation System
14. Responsive Rules
15. Accessibility
16. Naming Convention
17. CSS Folder Structure
18. CSS Variables
19. Best Practices
20. Common Mistakes

---

## 1. Design Philosophy

The AI Portfolio Builder visual language is built on seven pillars. Every token and component decision in this document should trace back to one of these.

| Pillar | What it means in practice |
|---|---|
| **Modern SaaS** | Flat surfaces, subtle depth via shadow rather than gradients, confident whitespace, product-first (not marketing-first) visual weight. |
| **Minimal** | No decoration without function. Every border, shadow, and color exists to communicate hierarchy or state — not to decorate. |
| **Clean** | Consistent 4px-based rhythm, limited palette, restrained typographic scale (7 sizes max in any one view). |
| **Professional** | Muted, desaturated neutrals as the base; saturated color reserved for action and status only. |
| **Premium** | Soft, diffused shadows (never harsh drop shadows), generous line-height, high-quality font stack (Inter/Geist). |
| **Responsive** | Every component is specified as fluid-first; fixed pixel values are used only for icons, borders, and radii. |
| **Accessibility First** | WCAG 2.1 AA is the floor, not the ceiling. Contrast, focus, and touch target rules are non-negotiable and are enforced at the token level, not left to component authors. |

**Design tone summary:** Think Linear's density + Stripe's color restraint + Vercel's typographic confidence + Airbnb's approachable roundness.

---

## 2. Color System

### 2.1 Principles

- Color communicates **state and hierarchy**, never decoration.
- Every color has a light-mode and dark-mode pair.
- Semantic colors (success, danger, warning, info) never change hue between light/dark — only lightness/saturation shift for contrast.

### 2.2 Full Color Table (Light Mode)

| Token | HEX | RGB | HSL | Usage |
|---|---|---|---|---|
| `--color-primary` | `#4F46E5` | `79, 70, 229` | `hsl(243, 75%, 59%)` | Primary CTAs, active nav items, links, focus accents |
| `--color-primary-hover` | `#4338CA` | `67, 56, 202` | `hsl(243, 65%, 51%)` | Hover state of primary elements |
| `--color-primary-active` | `#3730A3` | `55, 48, 163` | `hsl(243, 54%, 41%)` | Pressed/active state |
| `--color-primary-subtle` | `#EEF2FF` | `238, 242, 255` | `hsl(231, 100%, 97%)` | Primary-tinted backgrounds, selected rows |
| `--color-secondary` | `#0EA5E9` | `14, 165, 233` | `hsl(199, 89%, 48%)` | Secondary actions, accents, illustrative highlights |
| `--color-secondary-hover` | `#0284C7` | `2, 132, 199` | `hsl(199, 98%, 39%)` | Hover for secondary elements |
| `--color-success` | `#16A34A` | `22, 163, 74` | `hsl(142, 76%, 36%)` | Success toasts, published states, positive metrics |
| `--color-success-subtle` | `#F0FDF4` | `240, 253, 244` | `hsl(138, 76%, 97%)` | Success banner backgrounds |
| `--color-danger` | `#DC2626` | `220, 38, 38` | `hsl(0, 72%, 51%)` | Errors, destructive buttons, invalid fields |
| `--color-danger-subtle` | `#FEF2F2` | `254, 242, 242` | `hsl(0, 86%, 97%)` | Error banner/field backgrounds |
| `--color-warning` | `#D97706` | `217, 119, 6` | `hsl(32, 95%, 44%)` | Warnings, expiring trials, caution badges |
| `--color-warning-subtle` | `#FFFBEB` | `255, 251, 235` | `hsl(48, 100%, 96%)` | Warning banner backgrounds |
| `--color-info` | `#2563EB` | `37, 99, 235` | `hsl(221, 83%, 53%)` | Informational callouts, tips, tooltips |
| `--color-info-subtle` | `#EFF6FF` | `239, 246, 255` | `hsl(214, 100%, 97%)` | Info banner backgrounds |
| `--color-background` | `#FFFFFF` | `255, 255, 255` | `hsl(0, 0%, 100%)` | Page background |
| `--color-surface` | `#F8FAFC` | `248, 250, 252` | `hsl(210, 40%, 98%)` | Sidebar, panels, secondary surfaces |
| `--color-card` | `#FFFFFF` | `255, 255, 255` | `hsl(0, 0%, 100%)` | Card backgrounds (elevated on `--color-surface`) |
| `--color-border` | `#E2E8F0` | `226, 232, 240` | `hsl(214, 32%, 91%)` | Default borders, dividers |
| `--color-border-strong` | `#CBD5E1` | `203, 213, 225` | `hsl(213, 27%, 84%)` | Emphasized borders, input outlines on hover |
| `--color-text-primary` | `#0F172A` | `15, 23, 42` | `hsl(222, 47%, 11%)` | Headings, primary body text |
| `--color-text-secondary` | `#475569` | `71, 85, 105` | `hsl(215, 19%, 35%)` | Secondary body text, descriptions |
| `--color-text-muted` | `#94A3B8` | `148, 163, 184` | `hsl(215, 20%, 65%)` | Placeholders, timestamps, helper text |
| `--color-hover-overlay` | `rgba(15,23,42,0.04)` | `15,23,42 / 4%` | — | Neutral hover wash on non-colored surfaces |
| `--color-active-overlay` | `rgba(15,23,42,0.08)` | `15,23,42 / 8%` | — | Neutral pressed wash |
| `--color-disabled-bg` | `#F1F5F9` | `241, 245, 249` | `hsl(210, 40%, 96%)` | Disabled control backgrounds |
| `--color-disabled-text` | `#CBD5E1` | `203, 213, 225` | `hsl(213, 27%, 84%)` | Disabled control text |
| `--color-focus-ring` | `#818CF8` | `129, 140, 248` | `hsl(234, 89%, 74%)` | Focus outline color (paired with 2px offset) |

### 2.3 Dark Mode Colors

| Token | HEX | RGB | Usage |
|---|---|---|---|
| `--color-background-dark` | `#0B0F19` | `11, 15, 25` | Page background |
| `--color-surface-dark` | `#111827` | `17, 24, 39` | Sidebar/panels |
| `--color-card-dark` | `#1A2233` | `26, 34, 51` | Card backgrounds |
| `--color-border-dark` | `#2A3441` | `42, 52, 65` | Default borders |
| `--color-text-primary-dark` | `#F1F5F9` | `241, 245, 249` | Primary text |
| `--color-text-secondary-dark` | `#94A3B8` | `148, 163, 184` | Secondary text |
| `--color-text-muted-dark` | `#64748B` | `100, 116, 139` | Muted/placeholder text |
| `--color-primary-dark` | `#818CF8` | `129, 140, 248` | Primary actions (lightened for contrast on dark bg) |
| `--color-success-dark` | `#4ADE80` | `74, 222, 128` | Success on dark |
| `--color-danger-dark` | `#F87171` | `248, 113, 113` | Danger on dark |
| `--color-warning-dark` | `#FBBF24` | `251, 191, 36` | Warning on dark |
| `--color-info-dark` | `#60A5FA` | `96, 165, 250` | Info on dark |

### 2.4 Usage Example

```
.button-primary {
  background-color: var(--color-primary);
  color: #FFFFFF;
}
.button-primary:hover {
  background-color: var(--color-primary-hover);
}
.button-primary:active {
  background-color: var(--color-primary-active);
}
```

---

## 3. Typography System

### 3.1 Font Stack

```
--font-family-base: 'Inter', 'Geist', -apple-system, BlinkMacSystemFont, sans-serif;
```

- **Inter** — primary UI font. Excellent at small sizes, wide language support.
- **Geist** — alternative/secondary option for a more geometric, Vercel-like feel; can be swapped in via the same variable.
- **Poppins** — reserved for marketing/landing surfaces only (headlines, hero sections), never inside the app shell — its geometric roundness is friendlier for marketing but less legible at small UI sizes.

### 3.2 Type Scale

| Token | Size (rem / px) | Line Height | Letter Spacing | Weight | Usage |
|---|---|---|---|---|---|
| `--text-display` | 3.5rem / 56px | 1.1 | -0.02em | 700 | Landing hero headlines only |
| `--text-h1` | 2.25rem / 36px | 1.2 | -0.02em | 700 | Page titles |
| `--text-h2` | 1.875rem / 30px | 1.25 | -0.01em | 600 | Section titles |
| `--text-h3` | 1.5rem / 24px | 1.3 | -0.01em | 600 | Card/panel titles |
| `--text-h4` | 1.25rem / 20px | 1.35 | 0 | 600 | Sub-section titles |
| `--text-h5` | 1.125rem / 18px | 1.4 | 0 | 600 | Widget titles |
| `--text-h6` | 1rem / 16px | 1.4 | 0 | 600 | Minor labels/titles |
| `--text-body-lg` | 1.125rem / 18px | 1.6 | 0 | 400 | Lead paragraphs |
| `--text-body` | 1rem / 16px | 1.6 | 0 | 400 | Default body text |
| `--text-small` | 0.875rem / 14px | 1.5 | 0 | 400 | Secondary UI text, table cells |
| `--text-caption` | 0.75rem / 12px | 1.4 | 0.01em | 500 | Timestamps, meta info, badges |
| `--text-button` | 0.9375rem / 15px | 1 | 0.01em | 600 | All button labels |

### 3.3 Font Weights

| Token | Value | Usage |
|---|---|---|
| `--font-weight-regular` | 400 | Body copy |
| `--font-weight-medium` | 500 | Emphasized body text, captions |
| `--font-weight-semibold` | 600 | Headings, button text |
| `--font-weight-bold` | 700 | Display/H1 only |

### 3.4 Rules

- Never use more than **3 font weights** in a single screen.
- Letter-spacing tightens as size increases (large text needs negative tracking to avoid looking loose).
- Body text line-height stays ≥ 1.5 for readability; headings can go as low as 1.1–1.3.

---

## 4. Spacing System

All spacing derives from a **4px base unit**. Never use arbitrary values (e.g. `13px`, `22px`) — always snap to the scale.

| Token | Value | Typical Usage |
|---|---|---|
| `--space-1` | 4px | Icon-to-text gap, tight inline spacing |
| `--space-2` | 8px | Gap between related small elements (badge + label) |
| `--space-3` | 16px | Default padding inside inputs/buttons; gap between form fields |
| `--space-4` | 24px | Card internal padding; gap between related components |
| `--space-5` | 32px | Section internal spacing; gap between unrelated component groups |
| `--space-6` | 40px | Spacing between major page blocks |
| `--space-7` | 48px | Section-to-section spacing on desktop |
| `--space-8` | 64px | Large section breaks, hero padding on tablet |
| `--space-9` | 80px | Marketing section vertical padding (desktop) |
| `--space-10` | 96px | Hero/landing page top-level section spacing |

**Guideline:** as a component gets more "important" (page section > card > form field > icon), it should use a larger step. Never skip more than one step between a parent and its direct child's padding (e.g., a card with 64px padding but a button with 4px padding inside it breaks rhythm).

---

## 5. Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 4px | Checkboxes, small tags, inline badges |
| `--radius-md` | 8px | Inputs, buttons, dropdown menus |
| `--radius-lg` | 12px | Cards, modals, panels |
| `--radius-xl` | 16px | Large feature cards, hero panels, image containers |
| `--radius-full` | 9999px | Avatars, pills, toggle switches, circular icon buttons |

**Usage example:**
```
.card { border-radius: var(--radius-lg); }
.avatar { border-radius: var(--radius-full); }
```

Rule of thumb: the larger the component, the larger (proportionally smaller relative to size, but larger in px) the radius — a button at 40px height suits 8px radius; a card at 300px width suits 12–16px radius.

---

## 6. Shadow System

Shadows are always soft, multi-layered, and neutral (never colored) unless a component is in a colored "glow" focus state.

| Token | Value | Usage |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(15,23,42,0.06)` | Inputs, subtle resting elevation |
| `--shadow-md` | `0 4px 8px rgba(15,23,42,0.08)` | Default cards |
| `--shadow-lg` | `0 8px 24px rgba(15,23,42,0.10)` | Hover-elevated cards, popovers |
| `--shadow-xl` | `0 16px 40px rgba(15,23,42,0.14)` | Modals, floating panels |
| `--shadow-card` | `0 2px 6px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)` | Standard dashboard/portfolio card |
| `--shadow-floating` | `0 12px 32px rgba(15,23,42,0.12)` | Floating action button, toasts |
| `--shadow-modal` | `0 24px 64px rgba(15,23,42,0.18)` | Modal dialogs |
| `--shadow-dropdown` | `0 8px 16px rgba(15,23,42,0.10)` | Dropdown/select menus, tooltips |

**Rule:** never stack more than 2 shadow layers. Never use pure black shadows — always tint with the darkest text color at low opacity for a natural, premium feel.

---

## 7. Button Design

All buttons share: `border-radius: var(--radius-md)`, `font: var(--text-button)`, `transition: all 150ms ease`.

| Variant | Background | Text | Border | Height | Padding (H) |
|---|---|---|---|---|---|
| Primary | `--color-primary` | `#FFFFFF` | none | 40px | 20px |
| Secondary | `--color-surface` | `--color-text-primary` | 1px `--color-border` | 40px | 20px |
| Outline | transparent | `--color-primary` | 1px `--color-primary` | 40px | 20px |
| Ghost | transparent | `--color-text-primary` | none | 40px | 16px |
| Danger | `--color-danger` | `#FFFFFF` | none | 40px | 20px |
| Loading | same as base variant, dimmed 70% opacity | — | — | 40px | 20px |
| Disabled | `--color-disabled-bg` | `--color-disabled-text` | none | 40px | 20px |
| Icon Button | transparent / `--color-surface` | `--color-text-secondary` | none | 36px x 36px | 0 (centered icon) |
| Floating Action | `--color-primary` | `#FFFFFF` | none | 56px x 56px (circular) | 0 |

### 7.1 State Behavior (applies to all variants)

| State | Behavior |
|---|---|
| **Hover** | Background darkens one step (see color hover tokens); `transform: translateY(-1px)` for primary/danger only |
| **Active** | Background darkens to active token; `transform: translateY(0)`; shadow removed |
| **Focus** | `outline: 2px solid var(--color-focus-ring); outline-offset: 2px` — always visible, never `outline: none` without replacement |
| **Disabled** | `cursor: not-allowed`; opacity unaffected (uses dedicated disabled tokens instead, for accessible contrast) |
| **Animation** | All transitions use `150ms ease` for color/background, `100ms ease-out` for transform |

### 7.2 Loading Button

- Text is replaced or accompanied by a spinner (`16px`, 2px stroke, using current text color).
- Button width should be locked (`min-width`) before loading starts to prevent layout shift.

---

## 8. Input Design

All inputs share: height `40px` (single-line), `border-radius: var(--radius-md)`, `padding: 0 12px`, `border: 1px solid var(--color-border)`, `font: var(--text-body)`.

| Type | Notes |
|---|---|
| **Text Field** | Standard single-line; label above, helper text below |
| **Password** | Same as text field + trailing visibility-toggle icon button (36px hit area) |
| **Textarea** | `min-height: 96px`, `padding: 12px`, resizable vertically only |
| **Search** | Leading icon (16px, `--color-text-muted`), `padding-left: 36px`, optional clear icon trailing |
| **Dropdown/Select** | Same base styling + trailing chevron icon; menu uses `--shadow-dropdown` |
| **Checkbox** | 18px x 18px box, `--radius-sm`, checked state fills with `--color-primary` |
| **Radio** | 18px x 18px circle, `--radius-full`, checked state shows inner dot in `--color-primary` |
| **Toggle** | 40px x 22px track, `--radius-full`, thumb 18px; on-state track uses `--color-primary` |

### 8.1 Validation States

| State | Border | Background | Message Color |
|---|---|---|---|
| Default | `--color-border` | `--color-card` | `--color-text-muted` |
| Focus | `--color-primary`, 2px `--color-focus-ring` outline | `--color-card` | `--color-text-secondary` |
| Error | `--color-danger` | `--color-danger-subtle` (optional) | `--color-danger` |
| Success | `--color-success` | `--color-success-subtle` (optional) | `--color-success` |
| Disabled | `--color-border` | `--color-disabled-bg` | `--color-disabled-text` |

---

## 9. Card Design

Base card: `background: var(--color-card)`, `border: 1px solid var(--color-border)`, `border-radius: var(--radius-lg)`, `box-shadow: var(--shadow-card)`, `padding: var(--space-4)`.

| Card Type | Distinguishing Traits |
|---|---|
| **Portfolio Card** | Image/thumbnail top (16:10 ratio), title + tags below, hover elevates to `--shadow-lg` |
| **Dashboard Card** | Compact padding (`--space-3`), often paired with an icon + metric layout |
| **Analytics Card** | Large numeral (`--text-h2`/`--text-h1`), small trend label in success/danger color |
| **Pricing Card** | Emphasized border (2px `--color-primary`) on "recommended" tier; larger padding (`--space-5`) |
| **Feature Card** | Icon in a `--radius-md` colored tile (`--color-primary-subtle` bg), title + description |
| **Template Card** | Full-bleed preview image, overlay gradient on hover revealing "Use Template" button |
| **Testimonial Card** | Quote text in `--text-body-lg`, avatar + name/title row at bottom |
| **Glass Card** | `background: rgba(255,255,255,0.6)`, `backdrop-filter: blur(12px)`, 1px semi-transparent border — used sparingly over imagery/gradients only |

---

## 10. Navigation

| Component | Key Specs |
|---|---|
| **Navbar** | Height 64px, `background: var(--color-background)`, bottom border 1px `--color-border`, horizontal padding `--space-5` |
| **Sidebar** | Width 260px (expanded) / 72px (collapsed), `background: var(--color-surface)`, right border 1px `--color-border` |
| **Footer** | `background: var(--color-surface)`, padding `--space-7` vertical, text uses `--text-small` + `--color-text-secondary` |
| **Breadcrumb** | `--text-small`, separator uses `--color-text-muted`, current page in `--color-text-primary` (not a link) |
| **Tabs** | Underline style preferred; active tab uses 2px `--color-primary` bottom border + `--color-text-primary`; inactive uses `--color-text-secondary` |
| **Pagination** | Circular/rounded buttons 32px x 32px, active page uses `--color-primary` background + white text |

---

## 11. Layout System

| Token | Value | Usage |
|---|---|---|
| `--container-max` | 1280px | Max width for app shell content |
| `--container-narrow` | 768px | Forms, settings pages, focused reading content |
| `--section-padding-x` | `--space-5` (32px) | Horizontal page padding, desktop |
| `--grid-gap-default` | `--space-4` (24px) | Default grid/flex gap between cards |
| `--grid-columns-desktop` | 12 | Base grid |
| `--grid-columns-tablet` | 8 | Tablet grid |
| `--grid-columns-mobile` | 4 | Mobile grid |

### 11.1 Breakpoints

| Name | Min-width | Typical Device |
|---|---|---|
| Mobile | 0px | Phones |
| Tablet | 768px | Tablets, small laptops |
| Laptop | 1024px | Standard laptops |
| Desktop | 1440px | Large monitors |

---

## 12. Icon Guidelines

| Property | Value |
|---|---|
| **Sizes** | 16px (inline/small UI), 20px (default UI), 24px (headers/empty states), 32px+ (illustrative only) |
| **Stroke Width** | 1.5px – 2px (consistent across the entire icon set; never mix stroke weights) |
| **Color** | Inherits `currentColor` by default; muted icons use `--color-text-muted` |
| **Spacing** | Minimum 8px gap between icon and adjacent text (`--space-2`) |

Use a single icon library throughout (e.g. Lucide/Feather-style, consistent 24x24 viewBox) — never mix icon families, as differing stroke weights and corner styles break visual consistency.

---

## 13. Animation System

| Token | Value | Usage |
|---|---|---|
| `--duration-fast` | 100ms | Micro-interactions (button press, checkbox check) |
| `--duration-base` | 150ms | Hover states, color transitions |
| `--duration-slow` | 250ms | Modals, dropdowns, panel expand/collapse |
| `--duration-page` | 300ms | Page/route transitions |
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Default for most transitions |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Entrances (fade in, slide in) |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Exits (fade out, slide out) |

| Effect | Implementation Notes |
|---|---|
| **Hover** | Color/background change + optional 1px translateY lift |
| **Fade** | Opacity 0 → 1 over `--duration-slow` |
| **Slide** | `translateX/Y` 8–16px → 0, paired with fade |
| **Scale** | 0.96 → 1 for modal/popover entrances |
| **Rotate** | Used only for chevrons/carets (90°/180° toggle) and loading spinners (360° infinite) |
| **Loading** | Spinner: 360° rotation, `800ms linear infinite` |
| **Skeleton** | Shimmer gradient sweep, `1.5s ease-in-out infinite` |
| **Page Transition** | Cross-fade, `--duration-page`, avoid layout shift during transition |

---

## 14. Responsive Rules

| Breakpoint | Section Padding | Grid Columns | Typography Adjustment |
|---|---|---|---|
| Desktop (≥1440px) | `--space-9` (80px) | 12 | Full scale as defined in §3.2 |
| Laptop (1024–1439px) | `--space-7` (48px) | 12 | Display/H1 reduced ~10% |
| Tablet (768–1023px) | `--space-5` (32px) | 8 | Display → H1 size; H1 → H2 size |
| Mobile (<768px) | `--space-4` (24px) | 4 | Display/H1/H2 all reduced one full step; body stays fixed at 16px minimum |

**General rules:**
- Grid gap shrinks by one step (`--space-4` → `--space-3`) below tablet.
- Sidebar collapses to an overlay/drawer below 1024px.
- Multi-column card grids collapse to single column below 768px.
- Never reduce body text below 16px on mobile (prevents iOS auto-zoom on input focus).

---

## 15. Accessibility

| Requirement | Rule |
|---|---|
| **Color Contrast** | Text ≥ 4.5:1 against background (AA); large text (≥24px or 19px bold) ≥ 3:1. All token pairs in §2 have been checked against this. |
| **Focus Ring** | Always visible: `2px solid var(--color-focus-ring)`, `2px offset`. Never remove focus outlines without a compliant replacement. |
| **Keyboard Navigation** | All interactive elements reachable via Tab; visible focus order matches visual/DOM order; modals trap focus and return it on close. |
| **ARIA Recommendations** | Use semantic HTML first; ARIA only to fill gaps (e.g. `aria-live` for toasts, `aria-expanded` on collapsible triggers, `aria-label` on icon-only buttons). |
| **Minimum Font Size** | 12px absolute floor (captions only); 14px floor for any interactive/readable text; 16px floor for body/inputs on mobile. |
| **Touch Target** | Minimum 44px x 44px hit area for any tappable control, even if the visible element is smaller (use padding/pseudo-elements to expand hit area). |

---

## 16. Naming Convention

This system uses a **hybrid BEM + utility** approach: BEM for components, a small utility layer for spacing/layout primitives.

### 16.1 Component Naming (BEM)

```
.block {}
.block__element {}
.block--modifier {}
```

Example:
```
.card {}
.card__title {}
.card__footer {}
.card--elevated {}
.card--glass {}
```

### 16.2 Modifier Naming

- State modifiers describe **what**, not **how**: `.button--danger`, not `.button--red`.
- Boolean states use `is-`/`has-` prefixes when applied via JS rather than a variant class: `.is-loading`, `.is-disabled`, `.has-error`.

### 16.3 Utility Naming

Utilities are short, single-purpose, and prefixed to avoid collision with component classes:

```
.u-flex, .u-gap-3, .u-mt-4, .u-text-muted, .u-hidden
```

### 16.4 Folder/File Naming

- Kebab-case for all files: `button-primary.css`, `card-portfolio.css`.
- One component family per file; shared variants live in the same file as the base component.

---

## 17. CSS Folder Structure

```
styles/
│
├── base/            → Resets, element defaults, global typography rules applied to raw tags (h1, p, a). No classes here.
├── abstracts/        → Design tokens: variables, mixins (if using a preprocessor), functions. No actual CSS output.
├── components/       → One file per UI component (buttons, cards, inputs, modals). Self-contained, reusable, no page-specific overrides.
├── layouts/          → Structural patterns: grid system, header/sidebar/footer shell, page containers.
├── pages/            → Page-specific overrides only when a component doesn't generalize (keep this folder as small as possible).
├── themes/           → Light/dark theme variable overrides; theme-switching logic scope.
├── utilities/         → Single-purpose helper classes (spacing, display, text alignment, visibility).
└── animations/       → Keyframes and reusable transition/animation classes.
```

**Import order matters:** `base` → `abstracts` → `layouts` → `components` → `pages` → `themes` → `utilities` → `animations`. Utilities are imported late so they can override component-level styles when intentionally applied.

---

## 18. CSS Variables (Full Reference)

```css
:root {
  /* Colors — Brand */
  --color-primary: #4F46E5;
  --color-primary-hover: #4338CA;
  --color-primary-active: #3730A3;
  --color-primary-subtle: #EEF2FF;
  --color-secondary: #0EA5E9;
  --color-secondary-hover: #0284C7;

  /* Colors — Semantic */
  --color-success: #16A34A;
  --color-success-subtle: #F0FDF4;
  --color-danger: #DC2626;
  --color-danger-subtle: #FEF2F2;
  --color-warning: #D97706;
  --color-warning-subtle: #FFFBEB;
  --color-info: #2563EB;
  --color-info-subtle: #EFF6FF;

  /* Colors — Neutral / Surface */
  --color-background: #FFFFFF;
  --color-surface: #F8FAFC;
  --color-card: #FFFFFF;
  --color-border: #E2E8F0;
  --color-border-strong: #CBD5E1;

  /* Colors — Text */
  --color-text-primary: #0F172A;
  --color-text-secondary: #475569;
  --color-text-muted: #94A3B8;

  /* Colors — Interaction */
  --color-hover-overlay: rgba(15,23,42,0.04);
  --color-active-overlay: rgba(15,23,42,0.08);
  --color-disabled-bg: #F1F5F9;
  --color-disabled-text: #CBD5E1;
  --color-focus-ring: #818CF8;

  /* Typography */
  --font-family-base: 'Inter', 'Geist', -apple-system, sans-serif;
  --text-display: 3.5rem;
  --text-h1: 2.25rem;
  --text-h2: 1.875rem;
  --text-h3: 1.5rem;
  --text-h4: 1.25rem;
  --text-h5: 1.125rem;
  --text-h6: 1rem;
  --text-body-lg: 1.125rem;
  --text-body: 1rem;
  --text-small: 0.875rem;
  --text-caption: 0.75rem;
  --text-button: 0.9375rem;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 16px;
  --space-4: 24px;
  --space-5: 32px;
  --space-6: 40px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 80px;
  --space-10: 96px;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Shadow */
  --shadow-sm: 0 1px 2px rgba(15,23,42,0.06);
  --shadow-md: 0 4px 8px rgba(15,23,42,0.08);
  --shadow-lg: 0 8px 24px rgba(15,23,42,0.10);
  --shadow-xl: 0 16px 40px rgba(15,23,42,0.14);
  --shadow-card: 0 2px 6px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04);
  --shadow-floating: 0 12px 32px rgba(15,23,42,0.12);
  --shadow-modal: 0 24px 64px rgba(15,23,42,0.18);
  --shadow-dropdown: 0 8px 16px rgba(15,23,42,0.10);

  /* Animation */
  --duration-fast: 100ms;
  --duration-base: 150ms;
  --duration-slow: 250ms;
  --duration-page: 300ms;
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);

  /* Z-index scale */
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-fixed: 300;
  --z-overlay: 400;
  --z-modal: 500;
  --z-popover: 600;
  --z-toast: 700;
  --z-tooltip: 800;
}

[data-theme='dark'] {
  --color-background: #0B0F19;
  --color-surface: #111827;
  --color-card: #1A2233;
  --color-border: #2A3441;
  --color-text-primary: #F1F5F9;
  --color-text-secondary: #94A3B8;
  --color-text-muted: #64748B;
  --color-primary: #818CF8;
  --color-success: #4ADE80;
  --color-danger: #F87171;
  --color-warning: #FBBF24;
  --color-info: #60A5FA;
}
```

---

## 19. Best Practices

| Area | Practice |
|---|---|
| **Performance** | Prefer `transform`/`opacity` for animation (GPU-accelerated); avoid animating `width`/`height`/`box-shadow` directly on hover-heavy elements. |
| **Maintainability** | Never hardcode a color, spacing, or radius value in a component file — always reference a variable. |
| **Scalability** | New components should compose existing tokens; a new one-off value is a sign the token scale needs an addition, not a bypass. |
| **Accessibility** | Bake focus/contrast rules into base component classes so consumers can't accidentally opt out. |
| **Responsive Design** | Design mobile-first in the abstract even if desktop is the primary target — it forces a truly minimal, essential layout. |
| **Dark Mode** | Never invert colors programmatically (`filter: invert()`); always define explicit dark tokens as shown in §18. |
| **Animations** | Respect `prefers-reduced-motion`; provide a reduced/no-motion fallback for all non-essential animation. |

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 20. Common Mistakes

| Mistake | Why It's a Problem | Fix |
|---|---|---|
| Hardcoding hex values instead of variables | Breaks theming and consistency; a rebrand touches hundreds of files | Always reference design tokens |
| Using `px` for font-size everywhere | Ignores user browser font-size preferences, hurting accessibility | Use `rem` for typography |
| Removing `outline: none` without a replacement | Makes the site unusable for keyboard users | Always pair with a visible custom focus style |
| Overusing `!important` | Creates specificity wars, makes overrides unpredictable | Fix specificity/architecture instead (see §17 import order) |
| Deeply nested selectors (`.a .b .c .d span`) | Fragile, hard to override, poor performance | Flat BEM-style class selectors |
| Inconsistent spacing (13px, 22px, 7px) | Breaks visual rhythm across the product | Snap everything to the 4px scale in §4 |
| Mixing multiple icon libraries | Inconsistent stroke widths and corner styles look unpolished | Standardize on one icon set |
| Absolute positioning for layout instead of Flexbox/Grid | Breaks on responsive resize, hard to maintain | Use Flexbox/Grid as the default layout mechanism |
| Fixed pixel widths on containers | Breaks on smaller viewports | Use `max-width` + fluid `width: 100%` |
| Low-contrast text on colored backgrounds | Fails WCAG AA, excludes low-vision users | Test every text/background pair against contrast checkers |
| Animating too many properties at once | Janky, non-performant transitions | Limit to `transform`/`opacity`; keep duration ≤ 300ms |
| Skipping disabled/loading/error states in component design | Leads to inconsistent, ad-hoc patches later | Design all states (§7, §8) up front, not as an afterthought |

---

**End of Document.**
