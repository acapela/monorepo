import { cleanupDatabase } from "./testDatabaseUtils";
import database from "../database";

// we need to load the config before any modules get required.
// currently only way to do this with jest is to actually mock the module, as it hoists the import of it
// to the very first import ran. In testing, we also run loading synchronously, as there's no way to mock
// it otherwise.
jest.mock("../config", () => {
  const actualConfig = jest.requireActual("../config").default;
  actualConfig.load();
  return actualConfig;
});

beforeEach(async () => {
  await cleanupDatabase();
});

afterAll(async () => {
  await cleanupDatabase();
  await database.destroy();
});
