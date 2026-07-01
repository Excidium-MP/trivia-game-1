import { NextResponse } from "next/server";
import { readRoom } from "@/lib/room";
import { QUESTIONS } from "@/lib/questions";

export const dynamic = "force-dynamic";

// GET /api/rooms/[pin]  → current room state (polled by host and players).
export async function GET(_req: Request, { params }: { params: { pin: string } }) {
  const room = await readRoom(params.pin);
  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }
  return NextResponse.json({ room, totalQuestions: QUESTIONS.length });
}
