"use client";

import { useState } from "react";
import { STORY, STORY_STATS, type MockRow, type StoryCard } from "@/lib/story";

type View = "before" | "after";

export function StoryScreen({
  onBack,
  onStartTrivia,
}: {
  onBack: () => void;
  onStartTrivia: () => void;
}) {
  // per-card view state, keyed by card.key; default "before"
  const [views, setViews] = useState<Record<string, View>>({});

  function setView(key: string, v: View) {
    setViews((prev) => ({ ...prev, [key]: v }));
  }
  function setAll(v: View) {
    setViews(Object.fromEntries(STORY.map((c) => [c.key, v])));
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-4 pb-16 pt-16">
      {/* Intro */}
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-indigo-300">
          Step 1 · The Story
        </p>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Before &amp; After: Checkout UX</h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-300">
          Flip each card between the friction version and the research-backed fix. Ask the room
          &ldquo;what feels wrong here?&rdquo; before revealing the after.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {STORY_STATS.map((s) => (
            <div key={s.label} className="rounded-xl bg-white/5 px-4 py-2 text-center">
              <div className="text-xl font-extrabold">{s.value}</div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Global controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setAll("before")}
            className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/20"
          >
            All “Before”
          </button>
          <button
            onClick={() => setAll("after")}
            className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/20"
          >
            All “After”
          </button>
        </div>
        <button onClick={onBack} className="text-sm font-semibold text-slate-400 hover:text-slate-200">
          ← Home
        </button>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-5">
        {STORY.map((card) => (
          <StoryCardView
            key={card.key}
            card={card}
            view={views[card.key] ?? "before"}
            onSetView={(v) => setView(card.key, v)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 rounded-2xl bg-indigo-500/10 p-6 text-center">
        <h3 className="text-lg font-bold">The one-line business case</h3>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-300">
          &ldquo;Checkout UX investment is <strong>revenue recovery</strong>, not cosmetic design —
          we remove the barriers that stop high-intent users from finishing a purchase they already
          started.&rdquo;
        </p>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
          On 1M monthly sessions at £100 AOV, lifting conversion 2.00% → 2.02% ≈{" "}
          <strong>£240,000/yr</strong> in found money.
        </p>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={onStartTrivia}
            className="rounded-2xl bg-emerald-500 px-6 py-3 text-lg font-bold transition hover:bg-emerald-400"
          >
            Now test the team → Start Trivia
          </button>
          <button
            onClick={onBack}
            className="rounded-2xl bg-white/10 px-6 py-3 text-lg font-bold text-slate-200 transition hover:bg-white/20"
          >
            Back to home
          </button>
        </div>
      </div>
    </main>
  );
}

function StoryCardView({
  card,
  view,
  onSetView,
}: {
  card: StoryCard;
  view: View;
  onSetView: (v: View) => void;
}) {
  const before = view === "before";
  const rows = before ? card.before : card.after;
  return (
    <div className="overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
      <div className="p-5">
        <span className="inline-block rounded-md bg-indigo-500/20 px-2 py-0.5 text-xs font-bold text-indigo-200">
          {card.guideline}
        </span>
        <h2 className="mt-2 text-xl font-bold">{card.title}</h2>
        <p className="mt-1 text-sm text-slate-300">{card.lede}</p>

        {/* toggle */}
        <div className="mt-4 flex items-center gap-3">
          <div className="inline-flex rounded-full bg-slate-800 p-1">
            <button
              onClick={() => onSetView("before")}
              className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
                before ? "bg-red-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Before
            </button>
            <button
              onClick={() => onSetView("after")}
              className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
                !before ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              After
            </button>
          </div>
          <span className={`text-sm font-bold ${before ? "text-red-400" : "text-emerald-400"}`}>
            {before ? "✕ Friction version" : "✓ Research-backed fix"}
          </span>
        </div>
      </div>

      {/* mock phone */}
      <div className="px-5">
        <div className="mx-auto max-w-xs overflow-hidden rounded-2xl bg-white text-slate-900 ring-1 ring-black/10">
          <div className="flex items-center justify-center bg-slate-900 px-4 py-2 text-xs font-bold text-white">
            <span className="absolute left-9 font-extrabold">5B</span>
            Secure Checkout 🔒
          </div>
          <div className="flex flex-col gap-2.5 p-4">
            {rows.map((row, i) => (
              <MockRowView key={i} row={row} />
            ))}
          </div>
        </div>
      </div>

      {/* why */}
      <div className="p-5">
        <div
          className={`rounded-xl p-4 ring-1 ${
            before ? "bg-red-500/10 ring-red-500/20" : "bg-emerald-500/10 ring-emerald-500/20"
          }`}
        >
          <p className="text-sm font-bold">
            {before ? "🔴 Why this hurts" : "🟢 Why this works"}
          </p>
          <p className="mt-1 text-sm text-slate-200">{before ? card.whyBefore : card.whyAfter}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {card.refs.map((r) => (
              <a
                key={r.url}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-white/10 px-2 py-1 text-xs font-semibold text-indigo-200 hover:bg-white/20"
              >
                {r.label} ↗
              </a>
            ))}
          </div>

          <div className="mt-3 text-xs text-slate-400">
            {card.relatedTrivia.length > 0 ? (
              <span>
                🧠 Comes up in the trivia:{" "}
                <strong className="text-amber-300">
                  {card.relatedTrivia.map((n) => `Q${n}`).join(", ")}
                </strong>
              </span>
            ) : (
              <span className="italic">💡 Bonus concept — not directly asked in the quiz.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- mock row renderer ---------------- */

function MockRowView({ row }: { row: MockRow }) {
  switch (row.t) {
    case "steps":
      return (
        <div className="flex gap-1">
          {row.steps.map((s, i) => (
            <div
              key={i}
              className={`flex-1 rounded px-1 py-1.5 text-center text-[10px] font-bold ${
                s.state === "done"
                  ? "bg-slate-900 text-white"
                  : s.state === "now"
                    ? "bg-indigo-500 text-white"
                    : "bg-slate-100 text-slate-400"
              }`}
            >
              {s.label}
            </div>
          ))}
        </div>
      );

    case "field": {
      const ring =
        row.state === "error"
          ? "border-red-500 bg-red-50"
          : row.state === "cleared"
            ? "border-slate-200 text-slate-400"
            : "border-slate-300";
      return (
        <div>
          <div className="mb-1 text-[11px] font-bold text-slate-600">{row.label}</div>
          <div className={`rounded-lg border px-3 py-2 text-[13px] ${ring}`}>
            {row.value ?? " "}
          </div>
        </div>
      );
    }

    case "button": {
      const cls =
        row.variant === "ghost"
          ? "border border-slate-900 bg-white text-slate-900"
          : row.variant === "pay"
            ? "bg-emerald-600 text-white"
            : "bg-slate-900 text-white";
      return (
        <div className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[13px] font-extrabold ${cls}`}>
          {row.label}
          {row.badge && (
            <span className="rounded bg-amber-200 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
              {row.badge}
            </span>
          )}
        </div>
      );
    }

    case "msg": {
      const tone =
        row.tone === "bad"
          ? "bg-red-50 text-red-700 border-red-200"
          : row.tone === "good"
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-indigo-50 text-indigo-700 border-indigo-200";
      return <div className={`rounded-lg border px-3 py-2 text-[12px] font-semibold ${tone}`}>{row.text}</div>;
    }

    case "note":
      return <p className="text-center text-[11px] italic text-slate-400">{row.text}</p>;

    case "check":
      return (
        <label className="flex items-center gap-2 text-[12px] font-semibold text-slate-600">
          <span className="flex h-4 w-4 items-center justify-center rounded border border-slate-400 bg-slate-900 text-[9px] text-white">
            ✓
          </span>
          {row.label}
        </label>
      );

    case "summary":
      return (
        <div className="rounded-lg border border-dashed border-slate-300 p-3 text-[12px]">
          {row.items.map((it, i) => (
            <div key={i} className="mb-1.5 flex justify-between">
              <span className={it.surprise ? "font-bold text-red-600" : "text-slate-500"}>{it.label}</span>
              <span className={it.surprise ? "font-bold text-red-600" : "font-bold text-slate-800"}>{it.value}</span>
            </div>
          ))}
          <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 text-[14px] font-extrabold">
            <span>Total</span>
            <span>{row.total}</span>
          </div>
        </div>
      );

    case "suggest":
      return (
        <div className="overflow-hidden rounded-lg border border-slate-300">
          {row.items.map((s, i) => (
            <div key={i} className="border-t border-slate-100 px-3 py-2 text-[12px] text-slate-600 first:border-t-0">
              {s}
            </div>
          ))}
        </div>
      );

    case "keyboard": {
      const rows = row.numeric
        ? [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], ["0"]]
        : [
            ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
            ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
            ["Z", "X", "C", "V", "B", "N", "M"],
          ];
      return (
        <div className="mt-1 border-t border-slate-200 pt-2">
          {rows.map((r, i) => (
            <div key={i} className="mb-1 flex justify-center gap-1">
              {r.map((k) => (
                <span
                  key={k}
                  className={`rounded bg-slate-200 text-center font-bold text-slate-600 ${
                    row.numeric ? "h-8 w-12 leading-8 text-[15px]" : "w-6 py-1.5 text-[11px]"
                  }`}
                >
                  {k}
                </span>
              ))}
            </div>
          ))}
        </div>
      );
    }

    default:
      return null;
  }
}
