import { setupDatabase } from "./db";

export default async function globalSetup() {
  const { data, cleanup } = await setupDatabase();
  process.env.TESTING_DB_DATA = JSON.stringify(data);
  return cleanup;
}
