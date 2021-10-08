import { findUserBySlackId } from "~backend/src/slack/utils";
import { Prisma, db } from "~db";
import { slugify } from "~shared/slugify";
import { MentionType } from "~shared/types/mention";

async function createMissingTeamInvitations(teamId: string, invitingUserId: string, slackUserIds: string[]) {
  await db.team_invitation.createMany({
    data: slackUserIds.map((slackUserId) => ({
      slack_user_id: slackUserId,
      team_id: teamId,
      inviting_user_id: invitingUserId,
    })),
    skipDuplicates: true,
  });
  return db.team_invitation.findMany({
    where: {
      team_id: teamId,
      slack_user_id: { in: slackUserIds },
      // we get existing accepted invitations through findUsersBySlackId
      used_by_user_id: null,
    },
  });
}

type UserOrTeamInvitation = { type: "user" | "team_invitation"; id: string; requestType: MentionType };

type SlackUserIdWithRequestType = { slackUserId: string; requestType: MentionType };

export async function findUsersOrCreateTeamInvitations({
  slackToken,
  teamId,
  invitingUserId,
  slackUserIdsWithRequestType,
}: {
  slackToken: string;
  teamId: string;
  invitingUserId: string;
  slackUserIdsWithRequestType: SlackUserIdWithRequestType[];
}): Promise<UserOrTeamInvitation[]> {
  const usersForSlackIds = await Promise.all(
    slackUserIdsWithRequestType.map(async ({ slackUserId, requestType }) => ({
      slackUserId,
      requestType,
      user: await findUserBySlackId(slackToken, slackUserId, teamId),
    }))
  );

  const userIds = usersForSlackIds
    .filter((item) => item.user)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .map((item) => ({ type: "user", id: item.user!.id, requestType: item.requestType } as const));

  const missingUsersSlackIds = usersForSlackIds.filter((item) => !item.user).map((item) => item.slackUserId);

  if (missingUsersSlackIds.length === 0) {
    return userIds;
  }

  const teamInvitations = await createMissingTeamInvitations(teamId, invitingUserId, missingUsersSlackIds);
  const teamInvitationIds = teamInvitations.map(
    (row) =>
      ({
        type: "team_invitation",
        id: row.id,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        requestType: slackUserIdsWithRequestType.find((item) => item.slackUserId == row.slack_user_id)!.requestType,
      } as const)
  );
  return [...userIds, ...teamInvitationIds];
}

export async function createTopicForSlackUsers({
  token,
  teamId,
  ownerId,
  topicName,
  topicMessage,
  slackUserIdsWithRequestType,
}: {
  token: string;
  teamId: string;
  ownerId: string;
  topicName: string;
  topicMessage: string;
  slackUserIdsWithRequestType: SlackUserIdWithRequestType[];
}) {
  const usersAndTeamInvitations = await findUsersOrCreateTeamInvitations({
    slackToken: token,
    teamId,
    invitingUserId: ownerId,
    slackUserIdsWithRequestType,
  });

  const taskData = usersAndTeamInvitations.map(
    (item) =>
      ({
        type: item.requestType,
        [item.type == "user" ? "user_id" : "team_invitation_id"]: item.id,
      } as Prisma.taskUncheckedCreateWithoutMessageInput)
  );
  return await db.topic.create({
    data: {
      team_id: teamId,
      name: topicName,
      slug: slugify(topicName),
      index: "a",
      owner_id: ownerId,
      message: {
        create: {
          type: "TEXT",
          user_id: ownerId,
          content: {
            type: "doc",
            content: [{ type: "paragraph", content: [{ type: "text", text: topicMessage }] }],
          },
          content_text: topicMessage,
          task: { createMany: { data: taskData } },
        },
      },
    },
  });
}
