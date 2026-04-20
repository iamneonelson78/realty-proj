# Rental CRM — Philippine Property Agents

A lead management SaaS for rental agents. Track listings, manage leads in a Kanban pipeline, generate Facebook posts, and set reminders.

## Tech Stack

- Vite 5 + React (JS) · Tailwind CSS · React Router v6
- Zustand (auth state) · TanStack React Query v5 (server state)
- @dnd-kit (Kanban drag-and-drop)
- Supabase (Postgres + Auth)

---

## Setup

### 1. Supabase project

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste contents of `supabase/schema.sql` → Run
3. Go to **Authentication → Providers** → ensure **Email** is enabled
4. Copy your **Project URL** and **anon public key** from Project Settings → API

### 2. Environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

---

## Features

| Feature | Details |
|---|---|
| Auth | Email/password sign-up and login via Supabase |
| Listings | Create, edit, delete; filter by status |
| Kanban Pipeline | 5 columns (New → Contacted → Viewing → Reserved → Closed); drag to move |
| Lead Details | Notes/messages history, status dropdown, reminders |
| FB Post Generator | One-click copy of formatted listing text; opens Facebook |
| Reminders | Create time-based reminders linked to leads; mark done |
| Dashboard | Stats overview + upcoming reminders + recent leads |

## Row-Level Security

All data is owner-scoped via Supabase RLS — each agent sees only their own listings and leads.
