import "~config";

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

const PREFIX = "__TESTING__";

function createJWTForUser(user: user): string {
  return signJWT(
    createJWT({
      sub: user.id,
      userId: user.id,
      teamId: user.current_team_id,
    })
  );
}

export type TestUser = user & { jwt: string };

async function createUser(name: string, email: string, currentTeam: string | null): Promise<TestUser> {
  const dbUser1 = await db.user.create({
    data: {
      name,
      email: PREFIX + email,
      current_team_id: currentTeam,
      account: {
        create: {
          provider_id: PREFIX,
          provider_type: PREFIX,
          provider_account_id: PREFIX + email,
        },
      },
    },
  });
  return {
    ...dbUser1,
    jwt: createJWTForUser(dbUser1),
  };
}

export async function setupDatabase() {
  const user1 = await createUser("u1", "user-1@acape.la", null);
  const team = await db.team.create({
    data: { owner_id: user1.id, name: PREFIX + "what a team", slug: PREFIX + "team-with-a-slug" },
  });

  const user2 = await createUser("u2", "user-2@acape.la", team.id);

  await db.team_member.createMany({
    data: [
      { team_id: team.id, user_id: user1.id },
      { team_id: team.id, user_id: user2.id },
    ],
  });

  return {
    data: { user1, user2 },
    async cleanup() {
      await db.user.updateMany({ where: { id: { in: [user1.id, user2.id] } }, data: { current_team_id: null } });
      // Prisma does its own constraint checking, so we have to go raw SQL to make deletion cascade
      const userIds = Prisma.join([user1.id, user2.id]);
      await db.$executeRaw`DELETE FROM team WHERE owner_id IN (${userIds})`;
      await db.$executeRaw`DELETE FROM "user" WHERE id IN (${userIds})`;
    },
  };
}
