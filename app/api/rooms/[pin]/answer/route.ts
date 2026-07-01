import { NextResponse } from "next/server";
import { readRoom, writeRoom } from "@/lib/room";
import { QUESTIONS } from "@/lib/questions";
import { scoreAnswer } from "@/lib/scoring";

export const dynamic = "force-dynamic";

// POST /api/rooms/[pin]/answer  { playerId, choice }  → records + scores an answer.
export async function POST(req: Request, { params }: { params: { pin: string } }) {
  const room = await readRoom(params.pin);
  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }
  if (room.phase !== "question" || room.questionStartedAt == null) {
    return NextResponse.json({ error: "Not accepting answers" }, { status: 409 });
  }

  const body = await req.json().catch(() => ({}));
  const playerId = String(body?.playerId ?? "");
  const choice = Number(body?.choice);

  const player = room.players[playerId];
  if (!player) {
    return NextResponse.json({ error: "Unknown player" }, { status: 404 });
  }
  const question = QUESTIONS[room.currentQuestion];
  if (!question || !Number.isInteger(choice) || choice < 0 || choice >= question.choices.length) {
    return NextResponse.json({ error: "Invalid choice" }, { status: 400 });
  }

  const qIndex = room.currentQuestion;
  room.answers[qIndex] ??= {};
  if (room.answers[qIndex][playerId]) {
    return NextResponse.json({ locked: true }); // already answered — ignore
  }

  const elapsedMs = Date.now() - room.questionStartedAt;
  const correct = choice === question.correctIndex;
  const points = scoreAnswer(correct, elapsedMs);

  room.answers[qIndex][playerId] = { choice, elapsedMs, correct, points };
  player.score += points;
  await writeRoom(room);

  return NextResponse.json({ locked: true });
}
