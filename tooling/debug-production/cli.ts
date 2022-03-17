import fs from "fs";
import os from "os";

import asar from "asar";
import chokidar from "chokidar";
import fsExtra from "fs-extra";
import { $, path } from "zx";

import { getUUID } from "@aca/shared/uuid";

const DEFAULT_LOCATION = `/Users/adam/dev/acapela/playground/Acapela.app`;
const TEMP_DIR = path.resolve(os.tmpdir(), getUUID());

const RESOURCES_RELATIVE_PATH = `Contents/Resources`;
const BUNDLE_FILE_NAME = `app.asar`;

console.info("TMP", TEMP_DIR);

async function pickAcapelaLocation() {
  // let response = await question(`Paste path to Acapela application, (${DEFAULT_LOCATION}):`);
  let response = "";

  if (!response.trim()) {
    console.info(`Defaulting to ${DEFAULT_LOCATION}`);
    response = DEFAULT_LOCATION;
  }

  return response;
}

async function main() {
  const appLocation = await pickAcapelaLocation();

  console.info(`App location: ${appLocation}`);

  const resourcesPath = path.join(appLocation, RESOURCES_RELATIVE_PATH);

  console.info(`Res location: ${resourcesPath}`, { appLocation, RESOURCES_RELATIVE_PATH });

  // fs.chmodSync(resourcesPath, 0o666);

  const bundlePath = path.join(resourcesPath, BUNDLE_FILE_NAME);

  await startEditingAndWatchAsarFile(bundlePath, appLocation);

  console.info("Done");
}

main();

async function mkdirIfNeededAndEmptyIfNeeded(dir: string) {
  !fs.existsSync(dir) && fs.mkdirSync(dir);

  fsExtra.emptyDirSync(dir);
}

let currentElectronInstance: ReturnType<typeof $> | null = null;

async function runAcapelaAndKillPrevious(appLocation: string) {
  if (currentElectronInstance) {
    console.info(`Closing previous instance of Electron`);
    // Kill without error to avoid this entire file to exit
    await currentElectronInstance.kill();
    currentElectronInstance = null;
  }
  const runPath = path.join(appLocation, `Contents/MacOS/Acapela`);

  currentElectronInstance = $`${runPath}`;
}

async function startEditingAndWatchAsarFile(asarPath: string, appLocation: string) {
  const dirPath = path.dirname(asarPath);
  const tempDir = path.join(dirPath, "asar-temp");

  await mkdirIfNeededAndEmptyIfNeeded(tempDir);

  await asar.extractAll(asarPath, tempDir);

  const watcher = chokidar.watch(tempDir, {});

  await wait(1000);

  await $`code ${tempDir}`;

  watcher.on("all", updateAsar);

  async function updateAsar() {
    console.info("Will update", tempDir);
    // fs.rmSync(asarPath);
    await asar.createPackage(tempDir, asarPath);
    console.info("Updated");

    runAcapelaAndKillPrevious(appLocation);
  }
}

export function wait(time: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, time);
  });
}
