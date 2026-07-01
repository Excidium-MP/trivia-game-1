"use client";

import { useState } from "react";
import { QUIZZES } from "@/lib/questions";
import { FocusInput, HoverButton } from "@/components/AriesUI";

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
    <main
      style={{
        position: "relative",
        zIndex: 5,
        maxWidth: 480,
        margin: "0 auto",
        minHeight: "calc(100vh - 78px)",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        padding: "8px 28px 40px",
      }}
    >
      <div style={{ textAlign: "center", animation: "ariesRise .45s ease both" }}>
        <h1 style={{ margin: 0, fontSize: 34, fontWeight: 700, letterSpacing: "-0.02em", color: "#1F2D6B" }}>
          Who&apos;s playing?
        </h1>
        <p style={{ margin: "8px 0 0", color: "#6B6480", fontSize: 15, fontWeight: 500 }}>{quiz.title}</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {players.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                flexShrink: 0,
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "#F1EAF3",
                color: "#BF1B76",
                fontWeight: 700,
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {i + 1}
            </span>
            <FocusInput
              base={{
                flex: 1,
                minWidth: 0,
                fontFamily: "inherit",
                fontSize: 16,
                fontWeight: 600,
                color: "#1F2D6B",
                background: "#fff",
                border: "1.5px solid #E4DFEC",
                borderRadius: 13,
                padding: "13px 16px",
                outline: "none",
              }}
              value={p}
              onChange={(e) => update(i, e.target.value)}
              placeholder={`Player ${i + 1}`}
              maxLength={24}
            />
            {players.length > 1 && (
              <HoverButton
                onClick={() => remove(i)}
                aria-label="Remove player"
                base={{
                  flexShrink: 0,
                  width: 44,
                  height: 44,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#9B93A8",
                  background: "#fff",
                  border: "1.5px solid #E4DFEC",
                  borderRadius: 13,
                }}
                hover={{ border: "1.5px solid #C81E5A", color: "#C81E5A" }}
              >
                ✕
              </HoverButton>
            )}
          </div>
        ))}
      </div>

      <HoverButton
        onClick={add}
        base={{
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: 15,
          fontWeight: 600,
          color: "#8A5C77",
          background: "transparent",
          border: "1.5px dashed #D6BFCF",
          borderRadius: 13,
          padding: 14,
        }}
        hover={{ border: "1.5px dashed #BF1B76", color: "#BF1B76" }}
      >
        + Add player
      </HoverButton>

      {hasDupes && (
        <p style={{ margin: 0, textAlign: "center", color: "#D08A00", fontSize: 14, fontWeight: 600 }}>
          Player names must be unique.
        </p>
      )}

      <div
        style={{
          marginTop: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          paddingTop: 14,
        }}
      >
        <button
          onClick={() => onStart(cleaned)}
          disabled={!canStart}
          style={{
            cursor: canStart ? "pointer" : "default",
            fontFamily: "inherit",
            fontSize: 17,
            fontWeight: 600,
            color: "#fff",
            background: canStart ? "#12967A" : "#BBB4C6",
            border: "none",
            borderRadius: 15,
            padding: 17,
            opacity: canStart ? 1 : 0.6,
            boxShadow: "0 14px 30px -14px rgba(18,150,122,0.8)",
          }}
        >
          Start quiz
        </button>
        <HoverButton
          onClick={onCancel}
          base={{
            cursor: "pointer",
            fontFamily: "inherit",
            background: "none",
            border: "none",
            fontSize: 14,
            fontWeight: 600,
            color: "#9B93A8",
          }}
          hover={{ color: "#1F2D6B" }}
        >
          Cancel
        </HoverButton>
      </div>
    </main>
  );
}
