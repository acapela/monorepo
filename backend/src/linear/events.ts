import { detailedDiff } from "deep-object-diff";
import { isEmpty } from "lodash";

import { HasuraEvent } from "@aca/backend/src/hasura";
import { LinearIssue, db } from "@aca/db";

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
    // we just saved an issue for the first time, so we are not sure what has been updated
    return;
  }

  if (event.type === "create" && event.item.last_webhook_action === "create") {
    // this issue was just created, so we can already notify the subscribers
    await saveIssue(event.item, "create");
    return;
  }
  const issueData = event.item.data as unknown as IssueData;
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

  if ("state" in changes.updated && changes.updated.state.type === "canceled") {
    // issue was canceled
    await saveIssue(event.item, "cancel");
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
