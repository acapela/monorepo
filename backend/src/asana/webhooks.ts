import Asana from "asana";
import { get } from "lodash";

import { Webhook } from "@aca/backend/src/asana/types";
import { AsanaAccount, AsanaWebhook, User, db } from "@aca/db";

import { createClient } from "./utils";

type DbWebhook = AsanaWebhook & { asana_account: AsanaAccount & { user: User } };

export async function processEvent(event: Webhook, webhook: DbWebhook) {
  // ignore event that was triggered by the user themselves
  // it is useful to comment this line if you want to test the webhooks
  //if (webhook.asana_account.asana_user_id === event.user.gid) return;

  const client = createClient();
  // the oauth client also handles expired tokens internally and will refresh them
  client.useOauth({ credentials: webhook.asana_account });

  // detect mentions or comments
  if (event.resource.resource_type === "story" && event.resource.resource_subtype === "comment_added") {
    // fetch comment from api
    const comment = await client.stories.findById(event.resource.gid);

    // asana converts mentions to weird links to personal projects
    // some logic is required to resolve these ids to the actual user id
    const mentionUsers = [...comment.text.matchAll(/https:\/\/app\.asana\.com\/0\/(\d+)\/list/gm)].map((m) => m[1]);
    const userIds = await resolveMentions(client, mentionUsers);
    const isMentioned = userIds.includes(webhook.asana_account.asana_user_id);
    await createCommentNotification(webhook, comment, isMentioned);
    return;
  }

  // detect assignments
  if (event.resource.resource_type === "task" && event.change?.field === "assignee") {
    if (!event.change.new_value) return; // unassigned
    if (event.change.new_value.gid !== event.user.gid) return; // assigned to someone else
    const [assigner, task] = await Promise.all([
      client.users.findById(event.user.gid),
      client.tasks.findById(event.resource.gid),
    ]);
    await createAssignNotification(webhook, assigner, task);
    return;
  }

  // detect section changes (like "In Progress" or "Done")
  if (
    event.action === "added" &&
    event.resource.resource_type === "task" &&
    event.parent?.resource_type === "section"
  ) {
    const [actor, task, section] = await Promise.all([
      client.users.findById(event.user.gid),
      client.tasks.findById(event.resource.gid),
      client.sections.findById(event.parent.gid),
    ]);
    await createStatusChangeNotification(webhook, actor, task, section.name);
    return;
  }

  // detect status changes
  if (event.resource.resource_type === "task" && event.change?.field === "completed") {
    const [actor, task] = await Promise.all([
      client.users.findById(event.user.gid),
      client.tasks.findById(event.resource.gid),
    ]);
    await createStatusChangeNotification(webhook, actor, task, task.completed ? "completed" : "uncompleted");
    return;
  }
  // TODO: add further events here
  // console.info(event); //for debugging
}

// every asana user has a personal project, that is linked when being mentioned
// resolve these personal project ids to user ids
async function resolveMentions(client: Asana.Client, users: string[]) {
  const userIds: string[] = [];
  for (const user of users) {
    const project = await client.projects.findById(user);
    if (project.members.length) continue;
    userIds.push(get(project, "owner.gid"));
  }
  return userIds;
}

async function createCommentNotification(
  webhook: DbWebhook,
  comment: Asana.resources.Stories.Type,
  isMentioned: boolean
) {
  return db.notification_asana.create({
    data: {
      notification: {
        create: {
          user_id: webhook.asana_account.user.id,
          // the `/f` at the end enables full-screen preview of the comment (can be removed by preference)
          url: `https://app.asana.com/0/0/${comment.target.gid}/${comment.gid}/f`,
          from: comment.created_by.name,
        },
      },
      type: isMentioned ? "mention" : "comment",
      title: comment.target.name,
      task_id: comment.target.gid,
      asana_webhook: {
        connect: {
          id: webhook.id,
        },
      },
    },
  });
}

async function createAssignNotification(
  webhook: DbWebhook,
  assigner: Asana.resources.Users.Type,
  task: Asana.resources.Tasks.Type
) {
  return db.notification_asana.create({
    data: {
      notification: {
        create: {
          user_id: webhook.asana_account.user.id,
          url: get(task, "permalink_url", ""),
          from: assigner.name,
        },
      },
      type: "assign",
      title: task.name,
      task_id: task.gid,
      asana_webhook: {
        connect: {
          id: webhook.id,
        },
      },
    },
  });
}

async function createStatusChangeNotification(
  webhook: DbWebhook,
  actor: Asana.resources.Users.Type,
  task: Asana.resources.Tasks.Type,
  status: string
) {
  return db.notification_asana.create({
    data: {
      notification: {
        create: {
          user_id: webhook.asana_account.user.id,
          url: get(task, "permalink_url", ""),
          from: actor.name,
        },
      },
      type: `status:${status}`,
      title: task.name,
      task_id: task.gid,
      asana_webhook: {
        connect: {
          id: webhook.id,
        },
      },
    },
  });
}
