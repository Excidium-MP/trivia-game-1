"use client";

import { useEffect, useState } from "react";
import { ACCOUNTS } from "./users";

export interface Session {
  username: string;
  isAdmin: boolean;
}

const STORAGE_KEY = "ads-quiz-session";

/** Validate credentials against the hardcoded list. Case-insensitive username. */
export function validateLogin(username: string, password: string): Session | null {
  const account = ACCOUNTS.find(
    (a) => a.username.toLowerCase() === username.trim().toLowerCase() && a.password === password,
  );
  return account ? { username: account.username, isAdmin: account.isAdmin } : null;
}

/** Client-side session backed by localStorage. */
export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setSession(JSON.parse(raw));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setReady(true);
  }, []);

  function login(username: string, password: string): boolean {
    const s = validateLogin(username, password);
    if (!s) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    setSession(s);
    return true;
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }

  return { session, ready, login, logout };
}
