import { Notification } from "@linear/sdk";

import { LinearOauthToken, db } from "@aca/db";
import { assert } from "@aca/shared/assert";

/*
    All Linear Notification Types.
    We're only handling a few, as some wouldn't be relevant for initial import
   {
      'issueNewComment',
      'issueStatusChanged',
      'issueCommentMention',
      'issueAssignedToYou',
      'issueCommentReaction',
      'issueMention',
      'issueSubscribed'
    }
*/
type LinearNotificationType = "issueNewComment" | "issueCommentMention" | "issueAssignedToYou" | "issueMention";

export const linearNotificationTypeHandler: Record<
  LinearNotificationType,
  (linearOauthToken: LinearOauthToken, notification: Notification) => Promise<void>
> = {
  issueNewComment: handleNewComment,
  issueCommentMention: handleCommentMention,
  issueAssignedToYou: handleIssueAssigned,
  issueMention: handleIssueMention,
};

const supportedInitialLinearNotificationTypes = Object.keys(linearNotificationTypeHandler);

export function isSupportedInitialLinearNotificationType(type: string): type is LinearNotificationType {
  return supportedInitialLinearNotificationTypes.includes(type);
}

interface CreateInitialNotificationPayload {
  issueId: string;
  organizationId: string;
  issueTitle: string;
  url: string;
  from: string;
  acapelaUserId: string;
  linearCreatorId: string;
  type: string;
  origin: string;
  created_at: Date;
  updated_at: Date;
}

export async function handleNewComment(linearOauthToken: LinearOauthToken, notification: Notification) {
  await handleCommentOfOrigin(linearOauthToken, notification, "comment");
}

export async function handleCommentMention(linearOauthToken: LinearOauthToken, notification: Notification) {
  await handleCommentOfOrigin(linearOauthToken, notification, "mention");
}

async function handleCommentOfOrigin(
  linearOauthToken: LinearOauthToken,
  notification: Notification,
  origin: "comment" | "mention"
) {
  const comment = await notification.comment;
  assert(comment, "comment should exist");
  const issue = await comment.issue;
  const author = await comment.user;

  assert(issue, "issue should exist");
  assert(author, "author should be included");

  await createInitialNotification({
    issueId: issue.id,
    organizationId: linearOauthToken.linear_organization_id,
    issueTitle: issue.title,
    url: comment.url,
    from: author.name,
    acapelaUserId: linearOauthToken.user_id,
    linearCreatorId: author.id,
    type: "Comment",
    origin,
    created_at: notification.createdAt,
    updated_at: notification.updatedAt,
  });
}

export async function handleIssueMention(linearOauthToken: LinearOauthToken, notification: Notification) {
  await handleIssueOfOrigin(linearOauthToken, notification, "mention");
}

export async function handleIssueAssigned(linearOauthToken: LinearOauthToken, notification: Notification) {
  await handleIssueOfOrigin(linearOauthToken, notification, "assign");
}

async function handleIssueOfOrigin(
  linearOauthToken: LinearOauthToken,
  notification: Notification,
  origin: "mention" | "assign"
) {
  const issue = await notification.issue;
  assert(issue, "issue must be preset");

  const author = await issue.creator;
  assert(author, "author must be present");

  await createInitialNotification({
    issueId: issue.id,
    organizationId: linearOauthToken.linear_organization_id,
    issueTitle: issue.title,
    url: issue.url,
    from: author.name,
    acapelaUserId: linearOauthToken.user_id,
    linearCreatorId: author.id,
    type: "Issue",
    origin,
    created_at: notification.createdAt,
    updated_at: notification.updatedAt,
  });
}

async function createInitialNotification(payload: CreateInitialNotificationPayload) {
  await db.linear_issue.upsert({
    where: {
      id: payload.issueId,
    },
    update: {},
    create: {
      id: payload.issueId,
      organization_id: payload.organizationId,
      title: payload.issueTitle,
    },
  });

  await db.notification.create({
    data: {
      url: payload.url,
      from: payload.from,
      user_id: payload.acapelaUserId,
      created_at: payload.created_at.toISOString(),
      updated_at: payload.updated_at.toISOString(),
      notification_linear: {
        create: {
          issue_id: payload.issueId,
          issue_title: payload.issueTitle,
          creator_id: payload.linearCreatorId,
          type: payload.type,
          origin: payload.origin,
        },
      },
    },
  });
}
