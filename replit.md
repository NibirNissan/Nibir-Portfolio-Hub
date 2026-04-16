# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Portfolio Artifact (`artifacts/portfolio`)

Professional portfolio for Nibir Nissan — CST student, full-stack developer, AI automation expert.

### Design System
- **5-Theme Switcher**: `ThemeSwitcher.tsx` — glassmorphism dropdown menu, circular clip-path expand transition, localStorage persistence (`portfolio-theme` key)
  - **Emerald Stealth** (default): bg `#0a0a0a`, accent `#10b981`, secondary `#f59e0b`
  - **Cyber Amber**: bg `#0c0a09`, accent `#f59e0b`, secondary `#10b981`
  - **Midnight Royal**: bg `#020617`, accent `#8b5cf6`, secondary `#ec4899`
  - **Mono Chrome**: bg `#000000`, accent `#ffffff`, secondary `#a3a3a3`
  - **iPhone Liquid Glass**: bg `#e5e5e7` (Soft Matte Silver-Grey), accent `#1d1d1f` (Midnight Black), secondary `#0066cc` (Muted Steel Blue). LIGHT theme (`isLight: true`) with 25px backdrop blur, `rgba(255,255,255,0.4)` card bg, `1px solid rgba(255,255,255,0.5)` borders, `0 20px 50px rgba(0,0,0,0.05)` floating shadows, mesh gradient body (#f5f5f7→#d2d2d7), 1.5% grid opacity. Uses `[data-theme="liquid-glass"]` CSS overrides to flip all dark-mode utility classes (text, bg, borders, glows, gradients).
- **CSS Variable System**: All accent colors driven by `--theme-accent`, `--theme-accent-rgb`, `--theme-secondary-rgb`, `--theme-surface-rgb`, `--theme-heading`, `--theme-body`, `--theme-muted`, etc. in `:root`. JS applies theme via `document.documentElement.style.setProperty()`. Utility classes: `accent-text`, `text-gradient`, `glow-emerald`, `nav-capsule`, `icon-duotone` all reference CSS variables. Inline card backgrounds use `rgba(var(--theme-surface-rgb), ...)` instead of hardcoded dark values.
- **Display Font**: Space Grotesk (h1–h4), Inter (body)
- **Glassmorphism**: `rgba(10, 10, 10, 0.5–0.7)` with `backdrop-filter: blur()`
- **Grain texture**: CSS `::before` pseudo-element on `.grain-bg` class, opacity controlled by `--theme-grain`
- **Card accents**: Multi-color system (emerald, violet, amber, rose, sky, indigo, teal, orange) for variety — intentionally NOT themed

### Navigation
- Floating capsule bottom navbar (desktop), expandable pill (mobile)
- `[NN]` monogram logo top-left
- Magnetic hover effect via JS mouse tracking

### Sections
Hero, About, Skills, Projects (Firestore-backed, static fallback), Services (6 standard + 2 premium glassmorphism), Subscription, Ecosystem (interactive flowchart), Vision, **ProjectFeatures** (horizontal slider carousel), Contact

### Dynamic CMS — Firebase (Firestore + Auth)
- **`/admin`** — Protected Admin Panel (email/password login). Tabs: "Manage Projects" + "Manage Blogs".
  - Projects CRUD: title, slug, thumbnail, tech stack, live/repo links, features, stats, detail sections (text/image paragraphs)
  - Blogs CRUD: title, slug, date, cover image, excerpt, rich text content (Quill.js editor), published toggle
- **`/blog`** — Public blog listing page (only published posts)
- **`/blog/:slug`** — Individual blog post with rich typography
- Firebase config: 6 `VITE_FIREBASE_*` env vars (see Firebase setup guide)
- Projects section auto-fetches from Firestore if configured; falls back to static data if not
- Key files: `src/lib/firebase.ts`, `src/lib/firestoreTypes.ts`, `src/pages/AdminPage.tsx`, `src/pages/BlogList.tsx`, `src/pages/BlogPost.tsx`, `src/components/QuillEditor.tsx`

### Case Study Sub-Pages (`/project/:slug`)
Dynamic project pages accessible via "View Project" links on project cards. Each page includes:
- **Hero**: Title, subtitle, year, role, status badge, 3D tilt mockup
- **Problem**: Challenge description with emerald left-border accent
- **Solution + Tech Stack**: Glowing pill tags for each technology
- **Features Grid**: Numbered feature cards (3-column layout)
- **Results/Impact**: Bold stats in colored cards with hover glow
- **CTA**: "Get in Touch" linking back to main contact section

**Routing**: wouter with framer-motion `AnimatePresence` page transitions (fade-and-scale)
**Navigation**: ProjectNav (bottom capsule with Overview/Solution/Features/Results anchors), BackButton (fixed top-right glowing arrow)
**Scroll Reveals**: IntersectionObserver-based `ScrollReveal` component with directional animations (up/left/right/scale)
**Data**: `src/data/projects.ts` — 6 projects with slug-based lookup

### Service Sub-Pages (`/service/:slug`)
- **Data**: `src/data/services.ts` — 8 services with full content (process, deliverables, FAQ, pricing, case study links)
- **ServicePage** (`src/pages/ServicePage.tsx`): Hero, Process Timeline, Deliverables Grid, Case Study Teaser, Pricing Tiers, FAQ Accordion
- **ServiceNav** (`src/components/ServiceNav.tsx`): Bottom capsule nav (Overview/Process/Deliverables/Pricing/FAQ + pulsing Hire Me button)
- **Routing**: `/service/:slug` with animated page transitions via framer-motion
- **Interactive**: FAQ accordion with animated expand/collapse, floating "Get Started" sticky button, pulsing "Hire Me" CTA
- **Links**: "Learn More" links on all homepage service cards point to their sub-pages
- **Slugs**: ai-automation, web-development, video-editing, digital-marketing, subscription-business, saas-development, wordpress-development, webapp-saas-product

### Custom Cursor & Scroll Effects
- **CustomCursor**: Replaces system cursor with themed dot (8px) + semi-transparent ring (25px) with lerp lag. Ring expands to 40px on hover over links/buttons/cards, dot vanishes. Touch devices auto-detected and excluded. Dot color driven by `--cursor-dot-color` CSS var (set per theme in `applyTheme()`), z-index 9999, `opacity: 1 !important` enforced in CSS (only `.cursor-hovering` can set `opacity: 0`).
- **ScrollSkew**: GSAP ScrollTrigger "Morph-Fade-Slide" reveal. Section: `opacity:0, y:100, rotateX:-15deg, scale:0.9` → flat via `power3.out`, `scrub:1`, start `top 95%` → end `top 40%`. Cards (`.reveal-card`): staggered sub-reveal (stagger: 0.15), `y:70, rotateX:-10, scale:0.95` → flat, start `top 85%` → end `top 30%`. Perspective: 1200px. Mobile: 3D transforms disabled (no rotateX/scale), only y-slide + fade for performance. `will-change` toggled dynamically. `prefers-reduced-motion` respected.
- **ParallaxBg**: Fixed background layer with 3 blurred radial gradient orbs + 1 conic gradient mesh orb. Main layer moves `y: -150px` (desktop) / `y: -60px` (mobile). Mesh layer moves `y: -80px` with 15deg rotation at `scrub: 1.5` for depth offset. Sections sit above via `z-index: 1`.
- CSS: `cursor: none` applied via `.custom-cursor-active` class on `<html>`, hover states via `.cursor-hovering`
- **GSAP dependency**: `gsap` package with `ScrollTrigger` plugin registered globally

### Dynamic Favicon
- **SVG Favicon**: Dynamically generated `data:image/svg+xml` with bold "N" letter in Space Grotesk, neon glow filter (Gaussian blur + merge), themed accent color on dark/light background. Generated via `generateFaviconSvg()` in ThemeSwitcher.
- **Theme Integration**: `updateFavicon()` called from `applyTheme()` — favicon color matches active theme accent (emerald, amber, violet, white, midnight).
- **Tab Focus**: `visibilitychange` listener dims the "N" to 40% opacity and adds a notification dot (accent circle + white inner) when tab is hidden; restores full brightness when tab returns.
- **HTML**: `<link rel="icon" id="dynamic-favicon">` in `index.html`, updated via JS `href` swap.

### Visual Depth Enhancements
- **NebulaBg**: Animated mesh gradient backgrounds (deep greens/blacks) in Projects and Services sections — slow-drifting radial blobs
- **TiltCard**: 3D perspective tilt on hover for project cards — RAF-throttled mouse tracking with cached bounds
- **ScanLine**: Glowing neon line dividers between sections (transform-based animation, replaces static `.section-line`)
- **icon-duotone**: CSS utility for glowing duo-tone emerald icons on all section header icons — `drop-shadow` + `brightness(1.2)`
- Reduced-motion media query fallback for icon filters

### Key CSS Utilities
`glow-emerald`, `glow-amber`, `text-gradient`, `text-gradient-amber`, `nav-capsule`, `.hub-pulse-border`, `.icon-duotone`, `accent-text`, `accent-bg`, `accent-border`

### Assets
5 photos in `attached_assets/` via `@assets/` alias. Hero: `162cf2f1...webp`. About: `WhatsApp_Image_2026-02-28...jpeg`.

### Notes
- Contact form is frontend-only (fake submit with setTimeout)
- Social links use placeholder URLs
- No backend/API needed — purely static frontend

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
