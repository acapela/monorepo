import { LogAttachment } from "@aca/desktop/domains/dev/attachment.types";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";

export const workerLog = makeLogger("Notion-Worker");

export const notionDomain = "www.notion.so";
export const notionURL = `https://${notionDomain}`;

export function prepareLogAttachment(recordMap: object): LogAttachment {
  return {
    fileName: "recordMap.json",
    body: JSON.stringify(recordMap),
    type: "application/json",
  };
}
