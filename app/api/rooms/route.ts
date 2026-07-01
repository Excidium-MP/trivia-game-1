import { NextResponse } from "next/server";
import { createEmptyRoom, generatePin, writeRoom } from "@/lib/room";

export const dynamic = "force-dynamic";

// POST /api/rooms  → create a new game room, returns its PIN.
export async function POST() {
  const pin = await generatePin();
  const room = createEmptyRoom(pin);
  await writeRoom(room);
  return NextResponse.json({ pin });
}
