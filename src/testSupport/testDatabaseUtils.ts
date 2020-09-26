import database from '../database';

export async function cleanupDatabase(): Promise<unknown[]> {
  return Promise.all([database('user').truncate()]);
}
