import "~config";

import { PrismaClient } from "@prisma/client";
import { sign } from "jsonwebtoken";

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
  return sign(
    {
      email: user.email,
      picture: null,
      sub: user.id,
      id: user.id,
      currentTeamId: user.current_team_id,
      "https://hasura.io/jwt/claims": {
        "x-hasura-allowed-roles": ["user", "visitor"],
        "x-hasura-default-role": "user",
        "x-hasura-user-id": user.id,
      },
    },
    process.env.AUTH_JWT_TOKEN_SECRET
  );
}

export type TestUser = user & { jwt: string };

async function createUser(email: string, currentTeam: string | null): Promise<TestUser> {
  const dbUser1 = await db.user.create({
    data: {
      email: PREFIX + email,
      current_team_id: currentTeam,
    },
  });
  return {
    ...dbUser1,
    jwt: createJWTForUser(dbUser1),
  };
}

export async function setupDatabase() {
  const user1 = await createUser("user-1@acape.la", null);
  const team = await db.team.create({
    data: { owner_id: user1.id, name: PREFIX + "what a team", slug: PREFIX + "team-with-a-slug" },
  });

  const user2 = await createUser("user-2@acape.la", team.id);

  await db.team_member.createMany({
    data: [
      { team_id: team.id, user_id: user1.id },
      { team_id: team.id, user_id: user2.id },
    ],
  });

  const space = await db.space.create({
    data: {
      name: PREFIX + "space is noise",
      slug: PREFIX + "spacenoise",
      team_id: team.id,
      creator_id: user2.id,
    },
  });

  return {
    data: {
      user1,
      user2,
      space,
      team,
    },
    async cleanup() {
      await db.user.updateMany({ where: { id: { in: [user1.id, user2.id] } }, data: { current_team_id: null } });
      // Prisma does its own constraint checking, so we have to go raw SQL to make deletion cascade
      await db.$executeRaw`DELETE FROM team where id = ${team.id}`;
      await db.user.deleteMany({ where: { id: { in: [user1.id, user2.id] } } });
    },
  };
}
