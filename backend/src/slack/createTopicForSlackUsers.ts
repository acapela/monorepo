import { sendInviteNotification } from "~backend/src/inviteUser";
import { slackClient } from "~backend/src/slack/app";
import { parseAndTransformToTipTapJSON } from "~backend/src/slack/slackMarkdown/parser";
import { findUserBySlackId } from "~backend/src/slack/utils";
import { Account, User, db } from "~db";
import { convertMessageContentToPlainText } from "~richEditor/content/plainText";
import { slugify } from "~shared/slugify";
import { DEFAULT_TOPIC_TITLE_TRUNCATE_LENGTH, truncateTextWithEllipsis } from "~shared/text/ellipsis";
import { MentionType } from "~shared/types/mention";

async function createAndInviteMissingUsers(
  slackToken: string,
  teamId: string,
  invitingUserId: string,
  slackUserIds: string[]
) {
  const usersWithSlackIds: { slackUserId: string; user: User & { account: Account[] } }[] = [];
  await db.$transaction(async (transactionUntyped) => {
    const transaction = transactionUntyped as typeof db;
    await Promise.all(
      slackUserIds.map(async (slackUserId) => {
        const { profile } = await slackClient.users.profile.get({
          token: slackToken,
          user: slackUserId,
        });
        const name = profile?.real_name;
        const email = profile?.email;
        if (!name || !email) {
          return;
        }
        const user = await transaction.user.create({
          data: { name, email, avatar_url: profile?.image_original },
          include: { account: true },
        });
        await transaction.team_member.create({
          data: {
            team_id: teamId,
            user_id: user.id,
            team_member_slack: { create: { slack_user_id: slackUserId } },
          },
        });
        usersWithSlackIds.push({ slackUserId, user });
      })
    );
  });

  await Promise.all(usersWithSlackIds.map(({ user }) => sendInviteNotification(user, teamId, invitingUserId)));

  return usersWithSlackIds.map(({ slackUserId, user }) => ({ slackUserId, userId: user.id }));
}

type UserWithRequest = { userId: string; requestType: MentionType; slackUserId: string };

type SlackUserIdWithRequestType = { slackUserId: string; requestType: MentionType };

export async function findOrCreateUsers({
  slackToken,
  teamId,
  invitingUserId,
  slackUserIdsWithRequestType,
}: {
  slackToken: string;
  teamId: string;
  invitingUserId: string;
  slackUserIdsWithRequestType: SlackUserIdWithRequestType[];
}): Promise<UserWithRequest[]> {
  const usersForSlackIds = await Promise.all(
    slackUserIdsWithRequestType.map(async ({ slackUserId, requestType }) => ({
      slackUserId,
      requestType,
      user: await findUserBySlackId(slackToken, slackUserId, teamId),
    }))
  );
  const userIds = usersForSlackIds
    .filter((item) => item.user)

    .map(
      (item) =>
        ({
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          userId: item.user!.id,
          requestType: item.requestType,
          slackUserId: item.slackUserId,
        } as const)
    );

  const missingUsersSlackIds = usersForSlackIds.filter((item) => !item.user).map((item) => item.slackUserId);

  if (missingUsersSlackIds.length === 0) {
    return userIds;
  }

  const newUsers = await createAndInviteMissingUsers(slackToken, teamId, invitingUserId, missingUsersSlackIds);
  const newUserIds = newUsers.map(
    (row) =>
      ({
        userId: row.userId,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        requestType: slackUserIdsWithRequestType.find((item) => item.slackUserId == row.slackUserId)!.requestType,
        slackUserId: row.slackUserId,
      } as const)
  );
  return [...userIds, ...newUserIds];
}

export async function createTopicForSlackUsers({
  token,
  teamId,
  ownerId,
  slackTeamId,
  topicName,
  rawTopicMessage,
  slackUserIdsWithRequestType,
}: {
  token: string;
  teamId: string;
  ownerId: string;
  slackTeamId: string;
  topicName?: string;
  rawTopicMessage: string;
  slackUserIdsWithRequestType: SlackUserIdWithRequestType[];
}) {
  const usersWithRequestType = await findOrCreateUsers({
    slackToken: token,
    teamId,
    invitingUserId: ownerId,
    slackUserIdsWithRequestType,
  });

  const mentionedUsersBySlackId = Object.assign(
    {},
    ...usersWithRequestType.map((u) => {
      return {
        [u.slackUserId]: {
          type: u.requestType,
          userId: u.userId,
        },
      };
    })
  );

  const topicMessage = parseAndTransformToTipTapJSON(rawTopicMessage, {
    slackTeamId,
    mentionedUsersBySlackId,
  });
  const topicMessagePlainText = convertMessageContentToPlainText(topicMessage);
  const finalTopicName =
    topicName || truncateTextWithEllipsis(topicMessagePlainText, DEFAULT_TOPIC_TITLE_TRUNCATE_LENGTH);

  return await db.topic.create({
    data: {
      team_id: teamId,
      name: finalTopicName,
      slug: await slugify(finalTopicName),
      index: "a",
      owner_id: ownerId,
      message: {
        create: {
          type: "TEXT",
          user_id: ownerId,
          content: topicMessage,
          content_text: topicMessagePlainText,
          task: {
            createMany: {
              data: usersWithRequestType.map((item) => ({
                type: item.requestType,
                user_id: item.userId,
              })),
            },
          },
        },
      },
    },
  });
}
