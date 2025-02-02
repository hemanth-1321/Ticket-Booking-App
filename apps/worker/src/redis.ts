import { createClient, RedisClientType } from "redis";

export const client: RedisClientType = createClient();

export function getRedisKey(key: string) {
  return `showKey:${key}`;
}

export function incrCount(key: string) {
  return client.incr(getRedisKey(key));
}
