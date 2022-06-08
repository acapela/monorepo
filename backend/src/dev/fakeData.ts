import { subSeconds } from "date-fns";
import { Application } from "express";

import { db } from "@aca/db";

export function setupFakeDataRoute(app: Application) {
  app.get("/api/fake-data/:userId", async (req, res) => {
    const { userId } = req.params;
    const existing = await db.notification_slack_message.findFirst({
      where: { notification: { user_id: userId } },
      include: { notification: true },
    });
    if (!existing) {
      res.json("Can not create spam without pre-existing notification");
      return;
    }
    for (let i = 0; i < 500; i++) {
      await db.notification.create({
        data: {
          from: "Spammer",
          text_preview: `Spammy message no ${i}`,

          url: existing.notification.url + "/" + Math.random(),
          user_id: userId,
          resolved_at: subSeconds(new Date(), 100),
          notification_slack_message: {
            create: {
              slack_conversation_id: Math.random().toString(),
              slack_message_ts: Math.random().toString(),
              conversation_name: Math.random().toString(),
              conversation_type: "im",
              user_slack_installation_id: existing.user_slack_installation_id,
            },
          },
        },
      });
    }

    res.json("success");
  });
}
