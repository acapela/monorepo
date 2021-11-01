import { getDevPublicTunnel } from "~backend/src/localtunnel";
import { isDev } from "~shared/dev";

import { slackReceiver } from "./app";
import manifest from "./manifest.json";
import { Metadata } from "./metadata";

export const { bot: botScopes, user: userScopes } = manifest.oauth_config.scopes;

export const getSlackInstallURL = async ({ withBot }: { withBot: boolean }, metadata: Metadata) => {
  const basePath = isDev() ? (await getDevPublicTunnel(3000)).url + "/api/backend" : process.env.BACKEND_API_ENDPOINT;
  return slackReceiver.installer?.generateInstallUrl({
    userScopes,
    scopes: withBot ? botScopes : [],
    redirectUri: basePath + "/slack/oauth_redirect",
    metadata: JSON.stringify(metadata),
  });
};
