import { db } from "@acapela/db";

export async function cleanupDatabase(): Promise<void> {
  await db.$executeRaw`TRUNCATE TABLE "user" CASCADE`;
}
