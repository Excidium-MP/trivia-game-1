"use client";

import { useState } from "react";
import { QUIZZES } from "@/lib/questions";

export function SetupScreen({
  onStart,
  onCancel,
}: {
  onStart: (players: string[]) => void;
  onCancel: () => void;
}) {
  const quiz = QUIZZES[0];
  const [players, setPlayers] = useState<string[]>(["", ""]);

  function update(i: number, value: string) {
    setPlayers((prev) => prev.map((p, idx) => (idx === i ? value : p)));
  }
  function add() {
    setPlayers((prev) => [...prev, ""]);
  }
  function remove(i: number) {
    setPlayers((prev) => prev.filter((_, idx) => idx !== i));
  }

  const cleaned = players.map((p) => p.trim()).filter(Boolean);
  const hasDupes = new Set(cleaned.map((p) => p.toLowerCase())).size !== cleaned.length;
  const canStart = cleaned.length >= 2 && !hasDupes;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-5 px-6 py-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Who's playing?</h1>
        <p className="mt-1 text-slate-300">{quiz.title}</p>
      </div>

      <div className="flex flex-col gap-2">
        {players.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={p}
              onChange={(e) => update(i, e.target.value)}
              placeholder={`Player ${i + 1}`}
              maxLength={24}
              className="w-full rounded-xl bg-white/10 px-4 py-3 text-lg font-semibold outline-none ring-2 ring-transparent focus:ring-indigo-400"
            />
            {players.length > 1 && (
              <button
                onClick={() => remove(i)}
                aria-label="Remove player"
                className="shrink-0 rounded-xl bg-white/10 px-4 py-3 text-lg font-bold text-slate-300 hover:bg-white/20"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={add}
        className="rounded-xl border border-dashed border-white/25 px-4 py-3 font-semibold text-slate-300 hover:bg-white/5"
      >
        + Add player
      </button>

      {hasDupes && <p className="text-center text-amber-400">Player names must be unique.</p>}

      <div className="mt-auto flex flex-col gap-2 pt-4">
        <button
          onClick={() => onStart(cleaned)}
          disabled={!canStart}
          className="w-full rounded-2xl bg-emerald-500 px-6 py-4 text-lg font-bold transition hover:bg-emerald-400 disabled:opacity-50"
        >
          Start quiz
        </button>
        <button onClick={onCancel} className="text-sm font-semibold text-slate-400 hover:text-slate-200">
          Cancel
        </button>
      </div>
    </main>
  );
}
