import {
  BlockPayload,
  CommentDataText,
  CommentedActivityValue,
  GetNotificationLogResult,
  NotionDSLDataIndicator,
  NotionPageReferenceDataIndicator,
  NotionUserDataIndicator,
} from "./types";

export function extractNotionComment(
  activity: CommentedActivityValue,
  recordMap: GetNotificationLogResult["recordMap"]
): string | undefined {
  const lastEditIndex = activity.edits.length - 1;
  const commentActivityEdit = activity.edits[lastEditIndex];

  let commentDataText: CommentDataText[] | undefined;
  if (commentActivityEdit.type === "comment-created") {
    commentDataText = commentActivityEdit.comment_data.text;
  } else if (commentActivityEdit.type === "comment-changed") {
    commentDataText = commentActivityEdit.comment_data.after.text;
  }

  if (!commentDataText || !commentDataText.length) {
    return;
  }

  let result = "";
  for (const commentItem of commentDataText) {
    if (!commentItem) {
      continue;
    }

    if (commentItem.length === 1) {
      result += commentItem;
      continue;
    }

    if (commentItem[0] !== NotionDSLDataIndicator) {
      continue;
    }

    const notionDSLData = commentItem[1][0];

    if (Array.isArray(notionDSLData) && notionDSLData[0] === NotionUserDataIndicator) {
      const mentionedUserId = notionDSLData[1];
      result += `@${recordMap.notion_user[mentionedUserId].value.name} `;
      continue;
    }

    if (Array.isArray(notionDSLData) && notionDSLData[0] === NotionPageReferenceDataIndicator) {
      const pageId = notionDSLData[1];
      result += `📄${(recordMap.block[pageId] as BlockPayload<"page">).value.properties.title[0][0]} `;
      continue;
    }

    if (notionDSLData.start_date) {
      const start = `${notionDSLData.start_date} ${notionDSLData.start_time ?? ""}`.trim();
      const end = `${notionDSLData.end_date ?? ""} ${notionDSLData.end_time ?? ""}`.trim();
      result += end ? `${start} - ${end} ` : `${start} `;
    }
  }

  if (!result.trim()) {
    return;
  }

  return result;
}
