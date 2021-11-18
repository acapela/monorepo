const escapeStringForSlackLink = (input: string) => input.replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function createSlackLink(url: string, name?: string) {
  if (!name || url === name) return `<${escapeStringForSlackLink(url)}>`;
  return `<${escapeStringForSlackLink(url)}|${escapeStringForSlackLink(name)}>`;
}
