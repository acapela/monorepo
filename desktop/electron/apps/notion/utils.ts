import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { LogAttachment } from "@aca/shared/debug/logAttachment.types";

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
