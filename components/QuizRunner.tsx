"use client";

import { useMemo, useState } from "react";
import type { Question, Quiz } from "@/lib/questions";
import { CHOICE_STYLES, LETTERS } from "@/lib/ui";

type Phase = "playing" | "results" | "tiebreak" | "champion";

export function QuizRunner({
  quiz,
  players,
  onExit,
}: {
  quiz: Quiz;
  players: string[];
  onExit: () => void;
}) {
  const total = quiz.questions.length;

  const [scores, setScores] = useState<Record<string, number>>(
    () => Object.fromEntries(players.map((p) => [p, 0])),
  );
  const [phase, setPhase] = useState<Phase>("playing");

  // main quiz
  const [qIndex, setQIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [marked, setMarked] = useState<string[]>([]);

  // tiebreaker
  const [tied, setTied] = useState<string[]>([]);
  const [tbUsed, setTbUsed] = useState<number[]>([]);
  const [tbQ, setTbQ] = useState(0);
  const [tbRevealed, setTbRevealed] = useState(false);
  const [tbMarked, setTbMarked] = useState<string[]>([]);
  const [champion, setChampion] = useState<string | null>(null);

  const ranked = useMemo(
    () => [...players].sort((a, b) => scores[b] - scores[a]),
    [players, scores],
  );

  function toggle(setList: React.Dispatch<React.SetStateAction<string[]>>, name: string) {
    setList((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
  }

  function pickTbQuestion(used: number[]): { index: number; used: number[] } {
    let pool = quiz.questions.map((_, i) => i).filter((i) => !used.includes(i));
    let nextUsed = used;
    if (pool.length === 0) {
      pool = quiz.questions.map((_, i) => i); // ran out — allow reuse
      nextUsed = [];
    }
    const index = pool[Math.floor(Math.random() * pool.length)];
    return { index, used: [...nextUsed, index] };
  }

  // ----- main quiz: advance after marking -----
  function nextQuestion() {
    const newScores = { ...scores };
    for (const name of marked) newScores[name] += 1;
    setScores(newScores);

    if (qIndex + 1 < total) {
      setQIndex(qIndex + 1);
      setRevealed(false);
      setMarked([]);
    } else {
      const max = Math.max(...players.map((p) => newScores[p]));
      const winners = players.filter((p) => newScores[p] === max);
      if (winners.length === 1) setChampion(winners[0]);
      setPhase("results");
    }
  }

  function startTiebreak(group: string[]) {
    const first = pickTbQuestion([]);
    setTied(group);
    setTbUsed(first.used);
    setTbQ(first.index);
    setTbRevealed(false);
    setTbMarked([]);
    setPhase("tiebreak");
  }

  // ----- tiebreaker: resolve a round -----
  function resolveTiebreak() {
    const correct = tbMarked.filter((n) => tied.includes(n));
    if (correct.length === 1) {
      setChampion(correct[0]);
      setPhase("champion");
      return;
    }
    // narrow to those who were correct if it splits the group; otherwise keep all
    const nextTied = correct.length > 1 && correct.length < tied.length ? correct : tied;
    const next = pickTbQuestion(tbUsed);
    setTied(nextTied);
    setTbUsed(next.used);
    setTbQ(next.index);
    setTbRevealed(false);
    setTbMarked([]);
  }

  // ---------------- RESULTS ----------------
  if (phase === "results") {
    const max = Math.max(...players.map((p) => scores[p]));
    const winners = players.filter((p) => scores[p] === max);
    const draw = winners.length > 1;
    return (
      <Screen>
        <h1 className="text-4xl font-extrabold">Results</h1>
        <Scoreboard ranked={ranked} scores={scores} highlight={draw ? winners : winners} />
        {draw ? (
          <>
            <p className="text-center text-xl font-bold text-amber-300">
              🤝 It&apos;s a draw between {joinNames(winners)}!
            </p>
            <button onClick={() => startTiebreak(winners)} className={primaryBtn}>
              Start sudden-death tiebreaker
            </button>
          </>
        ) : (
          <p className="text-center text-2xl font-extrabold text-emerald-300">
            🏆 {winners[0]} wins!
          </p>
        )}
        <button onClick={onExit} className={ghostBtn}>
          Back to home
        </button>
      </Screen>
    );
  }

  // ---------------- CHAMPION (post-tiebreak) ----------------
  if (phase === "champion") {
    return (
      <Screen>
        <p className="text-6xl">🏆</p>
        <h1 className="text-center text-3xl font-extrabold text-emerald-300">
          {champion} wins the tiebreaker!
        </h1>
        <Scoreboard ranked={ranked} scores={scores} highlight={champion ? [champion] : []} />
        <button onClick={onExit} className={primaryBtn}>
          Back to home
        </button>
      </Screen>
    );
  }

  // ---------------- TIEBREAK ----------------
  if (phase === "tiebreak") {
    const question = quiz.questions[tbQ];
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-5 px-4 pb-6 pt-16">
        <div className="text-center">
          <span className="rounded-full bg-amber-500/20 px-4 py-1 text-sm font-bold text-amber-300">
            Sudden-death tiebreaker
          </span>
          <p className="mt-2 text-slate-300">Between {joinNames(tied)}</p>
        </div>
        <QuestionCard question={question} revealed={tbRevealed} />
        {!tbRevealed ? (
          <button onClick={() => setTbRevealed(true)} className={primaryBtn}>
            Reveal answer
          </button>
        ) : (
          <>
            <MarkPanel players={tied} marked={tbMarked} onToggle={(n) => toggle(setTbMarked, n)} />
            <button onClick={resolveTiebreak} className={emeraldBtn}>
              Submit round
            </button>
          </>
        )}
      </main>
    );
  }

  // ---------------- PLAYING ----------------
  const question = quiz.questions[qIndex];
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-5 px-4 pb-6 pt-16">
      <div className="flex items-center justify-between text-sm font-semibold text-slate-300">
        <span className="rounded-full bg-white/10 px-3 py-1">
          Question {qIndex + 1} of {total}
        </span>
        <button onClick={onExit} className="text-slate-400 hover:text-slate-200">
          Quit
        </button>
      </div>

      <QuestionCard question={question} revealed={revealed} />

      {!revealed ? (
        <button onClick={() => setRevealed(true)} className={primaryBtn}>
          Reveal answer
        </button>
      ) : (
        <>
          <MarkPanel players={players} marked={marked} onToggle={(n) => toggle(setMarked, n)} />
          <button onClick={nextQuestion} className={emeraldBtn}>
            {qIndex + 1 < total ? "Next question" : "See results"}
          </button>
        </>
      )}
    </main>
  );
}

// ---------------- shared pieces ----------------

function QuestionCard({ question, revealed }: { question: Question; revealed: boolean }) {
  return (
    <>
      <h2 className="text-center text-2xl font-bold sm:text-3xl">{question.prompt}</h2>
      <div className="grid grid-cols-1 gap-3">
        {question.choices.map((c, i) => {
          const isCorrect = i === question.correctIndex;
          const cls = revealed
            ? isCorrect
              ? "bg-green-600"
              : "bg-white/10 opacity-50"
            : CHOICE_STYLES[i].bg;
          return (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-2xl px-5 py-5 text-lg font-bold ${cls}`}
            >
              <span className="text-2xl">{CHOICE_STYLES[i].shape}</span>
              <span className="flex-1">
                {LETTERS[i]}. {c}
              </span>
              {revealed && isCorrect && <span className="text-2xl">✓</span>}
            </div>
          );
        })}
      </div>
      {revealed && (
        <div className="rounded-xl bg-indigo-500/20 px-5 py-3 text-center text-sm text-slate-200">
          💡 {question.funFact}
        </div>
      )}
    </>
  );
}

function MarkPanel({
  players,
  marked,
  onToggle,
}: {
  players: string[];
  marked: string[];
  onToggle: (name: string) => void;
}) {
  return (
    <div className="rounded-2xl bg-white/5 p-4">
      <p className="mb-3 text-center font-semibold text-slate-200">Who got it right?</p>
      <div className="flex flex-wrap justify-center gap-2">
        {players.map((p) => {
          const on = marked.includes(p);
          return (
            <button
              key={p}
              onClick={() => onToggle(p)}
              className={`rounded-full px-4 py-2 font-bold transition ${
                on ? "bg-emerald-500 text-white" : "bg-white/10 text-slate-200 hover:bg-white/20"
              }`}
            >
              {on ? "✓ " : ""}
              {p}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Scoreboard({
  ranked,
  scores,
  highlight,
}: {
  ranked: string[];
  scores: Record<string, number>;
  highlight: string[];
}) {
  return (
    <ol className="mx-auto flex w-full max-w-sm flex-col gap-2">
      {ranked.map((name, i) => (
        <li
          key={name}
          className={`flex items-center justify-between rounded-xl px-4 py-3 text-lg font-semibold ${
            highlight.includes(name) ? "bg-emerald-500" : "bg-white/10"
          }`}
        >
          <span className="flex items-center gap-3">
            <span className="w-6 text-center text-slate-300">{i + 1}</span>
            <span className="truncate">{name}</span>
          </span>
          <span className="tabular-nums">{scores[name]}</span>
        </li>
      ))}
    </ol>
  );
}

function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  return names.slice(0, -1).join(", ") + " & " + names[names.length - 1];
}

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-6 py-10">
      {children}
    </main>
  );
}

const primaryBtn =
  "w-full rounded-2xl bg-indigo-500 px-6 py-4 text-lg font-bold transition hover:bg-indigo-400";
const emeraldBtn =
  "w-full rounded-2xl bg-emerald-500 px-6 py-4 text-lg font-bold transition hover:bg-emerald-400";
const ghostBtn = "text-sm font-semibold text-slate-400 hover:text-slate-200";
