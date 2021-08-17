import { AuthorizationUrlParams } from "./types";

export function getSearchParams(params: AuthorizationUrlParams) {
  return new URLSearchParams(params as unknown as Record<string, string>).toString();
}
