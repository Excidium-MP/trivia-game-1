import { NextResponse } from "next/server";
import { newPlayer, readRoom, writeRoom } from "@/lib/room";

export const dynamic = "force-dynamic";

// POST /api/rooms/[pin]/join  { name }  → registers a player, returns playerId.
export async function POST(req: Request, { params }: { params: { pin: string } }) {
  const room = await readRoom(params.pin);
  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }
  if (room.phase !== "lobby") {
    return NextResponse.json({ error: "Game already started" }, { status: 409 });
  }

  const body = await req.json().catch(() => ({}));
  const name = String(body?.name ?? "").trim().slice(0, 20);
  if (!name) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }

  const taken = Object.values(room.players).some(
    (p) => p.name.toLowerCase() === name.toLowerCase(),
  );
  if (taken) {
    return NextResponse.json({ error: "That name is taken" }, { status: 409 });
  }

  const player = newPlayer(name);
  room.players[player.id] = player;
  await writeRoom(room);

  return NextResponse.json({ playerId: player.id, name: player.name });
}
