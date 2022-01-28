import { v4 as uuid, validate } from "uuid";

export function getUUID() {
  return uuid();
}

export function isUUID(input: string) {
  return validate(input);
}
