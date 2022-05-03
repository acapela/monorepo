import { z } from "zod";

import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";

import { extractPageTitleFromBlock } from "./notificationExtractor";
import {
  BlockDataItem,
  CommentedActivityValue,
  NotionBlockDSLDataIndicator,
  NotionDateDataIndicator,
  NotionPageReferenceDataIndicator,
  NotionUserDataIndicator,
  RecordMap,
  SomeBlockValue,
  UserMentionedActivityValue,
} from "./schema";
import { prepareLogAttachment } from "./utils";

const log = makeLogger("Notion-Worker");

export function extractNotionComment(
  activity: z.infer<typeof CommentedActivityValue>,
  recordMap: z.infer<typeof RecordMap>
): string | undefined {
  if (!activity.edits) {
    return;
  }
  const lastEditIndex = activity.edits.length - 1;
  const commentActivityEdit = activity.edits[lastEditIndex];

  if (!("comment_data" in commentActivityEdit)) {
    return;
  }
  const commentBlockItems =
    commentActivityEdit.type === "comment-created"
      ? commentActivityEdit.comment_data.text
      : commentActivityEdit.type === "comment-changed"
      ? commentActivityEdit.comment_data.after.text
      : null;

  if (!commentBlockItems || !commentBlockItems.length) {
    return;
  }

  return extractTextFromBlockDataItems(commentBlockItems, recordMap);
}

export function extractBlockMention(
  { mentioned_block_id, mentioned_property }: z.infer<typeof UserMentionedActivityValue>,
  recordMap: z.infer<typeof RecordMap>
): string | undefined {
  const blockValue = recordMap.block?.[mentioned_block_id]?.value;
  if (!blockValue) {
    return;
  }
  const blockParseResult = SomeBlockValue.safeParse(blockValue);
  if (!blockParseResult.success) {
    return;
  }
  const { properties } = blockParseResult.data;

  if (!properties[mentioned_property]) {
    return;
  }
  const blockItems = properties[mentioned_property];

  return extractTextFromBlockDataItems(blockItems, recordMap);
}

function extractTextFromBlockDataItems(
  items: z.infer<typeof BlockDataItem>[],
  recordMap: z.infer<typeof RecordMap>
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
  item: z.infer<typeof BlockDataItem>,
  recordMap: z.infer<typeof RecordMap>
): string | undefined {
  if (!item) {
    return;
  }

  // It's a string with or without formatting e.g bold and italic -> ["this string", [["b","i"]]]
  if ((item.length === 1 || item[0] !== NotionBlockDSLDataIndicator) && typeof item[0] == "string") {
    return item[0];
  }

  if (!Array.isArray(item[1])) {
    return;
  }
  const notionDSLData = item[1][0];

  if (!Array.isArray(notionDSLData)) {
    return;
  }

  if (notionDSLData[0] === NotionUserDataIndicator) {
    const mentionedUserId = notionDSLData[1];
    const name = recordMap.notion_user?.[mentionedUserId]?.value?.name;

    if (!name) {
      log.error(
        "unable to extract mentioned user from item" + JSON.stringify(item, null, 2),
        prepareLogAttachment(recordMap)
      );
      return "@...";
    }

    return `@${name}`;
  }

  if (notionDSLData[0] === NotionPageReferenceDataIndicator) {
    const pageId = notionDSLData[1];

    const title = extractPageTitleFromBlock(recordMap.block?.[pageId].value, recordMap);

    if (!title) {
      log.error(`Unknown page title found for page_id ${pageId}`, prepareLogAttachment(recordMap));
      return `📄"Notion Page"`;
    }

    return `📄"${title}"`;
  }

  if (notionDSLData[0] === NotionDateDataIndicator) {
    const { start_date, start_time, end_date, end_time } = notionDSLData[1];
    const startText = `${start_date} ${start_time ?? ""}`.trim();
    const endText = `${end_date ?? ""} ${end_time ?? ""}`.trim();
    return endText ? `${startText} - ${endText} ` : `${startText} `;
  }
}
