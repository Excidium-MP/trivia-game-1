"use client";

import { useEffect, useState } from "react";
import { useRoom } from "@/lib/useRoom";
import { QUESTIONS } from "@/lib/questions";
import { CHOICE_STYLES, LETTERS } from "@/lib/ui";
import { Timer } from "@/components/Timer";

interface Me {
  playerId: string;
  name: string;
}

export default function PlayPage({ params }: { params: { pin: string } }) {
  const pin = params.pin;
  const [me, setMe] = useState<Me | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Restore identity for this room after a refresh.
  useEffect(() => {
    const saved = localStorage.getItem(`trivia:${pin}`);
    if (saved) setMe(JSON.parse(saved));
    setHydrated(true);
  }, [pin]);

  function onJoined(m: Me) {
    localStorage.setItem(`trivia:${pin}`, JSON.stringify(m));
    setMe(m);
  }

  if (!hydrated) return <Screen>Loading…</Screen>;
  if (!me) return <JoinForm pin={pin} onJoined={onJoined} />;
  return <Game pin={pin} me={me} />;
}

function JoinForm({ pin, onJoined }: { pin: string; onJoined: (m: Me) => void }) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/rooms/${pin}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not join");
        return;
      }
      onJoined({ playerId: data.playerId, name: data.name });
    } catch {
      setError("Network error — try again");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-center text-3xl font-bold">Checkout UX Quiz</h1>
        <p className="mb-6 text-center text-slate-300">Game PIN {pin}</p>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            placeholder="Your nickname"
            className="w-full rounded-2xl bg-white/10 px-5 py-4 text-center text-xl font-bold outline-none ring-2 ring-transparent focus:ring-indigo-400"
            autoFocus
          />
          <button
            type="submit"
            disabled={busy || !name.trim()}
            className="w-full rounded-2xl bg-emerald-500 px-6 py-4 text-lg font-bold transition hover:bg-emerald-400 disabled:opacity-50"
          >
            {busy ? "Joining…" : "Enter"}
          </button>
          {error && <p className="text-center text-red-400">{error}</p>}
        </form>
      </div>
    </Screen>
  );
}

function Game({ pin, me }: { pin: string; me: Me }) {
  const { data, error } = useRoom(pin);
  const [answeredQ, setAnsweredQ] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  if (error) return <Screen>{error}</Screen>;
  if (!data) return <Screen>Loading…</Screen>;

  const { room } = data;
  const player = room.players[me.playerId];
  const q = room.currentQuestion >= 0 ? QUESTIONS[room.currentQuestion] : null;
  const myAnswer = room.answers[room.currentQuestion]?.[me.playerId];
  const locked = answeredQ === room.currentQuestion || Boolean(myAnswer);

  async function answer(choice: number) {
    if (locked) return;
    setAnsweredQ(room.currentQuestion);
    setSelected(choice);
    await fetch(`/api/rooms/${pin}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId: me.playerId, choice }),
    }).catch(() => {
      // allow retry on failure
      setAnsweredQ(null);
      setSelected(null);
    });
  }

  // LOBBY
  if (room.phase === "lobby") {
    return (
      <Screen>
        <div className="text-center">
          <p className="text-2xl font-bold">You're in, {me.name}! 🎉</p>
          <p className="mt-2 text-slate-300">Waiting for the host to start…</p>
        </div>
      </Screen>
    );
  }

  // QUESTION
  if (room.phase === "question" && q) {
    if (locked) {
      return (
        <Screen>
          <div className="text-center">
            <p className="text-3xl font-bold">Answer locked in! 🔒</p>
            <p className="mt-2 text-slate-300">Waiting for others…</p>
          </div>
        </Screen>
      );
    }
    return (
      <main className="flex min-h-screen flex-col gap-4 p-4">
        <Timer startedAt={room.questionStartedAt} />
        <p className="text-center text-xl font-semibold">{q.prompt}</p>
        <div className="grid flex-1 grid-cols-1 gap-3">
          {q.choices.map((c, i) => (
            <button
              key={i}
              onClick={() => answer(i)}
              className={`flex items-center gap-3 rounded-2xl px-5 text-left text-lg font-bold ${CHOICE_STYLES[i].bg}`}
            >
              <span className="text-3xl">{CHOICE_STYLES[i].shape}</span>
              <span>
                {LETTERS[i]}. {c}
              </span>
            </button>
          ))}
        </div>
      </main>
    );
  }

  // REVEAL
  if (room.phase === "reveal" && q) {
    const gotIt = myAnswer?.correct;
    const answeredThis = Boolean(myAnswer);
    return (
      <Screen>
        <div className="text-center">
          <p className="text-5xl">{gotIt ? "✅" : answeredThis ? "❌" : "⏱️"}</p>
          <p className="mt-3 text-3xl font-bold">
            {gotIt ? "Correct!" : answeredThis ? "Not this time" : "No answer"}
          </p>
          {gotIt && <p className="mt-1 text-xl text-emerald-300">+{myAnswer?.points} points</p>}
          <p className="mt-4 text-slate-300">
            Correct answer:{" "}
            <span className="font-semibold text-white">
              {LETTERS[q.correctIndex]}. {q.choices[q.correctIndex]}
            </span>
          </p>
          <p className="mt-6 text-2xl font-bold tabular-nums">{player?.score ?? 0} pts</p>
        </div>
      </Screen>
    );
  }

  // LEADERBOARD / FINAL
  if (room.phase === "leaderboard" || room.phase === "final") {
    const ranked = Object.values(room.players).sort((a, b) => b.score - a.score);
    const rank = ranked.findIndex((p) => p.id === me.playerId) + 1;
    return (
      <Screen>
        <div className="text-center">
          {room.phase === "final" && <p className="text-4xl">🏁</p>}
          <p className="mt-2 text-2xl font-bold">
            {room.phase === "final" ? "Final rank" : "Your rank"}: #{rank || "—"}
          </p>
          <p className="mt-1 text-slate-300">of {ranked.length} players</p>
          <p className="mt-6 text-5xl font-extrabold tabular-nums">{player?.score ?? 0}</p>
          <p className="text-slate-300">points</p>
        </div>
      </Screen>
    );
  }

  return <Screen>Loading…</Screen>;
}

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">{children}</main>
  );
}
