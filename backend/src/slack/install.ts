import { getDevPublicTunnelURL } from "~backend/src/localtunnel";
import { isDev } from "~shared/dev";
import { botScopes, userScopes } from "~shared/slack";

import { slackReceiver } from "./app";
import { InstallMetadata } from "./installMetadata";

export const getSlackInstallURL = async ({ withBot }: { withBot: boolean }, metadata: InstallMetadata) => {
  const basePath = isDev() ? (await getDevPublicTunnelURL(3000)) + "/api/backend" : process.env.BACKEND_API_ENDPOINT;
  return slackReceiver.installer?.generateInstallUrl({
    userScopes,
    scopes: withBot ? botScopes : [],
    redirectUri: basePath + "/slack/oauth_redirect",
    metadata: JSON.stringify(metadata),
  });
};
