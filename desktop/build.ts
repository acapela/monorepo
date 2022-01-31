import path from "path";

import { Parcel } from "@parcel/core";

import { createClientBundler, createElectronBundler, removeDirectory } from "./parcel";

async function build(name: string, bundler: Parcel) {
  console.info(`[${name}] starting build... 👷‍️🏗 `);
  try {
    const { bundleGraph, buildTime } = await bundler.run();
    console.info(`[${name}] built ${bundleGraph.getBundles().length} bundles in ${buildTime}ms! ✨`);
  } catch (e) {
    console.error(e);
  }
}

async function start() {
  console.info(`Building desktop app...`);
  // Let's remove previous files in dist to avoid gradually polluting it (files are hashed)
  removeDirectory(path.resolve(__dirname, "dist"));

  // Start client and electron bundler
  await Promise.all([build("client", createClientBundler(true)), build("electron", createElectronBundler(true))]);
}

start();
