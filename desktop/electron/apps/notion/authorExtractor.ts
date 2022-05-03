import { z } from "zod";

import {
  ActivityValueCommon,
  BlockValueCommon,
  Notification,
  PageBlockValue,
  RecordMap,
  ReminderActivityValue,
} from "./schema";
import { workerLog as log } from "./utils";

interface NotionAuthor {
  id?: string;
  name: string;
}

export function extractAuthor(
  notification: z.infer<typeof Notification>,
  recordMap: z.infer<typeof RecordMap>
): NotionAuthor {
  const pageId = notification.navigable_block_id;

  let authorId;

  const activityValue = recordMap.activity?.[notification.activity_id]?.value;
  const commonActivityResult = ActivityValueCommon.safeParse(activityValue);
  const reminderActivityResult = ReminderActivityValue.safeParse(activityValue);
  if (reminderActivityResult.success) {
    const activity = reminderActivityResult.data;

    const blockThatIncludesReminder = BlockValueCommon.safeParse(recordMap.block?.[activity.reminder_block_id]?.value);

    if (blockThatIncludesReminder.success) {
      authorId = blockThatIncludesReminder.data.last_edited_by_id;
    }
  } else if (commonActivityResult.success) {
    const activity = commonActivityResult.data;
    authorId = activity.edits?.[0]?.authors?.[0]?.id ?? "Notion";
    if (authorId === "Notion") {
      log.error("unable to extract authorId from activity" + JSON.stringify(activity, null, 2));
    }
  } else if (pageId) {
    const pageBlockResult = PageBlockValue.safeParse(recordMap.block?.[pageId]?.value);
    if (pageBlockResult.success) {
      authorId = pageBlockResult.data.created_by_id;
    }
  }

  if (!authorId) {
    return {
      name: "Notion",
    };
  }

  return {
    id: authorId,
    name: recordMap?.notion_user?.[authorId]?.value?.name ?? "Notion",
  };
}
