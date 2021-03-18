import { generate } from "@graphql-codegen/cli";
import { log } from "@acapela/shared/logger";
import path from "path";
import fs from "fs";
import { SCHEMA_FILE_PATH, updateSchemaFile } from "./fetchSchema";

interface ToolingGenerateOptions {
  packageName: string;
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

export async function startGeneratingGraphqlTypes({ packageName, watch }: ToolingGenerateOptions): Promise<void> {
  const packageDir = path.resolve(__dirname, "..", packageName);

  if (!isDir(packageDir)) {
    throw new Error(`Provided package name is not found (path: ${packageDir}) `);
  }

  log.info("Updating graphql schema");

  await updateSchemaFile();

  await generate({
    cwd: packageDir,
    schema: SCHEMA_FILE_PATH,
    watch,
    documents: [
      "./**/*.{ts,tsx}",
      // Ignore generated file itself. (IMO codegen could be aware what it generated and ignore it automatically ¯\_(ツ)_/¯)
      "!./**/gql/generated.ts",
    ],

    generates: {
      [path.resolve(packageDir, "src/gql/generated.ts")]: {
        plugins: [
          "typescript",
          "typescript-operations",
          "typescript-apollo-client-helpers",
          "typescript-react-apollo",
          "fragment-matcher",
        ],
      },
    },
  });
}
