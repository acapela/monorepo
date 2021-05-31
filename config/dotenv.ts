import dotenv from "dotenv";
import path from "path";

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
const requiredEnvVarNames = [
  "STAGE",
  "GOOGLE_APPLICATION_CREDENTIALS",
  "GOOGLE_STORAGE_BUCKET",
  "HASURA_GRAPHQL_URL",
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
  "FRONTEND_URL",
  "AUTH_SECRET",
  "AUTH_JWT_TOKEN_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "HASURA_EVENT_SECRET",
  "HASURA_API_URL",
  "HASURA_API_SECRET",
  "HASURA_API_ADMIN_ROLE",
  "HASURA_ACTION_SECRET",
  "HASURA_NOTIFICATION_SECRET",
  "HASURA_WEBSOCKET_ENDPOINT",
  "LOGGING_LEVEL",
  "BACKEND_PORT",
  "BACKEND_ROOT_URL",
  "BACKEND_AUTH_TOKEN",
  "SENDGRID_API_KEY",
  "SONIX_API_KEY",
  "SONIX_CALLBACK_SECRET",
] as const;

// Out of array of variable names, prepare types for process.env

type EnvVarName = typeof requiredEnvVarNames[number];
type EnvVariablesMap = Record<EnvVarName, string>;

// It is possible to mark some env vars as optional by providing their default value.
const optionalEnvVars: Partial<NodeJS.ProcessEnv> = {
  STAGE: "production",
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

function assertRequiredEnvVariablesLoaded() {
  const missingEnvVars: string[] = [];

  for (const envVarName of requiredEnvVarNames) {
    const envVarValue = process.env[envVarName];

    if (typeof envVarValue === "undefined") {
      const valueFromOptionalEnvVars = optionalEnvVars[envVarName];

      // If value is not set, but we have default value provided - assign it to env var and continue without
      // marking it as missing.
      if (valueFromOptionalEnvVars) {
        console.warn(`Using default value for env variable ${envVarName}.`);
        Reflect.set(process.env, envVarName, valueFromOptionalEnvVars);
        continue;
      }

      missingEnvVars.push(envVarName);
    }
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
}

loadRootDotEnv();
assertRequiredEnvVariablesLoaded();
