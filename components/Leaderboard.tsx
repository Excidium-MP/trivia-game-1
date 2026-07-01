import type { Player } from "@/lib/types";

const MEDALS = ["🥇", "🥈", "🥉"];

export function Leaderboard({
  players,
  highlightId,
  max = 8,
}: {
  players: Player[];
  highlightId?: string;
  max?: number;
}) {
  const rows = players.slice(0, max);
  if (rows.length === 0) {
    return <p className="text-center text-slate-400">No players yet.</p>;
  }
  return (
    <ol className="mx-auto flex w-full max-w-md flex-col gap-2">
      {rows.map((p, i) => (
        <li
          key={p.id}
          className={`flex items-center justify-between rounded-xl px-4 py-3 text-lg font-semibold ${
            p.id === highlightId ? "bg-indigo-500" : "bg-white/10"
          }`}
        >
          <span className="flex items-center gap-3">
            <span className="w-7 text-center">{MEDALS[i] ?? i + 1}</span>
            <span className="truncate">{p.name}</span>
          </span>
          <span className="tabular-nums">{p.score}</span>
        </li>
      ))}
    </ol>
  );
}
