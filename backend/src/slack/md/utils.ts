const escapeStringForSlackLink = (input: string) => input.replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function createSlackLink(url: string, name?: string) {
  if (!name || url === name) return `<${escapeStringForSlackLink(url)}>`;
  return `<${escapeStringForSlackLink(url)}|${escapeStringForSlackLink(name)}>`;
}

export const mdDate = (date: Date, format = "date_long_pretty") => {
  const unixTime = date.getTime() / 1000;
  return `<!date^${unixTime}^{${format}} {time}|${date.toISOString()}>`;
};
