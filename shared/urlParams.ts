export function getSearchParams(params: Record<string, string>) {
  return new URLSearchParams(params).toString();
}
