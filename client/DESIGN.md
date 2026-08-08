# Daccotta Frontend Design System — Zen Weaver

> Context document for design tools and implementation. Describes the **Zen Weaver** (Japanese Minimalism / Minimalist Spider-Man) aesthetic as the target design system for `client/`.

**Product:** Daccotta — a social network for movie lovers  
**Theme name:** Zen Weaver (Minimalist Noir)  
**Platform:** Responsive web app (Vite + React 19)  
**Primary experience mode:** Dark cinema UI (deep ink black + sparse accents)

---

## 1. Core Philosophy — The 80/20 Rule

Ground the UI in deep blacks. Use cinematic accents sparingly for **functional elements only**.

| Share | Role |
| --- | --- |
| ~80% | Deep ink black / surface-low / muted chrome |
| ~20% | Spider-Red (actions), Electric Blue (nav/active), Sense Yellow (ratings) |

Whitespace (blackspace) is a feature. Prefer ultra-thin borders over shadows. Industrial 4px corners — never playful pills for primary chrome.

---

## 2. Tech Stack (UI)

| Layer | Choice |
| --- | --- |
| Styling | Tailwind CSS v4 (`@theme` tokens in `src/index.css`) |
| Components | shadcn/ui + Radix primitives |
| Icons | Lucide React (outline) |
| Motion | Framer Motion (subtle scale / fade — cinematic, not bouncy) |
| Fonts | **Montserrat** (headings), **Inter** / Roboto (body) |

---

## 3. Design Tokens

### Surfaces

| Token | Hex | Tailwind | Role |
| --- | --- | --- | --- |
| background | `#0A0A0B` | `bg-background` | Main canvas |
| surface-low | `#141313` | `bg-card` / `bg-surface` | Cards, elevated panels |
| outline | `#27272A` | `border-border` | Ultra-thin structural borders |

### Accents

| Token | Hex | Tailwind | Role |
| --- | --- | --- | --- |
| primary (Spider-Red) | `#E31C25` | `bg-primary` / `text-primary` | CTAs, destructive, fav toggle |
| electric (Electric Blue) | `#00D4FF` | `text-electric` / `border-electric` | Active nav, tabs, online status |
| warning (Sense Yellow) | `#FACC15` | `text-warning` / `bg-warning` | Ratings, item-count badges |

### Text

| Token | Hex | Tailwind | Role |
| --- | --- | --- | --- |
| foreground | `#FAFAFA` | `text-foreground` | Body / titles |
| muted | `#A1A1AA` | `text-muted-foreground` | Secondary info |

### Shape

| Token | Value | Notes |
| --- | --- | --- |
| ROUND_FOUR | `4px` (`0.25rem`) | Buttons, inputs, cards, badges |
| Content pane | `lg:rounded-3xl` | Outer authenticated shell only |

---

## 4. Typography

| Role | Font | Classes |
| --- | --- | --- |
| Headings | Montserrat Bold / Extrabold | `font-heading`, auto on `h1–h6` |
| Body | Inter (fallback Roboto) | `font-sans` / `font-body` |
| Labels / meta | Inter, smaller, muted | `text-xs text-muted-foreground uppercase tracking-wider` |

Page titles: large, airy (`text-4xl`), generous whitespace below.

---

## 5. Component Rules

### Buttons
- **Primary:** solid Spider-Red (`bg-primary`), 4px radius
- **Secondary / ghost:** transparent + thin `border-border`
- No gray gradients for CTAs

### Inputs / Search
- Thin border, **no fill** (`bg-transparent`)
- Focus ring: Electric Blue

### Badges
- 4px radius (not pills)
- Warning outline for counts; primary outline for featured tags

### Tabs
- Underline style; active underline = Electric Blue

### Cards
- `bg-card` + `border-border` + `rounded-[4px]`
- No multi-layer shadows; elevation via surface shift only

### Navigation (left rail)
- Active icon + label tint: Electric Blue
- Thin vertical Electric Blue bar on active item
- Inactive: muted gray

---

## 6. Per-Page Patterns

### A. Home
- Full-width hero with heavy bottom→top black gradient
- Spider-Red “Watch Now” + outline “+ List”
- Horizontal poster rows; posters `scale-105` hover + red border indicator

### B. Movie Detail
- Blurred/high-opacity backdrop
- Circular fav (red toggle) / watchlist (blue toggle)
- Sense Yellow rating chip
- Cast: circular avatars, Montserrat names, no heavy card chrome

### C. Journal
- Group by month (uppercase tracked labels)
- Red “New Entry” header CTA
- Ratings in Sense Yellow

### D. Lists
- Grid / poster-stack cards
- Yellow item-count badges
- Large airy “Lists” title + “YOUR COLLECTIONS” electric eyebrow

### E. Friends
- Underline tabs (Electric Blue active)
- Online status dots in Electric Blue
- Thin-border friend rows; minimal search bar

---

## 7. Layout Shell

```
┌──────────────────────────────────────────────────────────┐
│ bg-[#0A0A0B] full viewport                               │
│  ┌─────┐  ┌────────────────────────────────────────────┐ │
│  │ Nav │  │ Content pane (bg-background)               │ │
│  │w-16 │  │ lg:rounded-3xl                             │ │
│  │     │  │                                            │ │
│  └─────┘  └────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

Auth / onboarding split: black form column + **Spider-Red** illustration panel (`bg-primary`).

---

## 8. Do’s & Don’ts

### Do
- Keep the black frame + rounded content pane
- Use Spider-Red for primary actions only
- Use Electric Blue for navigation / active / links
- Lead with movie posters and cinematic backdrops
- Montserrat for titles; Inter for body
- Maximize whitespace; keep borders ultra-thin

### Don’t
- Don’t use the old magenta (`#C111D4`) brand accent
- Don’t use purple-on-white SaaS gradients
- Don’t default to `rounded-full` for buttons/badges (avatars/status dots OK)
- Don’t fill search inputs with gray-800 slabs
- Don’t scatter accents — 80/20 discipline

---

## 9. File Map

| Concern | Path |
| --- | --- |
| Tokens / fonts | `client/src/index.css` |
| shadcn config | `client/components.json` |
| Theme hook | `client/src/hooks/useTheme.ts` |
| Auth shell | `client/src/layouts/authenticated-layout.tsx` |
| Nav | `client/src/components/custom/Navbar/TestNavbar.tsx` |
| Buttons / inputs / dialogs | `client/src/components/ui/*` |

---

## 10. Implementation Prompt (seed)

> Apply a Japanese minimalist theme based on the Zen Weaver design system. Use an 80/20 color split: 80% deep black (`#0A0A0B`) and 20% accent colors (Spider-Red `#E31C25` for buttons, Electric Blue `#00D4FF` for nav). Use shadcn/ui with a 4px border radius. All headings use Montserrat (Bold). Keep borders ultra-thin (`#27272A`) and maximize whitespace for a sophisticated noir aesthetic.

*Source of truth for the Zen Weaver redesign. Prefer these tokens when extending screens.*
