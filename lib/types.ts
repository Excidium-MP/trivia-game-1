export type Phase = "lobby" | "question" | "reveal" | "leaderboard" | "final";

export interface Question {
  prompt: string;
  choices: string[]; // exactly 4
  correctIndex: number; // 0-3
  funFact: string;
}

export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface AnswerRecord {
  choice: number;
  elapsedMs: number;
  correct: boolean;
  points: number;
}

export interface RoomState {
  pin: string;
  phase: Phase;
  /** Index into the questions array. -1 while in the lobby. */
  currentQuestion: number;
  /** Epoch ms when the current question was shown (for the timer & scoring). */
  questionStartedAt: number | null;
  players: Record<string, Player>;
  /** answers[questionIndex][playerId] */
  answers: Record<number, Record<string, AnswerRecord>>;
  createdAt: number;
}
