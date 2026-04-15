# KP Client Dashboard

A modern dark-themed client request dashboard for **KP Technology Solutions**. Replaces email-based website change requests with a structured system where clients submit and track requests, and Hal & Shawn manage everything from an admin panel.

**Live:** https://portal.kptechnologysolutions.com

## Why Is This Repo Public?

The repo is public so Vercel (our free hosting) can auto-deploy it. This is safe because:

- **No passwords, API keys, or secrets are in the code** — they're stored in environment variables on Vercel and Supabase, never committed
- **All client data is in Supabase** (our database) — the code is just the app shell
- **The dashboard itself requires login** — nobody can see or submit anything without an account we create
- **This is standard practice** — most SaaS companies host code publicly while keeping data private

Think of it like publishing a blueprint for a safe — useless without the combination.

## Live URLs

| URL | Who It's For |
|-----|-------------|
| https://portal.kptechnologysolutions.com | Everyone (login required) |
| https://portal.kptechnologysolutions.com/admin | Hal & Shawn (admin login) |
| https://portal.kptechnologysolutions.com/portal | Clients (client login) |

## Login Credentials

### Admin
| Email | Password | Access |
|-------|----------|--------|
| KPTechnologySolutions@gmail.com | Money22$$ | Full admin — sees all clients and requests |

### Clients
| Client | Email | Password |
|--------|-------|----------|
| 56 Kitchen | izzy@56kitchen.com | Money22$$ |
| 56 Kitchen | heather@56kitchen.com | Money22$$ |
| Water Heater Doctors | stellutiplumbing@aol.com | Money22$$ |
| Water Heater Doctors | callahanplumbingandheating@gmail.com | Money22$$ |
| KMP Clarity | kara@kmpclarity.com | Money22$$ |
| Impact Care HR | info@impactcarehr.com | Money22$$ |
| People Express | peoplereservations@gmail.com | Money22$$ |

**Note:** Change passwords before giving clients access.

## Client Organizations

| Organization | Contacts | Notes |
|-------------|----------|-------|
| 56 Kitchen | Izzy, Heather | Part of 56 Restaurant Group |
| Elle | (same contacts as 56 Kitchen) | Part of 56 Restaurant Group |
| 56 Social | (same contacts as 56 Kitchen) | Part of 56 Restaurant Group |
| 56 Tavern | (same contacts as 56 Kitchen) | Part of 56 Restaurant Group |
| 56 Catering | (same contacts as 56 Kitchen) | Part of 56 Restaurant Group |
| Water Heater Doctors | Stelluti Plumbing, Brian Callahan | Two contacts |
| KMP Clarity | Kara | |
| Impact Care HR | info@ | |
| People Express | peoplereservations@ | WorldWide Ground Transportation |

## Features

### Admin Dashboard (`/admin`)
- **Dashboard** — Stat cards (unassigned, in progress, completed, active) with gradient accents and glow-on-hover animations
- **Requests Table** — All requests across all clients with search + filters (status, client, assignee, priority)
- **Request Detail** — Full view with:
  - Status buttons (Reviewed, Start Work, Complete, Reject) — buttons glow and stay colored when active
  - Assign to Hal or Shawn
  - Set ETA date — clients see the expected completion date
  - Internal notes (yellow, only visible to admins)
  - Comment thread (public comments + internal-only comments)
  - Activity timeline
  - File attachments with download
  - Client contact info
- **Clients Page** — All organizations with request counts, drill into each client
- **Settings** — Team and notification config

### Client Portal (`/portal`)
- **Dashboard** — Welcome screen with stat cards and recent requests
- **Submit Request** — Form with title, description, category, priority, and drag-and-drop file uploads
- **My Requests** — List grouped by active/completed
- **Request Detail** — Status timeline stepper, comments, attachments, ETA visibility
- **Account** — Profile and notification preferences

### Email Notifications (Resend)
Emails are sent automatically when:
- **Client submits a request** → Hal & Shawn get an email
- **Admin changes status** → Client gets an email (admins CC'd)
- **Admin marks complete** → Client gets a "Request Complete!" email (admins CC'd)
- **Admin comments** → Client gets notified (admins CC'd)
- **Client comments** → Admins get notified

All notifications CC both admin emails so nothing is missed.

Emails come from `portal@kptechnologysolutions.com` (verified via Resend + DreamHost DNS).

### Security
- Supabase Auth with email/password login
- Middleware blocks clients from `/admin` routes
- Row Level Security (RLS) — clients only see their own organization's data
- Internal notes and internal comments are hidden from clients
- File attachments stored in private Supabase Storage bucket
- API keys and secrets stored in environment variables, never in code

### Design
- Dark theme (Jobie-inspired SaaS dashboard)
- Framer Motion animations (stagger fade-in, scale effects, slide transitions)
- Glassmorphism nav headers with backdrop blur
- Gradient stat cards with glow-on-hover
- Inter font (body) + Poppins (headings)
- Fully responsive — works on mobile

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 16 (App Router) | Full-stack React framework |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS v4 | Utility-first CSS |
| Components | shadcn/ui | Buttons, cards, tables, selects, etc. |
| Icons | Lucide React | Consistent icon set |
| Animations | Framer Motion | Page transitions, hover effects |
| Database | Supabase (PostgreSQL) | Data storage + Row Level Security |
| Auth | Supabase Auth | Email/password login |
| File Storage | Supabase Storage | Client attachments/screenshots |
| Email | Resend | Transactional notifications |
| Hosting | Vercel | Auto-deploys from GitHub |
| Domain | DreamHost DNS | portal.kptechnologysolutions.com |

## Status Workflow

```
submitted → reviewed → in_progress → complete
    └──────────────────────────────→ rejected
```

Each status has a colored button in the admin panel:
- **Reviewed** (violet) — Acknowledged, may need clarification
- **Start Work** (amber) — Actively being worked on
- **Complete** (emerald) — Done, client notified
- **Reject** (red) — Won't do, with explanation

## Project Structure

```
src/
  app/
    (auth)/login/           → Login page
    (auth)/logout/          → Logout API route
    admin/                  → Admin dashboard, requests, clients, settings
    portal/                 → Client portal, requests, new request, account
  components/
    admin/                  → AdminSidebar, AdminRequestActions
    portal/                 → PortalNav, PortalCommentForm
    shared/                 → StatusBadge, PriorityBadge, AttachmentsList, motion
    ui/                     → shadcn/ui components
  lib/
    actions.ts              → Server Actions (create request, update status, etc.)
    auth.ts                 → Get current user from Supabase
    constants.ts            → Status/category/priority configs
    email.ts                → Resend email notifications
    queries.ts              → Supabase database queries
    types.ts                → TypeScript types
    supabase/               → Supabase client helpers (browser, server, middleware)
  middleware.ts             → Route protection
supabase/
  migrations/               → SQL schema + RLS policies
```

## How Updates Work

1. Code changes are pushed to this GitHub repo
2. Vercel auto-detects the push and rebuilds
3. The live site at portal.kptechnologysolutions.com updates automatically
4. Takes about 1-2 minutes from push to live

## Running Locally (for development)

```bash
git clone https://github.com/KP-TechnologySolutions/kp-client-dashboard.git
cd kp-client-dashboard
npm install
```

Create `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=<ask Hal>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ask Hal>
RESEND_API_KEY=<ask Hal>
ADMIN_EMAIL_1=KPTechnologySolutions@gmail.com
ADMIN_EMAIL_2=<Shawn's email>
```

Then:
```bash
npm run dev
```

Open http://localhost:3000

## Environment Variables

These are set in Vercel (Settings → Environment Variables) and in `.env.local` for local dev:

| Variable | What It Is |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public API key |
| `RESEND_API_KEY` | Resend API key for sending emails |
| `ADMIN_EMAIL_1` | First admin email (gets all notifications) |
| `ADMIN_EMAIL_2` | Second admin email (gets all notifications) |

## External Services

| Service | URL | What It Does |
|---------|-----|-------------|
| Supabase | https://supabase.com/dashboard | Database, auth, file storage |
| Resend | https://resend.com | Email notifications |
| Vercel | https://vercel.com | Hosting + auto-deploy |
| GitHub | https://github.com/KP-TechnologySolutions | Source code |
| DreamHost | DreamHost panel | DNS for kptechnologysolutions.com |
