import knex from "knex";
import config from "./config";
import * as logger from "./logger";

const socketPath: string = config.get("database.host.socketPath");
const connection: string = config.get("database.host.connection");
const host = connection ? `${socketPath}/${connection}` : socketPath;

const database = knex({
  client: "pg",
  connection: {
    user: config.get("database.user"),
    password: config.get("database.password"),
    database: config.get("database.name"),
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
