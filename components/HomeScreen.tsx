"use client";

import type { Session } from "@/lib/auth";
import { QUIZZES } from "@/lib/questions";

export function HomeScreen({ session, onStart }: { session: Session; onStart: () => void }) {
  const quiz = QUIZZES[0];
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight">ADS Quiz Game</h1>
      <p className="text-lg text-slate-300">{quiz.title}</p>

      {session.isAdmin ? (
        <button
          onClick={onStart}
          className="mt-4 w-full rounded-2xl bg-indigo-500 px-6 py-5 text-xl font-bold shadow-lg transition hover:bg-indigo-400"
        >
          Get Started
        </button>
      ) : (
        <p className="mt-4 rounded-2xl bg-white/10 px-6 py-5 text-slate-300">
          Waiting for the host to start the game…
        </p>
      )}
    </main>
  );
}
