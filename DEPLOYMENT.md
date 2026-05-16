# Deployment Steps (Vercel + Railway)

This guide deploys the full-stack app on Vercel with a Railway PostgreSQL database.

## 1) Create Railway PostgreSQL

1. Create a Railway project.
2. Add a **PostgreSQL** plugin.
3. Copy the `DATABASE_URL`.

## 2) Create Vercel Project

1. Import this repo into Vercel.
2. Keep the project as a single deployment (client + API).
3. Vercel uses [vercel.json](vercel.json) automatically.

## 3) Configure Vercel Environment Variables

Set these in **Production** and **Preview**:

- `DATABASE_URL` = (from Railway)
- `JWT_ACCESS_SECRET` = 32+ random chars
- `JWT_REFRESH_SECRET` = 32+ random chars
- `CORS_ORIGIN` = `https://<your-vercel-app>.vercel.app`
- `COOKIE_SECURE` = `true`

Optional:

- `VITE_API_URL` = leave empty to use same-origin `/api`

## 4) Run Migrations

Run this locally (or in Railway) against the Railway database:

```bash
npx prisma migrate deploy
```

## 5) Deploy

Trigger a Vercel deploy. On success:

- App: `https://<your-vercel-app>.vercel.app`
- API: `https://<your-vercel-app>.vercel.app/api`

## Notes

- Socket.IO is not supported in Vercel serverless functions.
- Serverless functions do not run background timers reliably.
