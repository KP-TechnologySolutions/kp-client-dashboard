# Setup Guide

Step-by-step instructions to get the KP Client Dashboard running on your machine.

## Prerequisites

- **Node.js 18+** — Download from [nodejs.org](https://nodejs.org/) (LTS version recommended)
- **Git** — Should already be installed on Mac/Linux. Windows: [git-scm.com](https://git-scm.com/)
- **GitHub access** — You need access to the KP-TechnologySolutions org

## Step 1: Clone the repo

```bash
git clone https://github.com/KP-TechnologySolutions/kp-client-dashboard.git
cd kp-client-dashboard
```

## Step 2: Install dependencies

```bash
npm install
```

This will install Next.js, React, Tailwind, shadcn/ui, Framer Motion, and all other packages.

## Step 3: Run the dev server

```bash
npm run dev
```

Open your browser to **http://localhost:3000**

## Step 4: Log in

You'll see a login page with quick-login buttons at the bottom:

- **KP Admin** — Click this to see the admin dashboard (what we see)
- **Client names** (Mike, Sarah, James, Tom) — Click any of these to see what that client sees in their portal

No real passwords needed right now — it's all mock auth for development.

## What you'll see

### Admin side (`/admin`)
- **Dashboard** — Overview with stat cards, requests needing attention, active requests
- **Requests** — Full table of all requests with filters (search, status, client, assignee, priority)
- **Request Detail** — Click any request to see details, change status, assign to Hal or Shawn, add comments
- **Clients** — List of all client organizations with request counts
- **Settings** — Team and notification config (placeholder for now)

### Client side (`/portal`)
- **Dashboard** — Their request stats and recent activity
- **My Requests** — All their requests with active/completed grouping
- **New Request** — Form to submit a website change request
- **Request Detail** — Status timeline, comments (they can't see our internal notes)

## Project structure (key files)

```
src/lib/mock-data.ts    → All the fake data (organizations, users, requests)
src/lib/types.ts        → TypeScript types
src/lib/constants.ts    → Status colors, categories, team members (Hal & Shawn)
src/middleware.ts       → Route protection (keeps clients out of /admin)
```

## Common commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start dev server at localhost:3000 |
| `npm run build` | Build for production (checks for errors) |
| `npm run lint` | Run linter |

## Troubleshooting

**Port 3000 already in use?**
```bash
npx kill-port 3000
npm run dev
```

**Seeing stale styles?**
Hard refresh: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)

**Node version issues?**
Make sure you're on Node 18 or higher:
```bash
node --version
```

## Next steps

This is Phase 1 — the UI is complete with mock data. The next phases are:

1. **Supabase** — Real database, auth, and file storage
2. **Email notifications** — Resend for status updates and reminders
3. **Deploy to Vercel** — Live URL for clients to use
