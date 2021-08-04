import "~config";
import { PrismaClient } from "@prisma/client";
import { sign } from "jsonwebtoken";
import { space, team, user } from ".prisma/client";

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

type TestUser = user & { JWT: string };

async function createUser(email: string, currentTeam: string | null): Promise<TestUser> {
  const dbUser1 = await db.user.create({
    data: {
      email: PREFIX + email,
      current_team_id: currentTeam,
    },
  });
  return {
    ...dbUser1,
    JWT: createJWTForUser(dbUser1),
  };
}

export interface Database {
  user1: TestUser;
  user2: TestUser;
  team: team;
  space: space;
  cleanup: () => Promise<void>;
}

export async function setupDatabase(): Promise<Database> {
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

  const cleanup = async function () {
    await db.team_member.deleteMany({ where: { team_id: { in: [team.id] } } });
    await db.user.deleteMany({ where: { id: { in: [user2.id] } } });
    await db.team.deleteMany({ where: { id: { in: [team.id] } } });
    await db.user.deleteMany({ where: { id: { in: [user1.id] } } });
  };

  return {
    user1,
    user2,
    space,
    team,
    cleanup,
  };
}
