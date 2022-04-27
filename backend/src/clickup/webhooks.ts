import axios from "axios";

import { ClickUpAccount, ClickUpAccountToTeam, ClickUpTeam, db } from "@aca/db";

import { EventTypes, Webhook } from "./types";
import { API_ENDPOINT } from "./utils";

type DbTeam = ClickUpTeam & {
  clickup_account_to_team: (ClickUpAccountToTeam & { clickup_account: ClickUpAccount })[];
};

async function getTask(token: string, taskId: string) {
  const headers = { Authorization: token };
  return (await axios.get(`${API_ENDPOINT}/task/${taskId}`, { headers })).data;
}

export async function processEvent(webhook: Webhook, team: DbTeam) {
  if (!EventTypes.includes(webhook.event)) return;

  switch (webhook.event) {
    case "taskAssigneeUpdated": {
      const hist = webhook.history_items.pop();
      if (!hist || hist.field !== "assignee_add") return;
      // if (hist.after.id === hist.user.id) return;
      const assigneeUser = team.clickup_account_to_team.find(
        (at) => at.clickup_account.clickup_user_id === `${hist.after.id}`
      );
      if (!assigneeUser) return;
      const task = await getTask(assigneeUser.clickup_account.access_token, webhook.task_id);
      await createAssignNotification({
        userId: assigneeUser.clickup_account.user_id,
        taskId: webhook.task_id,
        taskName: task.name,
        fromName: hist.user.username,
      });
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
