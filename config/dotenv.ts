import path from "path";

import dotenv from "dotenv";

import { assertDefined } from "@aca/shared/assert";

function getDotEnvPath() {
  if (!__dirname) {
    // It is possible that __dirname is not set (in next.js it is by design to disable access to file system)
    return null;
  }

  if (process.env.NODE_ENV === "production") {
    return path.resolve(process.cwd(), ".env");
  }

  return path.resolve(__dirname, "..", ".env");
}

/**
 * We're setting list of all required env variables as an const array.
 *
 * We need it in runtime to exit early in case of missing env variables.
 *
 * We make it const so it can be used to provide autocompletion for type-safe process.env.[name]
 */
const requiredEnvVarNames = ["STAGE", "LOGGING_LEVEL"] as const;

const requiredEnvVarNamesBackend = [
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_NAME",
  "DB_PASSWORD",
  "HASURA_ENDPOINT",
  "HASURA_ADMIN_SECRET",
  "HASURA_EVENT_SECRET",
  "HASURA_API_URL",
  "HASURA_API_SECRET",
  "HASURA_API_ADMIN_ROLE",
  "HASURA_ACTION_SECRET",
  "GOOGLE_STORAGE_BUCKET",
  "LINEAR_CLIENT_ID",
  "LINEAR_CLIENT_SECRET",
  "LINEAR_OAUTH_SECRET",
  "AUTH_SECRET",
  "AUTH_JWT_TOKEN_SECRET",
  "NEXTAUTH_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "SLACK_CLIENT_ID",
  "SLACK_CLIENT_SECRET",
  "FRONTEND_URL",
  "GITHUB_APP_PRIVATE_KEY",
  "GITHUB_APP_ID",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
] as const;

const requiredEnvVarNamesFrontend = ["HASURA_HOST", "BACKEND_HOST"] as const;

const optionalEnvVarNames = [
  "SEGMENT_API_KEY",
  "AIRTABLE_API_KEY",
  "CUSTOMERIO_APP_API_KEY",
  "CUSTOMERIO_CLIENT_API_KEY",
  "CUSTOMERIO_CLIENT_SITE_ID",
] as const;

// Out of array of variable names, prepare types for process.env

type EnvVariablesMap = Record<typeof requiredEnvVarNames[number], string> &
  Record<typeof requiredEnvVarNamesBackend[number], string> &
  Record<typeof requiredEnvVarNamesFrontend[number], string> &
  Record<typeof optionalEnvVarNames[number], string>;

// It is possible to mark some env vars as optional by providing their default value.
const optionalEnvVars: Partial<NodeJS.ProcessEnv> = {
  STAGE: "development",
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // Let's extend ProcessEnv to provide process.env autocompletion
    export interface ProcessEnv extends EnvVariablesMap {
      // It is possible to narrow down types of some env variables here.
      STAGE: "development" | "staging" | "production";
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function assertEnvVarsLoaded(envVars: readonly string[]) {
  const missingEnvVars: string[] = [];

  for (const envVarName of envVars) {
    const envVarValue = process.env[envVarName];

    if (typeof envVarValue !== "undefined") {
      // Variable is set, there is nothing to do about it.
      continue;
    }

    // We have no value, let's try to load it from defaults.
    const valueFromOptionalEnvVars = optionalEnvVars[envVarName];

    // We have default value provided - assign it to env var and continue without marking it as missing.
    if (valueFromOptionalEnvVars) {
      // Let's warn about it so developers are aware of it even if defaults are saving them from crash.
      console.warn(`Using default value for env variable ${envVarName}.`);
      // Assign it to process.env
      Reflect.set(process.env, envVarName, valueFromOptionalEnvVars);
      continue;
    }

    // There is no value and not able to load it from defaults.

    // Add it to list of missing env variables instead of throwing now so we can throw with names of ALL missing variables
    // at once.
    missingEnvVars.push(envVarName);
  }

  if (missingEnvVars.length > 0) {
    const missingEnvVarsNames = missingEnvVars.join(", ");

    throw new Error(`Missing env variables - ${missingEnvVarsNames}`);
  }
}

function loadRootDotEnv(): void {
  const dotEnvPath = getDotEnvPath();

  if (!dotEnvPath) {
    console.warn(`Not able to get .env file path. Skip loading env variables in runtime.`);
    return;
  }

  dotenv.config({ path: dotEnvPath });
  console.info(`.env file loaded: ${dotEnvPath}`);
}

const appType = assertDefined(process.env.APP, "APP environment variable must always be set");

loadRootDotEnv();

assertEnvVarsLoaded(requiredEnvVarNames);

if (appType === "frontend") assertEnvVarsLoaded(requiredEnvVarNamesFrontend);
if (appType === "backend") assertEnvVarsLoaded(requiredEnvVarNamesBackend);
