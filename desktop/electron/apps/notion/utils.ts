import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";

export const workerLog = makeLogger("Notion-Worker");

export const notionDomain = "www.notion.so";
export const notionURL = `https://${notionDomain}`;
