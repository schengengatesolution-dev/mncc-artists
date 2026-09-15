# MNCC Circus Artist Resource

Separate Next.js site for **Mongolian New Circus Center (MNCC)** — artists register once; MNCC presents shareable dossiers to festivals and contracts worldwide.

Bilingual EN/MN · Dark theatrical UI · Gold/cream accents

## Stack

- Next.js 14 App Router + TypeScript + Tailwind
- Prisma + **Postgres (Neon)** — tables live in schema `mncc` (safe alongside other apps)
- Optional offline SQLite: see `prisma/schema.sqlite.prisma`
- Uploads: `@vercel/blob` when `BLOB_READ_WRITE_TOKEN` is set; else `public/uploads`
- Admin: cookie JWT via `ADMIN_PASSWORD` + `AUTH_SECRET`

## Routes

| Path | Purpose |
|------|---------|
| `/` | Landing + CTA |
| `/register` | Artist registration form |
| `/artists/[slug]` | Public dossier (phone hidden; contact via mongolcircus@gmail.com) |
| `/admin/login` | Admin password login |
| `/admin` | Artist list + open dossiers (full contact) |
| `/admin/artists/[slug]` | Internal dossier with phone/email |

## Local setup

```bash
cp .env.example .env
# Set DATABASE_URL to a Neon Postgres URL
npm install
npx prisma db push
npm run seed
npm run dev
```

Open http://localhost:3000

### Default demo admin password

```
ADMIN_PASSWORD=mncc-admin-demo
```

**Change this in production.**

Demo artist: `/artists/demo-contortion-trio`

### Offline SQLite (optional)

```bash
cp prisma/schema.sqlite.prisma prisma/schema.prisma
# .env → DATABASE_URL="file:./dev.db"
npx prisma db push && npm run seed
```

## Environment variables

| Variable | Required | Notes |
|----------|----------|-------|
| `DATABASE_URL` | yes | Neon Postgres URL (Prisma uses schema `mncc`) |
| `ADMIN_PASSWORD` | yes | Admin login — demo default `mncc-admin-demo` |
| `AUTH_SECRET` | yes | JWT signing secret |
| `BLOB_READ_WRITE_TOKEN` | no | Vercel Blob for durable uploads |

## Production (Vercel)

1. Import GitHub repo `schengengatesolution-dev/mncc-artists` (project name `mncc-artists`).
2. Set env: `DATABASE_URL`, `ADMIN_PASSWORD`, `AUTH_SECRET`, optionally `BLOB_READ_WRITE_TOKEN`.
3. Prefer a dedicated Neon database; this app uses Postgres schema `mncc` so it can share a Neon project without colliding with other tables.
4. After first deploy (or before): `npx prisma db push` + `npm run seed` against that `DATABASE_URL`.

## Contact

- mongolcircus@gmail.com
- https://www.facebook.com/MongolianNewCircus/
- New Circus Center · Ulaanbaatar

## Repo

https://github.com/schengengatesolution-dev/mncc-artists
