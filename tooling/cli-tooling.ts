import "@acapela/config/dotenv";

import yargs from "yargs";
import logger from "@acapela/shared/logger";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { hideBin } from "yargs/helpers";

const tooling = yargs(hideBin(process.argv));

tooling
  .command(
    "gql [package]",
    "start the server",
    (yargs) => {
      return yargs
        .positional("package", {
          describe: "name of package to generate types for",
          demandOption: true,
          type: "string",
        })
        .option("watch", { type: "boolean", default: false });
    },
    async ({ package: packageName, watch }) => {
      logger.info("Loading graphql types generator");
      const { startGeneratingGraphqlTypes } = await import("./graphqlCodegen");

      logger.info("Starting generation");
      await startGeneratingGraphqlTypes({ packageName: packageName, watch });
    }
  )
  .strict()
  .parse();
