#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */
const { copyFileSync, readFileSync, writeFileSync } = require("fs");

const pkgJson = JSON.parse(readFileSync("./package.json", "utf-8"));
const arg = process.argv.pop();
if (arg === "reset") {
  console.info("resetting package.json");
  pkgJson.name = "@aca/desktop";
  pkgJson.version = "999.0.0-do-not-autouptdate";
  pkgJson.repository = "github:acapela/releases";
  pkgJson.build.appId = "com.desktop.acapela";
  pkgJson.build.productName = "Acapela";
  pkgJson.build.directories.output = "dist-electron";
  pkgJson.main = "./dist/electron/index.js";
  pkgJson.build.files[1] = "dist";
} else {
  const isStaging = arg === "staging";
  pkgJson.version = require("./release-version");
  console.info(`updating version to ${pkgJson.version}`);

  // this is required to show the correct app name (instead of @aca/desktop)
  if (isStaging) pkgJson.name = "Alepaca";
  else pkgJson.name = "Acapela";
  console.info(`updated name to ${pkgJson.name}`);

  if (isStaging) pkgJson.repository = "github:acapela/releases-staging";
  else pkgJson.repository = "github:acapela/releases";
  console.info(`updated repository to ${pkgJson.repository}`);

  if (isStaging) pkgJson.build.appId = "com.desktop.acapela.staging";
  else pkgJson.build.appId = "com.desktop.acapela";
  console.info(`updated appId to ${pkgJson.build.appId}`);

  if (isStaging) pkgJson.build.productName = "Alepaca";
  else pkgJson.build.productName = "Acapela";
  console.info(`updated productName to ${pkgJson.build.productName}`);

  if (isStaging) pkgJson.build.directories.output = "dist-electron-staging";
  else pkgJson.build.directories.output = "dist-electron-production";
  console.info(`updated directories.output to ${pkgJson.build.directories.output}`);

  if (isStaging) {
    pkgJson.main = "./dist-staging/electron/index.js";
    pkgJson.build.files[1] = "dist-staging";
  } else {
    pkgJson.main = "./dist-production/electron/index.js";
    pkgJson.build.files[1] = "dist-production";
  }
  console.info(`updated main to ${pkgJson.main} [files: ${pkgJson.build.files[1]}]`);

  if (isStaging) copyFileSync("./build/icon_staging.png", "./build/icon.png");
  else copyFileSync("./build/icon_production.png", "./build/icon.png");
  console.info("updated icon");
}

writeFileSync("./package.json", JSON.stringify(pkgJson, null, 2) + "\n");
console.info("done.");
