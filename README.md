# Checkout UX Quiz — Live Trivia (Kahoot-style)

A live, host-driven trivia game. A host screen (projector) shows each question; players
join from their phones by scanning a QR code, answer the same question at the same time,
and a shared scoreboard shows between questions.

Content: the 10-question **UX Quiz Challenge — Baymard Edition** on checkout UX.

## How it works

- **Host** opens `/host`, gets a game **PIN** + **QR code** on screen.
- **Players** scan the QR (or go to the site and enter the PIN) → `/play/[pin]`, pick a
  nickname, and play.
- The host taps one button to move the game forward:
  `Start → question → reveal answer + fun fact → scoreboard → next → … → final results`.
- Scoring is Kahoot-style: correct **and** fast earns more (up to ~1000/question).

Tech: Next.js (App Router) + Tailwind. State lives in Upstash Redis (polled ~1s), with an
in-memory fallback for local single-machine testing.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Click **Host a game** (this tab is the projector), then open
the join URL / PIN in another tab or on your phone.

> No Redis needed for local testing on one computer — it falls back to an in-memory store
> shared across tabs of the same dev server. For **multi-device** play (phones), deploy it
> (below) so all devices talk to the same Redis.

To test phones on your local Wi-Fi without deploying, run `npm run dev` and visit
`http://<your-computer-LAN-IP>:3000` from the phone — but Redis is still recommended for
reliability once more than a couple of people join.

## Deploy (public URL for the QR)

1. Push this folder to a Git repo and import it into **Vercel** (or use the Vercel CLI /
   integration).
2. In the Vercel project, add an **Upstash Redis** store (Storage → Marketplace → Upstash).
   Linking it auto-adds the `KV_REST_API_URL` and `KV_REST_API_TOKEN` env vars.
3. Redeploy. Open the deployment's `/host` on your projector — the QR now points at the
   public URL, so anyone can join from any network.

See `.env.example` for the environment variables.

## Customizing

- **Questions / answers / fun facts:** `lib/questions.ts`.
- **Timer length:** `TIME_LIMIT_SECONDS` in `lib/questions.ts`.
- **Points curve:** `lib/scoring.ts`.
- **Answer colors/shapes:** `lib/ui.ts`.
