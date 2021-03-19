import knex from "knex";
import logger from "@acapela/shared/logger";

const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;

const database = knex({
  client: "pg",
  connection: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port,
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
