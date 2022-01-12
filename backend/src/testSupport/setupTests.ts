import "@aca/config/dotenv";

import { db } from "@aca/db";

import { cleanupDatabase } from "./testDatabaseUtils";

beforeEach(async () => {
  await cleanupDatabase();
});

afterAll(async () => {
  await cleanupDatabase();
  await db.$disconnect();
});
