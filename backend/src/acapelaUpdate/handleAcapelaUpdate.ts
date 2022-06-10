import { AcapelaUpdate, Prisma, db } from "@aca/db";
import { getUUID } from "@aca/shared/uuid";

import { HasuraEvent } from "../hasura";

export async function handleAcapelaUpdate(event: HasuraEvent<AcapelaUpdate>) {
  if (event.type !== "create") return;

  const userIds = await db.user.findMany({
    select: {
      id: true,
    },
  });

  const notificationData = userIds.reduce<{
    notification: Prisma.notificationCreateManyInput[];
    notification_acapela: Prisma.notification_acapelaCreateManyInput[];
  }>(
    (data, { id: user_id }) => {
      const notificationId = getUUID();

      return {
        notification: [
          ...data.notification,
          {
            user_id,
            id: notificationId,
            url: event.item.url,
            from: "Acapela",
          },
        ],
        notification_acapela: [
          ...data.notification_acapela,
          {
            notification_id: notificationId,
            title: event.item.title,
          },
        ],
      };
    },
    { notification: [], notification_acapela: [] }
  );

  await db.notification.createMany({
    data: notificationData.notification,
  });

  await db.notification_acapela.createMany({
    data: notificationData.notification_acapela,
  });
}
