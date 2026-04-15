# Sleep Coach

Connect your Oura Ring and get a personalised nightly recovery plan built from your actual sleep, readiness, and activity data — powered by Claude.

Built on [Context Gateway](https://opendatalabs.xyz) by Open Data Labs.

---

## Stack

- Next.js 14 App Router + TypeScript
- Tailwind CSS
- `@opendatalabs/connect-js` — Oura Ring OAuth via Context Gateway
- `@anthropic-ai/sdk` — Claude Haiku for recovery plan generation

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/vana-com/sleep-coach
cd sleep-coach
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Then fill in each value (see table below).

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

| Variable | Where to get it |
|---|---|
| `OPENDATALABS_API_KEY` | [Open Data Labs dashboard](https://dashboard.opendatalabs.xyz) → API Keys |
| `OPENDATALABS_ENCRYPTION_SECRET` | Dashboard → App Settings → Data Encryption Secret |
| `OPENDATALABS_APP_ID` | Dashboard → Apps → your app ID |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |
| `NEXT_PUBLIC_APP_URL` | Your deployed URL (e.g. `https://sleep-coach.vercel.app`). Use `http://localhost:3000` locally. |

---

## Open Data Labs dashboard steps

1. Sign in at [dashboard.opendatalabs.xyz](https://dashboard.opendatalabs.xyz).
2. Create a new app. Copy the **App ID** into `OPENDATALABS_APP_ID`.
3. Under **API Keys**, generate a key and copy it into `OPENDATALABS_API_KEY`.
4. Under **App Settings**, generate a **Data Encryption Secret** and copy it into `OPENDATALABS_ENCRYPTION_SECRET`.
5. Under **Allowed Origins**, add your domain (e.g. `https://sleep-coach.vercel.app` and `http://localhost:3000`). The Connect iframe will not load from unlisted origins.
6. Confirm that `oura` is an enabled source for your app.

---

## How it works

1. User clicks "Connect Oura Ring" on the landing page.
2. The app creates a short-lived Connect session via the ODL API (server-side, key never exposed to the browser).
3. The ODL Connect iframe opens and the user authenticates with Oura through the hosted flow.
4. On success, the app receives a `connectionId` and fetches decrypted Oura data (readiness, sleep periods, activity) from the ODL API.
5. That data goes to Claude Haiku with a structured prompt. Claude returns 3-4 specific recommendations and a single tonight's priority, as JSON.
6. The result page renders the plan.

---

## Deploy to Vercel

```bash
vercel deploy --prod
```

Set all five environment variables in the Vercel dashboard under **Settings → Environment Variables**, then add the production URL to your ODL app's allowed origins.

---

## Context Gateway by Open Data Labs

This app uses [Context Gateway](https://opendatalabs.xyz) to connect to Oura Ring. Context Gateway handles OAuth, token management, and end-to-end encrypted data retrieval — your server never sees plaintext Oura credentials.
