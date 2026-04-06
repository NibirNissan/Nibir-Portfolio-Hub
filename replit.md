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
- **Background**: Midnight Charcoal `#0a0a0a`
- **Primary Accent**: Electric Emerald `#10b981` (section headers, CTAs, nav, focus states)
- **Secondary Accent**: Amber `#f59e0b` (badges, highlights)
- **Text**: Off-white `#e5e7eb`, neutral grays for body text
- **Display Font**: Space Grotesk (h1–h4), Inter (body)
- **Glassmorphism**: `rgba(10, 10, 10, 0.5–0.7)` with `backdrop-filter: blur()`
- **Grain texture**: CSS `::before` pseudo-element on `.grain-bg` class
- **Card accents**: Multi-color system (emerald, violet, amber, rose, sky, indigo, teal, orange) for variety

### Navigation
- Floating capsule bottom navbar (desktop), expandable pill (mobile)
- `[NN]` monogram logo top-left
- Magnetic hover effect via JS mouse tracking

### Sections
Hero, About, Skills, Projects, Services (6 standard + 2 premium glassmorphism), Subscription, Ecosystem (interactive flowchart), Vision, Contact

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
- **CustomCursor**: Replaces system cursor with emerald dot (8px) + semi-transparent ring (25px) with lerp lag. Ring expands to 40px on hover over links/buttons/cards, dot vanishes. Touch devices auto-detected and excluded.
- **ScrollSkew**: GSAP ScrollTrigger "Slide-Scale-Fade" reveal. Initial: `opacity:0, y:100, rotateX:-15deg, scale:0.9`. Animates to flat with `power3.out` ease, `scrub:1`, start `top 90%` → end `top 40%`. Mobile: lighter values (y:60, rotateX:-10, scale:0.93). Active section gets emerald neon glow border via `toggleClass`. `prefers-reduced-motion` respected. Uses `gsap.context` + `ctx.revert()` for clean teardown.
- **ParallaxBg**: Fixed background layer with 3 blurred radial gradient orbs (emerald + amber). Moves `y: -100px` over full page scroll via GSAP ScrollTrigger for subtle depth parallax. Sections sit above via `z-index: 1`.
- CSS: `cursor: none` applied via `.custom-cursor-active` class on `<html>`, hover states via `.cursor-hovering`
- **GSAP dependency**: `gsap` package with `ScrollTrigger` plugin registered globally

### Visual Depth Enhancements
- **NebulaBg**: Animated mesh gradient backgrounds (deep greens/blacks) in Projects and Services sections — slow-drifting radial blobs
- **TiltCard**: 3D perspective tilt on hover for project cards — RAF-throttled mouse tracking with cached bounds
- **ScanLine**: Glowing neon line dividers between sections (transform-based animation, replaces static `.section-line`)
- **icon-duotone**: CSS utility for glowing duo-tone emerald icons on all section header icons — `drop-shadow` + `brightness(1.2)`
- Reduced-motion media query fallback for icon filters

### Key CSS Utilities
`glow-emerald`, `glow-amber`, `text-gradient` (emerald), `text-gradient-amber`, `nav-capsule`, `.hub-pulse-border`, `.icon-duotone`

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
