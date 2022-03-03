import { JSONContent } from "@tiptap/core";
import { uniq } from "lodash";

import { sendInviteNotification } from "@aca/backend/src/inviteUser";
import { Account, User, db } from "@aca/db";
import { convertMessageContentToPlainText } from "@aca/richEditor/content/plainText";
import { MentionType, REQUEST_TYPES, RequestType } from "@aca/shared/requests";
import { slugify } from "@aca/shared/slugify";
import { Maybe } from "@aca/shared/types";

import { slackClient } from "../app";
import { findUserBySlackId } from "../utils";
import { createRequestTitleFromMessageText } from "./utils";

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
        const user = await transaction.user.upsert({
          where: { email },
          create: { name, email, avatar_url: profile?.image_original, current_team_id: teamId },
          update: {},
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
  const [team, invitingUser] = await Promise.all([
    db.team.findUnique({ where: { id: teamId } }),
    db.user.findUnique({ where: { id: invitingUserId } }),
  ]);
  if (team && invitingUser) {
    await Promise.all(usersWithSlackIds.map(({ user }) => sendInviteNotification(user, team, invitingUser, false)));
  }

  return usersWithSlackIds.map(({ slackUserId, user }) => ({ slackUserId, userId: user.id }));
}

export type UserWithMaybeMentionType = { userId: string; mentionType?: MentionType; slackUserId: string };

export type SlackUserIdWithRequestType = { slackUserId: string; mentionType?: MentionType };

export async function findOrInviteUsers({
  slackToken,
  teamId,
  invitingUserId,
  slackUserIdsWithMentionType,
}: {
  slackToken: string;
  teamId: string;
  invitingUserId: string;
  slackUserIdsWithMentionType: SlackUserIdWithRequestType[];
}): Promise<UserWithMaybeMentionType[]> {
  const usersForSlackIds = await Promise.all(
    slackUserIdsWithMentionType.map(async ({ slackUserId, mentionType }) => ({
      slackUserId,
      mentionType: mentionType,
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
          mentionType: item.mentionType,
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
        mentionType: slackUserIdsWithMentionType.find((item) => item.slackUserId == row.slackUserId)!.mentionType,
        slackUserId: row.slackUserId,
      } as const)
  );
  return [...userIds, ...newUserIds];
}

export async function createTopicForSlackUsers({
  teamId,
  ownerId,
  topicName,
  dueAt,
  priority,
  messageContent,
  decisionOptions,
  isFirstCompletionEnough,
  usersWithMentionType,
}: {
  teamId: string;
  ownerId: string;
  topicName: Maybe<string>;
  dueAt: Maybe<Date>;
  messageContent: JSONContent;
  priority: Maybe<string>;
  decisionOptions: string[];
  isFirstCompletionEnough: boolean;
  usersWithMentionType: UserWithMaybeMentionType[];
}) {
  const userIds = uniq(usersWithMentionType.map(({ userId }) => userId).concat(ownerId));
  const messageContentText = convertMessageContentToPlainText(messageContent);

  topicName = topicName || createRequestTitleFromMessageText(messageContentText);

  const topic = await db.topic.create({
    data: {
      team_id: teamId,
      name: topicName,
      slug: await slugify(topicName),
      index: "a",
      priority,
      owner_id: ownerId,
      topic_access_token: { create: {} },
      topic_member: { createMany: { data: Array.from(userIds).map((user_id) => ({ user_id })) } },
      message: {
        create: {
          type: "TEXT",
          user_id: ownerId,
          content: messageContent,
          content_text: messageContentText,
          is_first_completion_enough: isFirstCompletionEnough,
          message_task_due_date: dueAt ? { create: { due_at: dueAt } } : undefined,
          task: {
            createMany: {
              data: usersWithMentionType
                .filter((item) => REQUEST_TYPES.includes(item.mentionType as RequestType))
                .map((item) => ({
                  type: item.mentionType,
                  user_id: item.userId,
                })),
            },
          },
          decision_option: { createMany: { data: decisionOptions.map((option, index) => ({ option, index })) } },
        },
      },
    },
    include: { message: true, topic_access_token: true, user: true, topic_member: true },
  });

  return topic;
}
