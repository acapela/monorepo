// APP env var is required for config to load.
// TODO: It's a bit awkward.
process.env.APP = "tooling";

import "@aca/config/dotenv";

import yargs from "yargs";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { hideBin } from "yargs/helpers";

import { logger } from "@aca/shared/logger";

const tooling = yargs(hideBin(process.argv));

tooling
  .command(
    "gql [package]",
    "start the server",
    (yargs) => {
      return yargs.option("watch", { type: "boolean", default: false });
    },
    async ({ watch }) => {
      logger.info("Loading graphql types generator");
      const { startGeneratingGraphqlTypes } = await import("./graphqlCodegen");

      logger.info("Starting generation");
      await startGeneratingGraphqlTypes({ watch });
    }
  )
  .strict()
  .parse();
