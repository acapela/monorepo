import "~config";

import { db } from "~db";

import { cleanupDatabase } from "./testDatabaseUtils";

beforeEach(async () => {
  await cleanupDatabase();
});

afterAll(async () => {
  await cleanupDatabase();
  await db.$disconnect();
});
