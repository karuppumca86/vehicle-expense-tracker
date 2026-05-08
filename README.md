# Vehicle Expense Tracker

A full-featured Progressive Web App (PWA) for tracking expenses across multiple vehicles — cars, bikes, trucks, and more. Built with React 18, Vite, TypeScript, and Tailwind CSS.

## Features

- **Multi-vehicle support** — track Cars, Bikes, Trucks, Vans, Scooters independently
- **AI bill scanning** — photograph receipts and auto-fill expense details using Gemini AI
- **Mileage tracking** — km/L efficiency with fill-up log and trend chart
- **Reports** — bar charts, category breakdown, period filters (week/month/year/all/pick month)
- **Edit expenses** — tap the pencil icon on any expense to update it
- **CSV export** — per-vehicle or all-vehicles export
- **PWA installable** — works offline, installable on Android via Chrome
- **Auto-updates** — installed PWA silently updates on next open after each deployment
- **Dark mode** — automatic based on system preference
- **IndexedDB storage** — all data stays on your device, never lost on app updates

---

## Live App

```
https://vehicle-expense-tracker.karuppu.dev
```

---

## Quick Start

```bash
npm install
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Build for production → dist/
npm run preview   # Preview production build
```

---

## Deploy to Azure Static Web Apps

Deployments are automated via GitHub Actions — every push to `master` builds and deploys automatically.

**Manual deploy (if needed):**

```bash
npm run build

$token = az staticwebapp secrets list --name "car-tracker-app" --resource-group "rg-car-tracker" --query "properties.apiKey" -o tsv
swa deploy dist --deployment-token $token --env production
```

**Azure resources:**
- App name: `car-tracker-app`
- Resource group: `rg-car-tracker`
- GitHub secret: `AZURE_STATIC_WEB_APPS_API_TOKEN`

---

## Install on Android

1. Open the deployed URL in **Chrome for Android**
2. Tap the **⋮ menu** → "Add to Home screen"
3. Tap "Install" in the prompt
4. App appears on your home screen and works offline

---

## Get a Free Gemini API Key

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with your Google account
3. Click **"Get API key"** → Create key
4. No credit card required — generous free tier
5. Paste the key in the app under **Dashboard → Settings → AI Bill Scanning**

---

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── BottomNav.tsx
│   ├── VehicleSelector.tsx   ← bottom sheet, switches active vehicle
│   ├── VehicleCard.tsx
│   ├── VehicleTypeIcon.tsx
│   ├── StatCard.tsx
│   ├── ExpenseItem.tsx       ← edit + delete per expense
│   ├── CategoryChip.tsx
│   ├── ProgressBar.tsx
│   ├── EmptyState.tsx
│   └── Toast.tsx
├── pages/
│   ├── Welcome.tsx     ← first-launch screen
│   ├── Dashboard.tsx   ← stats + recent expenses
│   ├── AddExpense.tsx  ← form + AI scanning + edit mode
│   ├── Reports.tsx     ← charts + full list + export + month picker
│   ├── Mileage.tsx     ← km/L tracking + fill-up log
│   ├── Vehicles.tsx    ← garage / vehicle management
│   ├── AddVehicle.tsx  ← add/edit vehicle form
│   └── Settings.tsx    ← API key + data management
├── contexts/
│   ├── ActiveVehicleContext.tsx  ← vehicle CRUD + active selection
│   └── ToastContext.tsx
├── hooks/
│   ├── useExpenses.ts    ← expense CRUD per vehicle (add/update/delete)
│   ├── useSettings.ts    ← Gemini API key
│   ├── useGemini.ts      ← AI bill scanning
│   └── useNavigation.ts  ← screen routing state
├── utils/
│   ├── db.ts           ← IndexedDB via idb
│   ├── formatters.ts   ← ₹ currency, dates, period filter
│   ├── mileage.ts      ← km/L calculation
│   ├── csvExport.ts    ← CSV download
│   ├── demoData.ts     ← demo vehicles + expenses
│   └── categories.ts   ← icons, colors, config
└── types/index.ts
```

---

## Data Storage

All data is stored locally in **IndexedDB** (`vehicle_tracker_db`):

| Store | Description |
|-------|-------------|
| `vehicles` | Vehicle records with type, registration, fuel type |
| `expenses` | Expense records indexed by `vehicleId` |
| `settings` | Key-value: `geminiApiKey`, `activeVehicleId` |

Deleting a vehicle cascades and deletes all its expenses. Data is never lost across app updates — IndexedDB persists independently of the app code.

---

## Tech Stack

| Library | Version | Purpose |
|---------|---------|---------|
| React | 18.3 | UI framework |
| Vite | 5.4 | Build tool |
| TypeScript | 5.5 | Type safety |
| Tailwind CSS | 3.4 | Styling |
| Recharts | 2.12 | Charts |
| idb | 8.0 | IndexedDB wrapper |
| Lucide React | 0.446 | Icons |
| vite-plugin-pwa | 0.20 | PWA + service worker |
