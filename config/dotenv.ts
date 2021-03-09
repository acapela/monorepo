import dotenv from "dotenv";
import path from "path";

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

function loadRootDotEnv(): void {
  dotenv.config();
}

loadRootDotEnv();
