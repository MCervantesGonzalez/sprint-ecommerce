# Repository agent instructions

This file helps AI coding agents understand the structure, workflows, and conventions of the `sprint-ecommerce` repository.

## What this repo is

- Monorepo for an ecommerce store of personalized products.
- Backend: `apps/api` using NestJS, TypeScript, PostgreSQL, TypeORM, JWT auth, Swagger, MercadoPago, Cloudinary.
- Frontend: `apps/web` using Next.js 14 App Router, Tailwind CSS, shadcn/ui, Zustand, TanStack Query, React Hook Form + Zod.
- Root `packages/shared` exists as a shared package placeholder, but it is currently empty.

## Key directories

- `apps/api/` — backend API source and NestJS app.
- `apps/web/` — frontend web app source.
- `docker-compose.yml` — local development services (database, etc.).
- `DESIGN.md` — architecture, business context, entity model, module boundaries, and payment flow.
- `README.md` — project overview and installation notes.

## Primary workflows

### Backend

- `cd apps/api`
- `npm install`
- `npm run start:dev`
- API docs: `http://localhost:3000/api/docs`
- Other useful commands:
  - `npm run build`
  - `npm run lint`
  - `npm run test`
  - `npm run test:e2e`

### Frontend

- `cd apps/web`
- `npm install`
- `npm run dev`
- Frontend runs on port `3001` by default.

### Local environment and database

- Copy `.env.example` to `.env` in `apps/api` and `.env.local` in `apps/web` if needed.
- `docker-compose.yml` is the recommended local database setup.
- Backend environment variables include Cloudinary, MercadoPago, email, JWT, and CORS settings.

## Important conventions

- Use app-level package managers and scripts; there is no centralized root `npm` script workflow.
- Backend uses NestJS modules and TypeORM entities; the API is modularized by feature (auth, users, products, designs, cart, orders, payments, notifications, admin, storage).
- Frontend uses Next.js App Router with route groups for public, auth, shop, and admin segments.
- Server Components are the default in `apps/web/app`; add `"use client"` only when interactivity is required.
- Payment flow depends on MercadoPago webhook handling and backend callback secrets.
- Development uses `synchronize: true` in TypeORM, but production should use migrations.

## Docs to link instead of duplicate

- `README.md` — repo overview and install notes.
- `apps/api/README.md` — backend stack and commands.
- `apps/web/README.md` — frontend stack and notes.
- `DESIGN.md` — architecture decisions, entity relationships, and external service integration.

## Notes for AI agents

- Prefer code changes inside the appropriate app folder: `apps/api` for backend logic, `apps/web` for frontend UI and state.
- Avoid editing root packages unless there is a clear monorepo-level change.
- Since `packages/shared` is empty, do not assume shared package code is already implemented.
- No GitHub Actions workflows or `.github` instructions are present in this repo at the moment.

## Suggested next customization

- Create a `skills/` or `.github/copilot-instructions.md` file if you want per-domain guidance for backend vs frontend work.
