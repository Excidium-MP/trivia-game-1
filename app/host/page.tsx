"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRoom } from "@/lib/useRoom";
import { QUESTIONS } from "@/lib/questions";
import { CHOICE_STYLES, LETTERS } from "@/lib/ui";
import type { Player, RoomState } from "@/lib/types";
import { QRDisplay } from "@/components/QRDisplay";
import { Leaderboard } from "@/components/Leaderboard";
import { Timer } from "@/components/Timer";

function sortedPlayers(room: RoomState): Player[] {
  return Object.values(room.players).sort((a, b) => b.score - a.score);
}

function HostInner() {
  const pin = useSearchParams().get("pin");
  const { data, error } = useRoom(pin);
  const [busy, setBusy] = useState(false);

  const joinUrl = useMemo(() => {
    if (!pin || typeof window === "undefined") return "";
    return `${window.location.origin}/play/${pin}`;
  }, [pin]);

  async function advance() {
    if (!pin) return;
    setBusy(true);
    try {
      await fetch(`/api/rooms/${pin}/advance`, { method: "POST" });
    } finally {
      setBusy(false);
    }
  }

  if (!pin) return <Centered>Missing game PIN.</Centered>;
  if (error) return <Centered>{error}</Centered>;
  if (!data) return <Centered>Loading…</Centered>;

  const { room, totalQuestions } = data;
  const players = sortedPlayers(room);
  const q = room.currentQuestion >= 0 ? QUESTIONS[room.currentQuestion] : null;
  const answersForQ = room.answers[room.currentQuestion] ?? {};
  const answered = Object.keys(answersForQ).length;
  const isLastQuestion = room.currentQuestion === totalQuestions - 1;

  const nextLabel =
    room.phase === "lobby"
      ? players.length === 0
        ? "Waiting for players…"
        : "Start game"
      : room.phase === "question"
        ? "Reveal answer"
        : room.phase === "reveal"
          ? "Show scoreboard"
          : room.phase === "leaderboard"
            ? isLastQuestion
              ? "Final results"
              : "Next question"
            : null;

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center gap-8 px-6 py-10">
      {/* LOBBY */}
      {room.phase === "lobby" && (
        <>
          <h1 className="text-3xl font-bold">Join the game!</h1>
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-12">
            <QRDisplay url={joinUrl} />
            <div className="text-center sm:text-left">
              <p className="text-slate-300">Go to</p>
              <p className="break-all text-lg font-semibold text-indigo-300">{joinUrl}</p>
              <p className="mt-4 text-slate-300">Game PIN</p>
              <p className="text-6xl font-extrabold tracking-widest tabular-nums">{pin}</p>
            </div>
          </div>
          <div className="w-full">
            <p className="mb-3 text-center text-lg text-slate-300">
              {players.length} player{players.length === 1 ? "" : "s"} joined
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {players.map((p) => (
                <span key={p.id} className="animate-pop rounded-full bg-white/10 px-4 py-2 font-semibold">
                  {p.name}
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      {/* QUESTION */}
      {room.phase === "question" && q && (
        <>
          <ProgressPill index={room.currentQuestion} total={totalQuestions} />
          <h2 className="text-center text-3xl font-bold">{q.prompt}</h2>
          <Timer startedAt={room.questionStartedAt} />
          <p className="text-lg text-slate-300">
            {answered} / {players.length} answered
          </p>
          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
            {q.choices.map((c, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-xl px-5 py-6 text-xl font-bold ${CHOICE_STYLES[i].bg}`}
              >
                <span className="text-2xl">{CHOICE_STYLES[i].shape}</span>
                <span>
                  {LETTERS[i]}. {c}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* REVEAL */}
      {room.phase === "reveal" && q && (
        <>
          <ProgressPill index={room.currentQuestion} total={totalQuestions} />
          <h2 className="text-center text-3xl font-bold">{q.prompt}</h2>
          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
            {q.choices.map((c, i) => {
              const isCorrect = i === q.correctIndex;
              const count = Object.values(answersForQ).filter((a) => a.choice === i).length;
              return (
                <div
                  key={i}
                  className={`flex items-center justify-between gap-3 rounded-xl px-5 py-6 text-xl font-bold transition ${
                    isCorrect ? CHOICE_STYLES[i].bg : "bg-white/10 opacity-50"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-2xl">{CHOICE_STYLES[i].shape}</span>
                    <span>
                      {LETTERS[i]}. {c}
                    </span>
                  </span>
                  <span className="flex items-center gap-2 text-base">
                    {count}
                    {isCorrect && <span className="text-2xl">✓</span>}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="rounded-xl bg-indigo-500/20 px-6 py-4 text-center text-lg">
            💡 {q.funFact}
          </div>
        </>
      )}

      {/* LEADERBOARD */}
      {room.phase === "leaderboard" && (
        <>
          <h2 className="text-3xl font-bold">Scoreboard</h2>
          <Leaderboard players={players} />
        </>
      )}

      {/* FINAL */}
      {room.phase === "final" && (
        <>
          <h2 className="text-4xl font-extrabold">🏆 Final Results</h2>
          <Leaderboard players={players} max={10} />
          <button
            onClick={() => void newGame()}
            className="mt-4 rounded-xl bg-indigo-500 px-6 py-3 font-bold hover:bg-indigo-400"
          >
            Host a new game
          </button>
        </>
      )}

      {/* HOST CONTROL BUTTON */}
      {nextLabel && (
        <button
          onClick={advance}
          disabled={busy || (room.phase === "lobby" && players.length === 0)}
          className="fixed bottom-6 right-6 rounded-2xl bg-emerald-500 px-8 py-4 text-lg font-bold shadow-xl transition hover:bg-emerald-400 disabled:opacity-50"
        >
          {nextLabel}
        </button>
      )}
    </main>
  );
}

async function newGame() {
  const res = await fetch("/api/rooms", { method: "POST" });
  const data = await res.json();
  window.location.href = `/host?pin=${data.pin}`;
}

function ProgressPill({ index, total }: { index: number; total: number }) {
  return (
    <span className="rounded-full bg-white/10 px-4 py-1 text-sm font-semibold text-slate-200">
      Question {index + 1} of {total}
    </span>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 text-center text-xl text-slate-300">
      {children}
    </main>
  );
}

export default function HostPage() {
  return (
    <Suspense fallback={<Centered>Loading…</Centered>}>
      <HostInner />
    </Suspense>
  );
}
