"use client";

import type { Session } from "@/lib/auth";
import { QUIZZES } from "@/lib/questions";

export function HomeScreen({
  session,
  onStart,
  onViewStory,
}: {
  session: Session;
  onStart: () => void;
  onViewStory: () => void;
}) {
  const quiz = QUIZZES[0];
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight">ADS Quiz Game</h1>
      <p className="text-lg text-slate-300">{quiz.title}</p>

      {session.isAdmin ? (
        <div className="mt-4 flex w-full flex-col gap-3">
          <button
            onClick={onViewStory}
            className="w-full rounded-2xl bg-emerald-500 px-6 py-5 text-xl font-bold shadow-lg transition hover:bg-emerald-400"
          >
            📖 View the Story <span className="font-semibold opacity-90">(Before &amp; After)</span>
          </button>
          <button
            onClick={onStart}
            className="w-full rounded-2xl bg-indigo-500 px-6 py-5 text-xl font-bold shadow-lg transition hover:bg-indigo-400"
          >
            🧠 Start the Trivia
          </button>
          <p className="text-xs text-slate-400">
            Recommended: walk the team through the story first, then run the quiz.
          </p>
        </div>
      ) : (
        <p className="mt-4 rounded-2xl bg-white/10 px-6 py-5 text-slate-300">
          Waiting for the host to start the game…
        </p>
      )}
    </main>
  );
}
