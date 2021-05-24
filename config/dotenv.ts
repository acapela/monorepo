import dotenv from "dotenv";
import path from "path";

function getDotEnvPath() {
  if (!__dirname) {
    // It is possible that __dirname is not avaliable (in next.js it is by design to disable access to file system)
    return null;
  }

  if (process.env.NODE_ENV === "production") {
    return path.resolve(process.cwd(), ".env");
  }

  return path.resolve(__dirname, "..", ".env");
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // Let's extend ProcessEnv to provide process.env autocompletion
    export interface ProcessEnv {
      STAGE: "development" | "staging" | "production";
      GOOGLE_APPLICATION_CREDENTIALS: string;
      GOOGLE_STORAGE_BUCKET: string;
      HASURA_GRAPHQL_URL: string;
      DB_HOST: string;
      DB_PORT: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_NAME: string;
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
      HASURA_WEBSOCKET_ENDPOINT: string;
      LOGGING_LEVEL: string;
      BACKEND_PORT: number;
      BACKEND_ROOT_URL: string;
      BACKEND_AUTH_TOKEN: string;
      SENDGRID_API_KEY: string;
      SONIX_API_KEY: string;
      SONIX_CALLBACK_SECRET: string;
    }
  }
}

function loadRootDotEnv(): void {
  const dotEnvPath = getDotEnvPath();

  if (!dotEnvPath) {
    return;
  }

  if (!process.env.DB_NAME) {
    console.warn(
      `It was not possible to load dotenv file and env variables were not loaded in other way. It might lead to bugs or crashes.`
    );
  }

  dotenv.config({ path: dotEnvPath });
}

loadRootDotEnv();
