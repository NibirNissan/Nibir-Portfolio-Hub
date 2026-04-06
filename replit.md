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

### Key CSS Utilities
`glow-emerald`, `glow-amber`, `text-gradient` (emerald), `text-gradient-amber`, `nav-capsule`, `.hub-pulse-border`

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
