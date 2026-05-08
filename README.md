# Vehicle Expense Tracker

A full-featured Progressive Web App (PWA) for tracking expenses across multiple vehicles — cars, bikes, trucks, and more. Built with React 18, Vite, TypeScript, and Tailwind CSS.

## Features

- **Multi-vehicle support** — track Cars, Bikes, Trucks, Vans, Scooters independently
- **AI bill scanning** — photograph receipts and auto-fill expense details using Gemini AI
- **Mileage tracking** — km/L efficiency with fill-up log and trend chart
- **Reports** — bar charts, category breakdown, period filters (week/month/year/all)
- **CSV export** — per-vehicle or all-vehicles export
- **PWA installable** — works offline, installable on Android via Chrome
- **Dark mode** — automatic based on system preference
- **IndexedDB storage** — all data stays on your device

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

The project is already deployed to:
```
https://witty-rock-0ab6b6900.7.azurestaticapps.net
```

To deploy the new `dist/` build:

```bash
# From d:\sbox\vehicle-tracker
npm run build

# Then deploy
$token = az staticwebapp secrets list --name "car-tracker-app" --resource-group "rg-car-tracker" --query "properties.apiKey" -o tsv
swa deploy dist --deployment-token $token --env production
```

## Deploy to Netlify (alternative)

1. Run `npm run build`
2. Go to [netlify.com/drop](https://netlify.com/drop)
3. Drag & drop the `dist/` folder
4. Your app is live instantly

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
│   ├── ExpenseItem.tsx
│   ├── CategoryChip.tsx
│   ├── ProgressBar.tsx
│   ├── EmptyState.tsx
│   └── Toast.tsx
├── pages/
│   ├── Welcome.tsx     ← first-launch screen
│   ├── Dashboard.tsx   ← stats + recent expenses
│   ├── AddExpense.tsx  ← form + AI scanning
│   ├── Reports.tsx     ← charts + full list + export
│   ├── Mileage.tsx     ← km/L tracking + fill-up log
│   ├── Vehicles.tsx    ← garage / vehicle management
│   ├── AddVehicle.tsx  ← add/edit vehicle form
│   └── Settings.tsx    ← API key + data management
├── contexts/
│   ├── ActiveVehicleContext.tsx  ← vehicle CRUD + active selection
│   └── ToastContext.tsx
├── hooks/
│   ├── useExpenses.ts    ← expense CRUD per vehicle
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

Deleting a vehicle cascades and deletes all its expenses.

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
