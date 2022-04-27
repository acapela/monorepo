import { Maybe } from "@aca/shared/types";

export const findHeader = (headers: { name?: Maybe<string>; value?: Maybe<string> }[], name: string) =>
  headers.find((h) => h.name === name)?.value;
