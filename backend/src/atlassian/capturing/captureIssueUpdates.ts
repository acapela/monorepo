import { uniq } from "lodash";

import { db } from "@aca/db";
import { SUPPORTED_FIELDS } from "@aca/shared/attlassian";
import { isNotNullish } from "@aca/shared/nullish";

import { JiraWebhookPayload } from "../types";
import { EXTRACT_MENTIONED_ACCOUNT_REGEX, extractMentionedAccountIds, getWatchersIfPermitted } from "./utils";

type ChangeLogItem = JiraWebhookPayload["changelog"]["items"][number];

interface UpdateIssueData {
  baseSitePath: string;
  payload: JiraWebhookPayload;
  changeLogItem: ChangeLogItem;
  accountThatUpdatedIssue: JiraWebhookPayload["user"];
  issueUrl: string;
  notifiedUsers: string[];
  notificationJiraIssueTypeValue?: string;
}

/*
  Possible new notification_jira_issue_type: "user_mentioned", "user_assigned", "issue_status_updated", "issue_field_updated"
*/
export async function handleJiraIssueUpdate(payload: JiraWebhookPayload) {
  const accountThatUpdatedIssue = payload.user;

  //e.g. https://acapela-team.atlassian.net
  const baseSitePath = payload.issue.self.split("/rest")[0];
  const issueUrl = `${baseSitePath}/browse/${payload.issue.key}`;

  // There can be multiple updates in one same webhook.
  // We want to notify individual users only about one update found in the webhook
  // This array keeps a record of people that were already notified
  const notifiedUsers: string[] = [];
  for (const changeLogItem of payload.changelog.items) {
    const data = {
      baseSitePath,
      payload,
      changeLogItem,
      accountThatUpdatedIssue,
      notifiedUsers,
      issueUrl,
    };

    if (changeLogItem.fieldId === "description") {
      notifiedUsers.push(
        ...(await notifyMentionedUsersInDescription({
          ...data,
          notificationJiraIssueTypeValue: "user_mentioned",
        }))
      );

      notifiedUsers.push(
        ...(await notifyWatchersOnUpdate({ ...data, notificationJiraIssueTypeValue: "issue_field_updated" }))
      );
      continue;
    }

    if (changeLogItem.fieldId === "assignee") {
      notifiedUsers.push(
        ...(await notifyAssignedUser({
          ...data,
          notificationJiraIssueTypeValue: "issue_assigned",
        }))
      );

      notifiedUsers.push(
        ...(await notifyWatchersOnUpdate({ ...data, notificationJiraIssueTypeValue: "issue_field_updated" }))
      );
      continue;
    }

    if (changeLogItem.fieldId === "status") {
      notifiedUsers.push(
        ...(await notifyWatchersOnUpdate({ ...data, notificationJiraIssueTypeValue: "issue_status_updated" }))
      );
      continue;
    }

    if (changeLogItem.fieldtype === "custom" || SUPPORTED_FIELDS.includes(changeLogItem.fieldId)) {
      notifiedUsers.push(
        ...(await notifyWatchersOnUpdate({ ...data, notificationJiraIssueTypeValue: "issue_field_updated" }))
      );
    }
  }
}

async function notifyMentionedUsersInDescription({
  payload,
  changeLogItem,
  accountThatUpdatedIssue,
  notifiedUsers,
  issueUrl,
}: UpdateIssueData): Promise<string[]> {
  const mentionsBeforeUpdate = extractMentionedAccountIds(changeLogItem.fromString ?? "");
  const mentionsAfterUpdate = extractMentionedAccountIds(changeLogItem.toString ?? "");

  // Mentions that are not added in between issue updates should not create a new notification
  const newAccountsMentioned = mentionsAfterUpdate.filter(
    (mentionedAccountId) =>
      !mentionsBeforeUpdate.includes(mentionedAccountId) && mentionedAccountId !== accountThatUpdatedIssue?.accountId
  );

  if (newAccountsMentioned.length === 0) {
    return [];
  }

  const mentionedUsersToNotify = (
    await db.user.findMany({
      where: {
        account: {
          some: {
            AND: [{ provider_id: "atlassian" }, { provider_account_id: { in: newAccountsMentioned } }],
          },
        },
      },
    })
  ).filter((user) => !notifiedUsers.includes(user.id));

  mentionedUsersToNotify.forEach(
    async (user) =>
      await db.notification_jira_issue.create({
        data: {
          notification: {
            create: {
              user_id: user.id,
              url: issueUrl,
              from: payload.user?.displayName ?? "Jira",
              // TODO: make another api call to get the display names of all the mentioned users
              text_preview: payload.issue.fields.description?.replaceAll(EXTRACT_MENTIONED_ACCOUNT_REGEX, "@..."),
            },
          },
          issue_id: payload.issue.id,
          issue_title: payload.issue.fields.summary,
          notification_jira_issue_type: {
            connect: {
              value: "user_mentioned",
            },
          },
        },
      })
  );

  return mentionedUsersToNotify.map(({ id }) => id);
}

async function notifyWatchersOnUpdate({
  payload,
  changeLogItem,
  accountThatUpdatedIssue,
  notifiedUsers,
  issueUrl,
  baseSitePath,
  notificationJiraIssueTypeValue,
}: UpdateIssueData): Promise<string[]> {
  const knownAccountsWithIssuePermissions = uniq(
    [accountThatUpdatedIssue?.accountId, payload.issue.fields.assignee?.accountId].filter(isNotNullish)
  );

  // Mention notifications are more important than watcher notifications
  // We're excluding mentions from watcher to prevent double notifications
  const watchersExceptUserThatUpdatedIssue = (
    await getWatchersIfPermitted(baseSitePath, payload.issue.key, knownAccountsWithIssuePermissions)
  ).filter((watcherAccountId) => watcherAccountId !== accountThatUpdatedIssue?.accountId);

  const watchersToNotify = (
    await db.user.findMany({
      where: {
        account: {
          some: {
            AND: [{ provider_id: "atlassian" }, { provider_account_id: { in: watchersExceptUserThatUpdatedIssue } }],
          },
        },
      },
    })
  ).filter((u) => !notifiedUsers.includes(u.id));

  watchersToNotify.map(
    async (user) =>
      await db.notification_jira_issue.create({
        data: {
          notification: {
            create: {
              user_id: user.id,
              url: issueUrl,
              from: payload.user?.displayName ?? "Jira",
            },
          },
          from: changeLogItem.fromString,
          to: changeLogItem.toString,
          issue_id: payload.issue.id,
          issue_title: payload.issue.fields.summary,
          updated_issue_field: changeLogItem.fieldtype === "custom" ? changeLogItem.field : changeLogItem.fieldId,
          notification_jira_issue_type: {
            connect: {
              value: notificationJiraIssueTypeValue as string,
            },
          },
        },
      })
  );

  return watchersToNotify.map(({ id }) => id);
}

async function notifyAssignedUser({
  payload,
  changeLogItem,
  accountThatUpdatedIssue,
  notifiedUsers,
  issueUrl,
}: UpdateIssueData): Promise<string[]> {
  const assignedAccountId = changeLogItem.to;
  if (!assignedAccountId || assignedAccountId === accountThatUpdatedIssue?.accountId) {
    return [];
  }

  const assigneeToNotify = await db.user.findFirst({
    where: {
      account: {
        some: {
          AND: [{ provider_id: "atlassian" }, { provider_account_id: { equals: assignedAccountId } }],
        },
      },
    },
  });

  if (!assigneeToNotify || notifiedUsers.includes(assigneeToNotify.id)) {
    return [];
  }

  await db.notification_jira_issue.create({
    data: {
      notification: {
        create: {
          user_id: assigneeToNotify.id,
          url: issueUrl,
          from: payload.user?.displayName ?? "Jira",
        },
      },
      issue_id: payload.issue.id,
      issue_title: payload.issue.fields.summary,
      notification_jira_issue_type: {
        connect: {
          value: "issue_assigned",
        },
      },
    },
  });

  return [assigneeToNotify.id];
}
