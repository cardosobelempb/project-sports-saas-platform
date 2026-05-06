# Agents Guide

## Scope
- This workspace is a TypeScript backend. The main code lives under `backend/`.
- Prisma schema lives in `backend/prisma/`. Generated Prisma client lives in `backend/generated/` and should not be edited.

## Quick commands (run inside backend/)
- `npm run dev` - start dev server (tsx)
- `npm run build` - build with tsup (ESM + d.ts)
- `npm run lint` - eslint with import sorting
- `npm run typecheck` - strict TS checks
- `npm run prisma:generate` - generate Prisma client
- `npm run prisma:migrate` - dev migration
- `npm run prisma:deploy` - deploy migration
- `npm run prisma:studio` - open Prisma Studio

## Architecture (clean modules)
- Modules live under `backend/src/modulos/<module>/` with `domain/`, `application/`, `infra/`, `presentation/`, and `container/`.
- Cross-cutting shared code lives under `backend/src/common/` and `backend/src/shared/`.
- Path alias: `@/*` -> `backend/src/*` (see [backend/tsconfig.json](backend/tsconfig.json)).

## Conventions and gotchas
- Keep module boundaries: avoid leaking infra into domain or application.
- Prefer existing utils in [backend/src/common/domain/utils](backend/src/common/domain/utils).
- Tests are not wired ("npm test" is a placeholder). If you add tests, wire Vitest.
- Docker compose only runs Postgres; backend is commented out (dev-only setup).

## Docs
- i18n usage: [backend/src/common/i18n/USO.md](backend/src/common/i18n/USO.md)
- Module READMEs: [backend/src/modulos](backend/src/modulos)
