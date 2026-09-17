# Vaseaux Lake Rentals

Family-friendly cabin-style accommodations on **Vaseaux Lake** in the South Okanagan. This project is a full-stack **Next.js** website with a MongoDB-backed CMS, booking-inquiry workflow, local media uploads, and an admin portal.

**Guest-facing brand (seeded):** Vaseaux Lake Waterfront Cabins  
**Project name:** Vaseaux Lake Rentals

---

## Public route map

| Route | Description |
|-------|-------------|
| `/` | Homepage with cinematic intro, cabin rail, seasons, and inquiry CTAs |
| `/about` | Property history and brand story |
| `/cabins` | Cabins 5–12 index with filters |
| `/cabins/[slug]` | Dynamic cabin detail pages |
| `/services` | Stay types and lake experiences |
| `/services/[slug]` | Dynamic service detail pages |
| `/rates-and-seasons` | Inquiry-focused rates overview (no fixed prices) |
| `/gallery` | Cinematic photo gallery with category filters |
| `/testimonials` | Guest testimonials (demo content seeded) |
| `/faqs` | Searchable FAQ accordion |
| `/things-to-do` | On-property activities and local guide |
| `/contact` | Contact details and message form |
| `/inquire` | Booking inquiry workflow (not instant booking) |
| `/policies` | Property policies |
| `/privacy` | Privacy policy |
| `/terms` | Terms of use |

Admin routes live under `/admin/*` (login required except `/admin/login`).

---

## Prerequisites

- **Node.js** 20+ recommended
- **MongoDB** 6+ (local install or Docker)
- **npm** (lockfile included)

---

## Quick start

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start MongoDB (Docker option)
docker compose up -d

# Create admin user (idempotent — updates password if user exists)
npm run create-admin

# Seed demo content (idempotent — skips existing records)
npm run seed

# Development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site and [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the admin portal.

---

## MongoDB & Compass

Default connection string (`.env.example`):

```env
MONGODB_URI=mongodb://127.0.0.1:27017/vaseaux_lake_rentals
```

**Docker:**

```bash
docker compose up -d
```

**Compass:** Create a new connection with the same `MONGODB_URI`. Database name: `vaseaux_lake_rentals`.

The seed script does **not** run automatically on app start. Run `npm run seed` manually when you want initial content.

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `AUTH_SECRET` | Yes | NextAuth session secret |
| `ADMIN_EMAIL` | Yes | Initial admin email (`create-admin`) |
| `ADMIN_PASSWORD` | Yes | Initial admin password (`create-admin`) |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public site URL for metadata/links |
| `UPLOAD_DIR` | Yes | Local upload directory (default `./uploads`) |
| `MAX_UPLOAD_BYTES` | No | Max upload size (default 12 MB) |
| `SMTP_*` | No | Optional email notifications |
| `BOOKING_NOTIFICATION_EMAIL` | No | Inquiry notification recipient |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run seed` | Idempotent database seed |
| `npm run create-admin` | Create/update admin from env vars |
| `npm run uploads:cleanup:dry` | Dry-run orphan upload cleanup |
| `npm run uploads:cleanup` | Delete unreferenced uploads |
| `npm run test` | Vitest unit tests |

---

## Seed data

The seed system lives in `src/lib/seed/` and is run via `scripts/seed.ts`.

### Idempotent behavior

- Each record is inserted **only if it does not already exist** (matched by slug, cabin number, question text, etc.).
- **Admin edits are never overwritten** on subsequent seed runs.
- Safe to run multiple times during development.

### What gets seeded

| Module | File | Contents |
|--------|------|----------|
| Settings | `settings.ts` | Brand, contact, property, booking, footer, motion |
| Pages | `pages.ts` | Home, About, Cabins, Services, Rates, Gallery, Testimonials, FAQs, Things to Do, Contact, Policies — with full section structures |
| Cabins | `cabins.ts` | Cabins 5–12 with exact sleeping arrangements |
| Services | `services.ts` | 7 experience/stay types |
| Seasons | `seasons.ts` | High + shoulder seasons (no fixed prices) |
| FAQs | `faqs.ts` | Factual starter FAQs |
| Gallery | `gallery.ts` | 9 gallery categories |
| Testimonials | `testimonials.ts` | Clearly marked **demo** testimonials (draft) |
| Attractions | `attractions.ts` | Verified on-property entries + draft placeholders |
| Policies | `policies.ts` | Confirmed packing policy + owner-review placeholders |

### Demo images

Placeholder SVGs are served from `/demo/*.svg` (see `public/demo/` and `src/lib/demo-images.ts`). They are labeled as demo assets and must be replaced before launch.

### Cabin sleeping arrangements (seeded exactly)

| Cabin | Sleeps | Layout |
|-------|--------|--------|
| 5 | 4 | Queen front; bunk back; no separate bedroom |
| 6 | 5 | Queen front; 3 twins in separate bedroom |
| 7 | 5 | Queen front; 3 twins in separate bedroom |
| 8 | 5 | Queen front; 3 twins in separate bedroom |
| 9 | 6 | Queen front; double + bunk in separate bedroom |
| 10 | 6 | Queen front; bunk + 2 twins in separate bedroom |
| 11 | 4 | Queen in separate bedroom; futon front |
| 12 | 6 | Bunk + double in separate bedroom; futon front |

---

## Booking inquiries vs confirmed bookings

This site uses an **inquiry workflow**, not instant online booking:

1. Guest submits dates, party size, and preferences via `/inquire`.
2. Request is saved with an inquiry number and immutable snapshot.
3. Owner reviews availability and sends a quote.
4. Stay is **not confirmed** until the owner explicitly confirms.

No payment collection is built into this project.

---

## Local uploads

- Runtime images are stored under `/uploads/YYYY/MM/<uuid>.webp` at the project root.
- Served via `/media/[...path]` — not from the Next.js build bundle.
- `/uploads` is gitignored; production requires **persistent disk** (VPS/Node host). Ephemeral serverless disks will lose uploads.

---

## Optional SMTP

If SMTP variables are unset, contact and inquiry forms still save to MongoDB but **do not claim an email was sent**. Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and `SMTP_FROM` for outbound notifications.

---

## Pre-launch checklist

Before going live, replace or verify:

- [ ] Demo SVG photos with real property photography
- [ ] Demo testimonials (`isDemo: true`, draft status)
- [ ] Draft/unverified attractions
- [ ] Placeholder policies (only bedding/towels/toiletries is confirmed in seed)
- [ ] Season calendar dates for the current year
- [ ] Brand name, address, and business hours in Settings
- [ ] `AUTH_SECRET`, `ADMIN_PASSWORD`, and production `MONGODB_URI`
- [ ] No invented public rates or fake reviews published

---

## Verification

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run seed    # requires MongoDB
```

---

## Project structure (high level)

```
src/
  app/              # Next.js App Router (public + admin + API)
  components/       # UI, layout, motion, forms
  lib/              # MongoDB, auth, media, validation, seed
  models/           # Mongoose schemas
scripts/            # seed, create-admin, upload cleanup
public/demo/        # Demo placeholder SVGs
uploads/            # Runtime uploads (gitignored)
```

---

## License

Private project for Vaseaux Lake Waterfront Cabins / Vaseaux Lake Rentals.
