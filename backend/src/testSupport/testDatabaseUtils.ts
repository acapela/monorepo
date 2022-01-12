import { db } from "@aca/db";

export async function cleanupDatabase(): Promise<void> {
  /* CASCADE follows foreign keys, therefore, truncating all the tables starting from `user` */
  await db.$executeRaw`TRUNCATE TABLE "user" CASCADE`;
}
