import { readFileSync, writeFileSync } from "fs";

const pkgJson = JSON.parse(readFileSync("./package.json", "utf-8"));
const releaseVersion = process.env.RELEASE_VERSION;
pkgJson.version = releaseVersion;
console.info(`updating version to ${pkgJson.version}`);
writeFileSync("./package.json", JSON.stringify(pkgJson, null, 2) + "\n");
console.info("done.");
