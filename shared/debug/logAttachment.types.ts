import { isNotNullish } from "@aca/shared/nullish";

export interface LogAttachment {
  fileName: string;
  body: string;
  type: string;
}

export function isLogAttachment(thing: unknown | LogAttachment): thing is LogAttachment {
  return isNotNullish(thing) && (thing as LogAttachment).fileName !== undefined;
}
