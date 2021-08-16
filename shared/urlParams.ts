export interface AuthorizationUrlParams {
  response_type: "code";
  prompt: "select_account";
  access_type: "offline";
  hd?: string;
}

export function getSearchParams(params: AuthorizationUrlParams) {
  return new URLSearchParams(params as unknown as Record<string, string>).toString();
}
