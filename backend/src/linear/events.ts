import { LinearClient } from "@linear/sdk";
import { detailedDiff } from "deep-object-diff";
import { isEmpty } from "lodash";

import { HasuraEvent } from "@aca/backend/src/hasura";
import { LinearIssue, LinearOauthToken, db } from "@aca/db";

import {
  isSupportedInitialLinearNotificationType,
  linearNotificationTypeHandler,
} from "./initialSyncNotificationImport";
import { IssueData } from "./types";
import {
  NotificationOrigin,
  fetchCreatorAndIssueHistory,
  findMatchingActor,
  getRandomLinearClient,
  getUsersForOrganizationId,
} from "./utils";

export async function handleLinearIssueChanges(event: HasuraEvent<LinearIssue>) {
  if (event.type === "create" && event.item.last_webhook_action === "update") {
    // we just saved an issue for the first time, so we cannot find out what has been updated
    return;
  }

  const issueData = event.item.data as unknown as IssueData;
  if (event.type === "create" && event.item.last_webhook_action === "create") {
    if (issueData.assigneeId) {
      await saveIssue(event.item, "assign", [issueData.assigneeId]);
      return;
    }
    // this issue was just created but has no assignee
    return;
  }

  const issueDataBefore = event.itemBefore?.data as unknown as IssueData;
  const changes = detailedDiff(issueDataBefore || {}, issueData || {}) as {
    added: IssueData;
    deleted: IssueData;
    updated: IssueData;
  };

  // no changes (ignore)
  if (isEmpty(changes.added) && isEmpty(changes.deleted) && isEmpty(changes.updated)) return;

  if ("assigneeId" in changes.added || "assigneeId" in changes.updated) {
    // issue was assigned to someone, notify only the assignee
    await saveIssue(event.item, "assign", [changes.added.assigneeId || changes.updated.assigneeId]);
  }

  if ("state" in changes.updated) {
    const state = changes.updated.state.type;
    if (state === "canceled") await saveIssue(event.item, "state:cancel");
    if (state === "completed") await saveIssue(event.item, "state:complete");
  }
}

async function saveIssue(payload: LinearIssue, origin: NotificationOrigin, notifyOnly?: string[]) {
  const issueData = payload.data as unknown as IssueData;
  const userIds = notifyOnly ? notifyOnly : issueData.subscriberIds;
  const usersToNotify = await getUsersForOrganizationId(payload.organization_id, userIds);
  if (!usersToNotify.length) return;
  const linearClient = getRandomLinearClient(usersToNotify);
  const [creator, history] = await fetchCreatorAndIssueHistory(linearClient, issueData.id);
  const actor = findMatchingActor(origin, issueData, creator, history);
  const notificationPromises = usersToNotify
    .filter((u) => u.linear_user_id !== actor.id)
    .map((u) =>
      db.notification_linear.create({
        data: {
          notification: {
            create: {
              user_id: u.user_id,
              url: payload.url || "",
              from: actor.name,
            },
          },
          creator_id: actor.id,
          type: "Issue",
          issue_id: issueData.id,
          issue_title: issueData.title,
          origin,
        },
      })
    );
  return Promise.all(notificationPromises);
}

export async function handleLinearOauthTokenCreated(event: HasuraEvent<LinearOauthToken>) {
  if (event.type !== "create") {
    return;
  }

  const linearOauthToken = event.item;

  const previousExistingLinearNotifications = await db.notification_linear.findFirst({
    where: {
      notification: {
        user_id: linearOauthToken.user_id,
      },
    },
  });

  if (!previousExistingLinearNotifications) {
    await importInitialNotificationsFromLinear(linearOauthToken);
  }
}

const AMOUNT_OF_INITIAL_NOTIFICATIONS_TO_SYNC = 5;

async function importInitialNotificationsFromLinear(linearOauthToken: LinearOauthToken) {
  const client = new LinearClient({
    accessToken: linearOauthToken.access_token,
  });

  const notifications = await client.notifications({ includeArchived: false });

  // This is more cumbersome but way more performant than an array filter.
  let countOfInitialNotifications = 0;
  for (const notification of notifications.nodes) {
    if (countOfInitialNotifications === AMOUNT_OF_INITIAL_NOTIFICATIONS_TO_SYNC) {
      return;
    }
    if (isSupportedInitialLinearNotificationType(notification.type)) {
      await linearNotificationTypeHandler[notification.type](linearOauthToken, notification);
      countOfInitialNotifications++;
    }
  }
}
