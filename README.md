# KP Client Dashboard

A modern dark-themed client request dashboard for **KP Technology Solutions**. Clients (56 Kitchen, Elle, 56 Social, etc.) submit website change requests and track their status. Hal and Shawn manage everything from the admin panel.

## Quick Start

```bash
git clone https://github.com/KP-TechnologySolutions/kp-client-dashboard.git
cd kp-client-dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and use the dev quick login buttons:

- **KP Admin** — Admin dashboard (Hal & Shawn)
- **Client accounts** — Portal view for each business (56 Kitchen, Elle, 56 Social, Lowcountry Septic)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui |
| Icons | Lucide React |
| Animations | Framer Motion |
| Fonts | Inter (body) + Poppins (headings) |

## Project Structure

```
src/
  app/
    (auth)/login/        → Login page with dev quick-login
    admin/               → Admin dashboard
      requests/          → All requests table + detail pages
      clients/           → Client org list + detail pages
      settings/          → Settings page
    portal/              → Client portal
      requests/          → Client's request list + detail + new form
      account/           → Client account settings
  components/
    admin/               → AdminSidebar, AdminRequestActions
    portal/              → PortalNav, PortalCommentForm
    shared/              → StatusBadge, PriorityBadge, CategoryLabel, motion helpers
    ui/                  → shadcn/ui components (button, card, input, etc.)
  lib/
    auth.ts              → Mock auth (reads cookie)
    constants.ts         → Status/category/priority configs, admin team
    mock-data.ts         → Organizations, profiles, requests, comments
    types.ts             → TypeScript types for all data models
    utils.ts             → cn() helper
  middleware.ts          → Route protection (admin vs client vs public)
```

## Features

### Admin Dashboard (`/admin`)
- Stat cards with gradient accents and glow-on-hover
- "Needs Attention" panel (unassigned + urgent requests)
- Active requests list
- Full requests table with search and filters (status, client, assignee, priority)
- Request detail with status actions, assignment, comments, internal notes, activity timeline
- Clients page with org cards and drill-down

### Client Portal (`/portal`)
- Dashboard with stat cards and recent requests
- Submit new request form (title, description, category, priority, file upload)
- Request list with active/completed grouping
- Request detail with status timeline, comment thread
- Account page

### Security
- Middleware blocks clients from `/admin` routes
- Client views only show their own organization's data
- Internal notes and internal comments are hidden from clients

## Current Status

**Phase 1 (Complete)** — Full UI with mock auth and mock data. Everything works locally.

### Next Phases

**Phase 2 — Supabase Integration**
- Create Supabase project, run SQL migrations
- Row Level Security for multi-tenant isolation
- Swap mock data for Supabase queries
- Swap mock auth for Supabase Auth
- File storage for attachments

**Phase 3 — Email Automation**
- Resend for transactional emails (status changes, new requests)
- React Email templates
- Vercel Cron for stale request reminders (daily at 8 AM ET)

**Phase 4 — Deploy**
- Deploy to Vercel
- Create real user accounts
- End-to-end testing

## Data Model

| Table | Purpose |
|-------|---------|
| `organizations` | Client businesses (56 Kitchen, Elle, etc.) |
| `profiles` | Users with roles (admin or client) |
| `requests` | Website change requests with status workflow |
| `request_comments` | Comment thread with internal flag |
| `request_attachments` | File uploads |
| `activity_log` | Audit trail for all changes |

### Status Workflow

```
submitted → reviewed → in_progress → complete
    └──────────────────────────────→ rejected
```

## Scripts

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```
