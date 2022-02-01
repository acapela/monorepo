import fs from "fs";
import path from "path";

import { Parcel } from "@parcel/core";
import dotenv from "dotenv";

const ELECTRON_DIR = path.resolve(__dirname, "electron");
const CLIENT_DIR = path.resolve(__dirname, "client");

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // Let's extend ProcessEnv to provide process.env autocompletion
    export interface ProcessEnv {
      // It is possible to narrow down types of some env variables here.
      ELECTRON_CONTEXT: "client" | "electron";
      FRONTEND_URL: string;
    }
  }
}

export type BuildEnvironment = "development" | "staging" | "production";
function loadDotenv() {
  return new Map<BuildEnvironment, Object>(
    ["development", "staging", "production"].map(
      (e) => [e, dotenv.parse(fs.readFileSync(`./.env.${e}`))] as [BuildEnvironment, dotenv.DotenvParseOutput]
    )
  );
}
const loadedEnv = loadDotenv();

const generatedJs = path.resolve(__dirname, "lib", "env", "generated.js");

function generateEnvVarFile(env: BuildEnvironment) {
  const content = `// DO NOT EDIT! THIS FILE IS GENERATED DURING THE BUILD PROCESS
module.exports = ${JSON.stringify(getEnv(env))};`;
  fs.writeFileSync(generatedJs, content);
}

function getEnv(env: BuildEnvironment, isClient = false) {
  return {
    ...loadedEnv.get(env),
    ELECTRON_CONTEXT: isClient ? "client" : "electron",
  } as NodeJS.ProcessEnv;
}

function isDev(env: BuildEnvironment): boolean {
  return env === "development";
}

/**
 * There are 2 javascript 'entry' points
 * - one for 'main' process (called 'electron' to avoid confusion) - javascript ran to bootstrap and manage electron app
 * - one is for 'client' (javascript ran inside 'browser' of electron)
 */

// Electron code bundler
export function createElectronBundler(env: BuildEnvironment): Parcel {
  generateEnvVarFile(env);
  return new Parcel({
    // point into entry of electron code
    entries: [path.resolve(ELECTRON_DIR, "index.ts"), path.resolve(ELECTRON_DIR, "preload.ts")],
    defaultConfig: "@parcel/config-default",
    mode: isDev(env) ? "development" : "production",
    targets: {
      default: {
        context: "electron-main",
        distDir: path.resolve(__dirname, "dist/electron"),
        optimize: !isDev(env),
        includeNodeModules: !isDev(env) || [
          "@aca/shared",
          "@aca/ui",
          "@aca/config",
          "@aca/db",
          "@aca/gql",
          "@aca/desktop",
        ],
      },
    },
  });
}

export function createClientBundler(env: BuildEnvironment): Parcel {
  const distDir = path.resolve(__dirname, "dist/client");
  return new Parcel({
    entries: path.resolve(CLIENT_DIR, "index.html"),
    defaultConfig: "@parcel/config-default",
    mode: isDev(env) ? "development" : "production",
    defaultTargetOptions: {
      distDir,
    },
    targets: {
      default: {
        context: "browser",
        distDir,
        optimize: true,
        includeNodeModules: true,
        publicUrl: "./",
        scopeHoist: true,
        outputFormat: "commonjs",
      },
    },
    env: getEnv(env, true),
    ...(isDev(env)
      ? {
          serveOptions: {
            port: 3005,
          },
          hmrOptions: {
            port: 3005,
          },
        }
      : {}),
  });
}

export function removeDirectory(dir: string) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true });
  }
}
