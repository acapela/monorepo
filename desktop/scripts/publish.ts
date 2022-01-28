import { readFileSync, writeFileSync } from "fs";

const pkgJson = JSON.parse(readFileSync("./package.json", "utf-8"));

pkgJson.version = require("./release-version");
// this is required to show the correct app name (instead of @aca/desktop)
pkgJson.name = "Acapela";

console.info(`updating version to ${pkgJson.version}`);
writeFileSync("./package.json", JSON.stringify(pkgJson, null, 2) + "\n");
console.info("done.");
