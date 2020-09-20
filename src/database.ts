import knex from 'knex';
import { DB_CONNECTION_URL } from './config';

const database = knex({
  client: 'pg',
  connection: DB_CONNECTION_URL,
});

export default database;
