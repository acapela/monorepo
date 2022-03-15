import path from "path";

import { Parcel } from "@parcel/core";

import { BuildEnvironment, createClientBundler, createElectronBundler, removeDirectory } from "./parcel";

async function build(name: string, bundler: Parcel) {
  console.info(`[${name}] starting build... 👷‍️🏗 `);
  try {
    const { bundleGraph, buildTime } = await bundler.run();
    console.info(`[${name}] built ${bundleGraph.getBundles().length} bundles in ${buildTime}ms! ✨`);
  } catch (e) {
    console.error(e);
  }
}

async function startBuildForEnv(env: BuildEnvironment) {
  const distDir = path.resolve(__dirname, `dist-${env}`);
  console.info(`[${env}] cleanup dist...`);
  removeDirectory(distDir);

  // Start client and electron bundler
  await Promise.all([
    build(`${env}:client`, createClientBundler(env)),
    build(`${env}:electron`, createElectronBundler(env)),
  ]);
}

async function start() {
  console.info(`Building desktop app...`);
  const lastArg = process.argv.pop();
  if (lastArg === "staging") return startBuildForEnv("staging");
  if (lastArg === "production") return startBuildForEnv("production");
  await startBuildForEnv("staging");
  await startBuildForEnv("production");
}

start();
