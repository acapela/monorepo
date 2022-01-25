import { readFileSync, writeFileSync } from "fs";

const pkgJson = JSON.parse(readFileSync("./package.json", "utf-8"));

let releaseVersion = process.env.RELEASE_VERSION || "";
if (releaseVersion.startsWith("refs/tags/")) releaseVersion = releaseVersion.replace(/^refs\/tags\//, "");
if (releaseVersion.startsWith("v")) releaseVersion = releaseVersion.slice(1);
pkgJson.version = releaseVersion;
// this is required to show the correct app name (instead of @aca/desktop)
pkgJson.name = "Acapela";

console.info(`updating version to ${pkgJson.version}`);
writeFileSync("./package.json", JSON.stringify(pkgJson, null, 2) + "\n");
console.info("done.");
