import {
  BlockDataItem,
  BlockPayload,
  CommentedActivityValue,
  GetNotificationLogResult,
  NotionBlockDSLDataIndicator,
  NotionPageReferenceDataIndicator,
  NotionUserDataIndicator,
  UserMentionedActivityValue,
} from "./types";

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

  if (item.length === 1) {
    return item[0];
  }

  if (item[0] !== NotionBlockDSLDataIndicator) {
    return;
  }

  const notionDSLData = item[1][0];

  if (Array.isArray(notionDSLData) && notionDSLData[0] === NotionUserDataIndicator) {
    const mentionedUserId = notionDSLData[1];
    return `@${recordMap.notion_user[mentionedUserId].value.name} `;
  }

  if (Array.isArray(notionDSLData) && notionDSLData[0] === NotionPageReferenceDataIndicator) {
    const pageId = notionDSLData[1];
    return `📄${(recordMap.block[pageId] as BlockPayload<"page">).value.properties.title[0][0]} `;
  }

  if (notionDSLData.start_date) {
    const start = `${notionDSLData.start_date} ${notionDSLData.start_time ?? ""}`.trim();
    const end = `${notionDSLData.end_date ?? ""} ${notionDSLData.end_time ?? ""}`.trim();
    return end ? `${start} - ${end} ` : `${start} `;
  }
}
