import { SpaceMember, db } from "~db";

export async function getSpaceHasMember(spaceId: string, memberId: string): Promise<boolean> {
  const entry = await db.space_member.findFirst({
    where: { space_id: spaceId, user_id: memberId },
  });

  return !!entry;
}

export async function findSpaceById(spaceId: string) {
  return db.space.findUnique({ where: { id: spaceId } });
}

export async function addSpaceMember(spaceId: string, userId: string): Promise<SpaceMember> {
  return await db.space_member.create({
    data: {
      space_id: spaceId,
      user_id: userId,
    },
  });
}
