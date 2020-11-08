import database from "../database";

export async function cleanupDatabase(): Promise<unknown[]> {
  return Promise.all([database.raw(`TRUNCATE TABLE "user" CASCADE`)]);
}
