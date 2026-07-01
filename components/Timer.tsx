"use client";

import { useEffect, useState } from "react";
import { TIME_LIMIT_SECONDS } from "@/lib/questions";

/** Counts down from the shared question start time so every device agrees. */
export function Timer({ startedAt }: { startedAt: number | null }) {
  const [remaining, setRemaining] = useState(TIME_LIMIT_SECONDS);

  useEffect(() => {
    if (startedAt == null) return;
    const tick = () => {
      const elapsed = (Date.now() - startedAt) / 1000;
      setRemaining(Math.max(0, Math.ceil(TIME_LIMIT_SECONDS - elapsed)));
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [startedAt]);

  const pct = (remaining / TIME_LIMIT_SECONDS) * 100;
  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mb-1 text-center text-2xl font-bold tabular-nums">{remaining}s</div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-white/20">
        <div
          className={`h-full rounded-full transition-[width] duration-300 ${
            remaining <= 5 ? "bg-red-500" : "bg-emerald-400"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
