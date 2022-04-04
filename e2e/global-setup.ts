import "@aca/config/dotenv";

import { FullConfig } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

import { TESTING_PREFIX } from "@aca/shared/dev";

const prismaDatabaseUrl = `postgresql://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD)}@${
  process.env.DB_HOST
}:${process.env.DB_PORT}/${process.env.DB_NAME}?schema=public`;

const db = new PrismaClient({
  datasources: {
    db: {
      url: prismaDatabaseUrl,
    },
  },
});

async function createUser(name: string, email: string) {
  await db.user.create({
    data: {
      name,
      email: email,
      account: {
        create: {
          provider_id: TESTING_PREFIX,
          provider_type: TESTING_PREFIX,
          provider_account_id: email,
        },
      },
    },
  });
}

export async function setupDatabase(key = "") {
  const fullPrefix = TESTING_PREFIX + key;

  await createUser("u1", fullPrefix + "user-1@acape.la");

  return async function cleanup() {
    await db.$executeRaw`DELETE FROM "user" WHERE email ILIKE ${fullPrefix + "%"}`;
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function globalSetup(config: FullConfig) {
  return await setupDatabase();
}
