# Mint Capital — Banking App

A mobile banking app UI for **Mint Capital**, implemented in **Vite + React + TypeScript**.
Ported pixel-for-pixel from a Claude Design (claude.ai/design) HTML/React prototype.

Dark theme, mint-green accent (`#10B981`), DM Sans typography, rendered inside an
iOS 26 device frame as a presentation shell.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build
```

## What's included

All five flows from the prototype:

| Flow | Screens |
|------|---------|
| **Auth** | Splash, Onboarding (3 slides), Login, Sign Up (with password strength), Forgot Password |
| **Main** | Home (balance, quick actions, monthly spending, recent tx), Wallet (card carousel, freeze), Transactions (search + filter, grouped by date), Notifications |
| **Transfer** | Select recipient, Add recipient, Amount (custom numpad), Confirm, Success |
| **Profile / Security** | Profile menu + logout, Security settings (toggles, sessions) |
| **KYC** | Welcome, Personal, Address, Employment, Document upload, Review, Approved |
| **Admin** | Login, Dashboard (customer list), Customer detail (balance, KYC approve/reject, freeze) |

State persists to `localStorage` (cards, transactions, recipients, notifications, users, KYC).

## Try it

1. **Sign up** for a customer account (any valid details) → lands on Home.
2. Explore Home → Wallet → Send money → Profile → Security.
3. **Admin:** from the Login screen tap **"Admin access"**, sign in with:
   - Email: `admin@mintcapital.app`
   - Password: `MintAdmin123!`

   The admin dashboard lists customers you've registered; open one to add balance,
   approve/reject KYC, or freeze the account.

> The login screen has no seeded demo customer — create one via Sign Up first.

## Architecture

```
src/
├── main.tsx                 # React entrypoint
├── App.tsx                  # history-stack router + slide transitions, wrapped in IOSDevice
├── index.css                # global resets + keyframes (ported from the prototype <head>)
├── theme.ts                 # design tokens (T)
├── types.ts                 # shared data-model types
├── lib/
│   ├── data.ts              # KEYS, DB, Auth, BankAPI, validators (V), formatters (F)
│   ├── kyc.ts               # KYC data layer
│   ├── admin.ts             # Admin data layer
│   └── assets.ts            # brand image URLs
├── components/
│   ├── Icon.tsx             # stroke SVG icon set
│   ├── ui.tsx               # Btn, InputField, BalanceCard, BottomNav, TxItem, Toast, …
│   └── ios/IOSDevice.tsx    # iOS 26 device frame kit
└── screens/
    ├── auth.tsx  main.tsx  action.tsx  kyc.tsx  admin.tsx
```

## Notes on the port

The prototype was a single-page React app loaded via Babel-in-browser with components
attached to `window`. This port converts it to ES modules with explicit imports/exports
and full TypeScript types. The visual output is preserved (inline styles copied verbatim,
including responsive `clamp()` sizing). The dev-only "tweaks panel" from the prototype was
dropped per scope.

Two latent bugs in the prototype's data layer were fixed during the port:

1. **`Auth` referenced an undefined `DEMO` global** (a leftover from a removed demo
   account), which threw on registration. Those references were removed.
2. **The admin data layer read/wrote `vault_*` localStorage keys** while the customer
   data layer used `mintcap_*`, so admin actions never reached customer data. The admin
   layer now uses the shared `KEYS` constants, so add-balance / KYC approval actually work.
