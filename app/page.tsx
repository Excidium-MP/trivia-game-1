"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { QUIZZES } from "@/lib/questions";
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
    return <main className="flex min-h-screen items-center justify-center text-slate-400">Loading…</main>;
  }

  if (!session) {
    return <LoginScreen onLogin={login} />;
  }

  return (
    <div className="relative">
      <header className="absolute right-0 top-0 z-10 flex items-center gap-3 p-4 text-sm">
        <span className="text-slate-400">
          {session.username}
          {session.isAdmin ? " (admin)" : ""}
        </span>
        <button
          onClick={() => {
            setScreen("home");
            logout();
          }}
          className="rounded-lg bg-white/10 px-3 py-1 font-semibold text-slate-200 hover:bg-white/20"
        >
          Log out
        </button>
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
