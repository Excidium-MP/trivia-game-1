"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [creating, setCreating] = useState(false);

  async function hostGame() {
    setCreating(true);
    try {
      const res = await fetch("/api/rooms", { method: "POST" });
      const data = await res.json();
      router.push(`/host?pin=${data.pin}`);
    } finally {
      setCreating(false);
    }
  }

  function joinGame(e: React.FormEvent) {
    e.preventDefault();
    const clean = pin.replace(/\D/g, "");
    if (clean.length >= 4) router.push(`/play/${clean}`);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-10 px-6 py-12 text-center">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Checkout UX Quiz</h1>
        <p className="mt-3 text-slate-300">A live, Kahoot-style trivia game.</p>
      </div>

      <button
        onClick={hostGame}
        disabled={creating}
        className="w-full rounded-2xl bg-indigo-500 px-6 py-5 text-xl font-bold shadow-lg transition hover:bg-indigo-400 disabled:opacity-60"
      >
        {creating ? "Creating…" : "Host a game"}
      </button>

      <div className="flex w-full items-center gap-4 text-slate-500">
        <div className="h-px flex-1 bg-white/15" />
        <span>or join</span>
        <div className="h-px flex-1 bg-white/15" />
      </div>

      <form onSubmit={joinGame} className="flex w-full flex-col gap-3">
        <input
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          inputMode="numeric"
          placeholder="Game PIN"
          className="w-full rounded-2xl bg-white/10 px-6 py-5 text-center text-2xl font-bold tracking-widest outline-none ring-2 ring-transparent focus:ring-indigo-400"
        />
        <button
          type="submit"
          className="w-full rounded-2xl bg-emerald-500 px-6 py-4 text-lg font-bold transition hover:bg-emerald-400"
        >
          Join game
        </button>
      </form>
    </main>
  );
}
