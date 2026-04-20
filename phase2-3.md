You are a senior frontend engineer working on an existing SaaS app:

"Rental CRM for Philippine Property Agents"

The app is already built using:

* Vite + React
* Tailwind CSS
* React Router
* Zustand
* TanStack React Query
* Supabase

---

# 🎯 YOUR TASK

Extend the app by building:

👉 UI ONLY (static / non-functional)
👉 No backend logic yet
👉 No API calls required

The goal is to:

* Visualize features
* Validate UX with real users
* Prepare for future backend integration

---

# ⚠️ IMPORTANT RULES

* DO NOT connect to Supabase for new features
* DO NOT implement real logic
* Use mock/static data only
* Focus on UI, layout, and user flow
* Keep everything clean and modular

---

# 🧱 FEATURES TO ADD (UI ONLY)

---

## 🔹 1. Inbox UI (Lead Messages)

### Add inside Lead Details page:

UI Components:

* Chat container
* Message bubbles (left = lead, right = agent)
* Input field (text box + send button)

### Behavior:

* Use static mock messages
* On send:

  * Append message locally (useState only)
  * No persistence

---

## 🔹 2. Quick Add Lead Modal

### Add:

* Button: “+ Quick Add Lead”

### Modal Fields:

* Name
* Contact Number
* Listing (dropdown - mock data)

### Behavior:

* On submit:

  * Just log to console
  * Close modal

---

## 🔹 3. Follow-Up Dashboard Section

### Add to Dashboard:

Section:

* “Today’s Follow-ups”

Display:

* List of mock reminders:

  * Name
  * Listing
  * Time

Buttons:

* “Mark as Done” (UI only)

---

## 🔹 4. Listing Performance UI

### Add to Listings Page:

For each listing card, show:

* Leads: 12
* Closed: 3

Use static/mock values

---

## 🔹 5. FB Post Variants UI

### Update existing FB generator:

Add:

* Tabs or buttons:

  * Formal
  * Short
  * Tagalog

Each tab shows different mock text

Add:

* Copy button (can work locally)

---

# 🚀 LAYER 3 (UI ONLY)

---

## 🔸 6. Realtime Indicator (Fake)

### Add:

* “Live” badge on pipeline page

Optional:

* Fake toast: “New lead received”

(no real subscription)

---

## 🔸 7. AI Generator UI

### Add to Listing Form:

Section:

* “Generate Description”

Button:

* “Generate with AI”

Behavior:

* On click:

  * Fill textarea with mock generated text

---

## 🔸 8. Team Collaboration UI

### Add:

#### A. Team Switcher (Top Navbar)

* Dropdown:

  * “My Team”
  * “Team A”
  * “Team B”

#### B. Assign Lead

Inside Lead Card:

* Dropdown: Assign to user

Use static users

---

# 🗂 COMPONENT STRUCTURE

Create reusable components:

* ChatBox.jsx
* MessageBubble.jsx
* QuickLeadModal.jsx
* FollowUpList.jsx
* ListingStats.jsx
* PostVariants.jsx
* TeamSwitcher.jsx

---

# 🎨 UI REQUIREMENTS

* Use Tailwind CSS only
* Clean and minimal
* Mobile responsive
* Inspired by:

  * Messenger (chat)
  * Trello (pipeline)
  * Simple dashboards

---

# 🧠 STATE MANAGEMENT

* Use useState for all new features
* DO NOT use React Query for new features yet
* DO NOT store in Zustand unless needed for UI

---

# 🔁 INTEGRATION RULE

* Plug UI into existing pages:

  * Dashboard
  * Listings
  * Leads
  * Lead Details

---

# 🚀 OUTPUT FORMAT

1. New components (full code)
2. Updated pages (where components are used)
3. Mock data examples
4. Notes on where backend logic will go later

---

# 🧠 GOAL

Make the app feel like:

👉 A complete, modern CRM system
Even though backend is not yet implemented

---

Now generate the UI step-by-step.
