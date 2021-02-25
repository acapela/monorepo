import knex from "knex";
import * as logger from "./logger";

const socketPath = process.env.DATABASE_HOST_SOCKET_PATH;
const connection = process.env.DATABASE_HOST_CONNECTION;
const host = connection ? `${socketPath}/${connection}` : socketPath;

const database = knex({
  client: "pg",
  connection: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host,
  },
});

async function testConnection() {
  try {
    await database.raw("select 1+1 as result");
    logger.info("Successfully connected to database");
  } catch (e) {
    logger.error("Failed to connect to database");
  }
}

testConnection();

export default database;
