import axios from "axios";

import { ClickUpAccount, ClickUpAccountToTeam, ClickUpTeam, db } from "@aca/db";

import { EventTypes, Webhook } from "./types";
import { API_ENDPOINT } from "./utils";

type DbTeam = ClickUpTeam & {
  clickup_account_to_team: (ClickUpAccountToTeam & { clickup_account: ClickUpAccount })[];
};

function getRandomToken(accounts: ClickUpAccount[]): string {
  const account = accounts[Math.floor(Math.random() * accounts.length)];
  return account.access_token;
}

async function getTask(token: string, taskId: string) {
  const headers = { Authorization: token };
  return (await axios.get(`${API_ENDPOINT}/task/${taskId}`, { headers })).data;
}

export async function processEvent(webhook: Webhook, team: DbTeam) {
  if (!EventTypes.includes(webhook.event)) return;

  const userByClickUpUserID = team.clickup_account_to_team.reduce((acc, cur) => {
    acc[cur.clickup_account.clickup_user_id] = cur.clickup_account;
    return acc;
  }, {} as { [key: string]: ClickUpAccount });

  switch (webhook.event) {
    case "taskAssigneeUpdated": {
      const hist = webhook.history_items.find((h) => h.field === "assignee_add");
      if (!hist) return;
      if (hist.after.id === hist.user.id) return;
      const assigneeUser = userByClickUpUserID[hist.after.id];
      if (!assigneeUser) return;
      const task = await getTask(assigneeUser.access_token, webhook.task_id);
      await createAssignNotification({
        userId: assigneeUser.user_id,
        taskId: webhook.task_id,
        taskName: task.name,
        fromName: hist.user.username,
      });
      break;
    }
    case "taskCommentPosted": {
      const hist = webhook.history_items.find((h) => h.field === "comment");
      if (!hist) return;
      const mentions = hist.comment.comment
        .filter((c: { type: string; user: unknown }) => c.type === "tag" && c.user)
        .map((c: { user: { id: number } }) => userByClickUpUserID[c.user.id]?.user_id)
        .filter(Boolean) as string[];
      const task = await getTask(getRandomToken(Object.values(userByClickUpUserID)), webhook.task_id);
      await Promise.all(
        team.clickup_account_to_team
          .filter((at) => at.clickup_account.clickup_user_id !== `${hist.user.id}`)
          .map((at) => at.clickup_account.user_id)
          .map((uid) =>
            createCommentNotification({
              userId: uid,
              taskId: webhook.task_id,
              commentId: hist.comment.id,
              taskName: task.name,
              fromName: hist.user.username,
              isMention: mentions.includes(uid),
            })
          )
      );
      break;
    }
    case "taskCreated": {
      break;
    }
    case "taskDueDateUpdated": {
      break;
    }
    case "taskPriorityUpdated": {
      break;
    }
    case "taskStatusUpdated": {
      break;
    }
  }
}

async function createAssignNotification(data: { userId: string; taskId: string; taskName: string; fromName: string }) {
  return db.notification_clickup.create({
    data: {
      notification: {
        create: {
          user_id: data.userId,
          url: `https://app.clickup.com/t/${data.taskId}`,
          from: data.fromName,
        },
      },
      type: "assign",
      title: data.taskName,
      task_id: data.taskId,
    },
  });
}

async function createCommentNotification(data: {
  userId: string;
  taskId: string;
  commentId: string;
  taskName: string;
  fromName: string;
  isMention: boolean;
}) {
  return db.notification_clickup.create({
    data: {
      notification: {
        create: {
          user_id: data.userId,
          url: `https://app.clickup.com/t/${data.taskId}?comment=${data.commentId}`,
          from: data.fromName,
        },
      },
      type: data.isMention ? "mention" : "comment",
      title: data.taskName,
      task_id: data.taskId,
    },
  });
}
