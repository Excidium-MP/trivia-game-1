"use client";

import type { Session } from "@/lib/auth";
import { QUIZZES } from "@/lib/questions";
import { HoverButton } from "@/components/AriesUI";

export function HomeScreen({
  session,
  onStart,
  onViewStory,
}: {
  session: Session;
  onStart: () => void;
  onViewStory: () => void;
}) {
  const quiz = QUIZZES[0];
  return (
    <main
      style={{
        position: "relative",
        zIndex: 5,
        minHeight: "calc(100vh - 78px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "0 32px 60px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
          maxWidth: 520,
          animation: "ariesRise .5s ease both",
        }}
      >
        <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: ".3em", color: "#BF1B76" }}>
          TEAM TRIVIA
        </span>
        <h1
          style={{
            margin: 0,
            fontSize: 56,
            lineHeight: 1.02,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#1F2D6B",
          }}
        >
          Ready to
          <br />
          play?
        </h1>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "#fff",
            border: "1px solid #EAE5F0",
            borderRadius: 999,
            padding: "10px 18px",
            boxShadow: "0 8px 24px -14px rgba(31,45,107,0.4)",
          }}
        >
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#12967A" }} />
          <span style={{ fontSize: 15, fontWeight: 600, color: "#1F2D6B" }}>{quiz.title}</span>
        </div>

        {session.isAdmin ? (
          <div
            style={{
              marginTop: 6,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              width: "100%",
              maxWidth: 360,
            }}
          >
            <HoverButton
              onClick={onViewStory}
              base={{
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 18,
                fontWeight: 600,
                color: "#fff",
                background: "#BF1B76",
                border: "none",
                borderRadius: 16,
                padding: 19,
                boxShadow: "0 18px 40px -14px rgba(191,27,118,0.85)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
              hover={{ background: "#A5165F" }}
            >
              <span style={{ fontSize: 18 }}>📖</span> View the Story{" "}
              <span style={{ fontWeight: 500, opacity: 0.85, fontSize: 15 }}>· Before &amp; After</span>
            </HoverButton>
            <HoverButton
              onClick={onStart}
              base={{
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 18,
                fontWeight: 600,
                color: "#1F2D6B",
                background: "#fff",
                border: "1.5px solid #E4DFEC",
                borderRadius: 16,
                padding: 19,
                boxShadow: "0 10px 30px -18px rgba(31,45,107,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
              hover={{ border: "1.5px solid #29348F", color: "#29348F" }}
            >
              <span style={{ fontSize: 18 }}>🧠</span> Start the Trivia
            </HoverButton>
            <p style={{ margin: "4px 0 0", color: "#9B93A8", fontSize: 13, fontWeight: 500 }}>
              Recommended: walk the team through the story first, then run the quiz.
            </p>
          </div>
        ) : (
          <div
            style={{
              marginTop: 6,
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "#fff",
              border: "1px solid #EAE5F0",
              borderRadius: 16,
              padding: "20px 26px",
              color: "#6B6480",
              fontSize: 15,
              fontWeight: 500,
              boxShadow: "0 8px 24px -16px rgba(31,45,107,0.4)",
            }}
          >
            <span style={{ display: "inline-flex", gap: 4 }}>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#BF1B76",
                  animation: "ariesPop 1s ease infinite alternate",
                }}
              />
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#BF1B76",
                  opacity: 0.6,
                  animation: "ariesPop 1s ease .2s infinite alternate",
                }}
              />
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#BF1B76",
                  opacity: 0.3,
                  animation: "ariesPop 1s ease .4s infinite alternate",
                }}
              />
            </span>
            Waiting for the host to start the game…
          </div>
        )}
      </div>
    </main>
  );
}
