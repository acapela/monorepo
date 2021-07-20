import { db, TeamMember } from "~db";

export async function handleTeamMemberDeleted(teamMember: TeamMember) {
  const { team_id: teamId, user_id: userId } = teamMember;

  // remove user's current_team_id
  await db.user.update({ where: { id: userId }, data: { current_team_id: null } });

  // remove user from team's spaces
  await db.space_member.deleteMany({
    where: {
      user_id: userId,
      space: {
        team_id: teamId,
      },
    },
  });

  // remove user from team's rooms
  await db.room_member.deleteMany({
    where: {
      user_id: userId,
      room: {
        space: {
          team_id: teamId,
        },
      },
    },
  });

  // remove user from team's topics
  await db.topic_member.deleteMany({
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
  });
}
