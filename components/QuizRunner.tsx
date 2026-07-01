"use client";

import { useMemo, useState, type CSSProperties } from "react";
import type { Question, Quiz } from "@/lib/questions";
import { CHOICE_STYLES } from "@/lib/ui";
import { HoverButton } from "@/components/AriesUI";

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
    const nextTied = correct.length > 1 && correct.length < tied.length ? correct : tied;
    const next = pickTbQuestion(tbUsed);
    setTied(nextTied);
    setTbUsed(next.used);
    setTbQ(next.index);
    setTbRevealed(false);
    setTbMarked([]);
  }

  // ---------------- RESULTS / CHAMPION ----------------
  if (phase === "results" || phase === "champion") {
    const max = Math.max(...players.map((p) => scores[p]));
    const winners = players.filter((p) => scores[p] === max);
    const isChampion = phase === "champion";
    const draw = !isChampion && winners.length > 1;
    const highlight = isChampion ? (champion ? [champion] : []) : winners;

    return (
      <EndScreen
        label={isChampion ? "Champion" : "Results"}
        showTrophy={isChampion || !draw}
        heading={isChampion ? "We have a champion!" : "Results"}
        winnerLine={
          isChampion
            ? `🏆 ${champion} wins the tiebreaker!`
            : draw
              ? `🤝 It's a draw between ${joinNames(winners)}!`
              : `🏆 ${winners[0]} wins!`
        }
        winnerLineColor={draw ? "#B5730B" : "#12967A"}
        ranked={ranked}
        scores={scores}
        highlight={highlight}
        showTiebreakBtn={draw}
        onStartTiebreak={() => startTiebreak(winners)}
        onExit={onExit}
        exitStyle={
          isChampion
            ? { color: "#fff", background: "#BF1B76", border: "none" }
            : draw
              ? { color: "#fff", background: "#1F2D6B", border: "none" }
              : { color: "#6B6480", background: "#fff", border: "1.5px solid #E4DFEC" }
        }
      />
    );
  }

  // ---------------- TIEBREAK ----------------
  if (phase === "tiebreak") {
    return (
      <QuestionView
        question={quiz.questions[tbQ]}
        revealed={tbRevealed}
        marked={tbMarked}
        markPlayers={tied}
        onToggleMark={(n) => toggle(setTbMarked, n)}
        onReveal={() => setTbRevealed(true)}
        onAdvance={resolveTiebreak}
        onQuit={onExit}
        advanceLabel="Submit round"
        tiebreak={{ tiedNames: joinNames(tied) }}
      />
    );
  }

  // ---------------- PLAYING ----------------
  return (
    <QuestionView
      question={quiz.questions[qIndex]}
      revealed={revealed}
      marked={marked}
      markPlayers={players}
      onToggleMark={(n) => toggle(setMarked, n)}
      onReveal={() => setRevealed(true)}
      onAdvance={nextQuestion}
      onQuit={onExit}
      advanceLabel={qIndex + 1 < total ? "Next question" : "See results"}
      progress={{ qIndex, total }}
    />
  );
}

// ============================================================
// Question / Reveal view (shared by playing + tiebreak)
// ============================================================

function QuestionView({
  question,
  revealed,
  marked,
  markPlayers,
  onToggleMark,
  onReveal,
  onAdvance,
  onQuit,
  advanceLabel,
  progress,
  tiebreak,
}: {
  question: Question;
  revealed: boolean;
  marked: string[];
  markPlayers: string[];
  onToggleMark: (name: string) => void;
  onReveal: () => void;
  onAdvance: () => void;
  onQuit: () => void;
  advanceLabel: string;
  progress?: { qIndex: number; total: number };
  tiebreak?: { tiedNames: string };
}) {
  const isMain = !!progress;

  return (
    <main
      style={{
        position: "relative",
        zIndex: 5,
        maxWidth: 660,
        margin: "0 auto",
        minHeight: "calc(100vh - 78px)",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        padding: "4px 22px 40px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {tiebreak ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#FBEFE0",
              color: "#B5730B",
              fontSize: 13.5,
              fontWeight: 700,
              padding: "8px 15px",
              borderRadius: 999,
            }}
          >
            ⚡ Sudden-death tiebreaker
          </span>
        ) : (
          <span
            style={{
              background: "#fff",
              color: "#1F2D6B",
              fontSize: 13.5,
              fontWeight: 700,
              padding: "8px 15px",
              borderRadius: 999,
              boxShadow: "0 4px 14px -8px rgba(31,45,107,0.4)",
            }}
          >
            Question {progress!.qIndex + 1} of {progress!.total}
          </span>
        )}
        <HoverButton
          onClick={onQuit}
          base={{
            cursor: "pointer",
            fontFamily: "inherit",
            background: "none",
            border: "none",
            fontSize: 14,
            fontWeight: 600,
            color: "#9B93A8",
          }}
          hover={{ color: "#C81E5A" }}
        >
          Quit
        </HoverButton>
      </div>

      {tiebreak && (
        <p style={{ margin: "-4px 0 0", textAlign: "center", color: "#6B6480", fontSize: 14, fontWeight: 500 }}>
          Between {tiebreak.tiedNames}
        </p>
      )}

      {isMain && (
        <div style={{ display: "flex", gap: 6 }}>
          {Array.from({ length: progress!.total }).map((_, i) => (
            <span
              key={i}
              style={{
                flex: 1,
                height: 5,
                borderRadius: 3,
                background:
                  i < progress!.qIndex ? "#12967A" : i === progress!.qIndex ? "#BF1B76" : "#E2DCEB",
              }}
            />
          ))}
        </div>
      )}

      <h2
        style={{
          margin: "6px 0 2px",
          textAlign: "center",
          fontSize: 27,
          lineHeight: 1.28,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          color: "#1F2D6B",
        }}
      >
        {question.prompt}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
        {question.choices.map((text, i) => {
          const correct = i === question.correctIndex;
          const p = CHOICE_STYLES[i];
          let bg: string, color: string, chipBg: string, chipColor: string, shadow: string, shape: string, showCheck: boolean;
          if (!revealed) {
            bg = p.bg;
            color = "#fff";
            chipBg = "rgba(255,255,255,0.22)";
            chipColor = "#fff";
            shadow = `0 10px 24px -16px ${p.bg}`;
            shape = p.shape;
            showCheck = false;
          } else if (correct) {
            bg = "#12967A";
            color = "#fff";
            chipBg = "rgba(255,255,255,0.25)";
            chipColor = "#fff";
            shadow = "0 12px 26px -14px rgba(18,150,122,0.8)";
            shape = "✓";
            showCheck = true;
          } else {
            bg = "#F2EFF5";
            color = "#B4AEC0";
            chipBg = "#E7E2EE";
            chipColor = "#B4AEC0";
            shadow = "none";
            shape = p.shape;
            showCheck = false;
          }
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 15,
                borderRadius: 17,
                padding: "17px 20px",
                fontSize: 16.5,
                fontWeight: 600,
                transition: "all .2s",
                background: bg,
                color,
                boxShadow: shadow,
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  background: chipBg,
                  color: chipColor,
                }}
              >
                {shape}
              </span>
              <span style={{ flex: 1 }}>{text}</span>
              {showCheck && <span style={{ flexShrink: 0, fontSize: 20, fontWeight: 700 }}>✓</span>}
            </div>
          );
        })}
      </div>

      {revealed && (
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            background: "#F3E8F0",
            border: "1px solid #EAD3E1",
            borderRadius: 15,
            padding: "15px 18px",
            color: "#7A2657",
            fontSize: 14,
            fontWeight: 500,
            lineHeight: 1.5,
          }}
        >
          <span style={{ flexShrink: 0, fontSize: 17 }}>💡</span>
          <span>{question.funFact}</span>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 2 }}>
        {!revealed ? (
          <HoverButton
            onClick={onReveal}
            base={{
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 17,
              fontWeight: 600,
              color: "#fff",
              background: "#BF1B76",
              border: "none",
              borderRadius: 15,
              padding: 17,
              boxShadow: "0 14px 30px -14px rgba(191,27,118,0.8)",
            }}
            hover={{ background: "#A5165F" }}
          >
            Reveal answer
          </HoverButton>
        ) : (
          <>
            <div
              style={{
                background: "#fff",
                border: "1px solid #EEE9F3",
                borderRadius: 18,
                padding: 18,
                boxShadow: "0 10px 30px -20px rgba(31,45,107,0.5)",
              }}
            >
              <p style={{ margin: "0 0 13px", textAlign: "center", fontSize: 14.5, fontWeight: 600, color: "#1F2D6B" }}>
                Who got it right?
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 9 }}>
                {markPlayers.map((name) => {
                  const on = marked.includes(name);
                  return (
                    <button
                      key={name}
                      onClick={() => onToggleMark(name)}
                      style={{
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontSize: 14.5,
                        fontWeight: 600,
                        borderRadius: 999,
                        padding: "10px 17px",
                        transition: "all .15s",
                        background: on ? "#12967A" : "#fff",
                        color: on ? "#fff" : "#1F2D6B",
                        border: `1.5px solid ${on ? "#12967A" : "#E4DFEC"}`,
                      }}
                    >
                      {on ? "✓ " : ""}
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>
            <HoverButton
              onClick={onAdvance}
              base={{
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 17,
                fontWeight: 600,
                color: "#fff",
                background: "#12967A",
                border: "none",
                borderRadius: 15,
                padding: 17,
                boxShadow: "0 14px 30px -14px rgba(18,150,122,0.8)",
              }}
              hover={{ background: "#0E7D66" }}
            >
              {advanceLabel}
            </HoverButton>
          </>
        )}
      </div>
    </main>
  );
}

// ============================================================
// Results / Champion scoreboard
// ============================================================

function EndScreen({
  label,
  showTrophy,
  heading,
  winnerLine,
  winnerLineColor,
  ranked,
  scores,
  highlight,
  showTiebreakBtn,
  onStartTiebreak,
  onExit,
  exitStyle,
}: {
  label: string;
  showTrophy: boolean;
  heading: string;
  winnerLine: string;
  winnerLineColor: string;
  ranked: string[];
  scores: Record<string, number>;
  highlight: string[];
  showTiebreakBtn: boolean;
  onStartTiebreak: () => void;
  onExit: () => void;
  exitStyle: CSSProperties;
}) {
  return (
    <main
      data-screen-label={label}
      style={{
        position: "relative",
        zIndex: 5,
        maxWidth: 460,
        margin: "0 auto",
        minHeight: "calc(100vh - 78px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 22,
        padding: "8px 28px 50px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          animation: "ariesPop .5s ease both",
        }}
      >
        {showTrophy && (
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#BF1B76,#29348F)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 42,
              boxShadow: "0 18px 40px -14px rgba(191,27,118,0.7)",
            }}
          >
            🏆
          </div>
        )}
        <h1 style={{ margin: 0, fontSize: 34, fontWeight: 700, letterSpacing: "-0.02em", color: "#1F2D6B" }}>
          {heading}
        </h1>
        <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: winnerLineColor }}>{winnerLine}</p>
      </div>

      <ol
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 9,
        }}
      >
        {ranked.map((name, i) => {
          const hot = highlight.includes(name);
          return (
            <li
              key={name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                justifyContent: "space-between",
                borderRadius: 14,
                padding: "14px 18px",
                fontSize: 16,
                fontWeight: 600,
                background: hot ? "#12967A" : "#fff",
                color: hot ? "#fff" : "#1F2D6B",
                border: `1px solid ${hot ? "#12967A" : "#EEE9F3"}`,
              }}
            >
              <span
                style={{
                  width: 22,
                  textAlign: "center",
                  fontWeight: 700,
                  color: hot ? "rgba(255,255,255,0.75)" : "#B4AEC0",
                }}
              >
                {i + 1}
              </span>
              <span
                style={{
                  flex: 1,
                  textAlign: "left",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {name}
              </span>
              <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 700 }}>{scores[name]}</span>
            </li>
          );
        })}
      </ol>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
        {showTiebreakBtn && (
          <HoverButton
            onClick={onStartTiebreak}
            base={{
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 16.5,
              fontWeight: 600,
              color: "#fff",
              background: "#BF1B76",
              border: "none",
              borderRadius: 15,
              padding: 16,
              boxShadow: "0 14px 30px -14px rgba(191,27,118,0.8)",
            }}
            hover={{ background: "#A5165F" }}
          >
            Start sudden-death tiebreaker
          </HoverButton>
        )}
        <HoverButton
          onClick={onExit}
          base={{
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 16,
            fontWeight: 600,
            borderRadius: 15,
            padding: 15,
            ...exitStyle,
          }}
          hover={{ opacity: 0.85 }}
        >
          Back to home
        </HoverButton>
      </div>
    </main>
  );
}

function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  return names.slice(0, -1).join(", ") + " & " + names[names.length - 1];
}
