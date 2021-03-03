import dotenv from "dotenv";
import path from "path";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { warn } from "@acapela/shared/logger";

export const ROOT_PATH = path.resolve(__dirname, "..");

const DOTENV_PATH = path.resolve(__dirname, "..", ".env");

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // Let's extend ProcessEnv to provide process.env autocompletion
    export interface ProcessEnv {
      GOOGLE_APPLICATION_CREDENTIALS: string;
      HASURA_GRAPHQL_URL: string;
      DB_HOST: string;
      DB_USER: string;
      DATABASE_HOST_SOCKET_PATH: string;
      DATABASE_HOST_CONNECTION: string;
      DB_PASSWORD: string;
      DB_NAME: string;
      PRISMA_DATABASE_URL: string;
      FRONTEND_URL: string;
      AUTH_SECRET: string;
      AUTH_JWT_TOKEN_SECRET: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      HASURA_EVENT_SECRET: string;
      HASURA_API_URL: string;
      HASURA_API_SECRET: string;
      HASURA_API_ADMIN_ROLE: string;
      HASURA_ACTION_SECRET: string;
      HASURA_NOTIFICATION_SECRET: string;
      LOGGING_LEVEL: string;
      BACKEND_PORT: number;
      BACKEND_ROOT_URL: string;
      BACKEND_AUTH_TOKEN: string;
      SENDGRID_API_KEY: string;
    }
  }
}

export function loadRootDotEnv(): void {
  dotenv.config({ path: DOTENV_PATH });
}

let isLoaded = false;
let loadingPromise: Promise<void> | null = null;

export function assertSecretsLoaded(message: string): void {
  if (isLoaded) {
    return;
  }

  throw new Error(`
    ${message} (Secrets not initialized. import {initializeSecrets} from @acapela/config and await it, then lazily import the rest of the app.)
  `);
}

export function getIsLoaded(): boolean {
  return isLoaded;
}

export async function initializeSecrets(): Promise<void> {
  // If is already loaded - do nothing.
  if (isLoaded) {
    return;
  }
  // TODO (Adam): Let's skip this step in development maybe and require variables to be included in gitignored .env
  // It'll not make things more complicated as developer needs to have google-key file anyway in order to have it working
  // It's also required now to have .bash config modified to include this key which is actually more complicated than
  // setting required env variables locally.

  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === undefined) {
    warn(`Skipping google secrets initialization in dev mode. Use .env variables file instead`);
    isLoaded = true;
    return;
  }

  // Make sure to never call loading twice if called multiple times before loaded
  if (loadingPromise) {
    return loadingPromise;
  }

  // Assign promise of loading to shared variable so it'll be reused for following calls.
  loadingPromise = performInjectSecretsToEnv();

  await loadingPromise;

  loadingPromise = null;
  isLoaded = true;
}

async function performInjectSecretsToEnv(): Promise<void> {
  const loadingSecretsPromises = Object.keys(process.env).map(async (key) => {
    const envVarValue = process.env[key];

    if (!envVarValue) {
      return null;
    }

    const googleSecretName = getGoogleSecretName(envVarValue);

    if (!googleSecretName) {
      return null;
    }

    const secretValue = await getGoogleSecretValue(googleSecretName);

    process.env[key] = secretValue;
  });

  try {
    await Promise.all(loadingSecretsPromises);
  } catch (error) {
    //
  }
}

const googleSecretsClient = new SecretManagerServiceClient();

const googleSecretEnvVarRegExp = /googleSecret\("(.+)"\)/;

async function getGoogleSecretValue(secretName: string) {
  const [version] = await googleSecretsClient.accessSecretVersion({
    name: `projects/meetnomoreapp/secrets/${secretName}/versions/latest`,
  });

  const value = version?.payload?.data?.toString();
  if (!value) {
    throw new EmptySecretError(secretName);
  }

  return value;
}

function getGoogleSecretName(rawValue: string): string | null {
  if (!googleSecretEnvVarRegExp.test(rawValue)) {
    return null;
  }

  const matchResult = googleSecretEnvVarRegExp.exec(rawValue);

  if (!matchResult) {
    return null;
  }

  const [, googleSecretName] = matchResult;

  return googleSecretName;
}

export class ConfigNotLoaded extends Error {
  constructor(fieldName: string) {
    super(`Configuration has not been loaded, but was tried to be accessed (field name: ${fieldName})`);
  }
}

class EmptySecretError extends Error {
  constructor(name: string) {
    super(`Secret named ${name} is empty`);
  }
}
