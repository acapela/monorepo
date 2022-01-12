import fs from "fs";
import path from "path";

import { generate } from "@graphql-codegen/cli";

import { logger } from "@aca/shared/logger";

import { SCHEMA_FILE_PATH, updateSchemaFile } from "./fetchSchema";
import { GQL_PACKAGE_PATH, ROOT_PATH } from "./files";

interface ToolingGenerateOptions {
  watch: boolean;
}

function isDir(dirPath: string): boolean {
  try {
    if (!fs.statSync(dirPath).isDirectory()) {
      return false;
    }
  } catch (error) {
    return false;
  }

  return true;
}

const PACKAGES_WITH_GQL_DOCUMENTS = ["frontend", "clientdb"];

export async function startGeneratingGraphqlTypes({ watch }: ToolingGenerateOptions): Promise<void> {
  if (!isDir(ROOT_PATH)) {
    throw new Error(`Incorrect project root (not a dir) (path: ${ROOT_PATH}) `);
  }

  logger.info("Updating graphql schema");

  await updateSchemaFile();

  await generate({
    cwd: ROOT_PATH,
    schema: SCHEMA_FILE_PATH,
    watch,
    documents: [
      ...PACKAGES_WITH_GQL_DOCUMENTS.map((packageName) => {
        return `./${packageName}/**/*.{ts,tsx}`;
      }),
      // Ignore generated file itself. (IMO codegen could be aware what it generated and ignore it automatically ¯\_(ツ)_/¯)
      "!./gql/generated.ts",
    ],

    generates: {
      [path.resolve(GQL_PACKAGE_PATH, "generated.ts")]: {
        plugins: ["typescript", "typescript-operations", "typescript-apollo-client-helpers", "fragment-matcher"],
        config: {
          enumsAsTypes: true,
          declarationKind: "interface",
          apolloClientVersion: 3,
          useExplicitTyping: true,

          strictScalars: true,
          nonOptionalTypename: true,
          scalars: {
            // Hasura has bunch of custom scalars. Let's inform gql codegen about corresponding typescript types.
            bigint: "number",
            date: "Date",
            json: "any",
            jsonb: "any",
            timestamp: "string",
            timestamptz: "string",
            uuid: "string",
          },
        },
      },
    },
  });
}
