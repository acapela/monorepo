import knex from 'knex';
import config from 'config';

const database = knex({
  client: 'pg',
  connection: config.get('database.connection-url'),
});

export default database;
