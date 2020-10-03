import knex from "knex";
import config from "config";

const database = knex({
  client: "pg",
  connection: config.get("database.connectionUrl"),
});

export default database;
