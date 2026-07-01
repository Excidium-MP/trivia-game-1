# ADS Quiz Game

An admin-hosted learning + trivia session run from a single shared screen. The host (admin)
logs in, then walks the team through an interactive **Before / After story** of checkout UX
improvements, and drives a **trivia** round: each question is shown, the room answers, the
host reveals the correct answer, marks who got it right, and at the end the app declares a
**winner** — or announces a **draw** and runs a **sudden-death tiebreaker**.

Topic: **Checkout UX — Baymard Edition** — an interactive Before/After story (8 checkout
moments) plus a 10-question quiz. Each quiz question links back to the story point it tests.

Fully **static / client-side** — no backend, no database, no environment variables. All
game state lives in the host's browser.

## Flow

`login → home → story (Before/After walkthrough) → home → setup (enter players) →
quiz (reveal + mark correct, per question) → results → tiebreaker (if a draw) → winner`

From **home**, an admin can jump into either **View the Story (Before & After)** or
**Start the Trivia** — both are available; the story is recommended first.

## Logins

Accounts are a hardcoded list in [`lib/users.ts`](lib/users.ts). Defaults:

| Username | Password    | Role  |
| -------- | ----------- | ----- |
| `Zarin`  | `Zarin`     | admin |
| `Irene`  | `Irene123!` | admin |

Only **admin** accounts can host (see the story and run the game). Edit `lib/users.ts` to
change passwords or add people. Note: because this is a static app, the list ships in the
browser bundle, so it's a friendly gate, not real security.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>, log in as `Irene` / `Irene123!` (or `Zarin` / `Zarin`), view
the **Before & After story**, then **Start the Trivia**, add the players, and run the quiz.

## Deploy

Push to GitHub (already at `Excidium-MP/trivia-game-1`) and import into **Vercel**. Click
**Deploy** — no environment variables, no database. You get a public URL the host opens and
shares on screen.

## Customizing

- **Questions / quizzes:** [`lib/questions.ts`](lib/questions.ts) (a `QUIZZES` array — add
  more quizzes here later).
- **Before/After story:** [`lib/story.ts`](lib/story.ts) (the `STORY` cards, each with
  `before`/`after` mock rows, the "why", guideline links, and `relatedTrivia` mapping) and
  [`components/StoryScreen.tsx`](components/StoryScreen.tsx) (rendering).
- **Accounts:** [`lib/users.ts`](lib/users.ts).
- **Answer colors / shapes:** [`lib/ui.ts`](lib/ui.ts).
