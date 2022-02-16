import { detailedDiff } from "deep-object-diff";
import { isEmpty } from "lodash";

import { HasuraEvent } from "@aca/backend/src/hasura";
import { LinearIssue, db } from "@aca/db";

import { IssueData } from "./types";
import { getRandomLinearClient, getUsersForOrganizationId } from "./utils";

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
    return;
  }
  if ("state" in changes.updated && changes.updated.state.type === "canceled") {
    // issue was canceled
    await saveIssue(event.item, "canceled");
    return;
  }
}

async function saveIssue(payload: LinearIssue, origin: string, notifyOnly?: string[]) {
  const usersForOrg = await getUsersForOrganizationId(payload.organization_id, notifyOnly);
  const linearClient = getRandomLinearClient(usersForOrg);
  const issueData = payload.data as unknown as IssueData;
  const { creatorId } = issueData;
  const creator = await linearClient.user(creatorId);
  const notificationPromises = usersForOrg
    .filter((u) => {
      if (!issueData.subscriberIds.includes(u.linear_user_id || "")) return false;
      if (!notifyOnly) return u.linear_user_id !== creatorId;
      return true;
    })
    .map((u) =>
      db.notification_linear.create({
        data: {
          notification: {
            create: {
              user_id: u.user_id,
              url: payload.url || "",
              from: creator.name,
            },
          },
          creator_id: creatorId,
          type: "Issue",
          issue_id: issueData.id,
          issue_title: issueData.title,
          origin,
        },
      })
    );
  return Promise.all(notificationPromises);
}
