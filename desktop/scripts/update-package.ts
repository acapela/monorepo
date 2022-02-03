import { readFileSync, writeFileSync } from "fs";

const pkgJson = JSON.parse(readFileSync("./package.json", "utf-8"));

if (process.argv.pop() === "reset") {
  console.info("resetting package.json");
  pkgJson.name = "@aca/desktop";
  pkgJson.version = "999.0.0-do-not-autouptdate";
} else {
  // this is required to show the correct app name (instead of @aca/desktop)
  pkgJson.name = "Acapela";
  pkgJson.version = require("./release-version");
  console.info(`updating version to ${pkgJson.version}`);
}

writeFileSync("./package.json", JSON.stringify(pkgJson, null, 2) + "\n");
console.info("done.");
