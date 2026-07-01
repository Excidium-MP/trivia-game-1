"use client";

import { useState } from "react";
import { STORY, STORY_STATS, type MockRow, type StoryCard } from "@/lib/story";
import { HoverButton, HoverLink } from "@/components/AriesUI";

type View = "before" | "after";

export function StoryScreen({
  onBack,
  onStartTrivia,
}: {
  onBack: () => void;
  onStartTrivia: () => void;
}) {
  const [views, setViews] = useState<Record<string, View>>({});

  function setView(key: string, v: View) {
    setViews((prev) => ({ ...prev, [key]: v }));
  }
  function setAll(v: View) {
    setViews(Object.fromEntries(STORY.map((c) => [c.key, v])));
  }

  return (
    <main
      style={{
        position: "relative",
        zIndex: 5,
        maxWidth: 840,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 24,
        padding: "6px 22px 110px",
      }}
    >
      {/* Intro */}
      <div style={{ textAlign: "center", animation: "ariesRise .45s ease both" }}>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".28em", color: "#BF1B76" }}>
          STEP 1 · THE STORY
        </span>
        <h1 style={{ margin: "12px 0 0", fontSize: 40, fontWeight: 700, letterSpacing: "-0.02em", color: "#1F2D6B" }}>
          Before &amp; After: Checkout UX
        </h1>
        <p
          style={{
            margin: "14px auto 0",
            maxWidth: 560,
            color: "#6B6480",
            fontSize: 15.5,
            lineHeight: 1.55,
            fontWeight: 500,
          }}
        >
          Flip each card between the friction version and the research-backed fix. Ask the room “what
          feels wrong here?” before revealing the after.
        </p>
        <div style={{ marginTop: 22, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
          {STORY_STATS.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "#fff",
                border: "1px solid #EEE9F3",
                borderRadius: 15,
                padding: "12px 20px",
                textAlign: "center",
                boxShadow: "0 8px 22px -16px rgba(31,45,107,0.5)",
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 700, color: "#BF1B76", letterSpacing: "-0.01em" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 11.5, fontWeight: 500, color: "#9B93A8", marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <HoverButton
            onClick={() => setAll("before")}
            base={{
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 13,
              fontWeight: 600,
              color: "#C22F55",
              background: "#FBEAEF",
              border: "1px solid #F3CFDA",
              borderRadius: 999,
              padding: "9px 16px",
            }}
            hover={{ background: "#F7DBE3" }}
          >
            All “Before”
          </HoverButton>
          <HoverButton
            onClick={() => setAll("after")}
            base={{
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 13,
              fontWeight: 600,
              color: "#0E7D66",
              background: "#E4F4F0",
              border: "1px solid #C1E6DD",
              borderRadius: 999,
              padding: "9px 16px",
            }}
            hover={{ background: "#D5EEE7" }}
          >
            All “After”
          </HoverButton>
        </div>
        <HoverButton
          onClick={onBack}
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
          ← Home
        </HoverButton>
      </div>

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {STORY.map((card) => (
          <StoryCardView
            key={card.key}
            card={card}
            view={views[card.key] ?? "before"}
            onSetView={(v) => setView(card.key, v)}
          />
        ))}
      </div>

      {/* Business case footer */}
      <div
        style={{
          borderRadius: 22,
          background: "linear-gradient(135deg,#F3E8F0,#EAECF7)",
          border: "1px solid #EAE0EC",
          padding: "30px 28px",
          textAlign: "center",
        }}
      >
        <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1F2D6B" }}>
          The one-line business case
        </h3>
        <p style={{ margin: "12px auto 0", maxWidth: 600, fontSize: 14.5, lineHeight: 1.6, color: "#5A5470", fontWeight: 500 }}>
          “Checkout UX investment is <strong style={{ color: "#BF1B76" }}>revenue recovery</strong>, not
          cosmetic design — we remove the barriers that stop high-intent users from finishing a
          purchase they already started.”
        </p>
        <p style={{ margin: "10px auto 0", maxWidth: 600, fontSize: 13.5, color: "#8A8398", fontWeight: 500 }}>
          On 1M monthly sessions at £100 AOV, lifting conversion 2.00% → 2.02% ≈{" "}
          <strong style={{ color: "#1F2D6B" }}>£240,000/yr</strong> in found money.
        </p>
        <div style={{ marginTop: 22, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
          <HoverButton
            onClick={onStartTrivia}
            base={{
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 16,
              fontWeight: 600,
              color: "#fff",
              background: "#12967A",
              border: "none",
              borderRadius: 14,
              padding: "15px 24px",
              boxShadow: "0 14px 30px -14px rgba(18,150,122,0.8)",
            }}
            hover={{ background: "#0E7D66" }}
          >
            Now test the team → Start Trivia
          </HoverButton>
          <HoverButton
            onClick={onBack}
            base={{
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 16,
              fontWeight: 600,
              color: "#1F2D6B",
              background: "#fff",
              border: "1.5px solid #E4DFEC",
              borderRadius: 14,
              padding: "15px 24px",
            }}
            hover={{ border: "1.5px solid #29348F", color: "#29348F" }}
          >
            Back to home
          </HoverButton>
        </div>
      </div>
    </main>
  );
}

// ============================================================
// One story card
// ============================================================

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
    <div
      style={{
        background: "#fff",
        border: "1px solid #EEE9F3",
        borderRadius: 22,
        overflow: "hidden",
        boxShadow: "0 16px 44px -28px rgba(31,45,107,0.4)",
      }}
    >
      {/* header */}
      <div style={{ padding: "22px 22px 0" }}>
        <span
          style={{
            display: "inline-block",
            background: "#F1EAF3",
            color: "#96155B",
            fontSize: 11.5,
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: 7,
            letterSpacing: "0.01em",
          }}
        >
          {card.guideline}
        </span>
        <h2 style={{ margin: "12px 0 0", fontSize: 21, fontWeight: 700, letterSpacing: "-0.01em", color: "#1F2D6B" }}>
          {card.title}
        </h2>
        <p style={{ margin: "7px 0 0", fontSize: 14, lineHeight: 1.5, color: "#6B6480", fontWeight: 500 }}>
          {card.lede}
        </p>
        <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14 }}>
          <div style={{ display: "inline-flex", background: "#F1EEF5", borderRadius: 999, padding: 4 }}>
            <button
              onClick={() => onSetView("before")}
              style={{
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: 700,
                border: "none",
                borderRadius: 999,
                padding: "7px 18px",
                background: before ? "#D8446A" : "transparent",
                color: before ? "#fff" : "#9B93A8",
              }}
            >
              Before
            </button>
            <button
              onClick={() => onSetView("after")}
              style={{
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: 700,
                border: "none",
                borderRadius: 999,
                padding: "7px 18px",
                background: before ? "transparent" : "#12967A",
                color: before ? "#9B93A8" : "#fff",
              }}
            >
              After
            </button>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: before ? "#C22F55" : "#0E7D66" }}>
            {before ? "✕ Friction version" : "✓ Research-backed fix"}
          </span>
        </div>
      </div>

      {/* mock phone */}
      <div style={{ padding: "20px 22px" }}>
        <div
          style={{
            maxWidth: 310,
            margin: "0 auto",
            background: "#fff",
            border: "1px solid #E7E2EE",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 12px 30px -18px rgba(31,45,107,0.45)",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#1F2D6B",
              color: "#fff",
              padding: "9px 14px",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            <span style={{ position: "absolute", left: 14, fontWeight: 800, opacity: 0.8 }}>5B</span>
            <span>Secure Checkout 🔒</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: 16 }}>
            {rows.map((row, i) => (
              <MockRowView key={i} row={row} />
            ))}
          </div>
        </div>
      </div>

      {/* why */}
      <div style={{ padding: "0 22px 22px" }}>
        <div
          style={{
            borderRadius: 15,
            border: `1px solid ${before ? "#F1D3DE" : "#C6E7DF"}`,
            background: before ? "#FBEEF2" : "#E9F5F1",
            padding: "16px 18px",
          }}
        >
          <p style={{ margin: 0, display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 700, color: "#1F2D6B" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: before ? "#D8446A" : "#12967A" }} />
            {before ? "Why this hurts" : "Why this works"}
          </p>
          <p style={{ margin: "8px 0 0", fontSize: 13.5, lineHeight: 1.5, color: "#5A5470", fontWeight: 500 }}>
            {before ? card.whyBefore : card.whyAfter}
          </p>
          <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 7 }}>
            {card.refs.map((ref) => (
              <HoverLink
                key={ref.url}
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                base={{
                  textDecoration: "none",
                  background: "#EEF0FA",
                  color: "#29348F",
                  fontSize: 11.5,
                  fontWeight: 600,
                  padding: "5px 10px",
                  borderRadius: 7,
                }}
                hover={{ background: "#E0E4F5" }}
              >
                {ref.label} ↗
              </HoverLink>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: "#9B93A8", fontWeight: 500 }}>
            {card.relatedTrivia.length > 0 ? (
              <span>
                🧠 Comes up in the trivia:{" "}
                <strong style={{ color: "#BF1B76" }}>
                  {card.relatedTrivia.map((n) => `Q${n}`).join(", ")}
                </strong>
              </span>
            ) : (
              <span style={{ fontStyle: "italic" }}>Bonus concept — not directly asked in the quiz.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Mock checkout row renderer
// ============================================================

function MockRowView({ row }: { row: MockRow }) {
  switch (row.t) {
    case "steps":
      return (
        <div style={{ display: "flex", gap: 5 }}>
          {row.steps.map((s, i) => {
            const st =
              s.state === "done"
                ? { bg: "#1F2D6B", color: "#fff" }
                : s.state === "now"
                  ? { bg: "#BF1B76", color: "#fff" }
                  : { bg: "#F1EEF5", color: "#9B93A8" };
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  textAlign: "center",
                  borderRadius: 6,
                  padding: "6px 3px",
                  fontSize: 9.5,
                  fontWeight: 700,
                  background: st.bg,
                  color: st.color,
                }}
              >
                {s.label}
              </div>
            );
          })}
        </div>
      );

    case "field": {
      const style =
        row.state === "error"
          ? { border: "#D8446A", bg: "#FCECF0", color: "#C22F55" }
          : row.state === "cleared"
            ? { border: "#E7E2EE", bg: "#FBFAFC", color: "#B4AEC0" }
            : { border: "#E4DFEC", bg: "#fff", color: "#1F2D6B" };
      return (
        <div>
          <div style={{ marginBottom: 4, fontSize: 10.5, fontWeight: 700, color: "#6B6480" }}>{row.label}</div>
          <div
            style={{
              borderRadius: 9,
              border: `1px solid ${style.border}`,
              background: style.bg,
              color: style.color,
              padding: "9px 11px",
              fontSize: 12.5,
              fontWeight: 500,
            }}
          >
            {row.value || " "}
          </div>
        </div>
      );
    }

    case "button": {
      const style =
        row.variant === "pay"
          ? { bg: "#12967A", color: "#fff", border: "none" }
          : row.variant === "ghost"
            ? { bg: "#fff", color: "#1F2D6B", border: "1.5px solid #1F2D6B" }
            : { bg: "#BF1B76", color: "#fff", border: "none" };
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            borderRadius: 10,
            padding: "10px 12px",
            fontSize: 12.5,
            fontWeight: 800,
            background: style.bg,
            color: style.color,
            border: style.border,
          }}
        >
          {row.label}
          {row.badge && (
            <span
              style={{
                background: "#F6E3BC",
                color: "#8A6008",
                fontSize: 9.5,
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: 5,
              }}
            >
              {row.badge}
            </span>
          )}
        </div>
      );
    }

    case "msg": {
      const style =
        row.tone === "bad"
          ? { bg: "#FBEAEF", color: "#C22F55", border: "#F3CFDA" }
          : row.tone === "good"
            ? { bg: "#E4F4F0", color: "#0E7D66", border: "#C1E6DD" }
            : { bg: "#EAEDF8", color: "#29348F", border: "#CFD6EF" };
      return (
        <div
          style={{
            borderRadius: 9,
            border: `1px solid ${style.border}`,
            background: style.bg,
            color: style.color,
            padding: "9px 11px",
            fontSize: 11.5,
            fontWeight: 600,
            lineHeight: 1.4,
          }}
        >
          {row.text}
        </div>
      );
    }

    case "note":
      return (
        <p style={{ margin: 0, textAlign: "center", fontSize: 11, fontStyle: "italic", color: "#9B93A8" }}>
          {row.text}
        </p>
      );

    case "check":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 600, color: "#6B6480" }}>
          <span
            style={{
              width: 17,
              height: 17,
              borderRadius: 5,
              background: "#1F2D6B",
              color: "#fff",
              fontSize: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✓
          </span>
          {row.label}
        </div>
      );

    case "summary":
      return (
        <div style={{ border: "1px dashed #D6CFE0", borderRadius: 10, padding: 12 }}>
          {row.items.map((it, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
              <span style={{ color: it.surprise ? "#C22F55" : "#6B6480", fontWeight: it.surprise ? 700 : 500 }}>
                {it.label}
              </span>
              <span style={{ color: it.surprise ? "#C22F55" : "#1F2D6B", fontWeight: 700 }}>{it.value}</span>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "1px solid #E7E2EE",
              paddingTop: 8,
              marginTop: 2,
              fontSize: 14,
              fontWeight: 800,
              color: "#1F2D6B",
            }}
          >
            <span>Total</span>
            <span>{row.total}</span>
          </div>
        </div>
      );

    case "suggest":
      return (
        <div style={{ border: "1px solid #E4DFEC", borderRadius: 10, overflow: "hidden" }}>
          {row.items.map((s, i) => (
            <div key={i} style={{ padding: "9px 11px", fontSize: 12, color: "#6B6480", borderTop: "1px solid #F1EEF5" }}>
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
      const keyStyle: React.CSSProperties = row.numeric
        ? { height: 34, minWidth: 46, fontSize: 15, padding: "0 6px" }
        : { height: 30, minWidth: 22, fontSize: 11, padding: "0 5px" };
      return (
        <div style={{ borderTop: "1px solid #EEE9F3", paddingTop: 9 }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 4 }}>
              {r.map((k) => (
                <span
                  key={k}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#EDEAF2",
                    color: "#6B6480",
                    borderRadius: 5,
                    fontWeight: 700,
                    ...keyStyle,
                  }}
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
