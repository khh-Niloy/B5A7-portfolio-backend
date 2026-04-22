import Redis from "ioredis";
import { envVars } from "../config/envVars";

const redis = new Redis(envVars.REDIS_URL);

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

export const cacheData = async (key: string, data: any, ttl: number = 3600) => {
  await redis.set(key, JSON.stringify(data), "EX", ttl);
};

export const getCachedData = async <T>(key: string): Promise<T | null> => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

export const deleteCache = async (key: string) => {
  await redis.del(key);
};

export default redis;
