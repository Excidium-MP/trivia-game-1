# Checkout UX Quiz — Self-Paced Trivia

A simple, self-paced trivia quiz you can share via a QR code. Each person opens the link
on their own phone, answers all 10 questions at their own pace, sees the correct answer +
a fun fact after each one, and gets a final score.

Content: the 10-question **UX Quiz Challenge — Baymard Edition** on checkout UX.

Fully **static / client-side** — no backend, no database, no environment variables.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000> and play. On the start or results screen, click **"Show QR
code to share"** to display a QR of the site's URL — a presenter can put it on a projector
so everyone scans and plays on their own phone.

## Deploy (public URL for the QR)

1. Push to GitHub (already at `Excidium-MP/trivia-game-1`).
2. Import the repo into **Vercel** (Next.js is auto-detected).
3. Click **Deploy**. That's it — **no environment variables, no database to set up.**

You get a public URL like `https://trivia-game-1-xxxx.vercel.app`. Share that link (or its
QR) and anyone can play.

## Customizing

- **Questions / answers / fun facts:** `lib/questions.ts`.
- **Answer colors / shapes:** `lib/ui.ts`.

## Notes

Each phone runs its own independent quiz (self-paced), so there's no shared live
leaderboard — everyone just sees their own score. If you ever want the live, host-driven
"everyone answers at once" Kahoot mode with a shared leaderboard, that's a bigger change
(needs a small backend for shared state).
