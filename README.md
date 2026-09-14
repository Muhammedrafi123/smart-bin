# ENGO — Smart Organic Waste Management System

**Small Actions. A Cleaner Tomorrow.**

A mobile-first, fully interactive frontend prototype for an RFID + AI powered campus smart-bin
system. Everything runs from the frontend using realistic mock data and simulated hardware —
no backend, database or IoT device is required to demonstrate the full product.

## Running it

```bash
npm install
npm run dev
```

Open http://localhost:5173. On a desktop browser the app renders inside a phone frame; on a
phone it fills the screen.

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check and produce a production build in `dist/` |
| `npm run preview` | Serve the production build locally |

## Demo walkthrough

1. **Splash** → tap the arrow (or *Skip*).
2. **Login** → *Demo Login (For Presentation)* signs in instantly.
   Manual login also works: User ID `USR-001`, password `engo`.
   *Login with RFID Card* runs the simulated tap-and-identify flow instead.
3. **Home** → Eco Score 820, 24.6 kg total waste, 320 points, ₹50 in fines.
4. **Deposit Waste** → the guided flow runs on its own:
   `Tap RFID` → `RFID detected` → `Smart bin unlocked` → `Weight measured` →
   `AI analyzing` → `Result`.
5. **Result** → a transaction is created and immediately appears on Home, in History,
   in Rewards and (if flagged) in Penalties.
6. **Rewards** → redeem a reward and watch the balance update.

### Choosing what the bin reports

The deposit screen has a **Smart Bin Simulator** panel with `Auto / Accepted / Incorrect /
Rejected`. Use it to demonstrate both a successful deposit and a penalised one on demand.
`Auto` mostly accepts, with an occasional flagged deposit mixed in.

*Profile → Reset demo data* restores the starting state at any time.

## Architecture

```
src/
  screens/      One file per screen (Splash, Login, Home, Deposit, …)
  components/
    ui/         Button, Card, Badge, Modal, ProgressRing, States
    layout/     PhoneShell, StatusBar, ScreenHeader, BottomNav
    domain/     TransactionItem, RewardCard, PenaltyCard, StatTile, WasteIcon
    brand/      Logo mark, wordmark, leaf confetti
  services/     authService, aiService, wasteService, rewardService, notificationService
  data/         users, transactions, rewards, penalties, notifications, bins
  store/        App state (React context + localStorage) and toasts
  types/        Shared domain types
  lib/          Formatting and waste-type metadata
```

### Ready for real hardware and a real backend

The UI never talks to a data source directly — it goes through the service layer, and every
number on screen is derived from one shared transaction list rather than hardcoded per screen.

- `services/aiService.ts` returns an `AIResult`. Replacing it with a Replicate-backed
  implementation that POSTs the captured frame to a vision model and maps the response onto
  the same `AIResult` shape requires **no UI changes**.
- `services/wasteService.ts` owns the scoring rules (+20 pts/kg, −10 for an incorrect
  classification, −20 for non-recyclable material) and turns a classifier result into a
  `Transaction`.
- `services/authService.ts` mocks password and RFID login; swap it for a real API client.
- The deposit flow's phases (`idle → identified → unlocked → weighing → analyzing → result`)
  map one-to-one onto the physical events an ESP32 would emit, so the timers can be replaced
  with a websocket or MQTT feed without redesigning the screens.

## Stack

React 18 · TypeScript · Vite 6 · Tailwind CSS v4 · React Router · Framer Motion · Lucide icons.

State lives in a React context and is persisted to `localStorage`, so deposits and redeemed
rewards survive a page refresh.

## Presentation deck

`deck/ENGO-Smart-Waste-Management.pptx` is a 12-slide 16:9 deck built from real screenshots of
this prototype. It is fully generated — see [deck/README.md](deck/README.md) to rebuild it after
the app changes.

## Assets

Icons are from [Lucide](https://lucide.dev). The logo, leaf illustrations and decorative
elements are hand-authored SVG. Photographs in `src/assets/images/` are from
[Unsplash](https://unsplash.com) under the Unsplash License and are stored locally, so the
prototype works without an internet connection.
