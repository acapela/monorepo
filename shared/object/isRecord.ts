import { isPlainObject } from "lodash";

export function isRecord(input: unknown): input is Record<any, any> {
  return isPlainObject(input);
}
