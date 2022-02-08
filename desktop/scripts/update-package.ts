import { readFileSync, writeFileSync } from "fs";

const pkgJson = JSON.parse(readFileSync("./package.json", "utf-8"));
const arg = process.argv.pop();
if (arg === "reset") {
  console.info("resetting package.json");
  pkgJson.name = "@aca/desktop";
  pkgJson.version = "999.0.0-do-not-autouptdate";
  pkgJson.repository = "github:weareacapela/releases";
  pkgJson.build.appId = "com.desktop.acapela";
} else {
  // this is required to show the correct app name (instead of @aca/desktop)
  if (arg === "staging") pkgJson.name = "Acapela Staging";
  else pkgJson.name = "Acapela";
  console.info(`updating name to ${pkgJson.name}`);

  if (arg === "staging") pkgJson.build.appId = "com.desktop.acapela.staging";
  else pkgJson.build.appId = "com.desktop.acapela";
  console.info(`updating appId to ${pkgJson.build.appId}`);

  pkgJson.version = require("./release-version");
  console.info(`updating version to ${pkgJson.version}`);

  if (arg === "staging") {
    pkgJson.repository = "github:weareacapela/releases-staging";
    console.info(`updating repository to ${pkgJson.repository}`);
  }
}

writeFileSync("./package.json", JSON.stringify(pkgJson, null, 2) + "\n");
console.info("done.");
