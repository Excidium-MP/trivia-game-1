"use client";

import { useEffect, useState } from "react";
import { QUESTIONS } from "@/lib/questions";
import { CHOICE_STYLES, LETTERS } from "@/lib/ui";
import { QRDisplay } from "@/components/QRDisplay";

type Phase = "start" | "question" | "reveal" | "done";

export default function Quiz() {
  const [phase, setPhase] = useState<Phase>("start");
  const [name, setName] = useState("");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") setShareUrl(window.location.href);
  }, []);

  const total = QUESTIONS.length;
  const q = QUESTIONS[index];

  function start() {
    setIndex(0);
    setScore(0);
    setSelected(null);
    setShowQR(false);
    setPhase("question");
  }

  function pick(choice: number) {
    if (selected !== null) return;
    setSelected(choice);
    if (choice === q.correctIndex) setScore((s) => s + 1);
    setPhase("reveal");
  }

  function next() {
    if (index + 1 < total) {
      setIndex(index + 1);
      setSelected(null);
      setPhase("question");
    } else {
      setPhase("done");
    }
  }

  // ---------- START ----------
  if (phase === "start") {
    return (
      <Shell>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Checkout UX Quiz</h1>
        <p className="mt-3 text-slate-300">Baymard Edition · {total} questions</p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
          placeholder="Your name (optional)"
          className="mt-8 w-full rounded-2xl bg-white/10 px-5 py-4 text-center text-lg font-semibold outline-none ring-2 ring-transparent focus:ring-indigo-400"
        />
        <button
          onClick={start}
          className="mt-3 w-full rounded-2xl bg-indigo-500 px-6 py-5 text-xl font-bold shadow-lg transition hover:bg-indigo-400"
        >
          Start quiz
        </button>

        <ShareToggle showQR={showQR} setShowQR={setShowQR} url={shareUrl} />
      </Shell>
    );
  }

  // ---------- DONE ----------
  if (phase === "done") {
    const pct = Math.round((score / total) * 100);
    const msg =
      pct === 100 ? "Perfect! 🏆" : pct >= 70 ? "Great job! 🎉" : pct >= 40 ? "Not bad! 👍" : "Keep practicing! 💪";
    return (
      <Shell>
        <p className="text-2xl font-semibold text-slate-300">{name ? `${name}, you scored` : "You scored"}</p>
        <p className="mt-2 text-7xl font-extrabold tabular-nums">
          {score}
          <span className="text-3xl text-slate-400">/{total}</span>
        </p>
        <p className="mt-3 text-2xl font-bold">{msg}</p>
        <button
          onClick={start}
          className="mt-8 w-full rounded-2xl bg-indigo-500 px-6 py-4 text-lg font-bold transition hover:bg-indigo-400"
        >
          Play again
        </button>
        <ShareToggle showQR={showQR} setShowQR={setShowQR} url={shareUrl} />
      </Shell>
    );
  }

  // ---------- QUESTION / REVEAL ----------
  const revealing = phase === "reveal";
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-5 px-4 py-6">
      <div className="flex items-center justify-between text-sm font-semibold text-slate-300">
        <span className="rounded-full bg-white/10 px-3 py-1">
          Question {index + 1} of {total}
        </span>
        <span className="tabular-nums">Score {score}</span>
      </div>

      <h2 className="text-center text-2xl font-bold sm:text-3xl">{q.prompt}</h2>

      <div className="grid flex-1 grid-cols-1 gap-3">
        {q.choices.map((c, i) => {
          const isCorrect = i === q.correctIndex;
          const isChosen = i === selected;
          let cls = CHOICE_STYLES[i].bg;
          if (revealing) {
            if (isCorrect) cls = "bg-green-600";
            else if (isChosen) cls = "bg-red-700";
            else cls = "bg-white/10 opacity-50";
          }
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={revealing}
              className={`flex items-center gap-3 rounded-2xl px-5 py-5 text-left text-lg font-bold transition ${cls}`}
            >
              <span className="text-2xl">{CHOICE_STYLES[i].shape}</span>
              <span className="flex-1">
                {LETTERS[i]}. {c}
              </span>
              {revealing && isCorrect && <span className="text-2xl">✓</span>}
              {revealing && isChosen && !isCorrect && <span className="text-2xl">✗</span>}
            </button>
          );
        })}
      </div>

      {revealing && (
        <>
          <div className="rounded-xl bg-indigo-500/20 px-5 py-4 text-center">
            <span className="font-bold">{selected === q.correctIndex ? "Correct! " : "Correct answer: "}</span>
            {selected !== q.correctIndex && (
              <span className="font-semibold">
                {LETTERS[q.correctIndex]}. {q.choices[q.correctIndex]}
              </span>
            )}
            <p className="mt-1 text-sm text-slate-200">💡 {q.funFact}</p>
          </div>
          <button
            onClick={next}
            className="w-full rounded-2xl bg-emerald-500 px-6 py-4 text-lg font-bold transition hover:bg-emerald-400"
          >
            {index + 1 < total ? "Next question" : "See results"}
          </button>
        </>
      )}
    </main>
  );
}

function ShareToggle({
  showQR,
  setShowQR,
  url,
}: {
  showQR: boolean;
  setShowQR: (v: boolean) => void;
  url: string;
}) {
  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <button
        onClick={() => setShowQR(!showQR)}
        className="text-sm font-semibold text-indigo-300 underline-offset-4 hover:underline"
      >
        {showQR ? "Hide QR code" : "Show QR code to share"}
      </button>
      {showQR && url && (
        <div className="flex flex-col items-center gap-2">
          <QRDisplay url={url} size={180} />
          <p className="max-w-xs break-all text-center text-xs text-slate-400">{url}</p>
        </div>
      )}
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 py-12 text-center">
      {children}
    </main>
  );
}
