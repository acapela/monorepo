#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const SentryCli = require("@sentry/cli");
const glob = require("glob-promise");

const cli = new SentryCli("./sentry.properties");

async function main() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const version = require("./release-version");
  if (!version) {
    console.error("version is missing in package.json");
    process.exit(1);
    return;
  }
  let isUpdate = false;
  if (process.argv.pop() === "update") {
    console.info("only update");
    isUpdate = true;
  }
  if (!isUpdate) {
    console.info(`creating new sentry release: ${version}`);
    await cli.execute(["releases", "new", version], true);
  }
  await cli.execute(["releases", "files", version, "upload-sourcemaps", "./dist", "--url-prefix", "app:///dist"], true);
  if (!isUpdate) {
    console.info("finalizing release...");
    await cli.execute(["releases", "finalize", version], true);
  }
  console.info("removing source maps...");
  const sourceMaps = await glob.promise("./dist/**/*.map");
  for (const sourceMap of sourceMaps) {
    console.info(`deleting ${sourceMap}`);
    await fs.promises.unlink(sourceMap);
  }
}

main().catch((e) => console.error(e));
