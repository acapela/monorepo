import { addDays } from "date-fns";
import Client from "ioredis";
import Redlock from "redlock";

import { db } from "@aca/db";
import { logger } from "@aca/shared/logger";

const redisClient = new Client({ host: process.env.REDIS_HOST });
const redlock = new Redlock([redisClient], {
  retryCount: 500,
});

export async function acquireLock(type: string, messageId: string) {
  return redlock.acquire(`${type}:${messageId}`, 30000);
}

export async function markAsProcessed(type: string, messageId: string): Promise<boolean> {
  try {
    await db.processed_message.create({ data: { id: `${type}:${messageId}` } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    // was already marked as processed
    if (e.code === "P2002") return false;
    throw e;
  }
  return true;
}

export async function cleanupProcessedMessages() {
  const deleted = await db.processed_message.deleteMany({
    // cleanup messages older than 7 days
    where: { created_at: { lt: addDays(new Date(), -7) } },
  });
  logger.info(`Deleted ${deleted.count} processed messages`);
}
