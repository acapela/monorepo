import { SlackInstallation } from "@aca/backend/src/slack/app";
import { UserSlackInstallation } from "@aca/db";

export const getSlackInstallationData = (userSlackInstallation: UserSlackInstallation) =>
  userSlackInstallation.data as unknown as SlackInstallation;

export function getPermalink({
  url,
  team,
  channel,
  messageTs,
  threadTs,
}: {
  url?: string;
  team: string;
  channel: string;
  messageTs: string;
  threadTs?: string;
}) {
  if (!url) {
    const permalink = `https://app.slack.com/client/${team}/${channel}/`;
    if (!threadTs) return permalink + messageTs;
    return permalink + `thread/${channel}-${threadTs}/${messageTs}`;
  }

  const permalink = `${url}archives/${channel}/p${messageTs.replace(".", "")}`;
  if (!threadTs) return permalink;
  return permalink + `?thread_ts=${threadTs}&cid=${channel}`;
}
