import { createClient } from "redis";
import { PHASE_PRODUCTION_BUILD } from "next/constants.js";
import { CacheHandler } from "@fortedigital/nextjs-cache-handler";
import createLruHandler from "@fortedigital/nextjs-cache-handler/local-lru";
import createRedisHandler from "@fortedigital/nextjs-cache-handler/redis-strings";

const redisPrefix = process.env.REDIS_KEY_PREFIX || "nextjs:";

const lruSettings = {
  maxItemsNumber: 10000,
  maxItemSizeBytes: 1024 * 1024 * 30, // 30MB per item
};

async function connectRedis() {
  if (!process.env.REDIS_URL) return null;
  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) return null;

  try {
    const client = createClient({
      url: process.env.REDIS_URL,
      pingInterval: 10000,
    });

    client.on("error", (e) => {
      if (process.env.NEXT_PRIVATE_DEBUG_CACHE) {
        console.warn("Redis error", e);
      }
    });

    console.info(`Connecting to Redis: ${process.env.REDIS_URL}...`);
    await client.connect();
    console.info("Redis connected.");

    return client.isReady ? client : null;
  } catch (error) {
    console.warn("Failed to connect to Redis:", error);
    return null;
  }
}

CacheHandler.onCreation(async () => {
  const lruHandler = createLruHandler(lruSettings);

  if (process.env.NODE_ENV === "development" && !process.env.REDIS_URL) {
    return { handlers: [lruHandler] };
  }

  const redisClient = await connectRedis();

  if (!redisClient) {
    return { handlers: [lruHandler] };
  }

  const redisHandler = createRedisHandler({
    client: redisClient,
    keyPrefix: redisPrefix,
  });

  return { handlers: [redisHandler, lruHandler] };
});

export default CacheHandler;
