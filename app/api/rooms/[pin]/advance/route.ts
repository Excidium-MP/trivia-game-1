import { NextResponse } from "next/server";
import { advanceRoom, readRoom, writeRoom } from "@/lib/room";

export const dynamic = "force-dynamic";

// POST /api/rooms/[pin]/advance  → host moves the game to the next phase.
export async function POST(_req: Request, { params }: { params: { pin: string } }) {
  const room = await readRoom(params.pin);
  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }
  advanceRoom(room);
  await writeRoom(room);
  return NextResponse.json({ room });
}
