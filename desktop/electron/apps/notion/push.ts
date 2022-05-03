import axios from "axios";

import { notionNotificationResolvedChannel } from "@aca/desktop/bridge/notification";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { notionURL } from "@aca/desktop/electron/auth/notion";
import { getUUID } from "@aca/shared/uuid";

import { getNotionSessionData } from "./worker";

const log = makeLogger("NotionResolver");

export async function initializeNotionPush() {
  log.info("Starting push handling");
  const sessionData = await getNotionSessionData();

  notionNotificationResolvedChannel.subscribe(async (event) => {
    log.info("Received resolved request for event 'notification_notion'");

    // TODO: Delete update ~3weeks after 1.Jul.2022
    // First version of notifications don't have space_id
    // This covers those cases.
    if (!event.space_id) {
      log.info("Not resolving notification as it doesn't have a space id");
      return;
    }

    await axios.post(
      notionURL + "/api/v3/saveTransactions",
      {
        requestId: getUUID(),
        transactions: [
          {
            id: getUUID(),
            spaceId: event.space_id,
            operations: [
              {
                command: "update",
                pointer: {
                  table: "notification",
                  id: event.notion_original_notification_id,
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
