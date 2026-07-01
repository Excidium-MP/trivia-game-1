# ADS Quiz Game

An admin-hosted trivia game run from a single shared screen. The host (admin) logs in,
shares their screen, and drives the quiz: each question is shown, the room answers, the
host reveals the correct answer, marks who got it right, and at the end the app declares a
**winner** — or announces a **draw** and runs a **sudden-death tiebreaker**.

First quiz: **Checkout UX — Baymard Edition** (10 questions).

Fully **static / client-side** — no backend, no database, no environment variables. All
game state lives in the host's browser.

## Flow

`login → home → setup (enter players) → quiz (reveal + mark correct, per question) →
results → tiebreaker (if a draw) → winner`

## Logins

Accounts are a hardcoded list in [`lib/users.ts`](lib/users.ts). Defaults:

| Username | Password | Role  |
| -------- | -------- | ----- |
| `Zarin`  | `Zarin`  | admin |
| `Irene`  | `Irene`  | player |

Only **admin** accounts can host a game. Edit `lib/users.ts` to change passwords or add
people. Note: because this is a static app, the list ships in the browser bundle, so it's a
friendly gate, not real security.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>, log in as `Zarin` / `Zarin`, click **Get Started**, add the
players, and run the quiz.

## Deploy

Push to GitHub (already at `Excidium-MP/trivia-game-1`) and import into **Vercel**. Click
**Deploy** — no environment variables, no database. You get a public URL the host opens and
shares on screen.

## Customizing

- **Questions / quizzes:** [`lib/questions.ts`](lib/questions.ts) (a `QUIZZES` array — add
  more quizzes here later).
- **Accounts:** [`lib/users.ts`](lib/users.ts).
- **Answer colors / shapes:** [`lib/ui.ts`](lib/ui.ts).
