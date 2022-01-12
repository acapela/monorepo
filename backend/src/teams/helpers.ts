import { db } from "@aca/db";

export async function getHasTeamMember(teamId: string, memberId: string): Promise<boolean> {
  const entry = await db.team_member.findFirst({
    where: { team_id: teamId, user_id: memberId },
  });

  return !!entry;
}

export async function findTeamById(teamId: string) {
  return db.team.findUnique({ where: { id: teamId } });
}
