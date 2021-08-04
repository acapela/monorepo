import "~config";
import { PrismaClient } from "@prisma/client";

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

async function globalSetup() {
  const user1 = await db.user.create({ data: { email: PREFIX + "user-1@acape.la" } });
  const user2 = await db.user.create({ data: { email: PREFIX + "user-2@acape.la" } });

  const team = await db.team.create({
    data: { owner_id: user1.id, name: PREFIX + "what a team", slug: PREFIX + "team-with-a-slug" },
  });
  const space = await db.space.create({
    data: { name: PREFIX + "space is noise", slug: PREFIX + "spacenoise", team_id: team.id, creator_id: user1.id },
  });

  return async () => {
    await db.space.deleteMany({ where: { id: { in: [space.id] } } });
    await db.team.deleteMany({ where: { id: { in: [team.id] } } });
    await db.user.deleteMany({ where: { id: { in: [user1.id, user2.id] } } });
  };
}
export default globalSetup;
