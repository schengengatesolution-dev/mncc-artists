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
| `/auditions/cirque-2026` | 2026 Cirque Du Soleil Audition placeholder |
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

**GitHub `main` is ready to Import.** Preferred project name: `mncc-artists`.

1. Vercel Dashboard → Add New Project → Import `schengengatesolution-dev/mncc-artists`.
2. If name `mncc-artists` is already taken by an empty/orphaned project, delete that project (or rename) and re-import, **or** use another name and set the production domain later.
3. Framework: Next.js (auto). Build command: `prisma generate && next build` (already in `package.json` `build` script).
4. Set Environment Variables (Production + Preview):

| Variable | Example / notes |
|----------|-----------------|
| `DATABASE_URL` | Neon Postgres URL. This app uses Prisma schema **`mncc`** (won’t drop other tables). |
| `ADMIN_PASSWORD` | Change from demo `mncc-admin-demo` |
| `AUTH_SECRET` | Long random string |
| `BLOB_READ_WRITE_TOKEN` | Optional — Vercel Blob for uploads |

5. Deploy. Then from a machine with the same `DATABASE_URL`:
   ```bash
   npx prisma db push
   npm run seed
   ```
6. Demo dossier path: `/artists/demo-contortion-trio`  
   Admin: `/admin/login` with your `ADMIN_PASSWORD`.

### Branding

Official circular cyan/red/blue **New Circus** logo: `public/logo.png` (HD: `public/logo-hd.png`). Do not substitute BLACK.png / mncc.jpg / N*.jpg as the brand mark.


## Contact

- Phone: +976 9406-1666 (`tel:+97694061666`)
- mongolcircus@gmail.com
- https://www.facebook.com/MongolianNewCircus/
- Address: Ардын Аюушийн өргөн чөлөө, Монголын Үндэсний Их Сургууль, Баянгол дүүрэг - 11-р хороо, Улаанбаатар 16060
- New Circus Center · Ulaanbaatar

## Repo

https://github.com/schengengatesolution-dev/mncc-artists
