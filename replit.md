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
