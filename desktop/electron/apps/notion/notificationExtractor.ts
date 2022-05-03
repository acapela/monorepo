import { z } from "zod";

import type { NotionNotificationType, NotionWorkerSync } from "@aca/desktop/bridge/apps/notion.types";

import { extractAuthor } from "./authorExtractor";
import { extractBlockMention, extractNotionComment } from "./commentExtractor";
import {
  CollectionViewPageBlockValue,
  CommentedActivityValue,
  GetNotificationLogResult,
  Notification,
  RecordMap,
  SomeBlockValue,
  UserInvitedActivityValue,
  UserMentionedActivityValue,
} from "./schema";
import { workerLog as log, notionURL, prepareLogAttachment } from "./utils";

const stripDashes = (str: string) => str.replaceAll("-", "");

interface DebugExtractionOptions {
  includeOnlyNotificationIds: string[];
}

export function extractNotifications(
  payload: z.infer<typeof GetNotificationLogResult>,
  debugOptions?: DebugExtractionOptions
): NotionWorkerSync {
  const { notificationIds, recordMap } = payload;

  const result: NotionWorkerSync = [];

  log.debug(`Found ${notificationIds.length} notifications`);
  for (const id of notificationIds) {
    if (debugOptions && !debugOptions.includeOnlyNotificationIds.includes(id)) {
      continue;
    }

    try {
      const notification = recordMap.notification?.[id].value;

      if (!notification) {
        log.error(new Error("Notification not found"), `Notification ${id} not found`);
        continue;
      }

      const notificationProperties = getNotificationProperties(notification, recordMap);
      if (!notificationProperties) {
        if (!isKnownAndUnsupported(notification, recordMap)) {
          log.error(
            `Unable to handle notification ${id} of type ${notification.type}:`,
            prepareLogAttachment(recordMap)
          );
        }
        continue;
      }

      const { url, type, text_preview } = notificationProperties;

      try {
        new URL(url);
      } catch (e) {
        log.error(new Error("Invalid URL: " + url));
        continue;
      }

      const createdAtTimestampAsNumber = Number.parseInt(notification.end_time);

      const created_at = new Date(createdAtTimestampAsNumber).toISOString();

      const page_title = getPageTitle(notification, recordMap);

      if (!page_title) {
        log.error(`Page title not found for notification_id ${notification.id}`, prepareLogAttachment(recordMap));
        continue;
      }

      const updated_at = created_at;

      const pageId = notification.navigable_block_id;

      if (!pageId) {
        log.error(`no navigable_block_id in notification_id ${id}`, prepareLogAttachment(recordMap));
        continue;
      }

      const author = extractAuthor(notification, recordMap);

      result.push({
        notification: {
          url,
          text_preview,
          created_at,
          updated_at,
          from: author.name,
        },
        type,
        notionNotification: {
          notion_original_notification_id: id,
          page_id: pageId,
          page_title,
          synced_spaced_id: notification.space_id,
          author_id: author.id,
        },
        discussion_id: notificationProperties.discussion_id,
      });
    } catch (error) {
      // We do not want a single mis-shaped notification to tear down the whole sync.
      // So we just log the error and move on to the next notification.
      log.error(error);
    }
  }

  return result;
}

function isKnownAndUnsupported(
  notification: z.infer<typeof Notification>,
  recordMap: z.infer<typeof RecordMap>
): boolean {
  if (notification.type === "user-invited") {
    const activity = UserInvitedActivityValue.parse(recordMap.activity?.[notification.activity_id]?.value);
    if (activity?.parent_table === "space") {
      return true;
    }
  }

  return false;
}

function getNotificationProperties(
  notification: z.infer<typeof Notification>,
  recordMap: z.infer<typeof RecordMap>
):
  | { type: NotionNotificationType; url: string; text_preview?: string | undefined; discussion_id?: string | undefined }
  | undefined {
  const pageId = notification.navigable_block_id;

  if (!pageId) {
    return;
  }

  const activityValue = recordMap.activity?.[notification.activity_id].value;

  if (notification.type === "user-mentioned") {
    const activityResult = UserMentionedActivityValue.safeParse(activityValue);
    const activity = activityResult.success ? activityResult.data : null;
    const url =
      notionURL +
      "/" +
      stripDashes(pageId) +
      (activity?.mentioned_block_id && pageId !== activity.mentioned_block_id
        ? `#${stripDashes(activity.mentioned_block_id)}`
        : "");

    return {
      type: "notification_notion_user_mentioned",
      url,
      text_preview: activity ? extractBlockMention(activity, recordMap) : undefined,
    };
  }

  if (notification.type === "commented") {
    const activityResult = CommentedActivityValue.safeParse(activityValue);
    if (activityResult.success) {
      const activity = activityResult.data;
      const discussion = recordMap.discussion?.[activity.discussion_id].value;

      if (discussion) {
        const parentDiscussionBlock = discussion.parent_id;
        const url =
          notionURL +
          "/" +
          stripDashes(pageId) +
          "?d=" +
          `${stripDashes(discussion.id)}` +
          (parentDiscussionBlock ? `#${stripDashes(parentDiscussionBlock)}` : "");
        return {
          type: "notification_notion_commented",
          url,
          text_preview: extractNotionComment(activity, recordMap),
          discussion_id: activity.discussion_id,
        };
      } else {
        log.error(
          `Discussion with id ${activity.discussion_id} not for notification_id: ${notification.id}`,
          prepareLogAttachment(recordMap)
        );
      }
    }

    log.error(
      `Could not extract comment text and link for notification_id ${notification.id}`,
      prepareLogAttachment(recordMap)
    );

    return {
      type: "notification_notion_commented",
      url: notionURL + "/" + stripDashes(pageId),
    };
  }

  if (notification.type === "user-invited") {
    const url = notionURL + "/" + stripDashes(pageId);

    return {
      type: "notification_notion_user_invited",
      url,
    };
  }

  if (notification.type === "reminder") {
    return {
      type: "notification_notion_reminder",
      url: notionURL + "/" + stripDashes(pageId),
    };
  }
}

function getPageTitle(
  notification: z.infer<typeof Notification>,
  recordMap: z.infer<typeof RecordMap>
): string | undefined {
  const blockId = notification.navigable_block_id;
  if (!blockId) {
    return;
  }
  const blockValue = recordMap?.block?.[blockId]?.value;

  return extractPageTitleFromBlock(blockValue, recordMap);
}

export function extractPageTitleFromBlock(
  blockValue: unknown,
  recordMap: z.infer<typeof RecordMap>
): string | undefined {
  const pageBlockResult = SomeBlockValue.safeParse(blockValue);

  if (pageBlockResult.success) {
    const { properties } = pageBlockResult.data;
    if (!properties?.title) {
      return "Untitled";
    }
    const [titleElement] = properties.title;
    return Array.isArray(titleElement) && typeof titleElement[0] == "string" ? titleElement[0] : "Untitled";
  }

  const collectionPageBlockResult = CollectionViewPageBlockValue.safeParse(blockValue);
  if (collectionPageBlockResult.success) {
    const block = collectionPageBlockResult.data;
    const collection_id = block.collection_id || block.format?.collection_pointer.id;
    if (!collection_id) {
      return "Untitled";
    }
    const collection = recordMap.collection && recordMap.collection[collection_id].value;
    if (!collection) {
      return;
    }
    const name = collection?.name?.flat()[0];
    return typeof name === "string" ? name : "Untitled";
  }
}
