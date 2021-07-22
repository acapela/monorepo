import { db, TeamMember } from "~db";

export async function handleTeamMemberDeleted(teamMember: TeamMember) {
  const { team_id: teamId, user_id: userId } = teamMember;

  await db.$transaction([
    // remove user's current_team_id
    db.user.update({ where: { id: userId }, data: { current_team_id: null } }),

    // remove user from team's spaces
    db.space_member.deleteMany({
      where: {
        user_id: userId,
        space: {
          team_id: teamId,
        },
      },
    }),

    // remove user from team's rooms
    db.room_member.deleteMany({
      where: {
        user_id: userId,
        room: {
          space: {
            team_id: teamId,
          },
        },
      },
    }),

    // remove user from team's topics
    db.topic_member.deleteMany({
      where: {
        user_id: userId,
        topic: {
          room: {
            space: {
              team_id: teamId,
            },
          },
        },
      },
    }),
  ]);
}
