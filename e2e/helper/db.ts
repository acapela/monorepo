import "@aca/config/dotenv";

import { PrismaClient } from "@prisma/client";

import { createJWT, signJWT } from "@aca/shared/jwt";

import { user } from ".prisma/client";

const prismaDatabaseUrl = `postgresql://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD)}@${
  process.env.DB_HOST
}:${process.env.DB_PORT}/${process.env.DB_NAME}?schema=public`;

export const db = new PrismaClient({
  datasources: {
    db: {
      url: prismaDatabaseUrl,
    },
  },
});
const PREFIX = "__TESTING__";

const createJWTForUser = (userId: string): string => signJWT(createJWT({ sub: userId, userId: userId }));

export type TestUser = user & { jwt: string };

async function createUser(name: string, email: string): Promise<TestUser> {
  const dbUser = await db.user.create({
    data: {
      name,
      email: email,
      account: {
        create: {
          provider_id: PREFIX,
          provider_type: PREFIX,
          provider_account_id: email,
        },
      },
    },
  });
  return {
    ...dbUser,
    jwt: createJWTForUser(dbUser.id),
  };
}

export async function setupDatabase(key: string) {
  const fullPrefix = PREFIX + key;

  const user1 = await createUser("u1", fullPrefix + "user-1@acape.la");
  const user2 = await createUser("u2", fullPrefix + "user-2@acape.la");

  return {
    data: { prefix: fullPrefix, user1, user2 },
    async cleanup() {
      await db.$executeRaw`DELETE FROM "user" WHERE email ILIKE ${fullPrefix + "%"}`;
    },
  };
}
