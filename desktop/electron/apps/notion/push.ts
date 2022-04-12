import axios from "axios";

import { notificationResolvedChannel } from "@aca/desktop/bridge/notification";
import { notionURL } from "@aca/desktop/electron/auth/notion";
import { getUUID } from "@aca/shared/uuid";

import { getNotionSessionData } from "./worker";

export async function initializeNotionPush() {
  console.info("[Notion] Starting push handling");
  const sessionData = await getNotionSessionData();

  notificationResolvedChannel.subscribe(async (event) => {
    if (event.inner.__typename !== "notification_notion") return;

    console.info("[Notion] Received resolved request for event 'notification_notion'");

    // TODO: Delete update ~3weeks after 1.Feb.2022
    // First version of notifications don't have space_id
    // This covers those cases.
    if (!event.inner.space_id) {
      console.info("[Notion] Not resolving notification as it doesn't have a space id");
      return;
    }

    await axios.post(
      notionURL + "/api/v3/saveTransactions",
      {
        requestId: getUUID(),
        transactions: [
          {
            id: getUUID(),
            spaceId: event.inner.space_id,
            operations: [
              {
                command: "update",
                pointer: {
                  table: "notification",
                  id: event.inner.notion_original_notification_id,
                },
                path: [],
                args: {
                  visited: true,
                  read: true,
                },
              },
            ],
          },
        ],
      },
      { headers: { cookie: sessionData.cookie } }
    );
  });
}
