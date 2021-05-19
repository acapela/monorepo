import { db, TeamMember } from "~db";

export async function getTeamHasMember(teamId: string, memberId: string): Promise<boolean> {
  const entry = await db.team_member.findFirst({
    where: { team_id: teamId, user_id: memberId },
  });

  return !!entry;
}

export async function findTeamById(teamId: string) {
  return db.team.findUnique({ where: { id: teamId } });
}

export async function addTeamMember(teamId: string, participantId: string): Promise<TeamMember> {
  return await db.team_member.create({
    data: {
      team_id: teamId,
      user_id: participantId,
    },
  });
}
