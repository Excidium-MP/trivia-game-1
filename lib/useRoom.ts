"use client";

import { useEffect, useRef, useState } from "react";
import type { RoomState } from "./types";

export interface RoomResponse {
  room: RoomState;
  totalQuestions: number;
}

/** Polls GET /api/rooms/[pin] on an interval and returns the latest state. */
export function useRoom(pin: string | null, intervalMs = 1000) {
  const [data, setData] = useState<RoomResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const active = useRef(true);

  useEffect(() => {
    if (!pin) return;
    active.current = true;

    async function poll() {
      try {
        const res = await fetch(`/api/rooms/${pin}`, { cache: "no-store" });
        if (!active.current) return;
        if (res.status === 404) {
          setError("Room not found");
          return;
        }
        if (res.ok) {
          setData(await res.json());
          setError(null);
        }
      } catch {
        // transient network error — keep the last known state and retry
      }
    }

    poll();
    const id = setInterval(poll, intervalMs);
    return () => {
      active.current = false;
      clearInterval(id);
    };
  }, [pin, intervalMs]);

  return { data, error };
}
