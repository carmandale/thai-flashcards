# Technical Stack

> Last Updated: 2025-08-12
> Version: 1.0.0

## Core Technologies

**Application Framework:** React 19 with TypeScript
**Database System:** Local Storage (browser-based persistence)
**JavaScript Framework:** React 19
**CSS Framework:** Tailwind CSS v4

## Package Managers (CRITICAL - DO NOT CHANGE)

**Python Package Manager:** n/a
**JavaScript Package Manager:** yarn

⚠️ **IMPORTANT**: Always use the package managers specified above. 
- Python: n/a (frontend-only project)
- JavaScript: Use `yarn` (NOT npm)

## Development Environment

**Project Structure:** frontend_only
**Frontend Port:** 3000
**Backend Port:** n/a

### Startup Commands

**Frontend:** `yarn dev`
**Backend:** n/a

**Quick Start:** Run `./start.sh` to start development server

### Environment Files

- **Frontend:** `.env.local` (contains PORT=3000)
- **Backend:** n/a

## Testing Strategy

**Frontend Testing:** Vitest (React Testing Library)
**Backend Testing:** n/a
**E2E Testing:** playwright

## Additional Configuration

**UI Component Library:** shadcn/ui (with Radix UI primitives)
**Font Provider:** System fonts
**Icon Library:** Lucide React
**Animation Library:** Framer Motion
**Build Tool:** Vite
**State Management:** React Context API and useState
**Forms:** React Hook Form with Zod validation

## Mobile & PWA

**Mobile Strategy:** Mobile-first responsive design
**PWA Capabilities:** Planned for offline functionality
**Audio Handling:** Web Audio API with iOS Safari compatibility
**Touch Interactions:** Optimized for mobile gestures

## Deployment

**Application Hosting:** TBD (Vercel recommended)
**Database Hosting:** n/a (local storage)
**Asset Hosting:** TBD (bundled with application)
**Deployment Solution:** TBD (GitHub Actions + Vercel recommended)

## Repository

**Code Repository:** Local project (GitHub integration planned)

## Additional Dependencies

**Three.js:** @react-three/fiber and @react-three/drei for 3D elements
**DnD Kit:** For drag-and-drop interactions
**Date Management:** date-fns
**Carousel:** Embla Carousel React
**Charts:** Recharts (for progress visualization)
**Notifications:** Sonner
**Utilities:** clsx, tailwind-merge for className management
**UUID:** For unique identifiers

---

**⚠️ AGENT OS REMINDER**: Before making ANY changes to package management, startup commands, or environment configuration, ALWAYS check this file first to maintain consistency.