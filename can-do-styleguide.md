# Can Do Style Guide

## Fonts

### Logo / Display Font
- **Font:** Hanky Demo (custom local font)
- **Variable:** `var(--font-logo)`
- **Usage:** Logo, toast notifications

### Body Font
- **Font:** Nunito (Google Font)
- **Variable:** `var(--font-nunito)`
- **Weights:** 200 (extra light), 300 (light), 400 (regular), 500 (medium)
- **Default weight:** 300 (light)
- **Usage:** All body text, headings, buttons, inputs

---

## Colours

### Background
| Name | Hex | Usage |
|------|-----|-------|
| Background | `#fef7f7` | Page background |

### Pastels
| Name | Hex | Usage |
|------|-----|-------|
| Pastel Pink | `#ffd4d4` | Borders, unselected states, dividers |
| Pastel Blue | `#d4e5ff` | Hover states |
| Pastel Green | `#d4ffd4` | Matching dates, success states |
| Pastel Purple | `#e8d4ff` | Share button |
| Pastel Yellow | `#fff8d4` | Others voted (calendar) |
| Pastel Mint | `#d4fff0` | (Available for future use) |

### Accent & UI
| Name | Hex | Usage |
|------|-----|-------|
| Accent | `#ffb8b8` | Primary buttons, selected states |
| Accent Hover | `#ffa0a0` | Button hover states |
| Success | `#a8e6a8` | Active indicator dots |
| Dark Pink | `#c77b7b` | "by SCT", suggest feature link |
| Green (Social Proof) | `#7c9885` | Events counter pill |

### Text
| Name | Hex | Usage |
|------|-----|-------|
| Foreground | `#4a4a4a` | Primary text |
| Text Light | `#7a7a7a` | Secondary text, labels |

---

## CSS Variables

```css
:root {
  --background: #fef7f7;
  --foreground: #4a4a4a;
  --pastel-pink: #ffd4d4;
  --pastel-blue: #d4e5ff;
  --pastel-green: #d4ffd4;
  --pastel-purple: #e8d4ff;
  --pastel-yellow: #fff8d4;
  --pastel-mint: #d4fff0;
  --accent: #ffb8b8;
  --accent-hover: #ffa0a0;
  --success: #a8e6a8;
  --text-light: #7a7a7a;
}
```

---

## Border Radius

| Element | Radius |
|---------|--------|
| Buttons, Inputs, Cards | `16px` |
| Calendar Days | `12px` |
| Pills / Tags | `rounded-full` (9999px) |
| Modals / Containers | `24px` (rounded-2xl) |

---

## Shadows

| Usage | Shadow |
|-------|--------|
| Cards / Containers | `shadow-sm` |
| Buttons | `shadow-sm` |
| Toast text | `0 4px 20px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)` |
| Modals | `shadow-lg` |

---

## Components

### Primary Button (Save My Dates)
```css
background: var(--accent);        /* #ffb8b8 */
hover: var(--accent-hover);       /* #ffa0a0 */
text: var(--foreground);          /* #4a4a4a */
hover text: white;
font-weight: 300;
border-radius: 16px;
```

### Secondary Button (Copy Link)
```css
background: var(--pastel-purple); /* #e8d4ff */
hover: var(--pastel-blue);        /* #d4e5ff */
text: var(--foreground);
```

### Links
```css
color: var(--accent);             /* #ffb8b8 */
hover: var(--accent-hover);       /* #ffa0a0 */
text-decoration: underline;
underline-offset: 2px;
```

### Input Fields
```css
background: white;
border: 1px solid var(--pastel-pink);
focus border: var(--accent);
border-radius: 16px;
font-weight: 300;
text-align: center;
```

---

## Calendar Day States

| State | Background | Border |
|-------|------------|--------|
| Default | `white/50` | none |
| Hover | `var(--pastel-pink)` | none |
| Selected | `var(--pastel-pink)` | `2px ring var(--accent)` |
| Others Voted | `var(--pastel-yellow)` | none |
| Matching | `var(--pastel-green)` | none |
| Selected + Matching | `var(--pastel-green)` | `2px ring var(--accent)` |
| Past/Disabled | `gray-100` | `opacity: 0.3` |

---

## Animations

### Toast Pop (Save confirmation)
```css
@keyframes toast-pop {
  0% { opacity: 0; scale: 0.5; }
  15% { opacity: 1; scale: 1.1; }
  30% { scale: 1; }
  80% { opacity: 1; scale: 1; }
  100% { opacity: 0; scale: 0.9; }
}
duration: 2s
```

### Fade In
```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
duration: 0.3s
```

---

## Spacing

- Page padding: `p-8` (32px)
- Section gaps: `gap-6` (24px) or `gap-8` (32px)
- Card padding: `p-6` (24px)
- Button padding: `px-6 py-3` or `px-4 py-3`
- Input padding: `px-6 py-4`

---

## Typography Scale

| Element | Size | Weight |
|---------|------|--------|
| Logo | `h-16` to `h-20` | — |
| Page Title | `text-3xl` | 300 (light) |
| Section Headings | `text-lg` | 300 (light) |
| Body Text | `text-sm` | 300 (light) |
| Small Text / Labels | `text-xs` | 300 (light) |
| Tiny Text | `text-[10px]` | 300 (light) |
| Toast | `text-5xl` / `text-6xl` | Logo font |

---

## Assets

| File | Location | Usage |
|------|----------|-------|
| Logo | `/public/logo.png` | Header |
| Logo (transparent) | `/public/logo-transparent.png` | OG image |
| Favicon | `/src/app/icon.png` | Browser tab |
| Apple Icon | `/src/app/apple-icon.png` | iOS bookmark |
| Page Curl | `/public/page-curl.png` | Homepage decoration |
| Logo Font | `/src/fonts/hanky-demo.regular.otf` | Display text |

---

## Brand Voice

- Friendly, casual, not corporate
- Light and approachable
- Slightly cheeky (see footer messages)
- Empowering ("You can do this!")
