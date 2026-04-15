# Setup Guide for Shawn

Everything you need to know about the KP Client Dashboard.

## What Is This?

A web dashboard where our clients (56 Kitchen, Elle, Water Heater Doctors, etc.) can submit website change requests instead of emailing us. We see everything in an admin panel, assign work, update status, and they get notified automatically.

**Live site:** https://portal.kptechnologysolutions.com

## How to Log In

Go to https://portal.kptechnologysolutions.com and use:

- **Email:** KPTechnologySolutions@gmail.com
- **Password:** Money22$$

This takes you to the admin dashboard where you can see all client requests.

## What You Can Do as Admin

### Dashboard
See stat cards (unassigned, in progress, completed) and requests that need attention.

### Requests
Click **Requests** in the sidebar to see all requests across all clients. You can:
- **Search** by title or request number
- **Filter** by status, client, assignee, or priority
- Click any request to see the full details

### On a Request Detail Page
- **Change status** — Click Reviewed, Start Work, Complete, or Reject. The button stays lit to show the current status.
- **Assign** — Pick Hal or Shawn from the dropdown. This is how we track who's working on what.
- **Set ETA** — Pick a date. The client will see this as the expected completion date.
- **Add comments** — Type a comment and send. The client gets an email notification.
- **Internal notes** — These show in yellow and are ONLY visible to us, never to clients.
- **View attachments** — Download any files the client uploaded (screenshots, PDFs, etc.)

### Clients
Click **Clients** in the sidebar to see all organizations, their contact info, and request counts.

## How Clients Use It

Clients go to the same URL (https://portal.kptechnologysolutions.com) and log in with their email. They can:

1. **Submit a new request** — Title, description, category, priority, file attachments
2. **Track status** — See a visual timeline (Submitted → Reviewed → In Progress → Complete)
3. **See ETA** — The date we set for expected completion
4. **Comment** — Ask follow-up questions or provide more details
5. **Download attachments** — Access any files on the request

They CANNOT see:
- Other clients' requests
- Our internal notes
- The admin dashboard
- Who else uses the system

## Email Notifications

Emails are sent automatically:

| When | Who Gets Emailed |
|------|-----------------|
| Client submits a request | Both of us (Hal & Shawn) |
| We change the status | The client (we're CC'd) |
| We mark it complete | The client (we're CC'd) |
| We add a comment | The client (we're CC'd) |
| Client adds a comment | Both of us |

All emails CC both admin addresses so neither of us misses anything.

## Client Accounts (Current)

| Client | Email | Password |
|--------|-------|----------|
| 56 Kitchen | izzy@56kitchen.com | Money22$$ |
| 56 Kitchen | heather@56kitchen.com | Money22$$ |
| Water Heater Doctors | stellutiplumbing@aol.com | Money22$$ |
| Water Heater Doctors | callahanplumbingandheating@gmail.com | Money22$$ |
| KMP Clarity | kara@kmpclarity.com | Money22$$ |
| Impact Care HR | info@impactcarehr.com | Money22$$ |
| People Express | peoplereservations@gmail.com | Money22$$ |

**Important:** We need to change these passwords before giving clients access.

## Organizations Set Up

56 Kitchen, Elle, 56 Social, 56 Tavern, 56 Catering, Water Heater Doctors, KMP Clarity, Impact Care HR, People Express

The 56 brands all share Izzy and Heather as contacts (under 56 Kitchen currently).

## Why Is the Code Public on GitHub?

Vercel (our free hosting) requires it for the free plan with organization repos. This is safe:
- No passwords or API keys are in the code
- All client data is in our private Supabase database
- The dashboard requires login to access anything
- This is how most SaaS companies operate

## Running Locally (Optional)

If you want to run it on your own machine:

```bash
git clone https://github.com/KP-TechnologySolutions/kp-client-dashboard.git
cd kp-client-dashboard
npm install
```

Ask Hal for the `.env.local` file (has the API keys), then:

```bash
npm run dev
```

Open http://localhost:3000

## How Updates Get Deployed

1. We make code changes locally
2. Push to GitHub
3. Vercel auto-detects and rebuilds (1-2 minutes)
4. Live site updates automatically

No manual deployment needed.

## Questions?

Ask Hal. The code is at https://github.com/KP-TechnologySolutions/kp-client-dashboard
