# From Idea to Production in Under an Hour: How AI Is Rewriting the Rules of Software Development

A few days ago, I had a simple frustration.

I own multiple vehicles — a car and a bike — and I had absolutely no idea how much I was spending on fuel, servicing, insurance, and tyres every month. Spreadsheets felt too manual. Existing apps were either too complex or didn't support multiple vehicles the way I needed.

So I thought: *what if I just built exactly what I needed?*

In the past, that thought would have been followed by weeks of planning, wireframing, setting up boilerplate, writing CRUD APIs, fighting with deployment pipelines — before a single real feature existed.

**This time, the app was live in under an hour.**

Not a prototype. Not a mock. A fully deployed Progressive Web App — installable on Android, works offline, with AI receipt scanning, mileage tracking, charts, CSV export, and an automated CI/CD pipeline pushing to Azure on every commit.

One hour. Here's how.

---

## The Shift: AI as Your Senior Dev, Architect, and DevOps Engineer

I used Claude (Anthropic's AI) as my development partner throughout this project. Not as an autocomplete tool. Not to generate snippets. As a **full thinking partner** — one that understood the problem, suggested the architecture, wrote the code, caught type errors, set up CI/CD, and explained tradeoffs when I asked.

Here is what we built together, and how fast it happened.

---

## What We Built: Vehicle Expense Tracker PWA

**Live app:** https://vehicle-expense-tracker.karuppu.dev

> 📸 *[Screenshot: Dashboard showing total spent this month, fuel share, mileage efficiency, and recent expenses for the active vehicle]*

The app is a full Progressive Web App (PWA) — installable on Android from Chrome, works offline, and feels native. Here's a walkthrough of every feature:

---

### 🚗 Multi-Vehicle Support

You can track expenses across Cars, Bikes, Trucks, Vans, Scooters — each independently. Switch between vehicles from any screen using the vehicle selector at the top.

> 📸 *[Screenshot: Vehicle selector bottom sheet showing multiple vehicles with icons]*

Each vehicle stores its type, registration number, default fuel type, and purchase date. Deleting a vehicle automatically cascades and removes all its associated expenses — no orphaned data.

---

### 📷 AI Bill Scanning with Gemini

This is the feature I'm most proud of. Tap the camera button on the Add Expense screen, photograph your fuel receipt or service bill — and Gemini AI reads it and auto-fills the amount, date, category, liters, and fuel type.

> 📸 *[Screenshot: Add Expense screen with a receipt photo and auto-filled fields]*

No more manual entry after every fill-up. You review, adjust if needed, and save. It took just minutes to integrate the Gemini API — and it just works.

---

### ⛽ Mileage Tracking

For every fuel fill-up, you can log the odometer reading and liters filled. The app calculates km/L efficiency per fill-up, tracks your best and average efficiency, and plots a trend chart over time.

> 📸 *[Screenshot: Mileage page showing average km/L, best km/L, and a line chart of efficiency over fill-ups]*

This alone has changed how I think about my driving habits.

---

### 📊 Reports with Charts

The Reports screen gives you bar charts of spending over time, category breakdowns with progress bars, and a full expense list — filterable by Week, Month, Year, All Time, or any specific month you pick.

> 📸 *[Screenshot: Reports page showing bar chart, category breakdown with Fuel/Service/Insurance, and the month picker]*

The **Pick Month** feature was added in a single conversation — I asked "can we add an option to select a specific month?" and within minutes the calendar icon appeared in the filter bar, revealing a native month input on tap.

---

### ✏️ Edit Expenses

Originally the app only had delete. I asked: "is there any option to edit the expense?" — and in one session we added a pencil icon to every expense row, a fully pre-filled edit form, and an update flow that saves in-place without touching the expense's ID or creation date.

> 📸 *[Screenshot: Expense list with pencil and trash icons, and the Edit Expense form pre-filled]*

---

### 📤 CSV Export

Every filtered view has a one-tap CSV export — either for a specific vehicle or all vehicles. Useful for accountants, insurance claims, or just your own records.

---

### 🌙 Dark Mode + Offline PWA

The app respects system dark mode automatically and works fully offline. Once installed on Android, it behaves like a native app — no browser chrome, no splash screen delay.

> 📸 *[Screenshot: App in dark mode on an Android home screen]*

---

## The Tech Stack — Chosen in Minutes

| Layer | Choice | Why |
|---|---|---|
| UI Framework | React 18 | Component model, ecosystem |
| Build Tool | Vite 5 | Fast HMR, great PWA plugin |
| Language | TypeScript | Catches mistakes early |
| Styling | Tailwind CSS | Fast, consistent, mobile-first |
| Charts | Recharts | Easy to configure, React-native |
| Storage | IndexedDB (idb) | Local-first, no backend needed |
| Icons | Lucide React | Clean, consistent set |
| PWA | vite-plugin-pwa | Workbox auto-config |
| Hosting | Azure Static Web Apps | Free tier, global CDN |
| CI/CD | GitHub Actions | Auto-deploy on every push |

I didn't agonise over these choices. I described what I needed — a mobile-first PWA, local-first storage (no backend), fast to build — and the stack fell out naturally from the conversation.

---

## The Deployment Pipeline — Set Up in One Session

Here's what the pipeline looks like today:

1. I write code (or describe what I want)
2. `git push` to GitHub
3. GitHub Actions runs: install → TypeScript check → Vite build → Azure deploy
4. App is live at the Azure URL within ~90 seconds

> 📸 *[Screenshot: GitHub Actions showing "build-and-deploy — Success — 1m 15s"]*

The GitHub Actions workflow file was written, the Azure deployment token was fetched and stored as a GitHub secret, and the first successful deploy happened — all in one conversation. I didn't write a single line of YAML manually.

---

## What "Idea to Production" Actually Looked Like

Let me be specific about the timeline — and I mean this literally:

**Under 1 hour. Start to finish. Live on the internet.**

Here's how that single session broke down:

- **0–10 min:** Described the problem. Stack decided. Project scaffolded. Core data model designed — vehicles, expenses, settings in IndexedDB.
- **10–25 min:** Dashboard, Add Expense form, Mileage tracking page, Reports with bar charts and category breakdown — all working.
- **25–40 min:** AI bill scanning with Gemini wired up. PWA configured with service worker and offline support. Dark mode automatic.
- **40–50 min:** Deployed to Azure Static Web Apps. App live at a public URL. Installable on Android.
- **50–60 min:** GitHub repository created, code pushed, GitHub Actions CI/CD pipeline set up with deployment secret. Every future `git push` auto-deploys.

After that one hour, the app was **fully in production** — not a prototype, not a demo. A real PWA with a CDN-backed global URL, automated deployments, offline support, and AI integration.

Additional features came in follow-up sessions (each taking minutes, not hours):
- Edit expense (pencil icon on every row, pre-filled form, in-place save)
- Pick-month filter in Reports (calendar icon → native month input)
- Node.js deprecation warning fixed from a screenshot alone

A production-quality PWA — with AI integration, offline support, charts, CSV export, CI/CD — live on the internet, ready to install on any Android device.

That used to be a multi-week project for a team. This was **one hour**.

---

## What This Changes

I've been in software development long enough to remember when "move fast" meant cutting corners on quality, tests, and architecture.

This is different. The code is clean. The TypeScript is strict. The architecture is sensible — React context for state, custom hooks for data access, utility functions for formatting and DB access. There are no hacks. No TODO comments promising to fix something later.

The AI didn't just write fast code — it wrote *good* code, caught errors before they became bugs, and pushed back when I suggested approaches that would cause problems.

A few moments that stood out:

- When I asked about upgrading the app schema without losing user data, I got a complete explanation of IndexedDB versioning, migration strategies, and what was already safe in the current implementation — before writing a single line of code.

- When the GitHub Actions run showed a deprecation warning about Node.js 20, I just shared the screenshot. The warning was read, diagnosed ("Actions will force Node.js 24 from June 2026"), the fix was applied, committed, and pushed — in under two minutes.

- When I asked to "add a specific month option to reports," there was no back-and-forth about requirements. The existing filter system was understood, the right UX pattern was chosen (calendar icon → native month input), and it was implemented correctly on the first attempt.

---

## The Honest Part

AI-assisted development is not magic, and it's not replacing developers.

You still need to:
- Know what you're building and why
- Understand the code that's generated (you're responsible for it)
- Make judgment calls on tradeoffs
- Review, test, and verify
- Understand the domain well enough to know when something is wrong

What AI removes is the *friction* — the hours spent reading docs, writing boilerplate, debugging configuration, and doing the mechanical parts of programming that don't require creativity.

It compresses the distance between the idea in your head and working software in a user's hands. And that changes what's possible.

---

## Try It Yourself

The app is live and free to use:
👉 **https://vehicle-expense-tracker.karuppu.dev**

Open it in Chrome on Android and install it to your home screen. Add a vehicle, log a fuel fill-up, photograph a receipt. See if it changes how you think about your vehicle costs.

The source code is on GitHub:
👉 **https://github.com/karuppumca86/vehicle-expense-tracker**

---

If you're a developer who hasn't deeply integrated AI into your workflow yet — this is the moment. Not because it's trendy. Because the gap between what you can build alone in a day, and what a team used to need weeks for, is now real and measurable.

The ideas you've been putting off because they were "too much work to build"?

Most of them aren't anymore. One hour is now enough to find out.

---

*I built this in under an hour using AI. What's the fastest you've gone from idea to production? Drop it in the comments — I'd love to hear.*

#AI #LLM #SoftwareDevelopment #React #TypeScript #Azure #PWA #BuildInPublic #Productivity #WebDevelopment #ClaudeAI #Anthropic
