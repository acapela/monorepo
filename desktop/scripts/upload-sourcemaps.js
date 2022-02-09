#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const SentryCli = require("@sentry/cli");
const glob = require("glob-promise");
const version = require("./release-version");

const cli = new SentryCli("./sentry.properties");

async function main() {
  if (!version) {
    console.error("version is missing");
    process.exit(1);
    return;
  }

  console.info(`creating new sentry release: ${version}`);
  await cli.execute(["releases", "new", version], true);

  for (let env of ["staging", "production"]) {
    console.info(`uploading ${env} sourcemaps...`);
    await cli.execute(
      ["releases", "files", version, "upload-sourcemaps", `./dist-${env}`, "--url-prefix", `app:///dist-${env}`],
      true
    );
  }

  console.info("finalizing release...");
  await cli.execute(["releases", "finalize", version], true);

  console.info("removing source maps...");
  const sourceMaps = await glob.promise("./dist-*/**/*.map");
  for (const sourceMap of sourceMaps) {
    console.info(`deleting ${sourceMap}`);
    await fs.promises.unlink(sourceMap);
  }
}

main().catch((e) => console.error(e));
