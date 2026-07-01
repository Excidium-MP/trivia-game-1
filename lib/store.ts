import { Redis } from "@upstash/redis";
import type { RoomState } from "./types";

/**
 * Storage abstraction for room state.
 *
 * - If Upstash Redis env vars are present (KV_REST_API_URL / KV_REST_API_TOKEN),
 *   use Redis so state is shared across serverless instances (required on Vercel
 *   and for multi-device play).
 * - Otherwise fall back to an in-memory Map. This works for LOCAL single-process
 *   `next dev` (state is shared across browser tabs) so you can try the game
 *   immediately without any setup.
 */

const ROOM_TTL_SECONDS = 60 * 60 * 6; // rooms expire after 6h

const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export const usingRedis = Boolean(url && token);

const redis = usingRedis ? new Redis({ url: url!, token: token! }) : null;

// In-memory fallback. `globalThis` keeps the Map alive across hot reloads in dev.
const mem: Map<string, RoomState> =
  (globalThis as any).__triviaRooms ?? ((globalThis as any).__triviaRooms = new Map());

const key = (pin: string) => `room:${pin}`;

export async function readRoom(pin: string): Promise<RoomState | null> {
  if (redis) {
    const data = await redis.get<RoomState>(key(pin));
    return data ?? null;
  }
  return mem.get(pin) ?? null;
}

export async function writeRoom(room: RoomState): Promise<void> {
  if (redis) {
    await redis.set(key(room.pin), room, { ex: ROOM_TTL_SECONDS });
    return;
  }
  mem.set(room.pin, room);
}

export async function roomExists(pin: string): Promise<boolean> {
  if (redis) {
    return (await redis.exists(key(pin))) === 1;
  }
  return mem.has(pin);
}
