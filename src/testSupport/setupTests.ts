import { cleanupDatabase } from './testDatabaseUtils';
import database from '../database';

beforeEach(async () => {
  await cleanupDatabase();
});

afterAll(async () => {
  await cleanupDatabase();
  await database.destroy();
});
