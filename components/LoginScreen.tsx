"use client";

import { useState } from "react";

export function LoginScreen({ onLogin }: { onLogin: (u: string, p: string) => boolean }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!onLogin(username, password)) setError(true);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight">ADS Quiz Game</h1>
      <p className="text-slate-300">Sign in to continue</p>
      <form onSubmit={submit} className="flex w-full flex-col gap-3">
        <input
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError(false);
          }}
          placeholder="Username"
          autoCapitalize="none"
          className="w-full rounded-2xl bg-white/10 px-5 py-4 text-center text-lg font-semibold outline-none ring-2 ring-transparent focus:ring-indigo-400"
        />
        <input
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          type="password"
          placeholder="Password"
          className="w-full rounded-2xl bg-white/10 px-5 py-4 text-center text-lg font-semibold outline-none ring-2 ring-transparent focus:ring-indigo-400"
        />
        <button
          type="submit"
          disabled={!username.trim() || !password}
          className="w-full rounded-2xl bg-indigo-500 px-6 py-4 text-lg font-bold transition hover:bg-indigo-400 disabled:opacity-50"
        >
          Sign in
        </button>
        {error && <p className="text-red-400">Wrong username or password.</p>}
      </form>
    </main>
  );
}
