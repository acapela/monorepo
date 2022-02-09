import { copyFileSync, readFileSync, writeFileSync } from "fs";

const pkgJson = JSON.parse(readFileSync("./package.json", "utf-8"));
const arg = process.argv.pop();
if (arg === "reset") {
  console.info("resetting package.json");
  pkgJson.name = "@aca/desktop";
  pkgJson.version = "999.0.0-do-not-autouptdate";
  pkgJson.repository = "github:weareacapela/releases";
  pkgJson.build.appId = "com.desktop.acapela";
  pkgJson.build.productName = "Acapela";
} else {
  const isStaging = arg === "staging";
  pkgJson.version = require("./release-version");
  console.info(`updating version to ${pkgJson.version}`);

  // this is required to show the correct app name (instead of @aca/desktop)
  if (isStaging) pkgJson.name = "Alepaca";
  else pkgJson.name = "Acapela";
  console.info(`updating name to ${pkgJson.name}`);

  if (isStaging) pkgJson.build.appId = "com.desktop.acapela.staging";
  else pkgJson.build.appId = "com.desktop.acapela";
  console.info(`updating appId to ${pkgJson.build.appId}`);

  if (isStaging) pkgJson.repository = "github:weareacapela/releases-staging";
  else pkgJson.repository = "github:weareacapela/releases";
  console.info(`updating repository to ${pkgJson.repository}`);

  if (isStaging) pkgJson.build.productName = "Alepaca";
  else pkgJson.build.productName = "Acapela";
  console.info(`updating productName to ${pkgJson.build.productName}`);

  if (isStaging) copyFileSync("./build/icon-staging.png", "./build/icon.png");
  else copyFileSync("./build/icon-production.png", "./build/icon.png");
}

writeFileSync("./package.json", JSON.stringify(pkgJson, null, 2) + "\n");
console.info("done.");
