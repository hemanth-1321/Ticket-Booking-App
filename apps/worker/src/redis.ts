// Initialize Redis client for custom logic
import { createClient, RedisClientType } from "redis";

export const redisClient: RedisClientType = createClient();

redisClient.on("connect", () => {
  console.log("Redis client connected");
});

redisClient.on("error", (err) => {
  console.error("Redis client error:", err);
});

redisClient.connect().catch((err) => {
  console.error("Failed to connect to Redis:", err);
});

export function getRedisKey(key: string) {
  return `showKey:${key}`;
}

export async function incrCount(key: string) {
  return redisClient.incr(getRedisKey(key));
}
