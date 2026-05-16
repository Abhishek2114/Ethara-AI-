# AstralHQ



![Dashboard placeholder](docs/screenshots/dashboard.png)

## Features

- **Authentication** — JWT access tokens, httpOnly refresh cookies, bcrypt password hashing
- **RBAC** — Admin & Member roles with route-level authorization
- **Projects** — CRUD, member management, progress tracking
- **Tasks** — Kanban board with drag-and-drop, priorities, deadlines
- **Dashboard** — Stats, charts, activity feed, AI productivity insights
- **Team** — Crew roster with task/project counts
- **Analytics** — Priority distribution, productivity radar, deadline heatmap
- **UX** — Command palette (⌘K), toasts, skeleton loaders, Framer Motion transitions

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, Vite, Tailwind CSS v4, React Router, Axios, Recharts, Framer Motion, @dnd-kit |
| Backend | Node.js, Express 5, Prisma 6, PostgreSQL |
| Auth | JWT, bcryptjs, express-validator |
| Deploy | Railway (monorepo), Docker Compose (local Postgres) |

## Monorepo Structure

```
astralhq/
├── apps/
│   ├── client/          # React + Vite frontend
│   └── server/          # Express API
├── docker-compose.yml
├── railway.json
└── package.json         # npm workspaces
```

## Quick Start

### Prerequisites

- Node.js 20+
- Docker (optional, for local PostgreSQL)

### 1. Clone & install

```bash
git clone <repo-url> astralhq && cd astralhq
npm install
```

### 2. Environment

```bash
cp apps/client/.env.example apps/client/.env
```

### 3. Database (choose one)

#### Option A — Local SQLite (recommended)

```bash
npm run setup:local
```

This creates `apps/server/data/dev.db`, seeds demo data, and configures the API to use SQLite.

#### Option B — Postgres via Docker

```bash
cp apps/server/.env.example apps/server/.env
npm run docker:up
npm run db:deploy
npm run db:seed
```

Edit `apps/server/.env` — set `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` (32+ chars each).

### 4. Run

```bash
npm run dev
```

- **Frontend:** http://localhost:5173  
- **API:** http://localhost:3000/api  

### Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@astralhq.app | Admin123! |
| Member | alex@astralhq.app | Member123! |

## Environment Variables

### Server (`apps/server/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | Access token signing secret |
| `JWT_REFRESH_SECRET` | Refresh token signing secret |
| `JWT_ACCESS_EXPIRES_IN` | Default: `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Default: `7d` |
| `CORS_ORIGIN` | Frontend URL(s), comma-separated in prod |
| `COOKIE_SECURE` | `true` in production (HTTPS) |
| `PORT` | API port (default `3000`) |

For local SQLite dev, the server uses `apps/server/.env.sqlite`, which is copied automatically when you run `npm run dev` or `npm run setup:local`.

### Client (`apps/client/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend URL (empty in dev uses Vite proxy) |

## API Reference

Base URL: `/api`

### Auth

| Method | Path | Auth |
|--------|------|------|
| POST | `/auth/register` | — |
| POST | `/auth/login` | — |
| POST | `/auth/refresh` | Cookie |
| POST | `/auth/logout` | — |
| GET | `/auth/me` | Bearer |

### Projects

| Method | Path | Auth |
|--------|------|------|
| GET | `/projects` | Bearer |
| POST | `/projects` | Bearer |
| GET | `/projects/:id` | Bearer |
| PUT | `/projects/:id` | Bearer |
| DELETE | `/projects/:id` | Bearer |

### Tasks

| Method | Path | Auth |
|--------|------|------|
| GET | `/tasks` | Bearer |
| POST | `/tasks` | Bearer |
| POST | `/tasks/reorder` | Bearer |
| GET | `/tasks/:id` | Bearer |
| PUT | `/tasks/:id` | Bearer |
| DELETE | `/tasks/:id` | Bearer |

### Dashboard & Team

| Method | Path | Auth |
|--------|------|------|
| GET | `/dashboard/stats` | Bearer |
| GET | `/team` | Bearer |
| GET | `/health` | — |

## Architecture

```
┌─────────────┐     HTTPS      ┌─────────────┐
│   React     │ ◄────────────► │   Express   │
│   (Vite)    │   JWT + API    │   + Prisma  │
└─────────────┘                └──────┬──────┘
                                      │
                               ┌──────▼──────┐
                               │ PostgreSQL  │
                               └─────────────┘
```

**Backend layers:** `routes` → `controllers` → `services` → Prisma  
**Frontend:** `pages` → `components` → `lib/api` + `AuthContext`

## Railway Deployment

1. Create a Railway project and connect this repo.
2. Add **PostgreSQL** plugin — copy `DATABASE_URL` to the API service.
3. Create two services from the monorepo:
   - **API** — root: `apps/server`, start: `node src/index.js`
   - **Web** — root: `apps/client`, build: `npm run build`, start: `npm run start`
4. Set API env vars: `DATABASE_URL`, `JWT_*`, `CORS_ORIGIN` (your Railway web URL), `COOKIE_SECURE=true`, `NODE_ENV=production`
5. Set Web env: `VITE_API_URL` = your Railway API public URL (build-time variable).
6. Run migrations on deploy: `npx prisma migrate deploy` (included in `railway.toml` build).

See `railway.json` and per-app `railway.toml` for reference configs.

## Vercel Deployment (Full Stack)

This repo can be deployed as a single Vercel project. The API runs as a serverless
function under `/api`, and the client is served from the Vite build output.

1. Create a new Vercel project and import this repository.
2. Vercel will use [vercel.json](vercel.json) to build the Vite client and route
   `/api/*` to the Express app.
3. Set these environment variables in Vercel (Production + Preview):
   - `DATABASE_URL`
   - `JWT_ACCESS_SECRET`
   - `JWT_REFRESH_SECRET`
   - `CORS_ORIGIN` = your Vercel app URL (comma-separated allowed)
   - `COOKIE_SECURE` = `true`
4. Optional: set `VITE_API_URL` to empty (or omit it) to use same-origin `/api`.
5. Run migrations against your database: `npx prisma migrate deploy`.
6. Deploy the project.

Note: Socket.IO is not supported on Vercel serverless functions. If you need
real-time sockets, host the API elsewhere.

### Railway Database (PostgreSQL)

1. Create a Railway project and add a **PostgreSQL** plugin.
2. Copy the `DATABASE_URL` from Railway.
3. Paste it into your Vercel project env vars (Production + Preview).
4. Run `npx prisma migrate deploy` against the Railway database.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start API + client concurrently |
| `npm run build` | Build client for production |
| `npm run db:migrate` | Dev migrations |
| `npm run db:seed` | Seed demo data |
| `npm run setup:local` | Set up SQLite dev database with seed data |
| `make docker-up` | Start local Postgres |

## License

ISC
