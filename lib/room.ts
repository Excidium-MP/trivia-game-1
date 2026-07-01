import { nanoid } from "nanoid";
import type { Phase, Player, RoomState } from "./types";
import { QUESTIONS } from "./questions";
import { readRoom, roomExists, writeRoom } from "./store";

export function createEmptyRoom(pin: string): RoomState {
  return {
    pin,
    phase: "lobby",
    currentQuestion: -1,
    questionStartedAt: null,
    players: {},
    answers: {},
    createdAt: Date.now(),
  };
}

/** Generate a 6-digit PIN that isn't already taken. */
export async function generatePin(): Promise<string> {
  for (let i = 0; i < 20; i++) {
    const pin = String(Math.floor(100000 + Math.random() * 900000));
    if (!(await roomExists(pin))) return pin;
  }
  // Extremely unlikely fallback.
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function newPlayer(name: string): Player {
  return { id: nanoid(10), name, score: 0 };
}

/**
 * Advance the room's state machine one step. Called by the host.
 * lobby → question → reveal → leaderboard → (next question | final)
 */
export function advanceRoom(room: RoomState): RoomState {
  const lastIndex = QUESTIONS.length - 1;
  switch (room.phase) {
    case "lobby":
      room.phase = "question";
      room.currentQuestion = 0;
      room.questionStartedAt = Date.now();
      break;
    case "question":
      room.phase = "reveal";
      break;
    case "reveal":
      room.phase = "leaderboard";
      break;
    case "leaderboard":
      if (room.currentQuestion < lastIndex) {
        room.currentQuestion += 1;
        room.phase = "question";
        room.questionStartedAt = Date.now();
      } else {
        room.phase = "final";
      }
      break;
    case "final":
      // Terminal state; no-op.
      break;
  }
  return room;
}

/** Ordered leaderboard, highest score first. */
export function leaderboard(room: RoomState): Player[] {
  return Object.values(room.players).sort((a, b) => b.score - a.score);
}

/** Count of answers submitted for the current question. */
export function answerCount(room: RoomState): number {
  const q = room.answers[room.currentQuestion];
  return q ? Object.keys(q).length : 0;
}

export const nextPhaseLabel: Record<Phase, string> = {
  lobby: "Start game",
  question: "Reveal answer",
  reveal: "Show leaderboard",
  leaderboard: "Next",
  final: "Game over",
};

export { readRoom, writeRoom };
