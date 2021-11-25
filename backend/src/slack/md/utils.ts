const escapeStringForSlackLink = (input: string) => input.replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function createSlackLink(url: string, name?: string) {
  if (!name || url === name) return `<${escapeStringForSlackLink(url)}>`;
  return `<${escapeStringForSlackLink(url)}|${escapeStringForSlackLink(name)}>`;
}

export const mdDate = (date: Date, format = "date_long_pretty") => {
  const unixTime = date.getTime() / 1000;
  return `<!date^${unixTime}^{${format}} {time}|${date.toISOString()}>`;
};

export const mdTime = (date: Date) => {
  const unixTime = Math.floor(date.getTime() / 1000);
  return `<!date^${unixTime}^{time}|${date.toISOString()}>`;
};

export function createSlackInviteNotification(inviterName: string, inviteUrl: string) {
  return `Welcome to Acapela! 🎉
${inviterName} invited you to join your team! Acapela is a lightweight task manager for all the requests spread out in channels, DMs, threads and on other tools like Notion or Google Docs.
Your next steps:
💜 Go to ${createSlackLink(inviteUrl, "Acapela")} to join your team on the web app.
⚡️ Send out your first request by using the /acapela command.
🤩 Enjoy getting more productive!`;
}
