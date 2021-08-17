import "~config/dotenv";

import fs from "fs";
import path from "path";

import axios from "axios";
import { buildClientSchema, getIntrospectionQuery, printSchema } from "graphql/utilities";

import { log } from "~shared/logger";

import { GQL_PACKAGE_PATH } from "./files";

export interface ProcessEnv {
  [key: string]: string | undefined;
  foo: string;
}

export async function fetchGraphQLSchema(): Promise<string> {
  log.info(`Introspecting graphql api - ${process.env.HASURA_GRAPHQL_URL}`);

  const res = await axios({
    url: process.env.HASURA_GRAPHQL_URL,
    method: "post",
    data: {
      query: getIntrospectionQuery(),
    },
    headers: {
      "X-Hasura-Role": process.env.HASURA_API_ADMIN_ROLE,
      "x-hasura-admin-secret": process.env.HASURA_API_SECRET,
    },
  });

  log.info(`Parsing introspection schema`);

  const readableSchema = printSchema(buildClientSchema(res.data.data));

  return readableSchema;
}

export const SCHEMA_FILE_PATH = path.resolve(GQL_PACKAGE_PATH, "schema.graphql");

export async function updateSchemaFile(): Promise<void> {
  const schema = await fetchGraphQLSchema();

  log.info(`Saving updated schema to file (${SCHEMA_FILE_PATH})`);

  fs.writeFileSync(SCHEMA_FILE_PATH, schema);
}
