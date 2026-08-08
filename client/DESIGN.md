# Daccotta Frontend Design System

> Context document for design tools (e.g. Google Stitch). Describes the **current** frontend as implemented in `client/`, not aspirational redesign.

**Product:** Daccotta — a social network for movie lovers  
**Tagline intent:** Discover, journal, list, and share films with friends  
**Platform:** Responsive web app (Vite + React 19)  
**Primary experience mode:** Dark cinema UI (default preference leans dark; light theme exists)

---

## 1. Product & UX Overview

### What users do
- Sign up / sign in, then complete a short onboarding (avatar → top movies)
- Browse a home feed of movie carousels (friend activity + popular / top-rated)
- Search movies with year / genre / language filters
- Open movie detail pages (poster hero, cast, providers, favourites / watchlist)
- Maintain personal lists and a watch journal (date + rating + rewatches)
- View personal / friend stats (bento grids + charts)
- Manage friends (search, requests, remove)
- View profile as a bento dashboard

### Brand personality
- Cinema / nightlife: black frames, poster-forward imagery, magenta accent
- Social: friend-attributed carousel slides (“Watched by …”)
- Energetic but not playful — purple/magenta primary, crimson auth panels, gray-900 content cards

### Brand signals to preserve
- Wordmark / logo mark in the left rail (`logo_light.svg` on black nav)
- Magenta/violet primary (`#c111d4`) as the signature accent
- Auth / onboarding split layout: black form column + solid `#FF204E` illustration panel
- Movie posters as the dominant visual currency (TMDB imagery)

---

## 2. Tech Stack (UI)

| Layer | Choice |
| --- | --- |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"`, `@theme` tokens in `src/index.css`) |
| Components | shadcn/ui style (`components.json`: style `default`, baseColor `slate`, CSS variables) |
| Primitives | Radix UI (dialog, dropdown, select, tooltip, tabs, accordion, etc.) |
| Icons | Lucide React (outline, 16–24px typical) |
| Motion | Framer Motion (hover scale, carousel, list transitions, Magic UI dock) |
| Charts | Recharts + shadcn chart wrappers |
| Toasts | react-toastify, `theme="dark"` |
| Fonts | Google Fonts: Montserrat (headings), Roboto (body), Poppins loaded |

---

## 3. Color System

Colors are HSL CSS variables mapped into Tailwind as `bg-background`, `text-primary`, etc. Hex values below are approximations for design tools.

### Brand / fixed accents (not tokenized)

| Name | Hex | Usage |
| --- | --- | --- |
| Brand magenta (primary) | `#C111D4` | Primary buttons, active journal/logout icons, spinners, focus accents |
| Auth panel crimson | `#FF204E` | Right column on Sign In / Sign Up / Onboarding |
| Friend highlight | `#F87171` / red-400 | “Watched by {friend}” in hero carousel |
| Link blue | `#60A5FA` / blue-400 | Auth cross-links, friend count icons |
| Rating yellow | `#FACC15` / yellow-400 | IMDb-style rating chips, badge icons |
| README brand SVG | `#D700F7` | External brand color reference (close to primary) |

### Semantic tokens — Light (`.root`)

| Token | HSL | Hex ≈ | Role |
| --- | --- | --- | --- |
| background | `294 55% 98%` | `#FCF7FD` | Page surface |
| foreground | `294 67% 3%` | `#0C030D` | Body text |
| muted | `264 35% 86%` | `#D9CFE8` | Soft fills |
| muted-foreground | `264 15% 36%` | `#594E6A` | Secondary text |
| card | `0 0% 5%` | `#0D0D0D` | Cards (note: near-black even in light) |
| primary | `294 85% 45%` | `#C111D4` | Brand CTA |
| primary-foreground | `0 0% 100%` | `#FFFFFF` | On primary |
| secondary | `0 0% 5%` | `#0D0D0D` | Dark secondary fills |
| accent | `264 35% 92%` | `#E9E3F2` | Hover / subtle highlight |
| destructive | `21 87% 38%` | `#B5480D` | Destructive actions |
| border / input | `294 3% 93%` | `#EEEDEE` | Borders, inputs |
| ring | `294 10% 70%` | `#B9ABBA` | Focus rings |

### Semantic tokens — Dark (`.dark`)

| Token | HSL | Hex ≈ | Role |
| --- | --- | --- | --- |
| background | `240 6% 4%` | `#0A0A0B` | Main content canvas |
| foreground | `0 0% 98%` | `#FAFAFA` | Body text |
| muted | `240 4% 16%` | `#27272A` | Muted surfaces |
| muted-foreground | `240 5% 65%` | `#A1A1AA` | Secondary text |
| card / popover | `240 6% 6%` | `#0E0E10` | Elevated panels |
| primary | `294 85% 45%` | `#C111D4` | Same brand primary |
| secondary / accent / border / input | `240 4% 16%` | `#27272A` | Chrome / borders |
| destructive | `0 62% 40%` | `#A52727` | Destructive |
| ring | `240 4% 30%` | `#494950` | Focus |

### Chart colors (dark)

| Token | HSL intent |
| --- | --- |
| chart-1 | blue `220 70% 50%` |
| chart-2 | green `160 60% 45%` |
| chart-3 | orange `30 80% 55%` |
| chart-4 | purple `280 65% 60%` |
| chart-5 | rose `340 75% 55%` |

### Hardcoded gray gradients used in UI

Many feature screens bypass tokens and use Tailwind grays:

- Content cards: `bg-gradient-to-br from-gray-900 to-gray-800`
- Selected list rows: `bg-gradient-to-tr from-gray-900 to-gray-800`
- Auth submit: `bg-gradient-to-r from-gray-900 to-gray-700`
- Inputs on auth: `bg-gray-800 text-white`
- Movie detail chrome: `bg-black/50`, `bg-gray-700/50`, pill badges `bg-gray-800/65`

### Shell / chrome outside the content pane

- Outer authenticated shell: solid `bg-black`
- Left nav: solid black, white / gray-400 icons
- Content pane: `bg-background` with large radius on desktop (`lg:rounded-3xl`)

---

## 4. Typography

### Families

| Role | Font | CSS helper / token |
| --- | --- | --- |
| UI / headings | **Montserrat** (100–900) | `--font-sans`, `.font-heading` (weight 700) |
| Body | **Roboto** | `.font-body`, carousel CSS |
| Also loaded | Poppins 400/600/700 | Available; not primary |
| Theme aliases | Lato, Noto Sans, Matemasie | Declared in `@theme`; rarely used |

### Hierarchy (common patterns)

| Level | Typical classes | Notes |
| --- | --- | --- |
| Page title | `text-3xl`–`text-4xl font-bold` / `font-extrabold` | Auth, Journal, Search |
| Section title | `text-xl font-semibold` | Bento card headers |
| Card / movie title | `text-sm`–`text-lg font-bold` / `font-medium` | Poster overlays, search results |
| Body | `text-sm` / `text-base` | Descriptions, forms |
| Meta | `text-xs text-muted-foreground` / `text-gray-400` | Years, secondary stats |
| Auth links | `text-sm text-blue-400` | Sign in ↔ Sign up |

Default sans stack: `"Montserrat", "Lato", sans-serif`.

---

## 5. Shape, Spacing, Elevation

### Radius

| Token | Value | Use |
| --- | --- | --- |
| `--radius` | `0.5rem` (8px) | Base |
| `rounded-md` | ~6–8px | Buttons, inputs, nav icons |
| `rounded-lg` | ~8–12px | Dialogs, posters, cards |
| `rounded-xl` | ~12–16px | Bento tiles |
| `rounded-2xl` | ~16px | Magic UI dock |
| `rounded-3xl` | ~24px | Main content pane (desktop) |
| `rounded-full` | pill / circle | Badges, avatars, FAB, rating chips |

### Spacing conventions

- Page padding: often `px-4`–`px-12`, vertical `py-6`–`py-10`
- Bento grids: `gap-6`, tiles `p-6`
- Nav rail: `w-16`, icon buttons `p-2`, list item `mb-4`
- Auth form: `max-w-md`, `space-y-8` / `space-y-6` / `space-y-4`
- Content pane sits inside black shell with `pr-2`, `lg:my-4`

### Elevation / depth

- Dialogs: `shadow-lg` + `bg-black/80` overlay
- Movie posters: `shadow-lg` / `shadow-2xl` on hero poster
- Bento hover: `hover:shadow-xl` (shared bento component)
- Prefer soft black scrims over heavy multi-layer shadows
- Backdrop blur used on carousel overlay (`backdrop-blur-sm`) and dock (`backdrop-blur-md`)

### Scrollbars

Utility `.scrollbar-hide` removes scrollbars on main panes while content still scrolls.

---

## 6. Layout Shell

### Authenticated layout

```
┌──────────────────────────────────────────────────────────┐
│ bg-black full viewport                                   │
│  ┌─────┐  ┌────────────────────────────────────────────┐ │
│  │ Nav │  │ Content pane                               │ │
│  │w-16 │  │ bg-background                              │ │
│  │black│  │ lg:rounded-3xl                             │ │
│  │     │  │ flex-1, centered, overflow per page        │ │
│  │     │  │                                            │ │
│  └─────┘  └────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

- **Desktop:** left icon rail always visible; content rounded against black frame (app-in-frame look)
- **Mobile:** same rail present; content ~`90vw`; Magic UI bottom dock exists but is currently commented out in layout
- Profile menu (avatar dropdown) floats top-right on Home via absolute positioning

### Navigation items (left rail)

| Icon | Route | Notes |
| --- | --- | --- |
| Home | `/` | Active = white; inactive = gray-400 |
| Search | `/search-movie` | |
| Friends | `/friends` | |
| Lists | `/lists` | |
| Journal | `/journal` | Icon tinted `text-primary` |
| Log out | dialog confirm | Icon tinted `text-primary` |

Tooltips appear on the right of icons (`Tooltip`, delay 200ms).

### Unauthenticated / onboarding layout

5-column grid on large screens:

- **Cols 1–2:** black form column, centered, white text
- **Cols 3–5:** solid `#FF204E` with illustrative SVG (`/movie_signup.svg`, `/profile_page.svg`)
- Mobile: illustration column hidden; form full-bleed black

---

## 7. Component Library

### shadcn / UI primitives (`src/components/ui/`)

| Component | Visual notes |
| --- | --- |
| **Button** | Variants: `default` (primary fill), `destructive`, `outline`, `secondary`, `ghost`, `link`. Sizes: `default` h-10, `sm`, `lg`, `icon` (40×40). `rounded-md`, `text-sm font-medium` |
| **Input** | h-10, `rounded-md`, border-input, focus ring. Auth overrides to gray-800 |
| **Badge** | `rounded-full`, variants default/secondary/destructive/outline |
| **Dialog** | Centered modal, max-w-lg, `sm:rounded-lg`, black/80 overlay, zoom+fade enter. Titles often forced `text-white` |
| **Dropdown menu** | Used for profile menu (~w-52) |
| **Select** | Filters on Search |
| **Separator** | Horizontal rules |
| **Tooltip** | Nav labels |
| **Card** | `rounded-lg border bg-card shadow-sm` — used in Journal |
| **Avatar** | Circular; profile trigger ~42×42 |
| **Drawer** (vaul) | Create-list flows |
| **Tabs / Accordion / Switch / Checkbox / Calendar / Popover / Textarea / Textarea / Pagination** | Standard shadcn |
| **Stars** | Rating control on Journal |
| **LoadingSpinner** | Primary-colored border spinner |
| **FullPageLoader** | Full-screen loading with message |
| **profile-menu** | Avatar dropdown: username, friends/badges counts, Profile / Friends / Settings / Logout |
| **DockBar** + **magicui/dock** | Magnifying glassmorphic dock (mobile intent); inactive in layout |

### Custom product components (`src/components/custom/`)

| Component | Role |
| --- | --- |
| **MovieCarousel / CarouselCard** | Full-bleed hero slides: backdrop image, dark gradient, poster + meta, optional friend attribution, “View Details” pill |
| **MovieCard / Carousel (list)** | Poster tiles; hover blur + scale + bottom gradient title |
| **ProfileIcon** | Wrapper around profile-menu |
| **Navbar (TestNavbar)** | Active left rail |
| **ThemeController** | Sun/Moon ghost icon button |
| **Share** | Share affordances |
| **Groups / Group** | Group UI (feature present in codebase) |
| **AddToListBtn** | Add-to-list action |
| **LazyImage** | Lazy-loaded posters |
| **PopoverRadix** | Custom popover usage |

### Auth fields

`EmailField`, `EmailAvailabilityField`, `UsernameField` — validation states + availability messaging on black forms.

---

## 8. Screen Inventory (for Stitch frames)

### A. Sign In / Sign Up
- Split layout (black | `#FF204E`)
- Centered `text-3xl font-extrabold` title
- Dark inputs (`bg-gray-800`), eye toggle for password
- Primary CTA: gray gradient button (not always primary magenta)
- Disabled Google / Forgot Password at reduced opacity
- OR divider with gray-600 rule
- Cross-link in blue-400

### B. Onboarding
1. **Choose Avatar** — 3-column avatar grid, white ring on selection, Next disabled until selected; same split layout
2. **Top Movies** — pick favorites, then submit onboarding

### C. Home
- Hero carousel (300–600px tall by breakpoint), drag-capable
- Each slide: backdrop + left poster + title + year + genres + optional “Watched by”
- Below: horizontal sections “Top Movies This Week”, “Top Rated Movies of All Time”
- Profile avatar menu top-right

### D. Search
- Headline when idle: “Find Your Favorite Movie Here”
- Three selects (Year / Genre / Language) + search field with history
- Results as poster grid with title + year; hover slight scale
- Empty poster placeholder: muted box with title centered

### E. Movie Detail
- Full-viewport backdrop (`bg-fixed`), content in `bg-black/50` rounded panel
- Title row with Favourite (red when on) and Watchlist (yellow when on) circular icon buttons
- Yellow rating pill, overview, meta row with colored Lucide icons (blue / green / purple)
- Action chips: providers, YouTube, etc. on translucent gray-700
- Cast: circular headshots + name / character

### F. Journal
- Title “My Movie Journal” + date filter + circular Plus FAB
- Add-entry dialog: movie search, rating stars, date picker, rewatches
- Entries grouped by month in responsive poster grids (2–5 cols)
- Hover reveals overflow menu for delete

### G. Lists
- User lists index → list detail with MovieCards
- Create list via drawer

### H. Profile
- Dark bento grid (`from-gray-900 to-gray-800`, `rounded-xl`)
- Tiles: Profile Info (avatar + username + friends/badges), Your Lists, Your Stats (chart), List Preview, AI Recommendations (coming soon)
- Icon accents: blue / green / yellow / purple Lucide icons
- Avatar change overlay (“change” pill on hover)

### I. Stats (self & friend)
- Same bento language as Profile
- Total watched, monthly bar chart, top genres, genre pie, top decade
- White text on dark gradient tiles

### J. Friends
- Tabs: all / pending / add
- Search users, avatar rows, request actions, pagination
- Confirm dialogs for remove
- Motion list transitions (Framer)

### K. User descriptive (`/user/:userName`)
- Public-ish profile view for another user

---

## 9. Imagery & Media Rules

- **Source:** TMDB (`image.tmdb.org/t/p` with sizes `w92`, `w300`, `w500`, `w1280`)
- **Poster aspect:** ~2:3; grids often use natural poster ratios or `pb-[150%]` placeholders
- **Hero treatment:** backdrop under multi-stop black gradient (`transparent → 0.6 → 0.9`)
- **Hover on posters:** scale up (~1.03–1.05), blur image, reveal title gradient overlay
- **Avatars:** curated set from `src/assets/avatars.ts`; circular crops
- **Auth illustrations:** flat SVG on crimson panel, ~400px wide
- **Logo:** rounded-md mark in nav; light logo on black rail

Do not invent stock photography for movie content — designs should show poster-like frames.

---

## 10. Motion & Interaction

| Pattern | Spec |
| --- | --- |
| Poster hover | `scale: 1.05`, image blur + title fade-in ~300ms |
| Carousel card hover | `scale: 1.02`, content fade/slide in |
| View Details button | scale 1.05 hover / 0.95 tap |
| List / friends | AnimatePresence opacity fades |
| Dialog | fade + zoom 95% |
| Dock icons | magnification spring toward cursor |
| Theme toggle | Instant class swap on `<html class="dark">` |
| Profile avatar trigger | `hover:scale-105` |
| Spinners | CSS `animate-spin`, primary or white border |

Motion should feel cinematic and tactile, not bouncy/playful.

---

## 11. Iconography

- Library: **Lucide** outline icons
- Default stroke weight: library default
- Sizes: nav `h-6 w-6`; inline meta `h-3`–`h-4`; bento headers `h-6 w-6` with semantic colors
- Active nav: white; inactive: gray-400; accent actions: primary magenta
- Semantic color coding on Profile/Stats: blue (profile), green (lists), yellow (stats), purple (movies/AI)

---

## 12. Responsive Behavior

| Breakpoint | Behavior |
| --- | --- |
| `< sm` | Stacked forms; 2-col poster grids; shorter carousel (~300px); auth illustration hidden |
| `sm`–`md` | Wider posters, more journal columns |
| `lg+` | Auth 2/5 + 3/5 split; content pane rounded; taller hero (~600px); bento 3-column |

Tailwind defaults apply (`sm` 640, `md` 768, `lg` 1024).

---

## 13. Copy & Tone

- Direct, film-nerd friendly, short labels
- Examples: “Sign In”, “Find Your Favorite Movie Here”, “My Movie Journal”, “View Details”, “coming soon”
- Confirmations: “Are you sure you want to logout?” / remove-movie warnings
- Errors via toast (dark theme), inline `text-red-500` on forms

---

## 14. Design Do’s & Don’ts (for generated screens)

### Do
- Keep the **black frame + rounded content pane** for authenticated screens
- Use **magenta `#C111D4`** as the brand accent, not a generic purple-indigo gradient wash
- Lead with **movie posters / backdrops** as the visual anchor
- Prefer **dark gray gradient tiles** (`gray-900 → gray-800`) for dashboard cards
- Use **Montserrat** for titles, clean sans for UI chrome
- Keep auth/onboarding **black + `#FF204E`** split where applicable
- Use Lucide-style outline icons
- Round content surfaces generously (xl–3xl) but keep controls at md

### Don’t
- Don’t redesign as a light purple-on-white SaaS dashboard
- Don’t replace posters with abstract gradients as the main visual
- Don’t add dense marketing hero chrome (stat strips, floating promo badges) inside the app shell
- Don’t use Inter/Roboto-only generic startup styling for brand moments — Montserrat + magenta is the signal
- Don’t drop the left icon rail on desktop authenticated layouts
- Don’t make primary CTAs randomly rainbow; stick to primary magenta or the established gray gradients on auth

---

## 15. Example Stitch Prompts (seed)

Use these with this document attached:

1. **Home:** “Dark cinema web app home: black outer frame, left 64px icon rail, rounded content pane, full-width movie backdrop carousel with poster and title, horizontal poster rows below, avatar top-right.”
2. **Search:** “Centered search page on near-black background, three filter selects, search field, responsive poster grid with titles.”
3. **Auth:** “Split sign-in: left black form with Montserrat title and dark inputs; right solid #FF204E panel with movie illustration.”
4. **Profile bento:** “Dark dashboard of rounded gradient cards (gray-900 to gray-800) with colored Lucide icons, avatar, lists, and a small bar chart.”
5. **Movie detail:** “Fullscreen blurred movie backdrop, translucent black content card, title with circular fav/watchlist buttons, yellow rating pill, cast circles.”

---

## 16. File Map (source of truth)

| Concern | Path |
| --- | --- |
| Tokens / fonts / utilities | `client/src/index.css` |
| shadcn config | `client/components.json` |
| Theme hook | `client/src/hooks/useTheme.ts` |
| Routes | `client/src/router.tsx` |
| Auth shell | `client/src/layouts/authenticated-layout.tsx` |
| Nav | `client/src/components/custom/Navbar/TestNavbar.tsx` |
| Buttons / inputs / dialogs | `client/src/components/ui/*` |
| Brand logos | `client/src/assets/logo_light.svg`, `logo_dark.svg` |

---

*Generated from the current Daccotta client implementation. Prefer matching these patterns when proposing new screens so Stitch output stays on-brand with the live app.*
