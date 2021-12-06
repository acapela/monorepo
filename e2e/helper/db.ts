import "~config/dotenv";

import { Prisma, PrismaClient } from "@prisma/client";

import { createJWT, signJWT } from "~shared/jwt";

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

// Make sure we disconnect previous instance
if (globalThis.dbInstance) {
  globalThis.dbInstance.$disconnect();
  globalThis.dbInstance = null;
}

globalThis.dbInstance = db;

const PREFIX = "__TESTING__";

const createJWTForUser = (userId: string): string => signJWT(createJWT({ sub: userId, userId: userId }));

export type TestUser = user & { jwt: string };

async function createUser(name: string, email: string, currentTeam: string | null): Promise<TestUser> {
  const dbUser = await db.user.create({
    data: {
      name,
      email: email,
      current_team_id: currentTeam,
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
  try {
    await db.$connect();
    await db.$executeRaw`DELETE FROM "team" WHERE slug ILIKE ${PREFIX + "%"}`;
    await db.$executeRaw`DELETE FROM "user" WHERE email ILIKE ${fullPrefix + "%"}`;
    await db.$executeRaw`DELETE FROM "user" WHERE email ILIKE ${PREFIX + "%"}`;
  } catch (error) {
    console.error(error);
  }

  const user1 = await createUser("u1", fullPrefix + "user-1@acape.la", null);
  const team = await db.team.create({
    data: { owner_id: user1.id, name: fullPrefix + "what a team", slug: fullPrefix + "team-with-a-slug" },
  });

  const user2 = await createUser("u2", fullPrefix + "user-2@acape.la", team.id);

  await db.team_member.createMany({
    data: [
      { team_id: team.id, user_id: user1.id },
      { team_id: team.id, user_id: user2.id },
    ],
  });

  return {
    data: { user1, user2 },
    async cleanup() {
      const userIds = Prisma.join([user1.id, user2.id]);
      try {
        await db.$executeRaw`DELETE FROM team WHERE owner_id IN (${userIds})`;

        await db.$disconnect();
      } catch (error) {
        console.error(`Database cleanup failed`);
        console.error(error);
        throw error;
      }
    },
  };
}
