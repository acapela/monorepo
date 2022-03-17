import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";

import {
  BlockDataItem,
  BlockPayload,
  CommentedActivityValue,
  GetNotificationLogResult,
  NotionBlockDSLDataIndicator,
  NotionDateDataIndicator,
  NotionPageReferenceDataIndicator,
  NotionUserDataIndicator,
  UserMentionedActivityValue,
} from "./types";

const log = makeLogger("Notion-Worker");

export function extractNotionComment(
  activity: CommentedActivityValue,
  recordMap: GetNotificationLogResult["recordMap"]
): string | undefined {
  const lastEditIndex = activity.edits.length - 1;
  const commentActivityEdit = activity.edits[lastEditIndex];

  let commentBlockItems: BlockDataItem[] | undefined;
  if (commentActivityEdit.type === "comment-created") {
    commentBlockItems = commentActivityEdit.comment_data.text;
  } else if (commentActivityEdit.type === "comment-changed") {
    commentBlockItems = commentActivityEdit.comment_data.after.text;
  }

  if (!commentBlockItems || !commentBlockItems.length) {
    return;
  }

  return extractTextFromBlockDataItems(commentBlockItems, recordMap);
}

export function extractBlockMention(
  activity: UserMentionedActivityValue,
  recordMap: GetNotificationLogResult["recordMap"]
): string | undefined {
  const { mentioned_block_id, mentioned_property } = activity;

  const properties = (recordMap.block[mentioned_block_id] as BlockPayload<"page">).value?.properties;

  if (!properties || !properties[mentioned_property]) {
    return;
  }
  const blockItems = properties[mentioned_property] as BlockDataItem[];

  return extractTextFromBlockDataItems(blockItems, recordMap);
}

function extractTextFromBlockDataItems(
  items: BlockDataItem[],
  recordMap: GetNotificationLogResult["recordMap"]
): string | undefined {
  let result = "";
  for (const blockItem of items) {
    result += extractTextFromBlockDataItem(blockItem, recordMap) ?? "";
  }

  if (!result.trim()) {
    return;
  }

  return result;
}

function extractTextFromBlockDataItem(
  item: BlockDataItem,
  recordMap: GetNotificationLogResult["recordMap"]
): string | undefined {
  if (!item) {
    return;
  }

  // It's a string with or without formatting e.g bold and italic -> ["this string", [["b","i"]]]
  if (item.length === 1 || item[0] !== NotionBlockDSLDataIndicator) {
    return item[0];
  }

  const notionDSLData = item[1][0];

  if (!Array.isArray(notionDSLData)) {
    return;
  }

  if (notionDSLData[0] === NotionUserDataIndicator) {
    const mentionedUserId = notionDSLData[1];
    const name = recordMap.notion_user[mentionedUserId]?.value?.name;

    if (!name) {
      log.error("unable to extract mentioned user from item", item, recordMap);
      return "@...";
    }

    return `@${name}`;
  }

  if (notionDSLData[0] === NotionPageReferenceDataIndicator) {
    const pageId = notionDSLData[1];

    const title = (recordMap.block[pageId] as BlockPayload<"page">)?.value?.properties?.title?.[0]?.[0];

    if (!title) {
      log.error("unable to extract page title from item", item, recordMap);
    }

    return `📄${title}`;
  }

  if (notionDSLData[0] === NotionDateDataIndicator) {
    const { start_date, start_time, end_date, end_time } = notionDSLData[1];
    const startText = `${start_date} ${start_time ?? ""}`.trim();
    const endText = `${end_date ?? ""} ${end_time ?? ""}`.trim();
    return endText ? `${startText} - ${endText} ` : `${startText} `;
  }
}
