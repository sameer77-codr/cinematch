# CineMatch

CineMatch helps viewers discover personalized movie recommendations, understand why a film might suit them, and explore Indian cinema by language and regional industry.

## Run & Operate

- `pnpm --filter @workspace/cinematch run dev` — run the CineMatch website
- `pnpm --filter @workspace/api-server run dev` — run the shared API server
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Local Vite runs require `PORT` and `BASE_PATH` (use `PORT=5173 BASE_PATH=/` for a local root preview)
- Database-backed routes require `DATABASE_URL`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/cinematch/src/App.tsx` — CineMatch interface, sample film catalog, regional filters, and browser-persisted interactions
- `artifacts/cinematch/src/index.css` — app theme and visual styles
- `lib/api-spec/openapi.yaml` — source of truth for API contracts
- `lib/db/src/schema/` — Drizzle database schema

## Architecture decisions

- The current CineMatch UI is a frontend-first prototype with sample data; movie ratings and watchlist choices are stored in the browser.
- The repository is a pnpm monorepo; run commands from the root so shared libraries and lockfile are available.

## Product

The website supports movie discovery, genre and Indian cinema industry/state filters, recommendations with explanations, ratings, a watchlist, and a taste profile. State filters describe regional cinema roots, not live theatre availability.

## User preferences

No additional project-specific preferences recorded.

## Gotchas

- The Vite configuration requires `PORT` and `BASE_PATH`; managed Replit workflows supply these automatically.
- Keep the root `pnpm-lock.yaml` and workspace manifests when cloning or syncing the repository.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
