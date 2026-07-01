"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { QUIZZES } from "@/lib/questions";
import { AriesBackdrop } from "@/components/AriesBackdrop";
import { HoverButton } from "@/components/AriesUI";
import { LoginScreen } from "@/components/LoginScreen";
import { HomeScreen } from "@/components/HomeScreen";
import { StoryScreen } from "@/components/StoryScreen";
import { SetupScreen } from "@/components/SetupScreen";
import { QuizRunner } from "@/components/QuizRunner";

type Screen = "home" | "story" | "setup" | "running";

export default function App() {
  const { session, ready, login, logout } = useAuth();
  const [screen, setScreen] = useState<Screen>("home");
  const [players, setPlayers] = useState<string[]>([]);

  if (!ready) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#9B93A8",
          fontWeight: 500,
        }}
      >
        Loading…
      </main>
    );
  }

  if (!session) {
    return <LoginScreen onLogin={login} />;
  }

  const userLabel = session.username + (session.isAdmin ? " · host" : "");

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        color: "#1F2D6B",
      }}
    >
      <AriesBackdrop />

      <header
        style={{
          position: "relative",
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "22px 30px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/aries-logo.png" alt="Aries" style={{ height: 34, width: "auto" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: "#6B6480" }}>{userLabel}</span>
          <HoverButton
            onClick={() => {
              setScreen("home");
              logout();
            }}
            base={{
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              background: "#fff",
              color: "#1F2D6B",
              fontWeight: 600,
              fontSize: 14,
              padding: "9px 16px",
              borderRadius: 11,
              boxShadow: "0 4px 14px -6px rgba(31,45,107,0.3)",
            }}
            hover={{ background: "#1F2D6B", color: "#fff" }}
          >
            Log out
          </HoverButton>
        </div>
      </header>

      {screen === "home" && (
        <HomeScreen
          session={session}
          onStart={() => setScreen("setup")}
          onViewStory={() => setScreen("story")}
        />
      )}

      {screen === "story" && (
        <StoryScreen onBack={() => setScreen("home")} onStartTrivia={() => setScreen("setup")} />
      )}

      {screen === "setup" && (
        <SetupScreen
          onCancel={() => setScreen("home")}
          onStart={(p) => {
            setPlayers(p);
            setScreen("running");
          }}
        />
      )}

      {screen === "running" && (
        <QuizRunner quiz={QUIZZES[0]} players={players} onExit={() => setScreen("home")} />
      )}
    </div>
  );
}
