import { readFileSync, writeFileSync } from "fs";

const pkgJson = JSON.parse(readFileSync("./package.json", "utf-8"));
const arg = process.argv.pop();
if (arg === "reset") {
  console.info("resetting package.json");
  pkgJson.name = "@aca/desktop";
  pkgJson.version = "999.0.0-do-not-autouptdate";
  pkgJson.repository = "github:weareacapela/releases";
} else {
  // this is required to show the correct app name (instead of @aca/desktop)
  pkgJson.name = "Acapela";
  pkgJson.version = require("./release-version");
  console.info(`updating version to ${pkgJson.version}`);
  if (arg === "staging") {
    pkgJson.repository = "github:weareacapela/releases-staging";
    console.info(`updating repository to ${pkgJson.repository}`);
  }
}

writeFileSync("./package.json", JSON.stringify(pkgJson, null, 2) + "\n");
console.info("done.");
