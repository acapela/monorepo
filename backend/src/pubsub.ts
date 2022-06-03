import { addDays } from "date-fns";
import Redlock from "redlock";

import { db } from "@aca/db";
import { logger } from "@aca/shared/logger";

import { redisClient } from "./redis";

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

export async function removeMarkAsProcessed(type: string, messageId: string): Promise<void> {
  try {
    await db.processed_message.delete({ where: { id: `${type}:${messageId}` } });
  } catch (e) {
    logger.warn("removeMarkAsProcessed failed", e);
  }
}

export async function cleanupProcessedMessages() {
  const deleted = await db.processed_message.deleteMany({
    // cleanup messages older than 7 days
    where: { created_at: { lt: addDays(new Date(), -7) } },
  });
  logger.info(`Deleted ${deleted.count} processed messages`);
}
