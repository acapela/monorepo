import { db } from "@acapela/db";
import { cleanupDatabase } from "./testDatabaseUtils";

beforeEach(async () => {
  await cleanupDatabase();
});

afterAll(async () => {
  await cleanupDatabase();
  await db.$disconnect();
});
