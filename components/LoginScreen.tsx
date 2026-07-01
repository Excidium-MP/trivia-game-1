"use client";

import { useState } from "react";
import { AriesBackdrop } from "@/components/AriesBackdrop";
import { FocusInput, HoverButton } from "@/components/AriesUI";

export function LoginScreen({ onLogin }: { onLogin: (u: string, p: string) => boolean }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password || !onLogin(username, password)) setError(true);
  }

  const inputBase: React.CSSProperties = {
    width: "100%",
    fontFamily: "inherit",
    fontSize: 16,
    fontWeight: 500,
    textAlign: "center",
    color: "#1F2D6B",
    background: "#fff",
    border: "1.5px solid #E4DFEC",
    borderRadius: 14,
    padding: "16px 18px",
    outline: "none",
  };

  return (
    <div style={{ position: "relative", overflow: "hidden", minHeight: "100vh" }}>
      <AriesBackdrop />
      <main
        style={{
          position: "relative",
          zIndex: 5,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          padding: 32,
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
            animation: "ariesRise .5s ease both",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/aries-logo.png" alt="Aries" style={{ height: 96, width: "auto" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ height: 1, width: 26, background: "#C9C2D6" }} />
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".32em", color: "#BF1B76" }}>
              QUIZ NIGHT
            </span>
            <span style={{ height: 1, width: 26, background: "#C9C2D6" }} />
          </div>
        </div>

        <form
          onSubmit={submit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            width: "100%",
            maxWidth: 360,
            animation: "ariesRise .6s ease both",
          }}
        >
          <FocusInput
            base={inputBase}
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError(false);
            }}
            placeholder="Username"
            autoCapitalize="none"
          />
          <FocusInput
            base={inputBase}
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Password"
          />
          <HoverButton
            type="submit"
            base={{
              marginTop: 4,
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 17,
              fontWeight: 600,
              color: "#fff",
              background: "#BF1B76",
              border: "none",
              borderRadius: 14,
              padding: 17,
              boxShadow: "0 14px 30px -12px rgba(191,27,118,0.8)",
            }}
            hover={{ background: "#A5165F" }}
          >
            Sign in
          </HoverButton>
          {error && (
            <p style={{ margin: "2px 0 0", color: "#C81E5A", fontSize: 14, fontWeight: 500 }}>
              Wrong username or password.
            </p>
          )}
          <p style={{ margin: "6px 0 0", color: "#9B93A8", fontSize: 12.5 }}>
            Sign in with your Quiz Night credentials to host.
          </p>
        </form>
      </main>
    </div>
  );
}
