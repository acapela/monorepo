import database from '../database';

export async function cleanupDatabase() {
  return Promise.all([database('user').truncate()]);
}
